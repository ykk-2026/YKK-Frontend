import {
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  CalendarClock,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Accessibility,
} from 'lucide-react';
import { useState } from 'react';
import type { Page } from '@/app/types';

interface MainPageProps {
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
}

const searchTags = ['휠체어 이동', '재택근무', '장애인 주차', '엘리베이터', '화상 면접', '서울 개발자'];

const quickMenus = [
  { label: '지역별', helper: '가까운 공고', icon: MapPin },
  { label: '재택 가능', helper: '출퇴근 부담 낮게', icon: Home },
  { label: '장애친화', helper: '시설 확인', icon: Accessibility },
  { label: '오늘 마감', helper: '바로 지원', icon: CalendarClock },
  { label: '급구', helper: '빠른 채용', icon: Bell },
  { label: '추천순', helper: '조건 매칭', icon: Sparkles },
];

const recommendedJobs = [
  { title: 'Java 백엔드 개발자', location: '서울 송파구', score: 98 },
  { title: 'React 프론트엔드 개발자', location: '경기 성남시', score: 94 },
  { title: '데이터 분석가', location: '서울 강서구', score: 91 },
];

const todayStats = [
  { title: '접근성 검증 완료', count: '312건', helper: '시설 사진과 상세 조건 제공', icon: ShieldCheck },
  { title: '재택/하이브리드', count: '486건', helper: '출퇴근 부담을 줄이는 공고', icon: Home },
  { title: '오늘 새 공고', count: '94건', helper: '최근 등록순으로 확인', icon: CalendarClock },
  { title: '즉시 지원 가능', count: '139건', helper: '간편 지원 지원', icon: Briefcase },
];

const companies = [
  { name: 'Samsung SDS', count: '채용 24건', tags: ['휠체어 동선', '재택 가능'], color: '#1B6EF3' },
  { name: 'Kakao', count: '채용 18건', tags: ['하이브리드', '화상 면접'], color: '#F59E0B' },
  { name: 'Naver', count: '채용 21건', tags: ['보조기기', '장애인 화장실'], color: '#10B981' },
  { name: 'LG CNS', count: '채용 15건', tags: ['장애인 주차', '유연근무'], color: '#8B5CF6' },
];

const profiles = [
  { name: '김민준', age: '24세', role: 'Java 백엔드 개발자', location: '서울', career: '경력 2년', score: 92, tags: ['재택근무 가능', '장애인 주차'], initial: '김' },
  { name: '이지아', age: '27세', role: 'React 프론트엔드 개발자', location: '경기 성남', career: '경력 3년', score: 89, tags: ['하이브리드', '엘리베이터'], initial: '이' },
  { name: '박서준', age: '29세', role: '데이터 분석가', location: '서울 강서', career: '경력 2년', score: 87, tags: ['보조기기 지원', '화상 면접'], initial: '박' },
];

const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '전국'];

export function MainPage({ navigate }: MainPageProps) {
  const [query, setQuery] = useState('');

  const goJobs = () => navigate('jobs');

  return (
    <div className="bg-[#F6F8FB] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-5">
            <section className="rounded-xl border border-[#D8E4F0] bg-[#F2F7FD] p-5 sm:p-6">
              <div className="grid lg:grid-cols-[1fr_290px] gap-5 items-start">
                <div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="rounded-full bg-white border border-[#DCEAF3] px-3 py-1 text-sm font-semibold text-[#176B87]">장애친화 채용</span>
                    <span className="rounded-full bg-[#E8F8F4] px-3 py-1 text-sm font-semibold text-[#14806E]">접근성 조건 확인</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground">
                    일하기 편한 조건으로
                    <br />
                    공고를 찾아보세요
                  </h1>
                  <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                    지역, 직무, 근무방식, 편의시설을 한 번에 검색할 수 있습니다.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="직무, 회사, 지역, 편의시설 검색"
                        className="h-12 w-full rounded-lg border border-[#C9DAE8] bg-white pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-[#176B87]/15"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={goJobs}
                      className="h-12 rounded-lg bg-[#176B87] px-6 font-semibold text-white inline-flex items-center justify-center gap-2 hover:bg-[#0F5A72]"
                    >
                      검색
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchTags.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={goJobs}
                        className="rounded-full border border-[#DCEAF3] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:border-[#176B87]"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <aside className="rounded-xl border border-[#DCEAF3] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">내 프로필 기준</p>
                      <h2 className="mt-1 text-xl font-bold text-foreground">추천 공고 42건</h2>
                    </div>
                    <span className="rounded-full bg-[#E8F8F4] px-3 py-1 text-sm font-bold text-[#14A38B]">98%</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {recommendedJobs.map(job => (
                      <button
                        type="button"
                        key={job.title}
                        onClick={goJobs}
                        className="w-full rounded-lg bg-[#F7FAFC] px-3 py-3 text-left hover:bg-[#F0F7FF]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-foreground">{job.title}</p>
                          <span className="text-sm font-bold text-[#14A38B]">{job.score}%</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{job.location} · 접근성 조건 일치</p>
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={goJobs} className="mt-4 w-full text-sm font-semibold text-[#176B87]">
                    전체 보기 <ArrowRight size={14} className="inline" />
                  </button>
                </aside>
              </div>
            </section>

            <section className="rounded-xl border border-[#E1E7EC] bg-white p-4">
              <div className="grid grid-cols-2 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[#E8EEF4]">
                {quickMenus.map(item => {
                  const Icon = item.icon;
                  return (
                    <button type="button" key={item.label} onClick={goJobs} className="p-4 text-left hover:bg-[#F7FAFC]">
                      <Icon size={22} className="text-[#176B87] mb-3" />
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-[#E1E7EC] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">오늘 바로 볼 채용</h2>
                <button type="button" onClick={goJobs} className="text-sm font-semibold text-[#176B87]">
                  전체 보기 <ArrowRight size={14} className="inline" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {todayStats.map(item => {
                  const Icon = item.icon;
                  return (
                    <button type="button" key={item.title} onClick={goJobs} className="rounded-lg border border-[#E1E7EC] bg-[#F8FAFC] p-4 text-left hover:border-[#176B87]">
                      <Icon size={21} className="text-[#176B87] mb-3" />
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{item.count}</p>
                      <p className="mt-2 text-xs text-[#14806E]">{item.helper}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-[#E1E7EC] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">장애친화 우수 기업</h2>
                <button type="button" onClick={goJobs} className="text-sm font-semibold text-[#176B87]">
                  기업 더 보기 <ArrowRight size={14} className="inline" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {companies.map(company => (
                  <button type="button" key={company.name} onClick={goJobs} className="rounded-lg border border-[#E1E7EC] p-4 text-left hover:border-[#176B87]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold" style={{ backgroundColor: company.color }}>
                        {company.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{company.name}</p>
                        <p className="text-xs text-muted-foreground">{company.count}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {company.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-[#F0FBF8] px-2.5 py-1 text-xs text-[#176B87]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#E1E7EC] bg-white p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">구직자 프로필</h2>
                <button type="button" onClick={() => navigate('user-dashboard')} className="text-sm font-semibold text-[#176B87]">
                  프로필 관리 <ArrowRight size={14} className="inline" />
                </button>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">구직자 목록 (12,847명)</p>
              <div className="space-y-4">
                {profiles.map(profile => (
                  <article key={profile.name} className="border-b border-[#E8EEF4] pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#DDF7F2] text-lg font-bold text-[#176B87]">
                        {profile.initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-foreground">
                              {profile.name} <span className="font-normal text-muted-foreground">({profile.age})</span>
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{profile.role}</p>
                            <p className="mt-1 text-xs text-muted-foreground">· {profile.location} · {profile.career}</p>
                          </div>
                          <div className="text-right text-xs">
                            <p className="text-muted-foreground">AI 적합도</p>
                            <p className="mt-1 text-sm font-bold text-[#14A38B]">{profile.score}%</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {profile.tags.map(tag => (
                            <span key={tag} className="rounded-full bg-[#F0FBF8] px-2.5 py-1 text-xs text-[#176B87]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" onClick={() => navigate('user-dashboard')} className="mt-4 w-full text-sm font-semibold text-[#176B87]">
                전체 보기 <ArrowRight size={14} className="inline" />
              </button>
            </section>

            <section className="rounded-xl border border-[#E1E7EC] bg-white p-5">
              <h2 className="mb-4 text-xl font-bold text-foreground">지역별 채용</h2>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button type="button" key={region} onClick={goJobs} className="rounded-full bg-[#F1F5F8] px-4 py-2 text-sm font-medium text-foreground hover:bg-[#176B87] hover:text-white">
                    {region}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-5 grid sm:grid-cols-3 gap-4">
          {[
            { label: '가입 사용자', value: '12,847', icon: Users },
            { label: '진행 중인 채용', value: '4,218', icon: Building2 },
            { label: '추천 만족도', value: '98%', icon: Star },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-[#E1E7EC] bg-white p-5">
                <Icon size={20} className="text-[#176B87] mb-3" />
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
