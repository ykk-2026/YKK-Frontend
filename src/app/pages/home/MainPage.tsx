import {
  Accessibility,
  ArrowRight,
  BellRing,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { JobCard } from '@/app/features/jobs/JobCard';
import { categories, mockJobs } from '@/app/data/mockData';
import type { Page } from '@/app/types';

interface MainPageProps {
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
}

const localizedJobs = {
  '1': {
    title: 'Java 백엔드 개발자',
    location: '서울 송파구',
    salary: '4,000만 ~ 6,000만 원',
    workType: '재택근무 가능',
    description: '클라우드 기반 엔터프라이즈 솔루션을 함께 개발할 Java 백엔드 개발자를 채용합니다. 휠체어 이동 동선과 유연근무를 지원합니다.',
  },
  '2': {
    title: '프론트엔드 개발자 (React)',
    location: '경기 성남시',
    salary: '4,500만 ~ 7,000만 원',
    workType: '하이브리드',
    description: '여러 서비스의 사용자 경험을 개선할 프론트엔드 개발자를 채용합니다. 화상 면접과 하이브리드 근무가 가능합니다.',
  },
  '3': {
    title: '데이터 분석가',
    location: '서울 강서구',
    salary: '3,500만 ~ 5,500만 원',
    workType: '사무실 근무',
    description: '빅데이터 분석과 AI 솔루션 프로젝트를 담당할 데이터 분석가를 채용합니다. 장애인 주차와 엘리베이터를 제공합니다.',
  },
} satisfies Record<string, Partial<(typeof mockJobs)[number]>>;

const categoryLabels: Record<string, string> = {
  IT: 'IT / 개발',
  Office: '사무 / 경영지원',
  Design: '디자인',
  Service: '서비스 / 지원',
  Production: '생산 / 기술',
};

const quickMenus = [
  { label: '지역별', helper: '가까운 공고', icon: MapPin },
  { label: '재택 가능', helper: '출퇴근 부담 낮게', icon: Home },
  { label: '장애친화', helper: '시설 확인', icon: Accessibility },
  { label: '오늘 마감', helper: '바로 지원', icon: CalendarClock },
  { label: '급구', helper: '빠른 채용', icon: BellRing },
  { label: '추천순', helper: '조건 매칭', icon: Sparkles },
];

const popularSearches = ['휠체어 이동', '재택근무', '장애인 주차', '엘리베이터', '화상 면접', '서울 개발자'];
const accessibilityTags = ['휠체어 동선', '장애인 화장실', '장애인 주차', '엘리베이터', '보조기기 반입', '재택/하이브리드', '문턱 낮음', '화상 면접'];
const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '전국'];

const spotlightJobs = [
  { title: '접근성 검증 완료', count: '312건', helper: '시설 사진과 상세 조건 제공', icon: ShieldCheck },
  { title: '재택/하이브리드', count: '486건', helper: '출퇴근 부담을 줄이는 공고', icon: Home },
  { title: '오늘 새 공고', count: '94건', helper: '최근 등록순으로 확인', icon: Clock },
  { title: '즉시 지원 가능', count: '139건', helper: '간편 지원 지원', icon: Briefcase },
];

const friendlyCompanies = [
  { name: 'Samsung SDS', count: '24건', tags: ['휠체어 동선', '재택 가능'], color: '#1B6EF3' },
  { name: 'Kakao', count: '18건', tags: ['하이브리드', '화상 면접'], color: '#F59E0B' },
  { name: 'Naver', count: '21건', tags: ['보조기기', '장애인 화장실'], color: '#10B981' },
  { name: 'LG CNS', count: '15건', tags: ['장애인 주차', '유연근무'], color: '#8B5CF6' },
];

const seekerProfiles = [
  { name: '김민준', role: 'Java 백엔드 개발자', location: '서울', experience: '경력 4년', needs: ['재택 가능', '휠체어 이동'], match: 96, initials: '김' },
  { name: '이지아', role: 'React 프론트엔드 개발자', location: '경기', experience: '경력 3년', needs: ['하이브리드', '엘리베이터'], match: 94, initials: '이' },
  { name: '박서준', role: '데이터 분석가', location: '서울', experience: '신입', needs: ['장애인 주차', '보조기기'], match: 91, initials: '박' },
];

export function MainPage({ navigate, bookmarks, onBookmark }: MainPageProps) {
  const [query, setQuery] = useState('');
  const featuredJobs = mockJobs.slice(0, 3).map(job => ({ ...job, ...localizedJobs[job.id as keyof typeof localizedJobs] }));
  const localizedCategories = categories.map(category => ({ ...category, label: categoryLabels[category.id] ?? category.label }));

  return (
    <div className="bg-[#F6F8FA]">
      <section className="bg-white border-b border-[#E5EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            <div className="rounded-lg border border-[#D6E4EF] bg-[#F0F7FF] p-5 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#176B87]">장애친화 채용</span>
                <span className="rounded-full bg-[#E7F8F4] px-3 py-1 text-sm font-semibold text-[#14806E]">접근성 조건 확인</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground">일하기 편한 조건으로 공고를 찾아보세요</h1>
              <p className="mt-3 text-muted-foreground">지역, 직무, 근무방식, 편의시설을 한 번에 검색할 수 있습니다.</p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="직무, 회사, 지역, 편의시설 검색"
                    className="w-full h-13 pl-12 pr-4 rounded-lg border border-[#BED7EA] bg-white text-base outline-none focus:ring-4 focus:ring-[#176B87]/15"
                  />
                </div>
                <button onClick={() => navigate('jobs')} className="h-13 px-6 rounded-lg bg-[#176B87] text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#0F5A72]">
                  검색 <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {popularSearches.map(keyword => (
                  <button key={keyword} onClick={() => navigate('jobs')} className="rounded-full bg-white border border-[#D6E4EF] px-3 py-1.5 text-sm text-foreground hover:border-[#176B87]">
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-[#E1E7EC] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">내 프로필 기준</p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">추천 공고 42건</h2>
                </div>
                <span className="rounded-full bg-[#E7F8F4] px-3 py-1 text-sm font-bold text-[#14806E]">98%</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['Java 백엔드', '서울 송파구', '98%'],
                  ['React 프론트엔드', '경기 성남시', '94%'],
                  ['데이터 분석', '서울 강서구', '91%'],
                ].map(([title, location, score]) => (
                  <button key={title} onClick={() => navigate('jobs')} className="w-full rounded-lg bg-[#F7FAFC] px-3 py-3 text-left hover:bg-[#F0F7FF]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{title}</p>
                      <span className="text-sm font-bold text-[#14A38B]">{score}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{location} · 접근성 조건 일치</p>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-7">
          {quickMenus.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => navigate('jobs')} className="rounded-lg border border-border bg-white p-4 text-left hover:border-[#14A38B] hover:shadow-sm transition">
                <Icon size={21} className="text-[#176B87] mb-3" />
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.helper}</p>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-5 mb-8">
          <div className="rounded-lg border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">오늘 바로 볼 채용</h2>
              <button onClick={() => navigate('jobs')} className="text-sm font-semibold text-[#176B87]">전체 보기</button>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {spotlightJobs.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.title} onClick={() => navigate('jobs')} className="rounded-lg border border-[#E1E7EC] bg-[#F8FAFC] p-4 text-left hover:border-[#176B87]">
                    <Icon size={19} className="text-[#176B87] mb-3" />
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{item.count}</p>
                    <p className="mt-2 text-xs text-[#14806E]">{item.helper}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-5">
            <h2 className="text-xl font-bold mb-4">지역별 채용</h2>
            <div className="flex flex-wrap gap-2">
              {regions.map(region => (
                <button key={region} onClick={() => navigate('jobs')} className="rounded-full bg-[#F1F5F8] px-3.5 py-2 text-sm font-medium text-foreground hover:bg-[#176B87] hover:text-white">
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-5 mb-8">
          <aside className="rounded-lg border border-border bg-white p-5">
            <h2 className="text-xl font-bold mb-4">조건으로 찾기</h2>
            <div className="flex flex-wrap gap-2">
              {accessibilityTags.map(tag => (
                <button key={tag} onClick={() => navigate('jobs')} className="rounded-full bg-[#F7FAFC] border border-[#E1E7EC] px-3 py-2 text-sm text-foreground hover:border-[#14A38B] hover:bg-[#F0FBF8]">
                  {tag}
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-lg border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">추천 채용</h2>
              <button onClick={() => navigate('jobs')} className="text-sm font-semibold text-[#176B87]">전체 보기</button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} navigate={navigate} bookmarked={bookmarks.has(job.id)} onBookmark={onBookmark} />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">장애친화 우수 기업</h2>
            <button onClick={() => navigate('jobs')} className="text-sm font-semibold text-[#176B87]">기업 더 보기</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {friendlyCompanies.map(company => (
              <button key={company.name} onClick={() => navigate('jobs')} className="rounded-lg border border-border bg-white p-4 text-left hover:border-[#14A38B] hover:shadow-sm transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold" style={{ backgroundColor: company.color }}>
                    {company.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{company.name}</p>
                    <p className="text-xs text-muted-foreground">채용 {company.count}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-[#F0FBF8] px-2.5 py-1 text-xs text-[#176B87]">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mb-8">
          <div className="rounded-lg border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">구직자 프로필</h2>
                <p className="text-sm text-muted-foreground mt-1">핵심 역량과 필요한 근무환경을 함께 확인합니다.</p>
              </div>
              <button onClick={() => navigate('jobs')} className="text-sm font-semibold text-[#176B87]">프로필 더 보기</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seekerProfiles.map(profile => (
                <article key={profile.name} className="rounded-lg border border-[#E1E7EC] bg-[#F8FAFC] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#DDF7F2] font-bold text-[#176B87]">
                        {profile.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#14A38B]">{profile.match}%</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-2.5 py-1 text-muted-foreground">{profile.location}</span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-muted-foreground">{profile.experience}</span>
                    {profile.needs.map(need => (
                      <span key={need} className="rounded-full bg-[#F0FBF8] px-2.5 py-1 text-[#176B87]">
                        {need}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-white p-5">
            <h2 className="text-xl font-bold mb-4">직무 카테고리</h2>
            <div className="space-y-2">
              {localizedCategories.map(category => (
                <button key={category.id} onClick={() => navigate('jobs')} className="flex w-full items-center justify-between rounded-lg bg-[#F8FAFC] px-4 py-3 text-left hover:bg-[#F0FBF8]">
                  <span className="font-medium text-foreground">{category.label}</span>
                  <span className="text-sm text-muted-foreground">{category.count}개</span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: '가입 사용자', value: '12,847', icon: Users },
            { label: '진행 중인 채용', value: '4,218', icon: Building2 },
            { label: '추천 만족도', value: '98%', icon: Star },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-border bg-white p-5">
                <Icon size={20} className="text-[#176B87] mb-3" />
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
