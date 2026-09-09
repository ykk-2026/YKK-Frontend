import {
  Accessibility,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Code2,
  Database,
  FileText,
  Filter,
  Heart,
  Lightbulb,
  MapPin,
  Search,
  Settings,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Page } from '@/app/types';

interface JobsPageProps {
  mode?: 'all' | 'saved' | 'recommended';
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
  initialQuery?: string;
}

interface JobListing {
  id: string;
  company: string;
  logoText: string;
  logoClass: string;
  title: string;
  region: string;
  location: string;
  employment: string;
  career: string;
  salary: string;
  deadline: string;
  order: number;
  baseScore: number;
  tags: string[];
  requiredSkills: string[];
  preferredRoles: string[];
  learningPath: string[];
}

interface RecommendedJob extends JobListing {
  score: number;
  reasons: string[];
  missingSkills: string[];
  learningDirection: string[];
}

const jobs: JobListing[] = [
  {
    id: 'job-1',
    company: '삼성SDS',
    logoText: 'SAMSUNG\nSDS',
    logoClass: 'bg-white text-[#2563EB] border-[#DCE8FF]',
    title: 'Java 백엔드 개발자',
    region: '서울',
    location: '서울 송파구',
    employment: '정규직',
    career: '경력무관',
    salary: '월 320만원 이상',
    deadline: 'D-12',
    order: 8,
    baseScore: 88,
    tags: ['Java', 'Spring Boot', 'REST API', 'Git'],
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Git'],
    preferredRoles: ['백엔드 개발자', '소프트웨어 개발자'],
    learningPath: ['Spring Boot REST API 실습', 'SQL 조인과 인덱스 정리', 'Git 협업 플로우'],
  },
  {
    id: 'job-2',
    company: '카카오',
    logoText: 'kakao',
    logoClass: 'bg-[#FFE500] text-[#111827]',
    title: 'React 프론트엔드 개발자',
    region: '경기',
    location: '경기 성남시',
    employment: '정규직',
    career: '경력 1년 이상',
    salary: '월 350만원 이상',
    deadline: 'D-18',
    order: 7,
    baseScore: 86,
    tags: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    preferredRoles: ['프론트엔드 개발자', '웹 개발자'],
    learningPath: ['React 상태 관리 패턴', 'TypeScript 타입 설계', '접근성 있는 UI 컴포넌트'],
  },
  {
    id: 'job-4',
    company: '네이버',
    logoText: 'N',
    logoClass: 'bg-[#03C75A] text-white',
    title: '웹 서비스 기획자',
    region: '경기',
    location: '경기도 판교',
    employment: '정규직',
    career: '경력 2년 이상',
    salary: '월 330만원 이상',
    deadline: 'D-7',
    order: 6,
    baseScore: 80,
    tags: ['서비스 기획', '데이터 분석', '커뮤니케이션', '문서작성'],
    requiredSkills: ['Excel', 'SQL', '문서정리', '커뮤니케이션'],
    preferredRoles: ['서비스 기획자', 'PM'],
    learningPath: ['요구사항 정의서 작성', '사용자 흐름 설계', 'SQL 기초 분석'],
  },
  {
    id: 'job-3',
    company: 'LG전자',
    logoText: 'LG',
    logoClass: 'bg-white text-[#A50034] border-[#F4CBD7]',
    title: '데이터 분석가',
    region: '서울',
    location: '서울 영등포구',
    employment: '계약직',
    career: '경력무관',
    salary: '월 300만원 이상',
    deadline: 'D-25',
    order: 5,
    baseScore: 84,
    tags: ['Python', 'SQL', '데이터 시각화', '통계분석'],
    requiredSkills: ['Python', 'SQL', 'Excel', '통계'],
    preferredRoles: ['데이터 분석가', 'BI 분석가'],
    learningPath: ['Python 데이터 전처리', 'SQL 집계 쿼리', '대시보드 포트폴리오 제작'],
  },
  {
    id: 'job-5',
    company: 'SK C&C',
    logoText: 'SK',
    logoClass: 'bg-[#EF4444] text-white',
    title: 'UI/UX 디자이너',
    region: '서울',
    location: '서울 중구',
    employment: '정규직',
    career: '신입 가능',
    salary: '월 280만원 이상',
    deadline: 'D-9',
    order: 4,
    baseScore: 78,
    tags: ['Figma', 'UX 리서치', '디자인 시스템'],
    requiredSkills: ['Figma', '문서정리', '고객응대'],
    preferredRoles: ['UI/UX 디자이너', '프로덕트 디자이너'],
    learningPath: ['Figma 컴포넌트 구조화', '웹 접근성 체크리스트', '사용자 인터뷰 정리'],
  },
  {
    id: 'job-6',
    company: 'Hyundai IT&E',
    logoText: 'H',
    logoClass: 'bg-[#0EA5E9] text-white',
    title: 'IT 서비스 운영',
    region: '서울',
    location: '서울 영등포구',
    employment: '계약직',
    career: '경력무관',
    salary: '월 270만원 이상',
    deadline: 'D-5',
    order: 3,
    baseScore: 74,
    tags: ['ITSM', '모니터링', '문서정리'],
    requiredSkills: ['SQL', 'Excel', '문서정리'],
    preferredRoles: ['IT 서비스 운영', '시스템 운영자'],
    learningPath: ['Linux 기본 명령어', '장애 대응 리포트 작성', '모니터링 지표 이해'],
  },
];

const roleFilters = ['전체', '프론트엔드', '백엔드', '데이터', '디자인', '기획', '사무·행정', 'IT·보안', '기타'];
const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '기타'];
const availableSkills = ['Java', 'Spring Boot', 'React', 'TypeScript', 'Python', 'SQL', 'Figma', 'Excel', '고객응대', '문서정리'];

const getDeadlineDays = (deadline: string) => Number(deadline.replace('D-', ''));
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const makeRecommendation = (job: JobListing, desiredRole: string, selectedSkills: string[]): RecommendedJob => {
  const selectedSkillSet = new Set(selectedSkills);
  const matchedSkills = job.requiredSkills.filter(skill => selectedSkillSet.has(skill));
  const missingSkills = job.requiredSkills.filter(skill => !selectedSkillSet.has(skill)).slice(0, 3);
  const roleMatched = job.preferredRoles.some(role => role.includes(desiredRole) || desiredRole.includes(role));
  const score = clamp(job.baseScore + Math.round((matchedSkills.length / job.requiredSkills.length) * 22) + (roleMatched ? 8 : 0), 58, 99);

  return {
    ...job,
    score,
    reasons: [
      matchedSkills.length ? `${matchedSkills.join(', ')} 역량이 공고 요구사항과 일치합니다.` : '현재 희망 직무와 접근성 조건을 우선 반영했습니다.',
      roleMatched ? `희망 직무인 ${desiredRole}와 직무 방향이 잘 맞습니다.` : `${desiredRole}에서 확장 가능한 인접 직무입니다.`,
      `${job.employment}, ${job.location} 조건으로 지원 가능성을 높게 봤습니다.`,
    ],
    missingSkills,
    learningDirection: missingSkills.length ? job.learningPath.filter(item => missingSkills.some(skill => item.includes(skill))).concat(job.learningPath).slice(0, 3) : job.learningPath.slice(0, 3),
  };
};

export function JobsPage({ mode = 'all', navigate, bookmarks, onBookmark, initialQuery = '' }: JobsPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchDraft, setSearchDraft] = useState(initialQuery);
  const [activeRole, setActiveRole] = useState('전체');
  const [activeRegion, setActiveRegion] = useState('전체');
  const [desiredRole, setDesiredRole] = useState('프론트엔드 개발자');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'SQL']);
  const [filterOpen, setFilterOpen] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(initialQuery === 'D-3');
  const [highMatchOnly, setHighMatchOnly] = useState(false);

  useEffect(() => {
    const nextQuery = initialQuery === 'D-3' ? '' : initialQuery;
    setQuery(nextQuery);
    setSearchDraft(nextQuery);
    setUrgentOnly(initialQuery === 'D-3');
  }, [initialQuery]);

  const recommendedJobs = useMemo(
    () => jobs.map(job => makeRecommendation(job, desiredRole, selectedSkills)).sort((a, b) => b.score - a.score),
    [desiredRole, selectedSkills],
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recommendedJobs.filter(job => {
      if (mode === 'saved' && !bookmarks.has(job.id)) return false;
      if (activeRegion !== '전체' && job.region !== activeRegion) return false;
      if (activeRole !== '전체' && ![job.title, ...job.tags, ...job.preferredRoles].join(' ').includes(activeRole)) return false;
      if (urgentOnly && getDeadlineDays(job.deadline) > 7) return false;
      if (highMatchOnly && job.score < 90) return false;
      if (!normalizedQuery) return true;

      const searchable = [job.company, job.title, job.location, job.employment, job.career, ...job.tags, ...job.requiredSkills].join(' ').toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [activeRegion, activeRole, bookmarks, highMatchOnly, mode, query, recommendedJobs, urgentOnly]);

  const topJob = recommendedJobs[0];
  const title = mode === 'saved' ? '관심공고' : mode === 'recommended' ? 'AI 맞춤 일자리 추천' : '추천 채용공고';

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => (prev.includes(skill) ? prev.filter(item => item !== skill) : [...prev, skill]));
  };

  const submitSearch = () => {
    setQuery(searchDraft.trim());
  };

  const clearFilters = () => {
    setSearchDraft('');
    setQuery('');
    setActiveRole('전체');
    setActiveRegion('전체');
    setUrgentOnly(false);
    setHighMatchOnly(false);
  };

  const showMatchedJobs = () => {
    clearFilters();
    document.getElementById('recommended-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectRecommendedJob = (job: RecommendedJob) => {
    setDesiredRole(job.preferredRoles[0]);
    setActiveRole('전체');
    setSearchDraft(job.title);
    setQuery(job.title);
    document.getElementById('recommended-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (mode === 'recommended') {
    return (
      <div className="min-h-screen bg-[#F3F8FF] text-[#101828]">
        <main className="mx-auto grid max-w-[1240px] gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_336px]">
          <section className="min-w-0 space-y-4">
            <section className="relative overflow-hidden rounded-lg bg-[#DCEEFF] px-7 py-6 shadow-sm">
              <div className="relative z-10 max-w-[540px]">
                <p className="text-sm font-extrabold text-[#1267E8]">AI가 찾아주는, 나에게 딱 맞는 일자리</p>
                <h1 className="mt-3 text-4xl font-black leading-tight text-[#071632]">
                  가능성이 이어지는
                  <br />
                  더 넓은 내일, <span className="text-[#1267E8]">JobBridgeAI</span>
                </h1>
                <p className="mt-4 text-sm font-bold leading-6 text-[#31527A]">
                  당신의 경험과 역량에 맞는 일자리를 AI가 추천해드립니다.
                </p>
                <button
                  type="button"
                  onClick={showMatchedJobs}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#081B45] px-6 text-sm font-extrabold text-white shadow-md hover:bg-[#102A63]"
                >
                  지금 맞춤 일자리 찾기 <ArrowRight size={17} />
                </button>
              </div>

              <div className="absolute bottom-0 right-5 hidden h-[190px] w-[330px] lg:block">
                <div className="absolute bottom-0 right-20 h-28 w-36 rounded-t-[44px] bg-[#547FE6]" />
                <div className="absolute bottom-24 right-32 h-16 w-16 rounded-full bg-[#F7C9A6] shadow-sm" />
                <div className="absolute bottom-34 right-28 h-12 w-20 rounded-t-full bg-[#5A392C]" />
                <div className="absolute bottom-40 right-52 rotate-[-8deg] rounded bg-white/90 px-3 py-2 text-xs font-black text-[#081B45] shadow-sm">
                  할 수 있는 일이 더 많아요!
                </div>
                <div className="absolute bottom-4 right-42 h-20 w-36 -skew-x-6 rounded-lg bg-[#334155] shadow-lg" />
                <div className="absolute bottom-2 right-1 h-16 w-16 rounded-full border-[8px] border-[#3B82F6] bg-white" />
                <div className="absolute bottom-2 right-58 h-16 w-16 rounded-full border-[8px] border-[#3B82F6] bg-white" />
                <div className="absolute bottom-26 right-2 space-y-2 rounded-lg bg-white/80 p-3 text-xs font-extrabold text-[#1267E8] shadow-sm">
                  <p className="flex items-center gap-1"><Sparkles size={13} /> AI 맞춤 추천</p>
                  <p className="flex items-center gap-1"><Accessibility size={13} /> 장애인 친화 기업</p>
                  <p className="flex items-center gap-1"><CheckCircle2 size={13} /> 접근성 정보 제공</p>
                  <p className="flex items-center gap-1"><BriefcaseBusiness size={13} /> 지속적인 취업 지원</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-white p-3 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[1fr_96px]">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" />
                  <input
                    value={searchDraft}
                    onChange={event => setSearchDraft(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') submitSearch();
                    }}
                    placeholder="직무, 회사명, 지역, 키워드로 검색해보세요."
                    className="h-12 w-full rounded-lg border border-[#D7E1EE] bg-white pl-11 pr-4 text-sm font-bold outline-none placeholder:text-[#98A2B3] focus:border-[#1267E8] focus:ring-4 focus:ring-[#1267E8]/10"
                  />
                </div>
                <button type="button" onClick={submitSearch} className="h-12 rounded-lg bg-[#1267E8] text-sm font-extrabold text-white hover:bg-[#0E58C9]">
                  검색
                </button>
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-2">
              {roleFilters.map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    if (role !== '전체') setDesiredRole(`${role} 직무`);
                  }}
                  className={`h-9 rounded-full px-4 text-xs font-extrabold shadow-sm ${
                    activeRole === role ? 'bg-[#081B45] text-white' : 'bg-white text-[#667085] hover:bg-[#EAF2FF]'
                  }`}
                >
                  {role}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFilterOpen(prev => !prev)}
                className={`ml-auto inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-extrabold shadow-sm ${
                  filterOpen || urgentOnly || highMatchOnly ? 'bg-[#1267E8] text-white' : 'bg-white text-[#081B45] hover:bg-[#EAF2FF]'
                }`}
              >
                <Filter size={15} /> 필터
              </button>
            </section>

            {filterOpen && (
              <section className="grid gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setHighMatchOnly(prev => !prev)}
                  className={`h-10 rounded-lg text-sm font-extrabold ${highMatchOnly ? 'bg-[#1267E8] text-white' : 'bg-[#F2F6FB] text-[#344054] hover:bg-[#EAF2FF]'}`}
                >
                  적합도 90% 이상
                </button>
                <button
                  type="button"
                  onClick={() => setUrgentOnly(prev => !prev)}
                  className={`h-10 rounded-lg text-sm font-extrabold ${urgentOnly ? 'bg-[#EF4444] text-white' : 'bg-[#F2F6FB] text-[#344054] hover:bg-[#EAF2FF]'}`}
                >
                  마감 7일 이내
                </button>
                <button type="button" onClick={clearFilters} className="h-10 rounded-lg bg-[#F8FAFC] text-sm font-extrabold text-[#667085] hover:bg-[#EEF2F6]">
                  전체 초기화
                </button>
              </section>
            )}

            <section id="recommended-list" className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#081B45]">추천 채용공고</h2>
                  <p className="mt-1 text-xs font-bold text-[#667085]">당신에게 맞는 일자리를 추천합니다.</p>
                </div>
                <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1267E8]">
                  전체보기 <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <JobRow key={job.id} job={job} bookmarks={bookmarks} onBookmark={onBookmark} navigate={navigate} showAnalysis />
                  ))
                ) : (
                  <EmptyState onReset={clearFilters} />
                )}
              </div>
            </section>
          </section>

          <aside className="space-y-4">
            <section className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black text-[#081B45]">
                  <Sparkles size={20} className="text-[#F59E0B]" />
                  AI 맞춤 추천
                </h2>
              </div>
              <p className="mb-4 text-xs font-bold text-[#667085]">지원님을 위한 추천 직무예요!</p>
              <div className="space-y-3">
                {recommendedJobs.slice(0, 5).map((job, index) => (
                  <button
                    type="button"
                    key={job.id}
                    onClick={() => selectRecommendedJob(job)}
                    className="flex h-12 w-full items-center justify-between rounded-lg bg-[#F4F8FD] px-4 text-left text-sm font-extrabold text-[#344054] hover:bg-[#EAF2FF]"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${index === 0 ? 'bg-[#E7F0FF] text-[#1267E8]' : index === 1 ? 'bg-[#EAF7FF] text-[#0E7490]' : index === 2 ? 'bg-[#FFF7E8] text-[#B45309]' : 'bg-[#EEF2F7] text-[#475467]'}`}>
                        {index === 0 ? <BarChart3 size={17} /> : index === 1 ? <Database size={17} /> : index === 2 ? <Lightbulb size={17} /> : index === 3 ? <Code2 size={17} /> : <Settings size={17} />}
                      </span>
                      {job.title}
                    </span>
                    <ArrowRight size={15} className="text-[#98A2B3]" />
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black text-[#081B45]">
                  <MapPin size={20} />
                  지역별 채용공고
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {regions.map(region => (
                  <button
                    type="button"
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`h-10 rounded-lg text-xs font-extrabold ${
                      activeRegion === region ? 'bg-[#1267E8] text-white' : 'bg-[#F2F6FB] text-[#344054] hover:bg-[#EAF2FF]'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[#081B45]">
                <ClipboardList size={20} />
                빠른 메뉴
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '이력서 관리', icon: FileText, page: 'user-dashboard' as Page, className: 'bg-[#EAF2FF] text-[#1267E8]' },
                  { label: '지원현황', icon: CheckCircle2, page: 'applications' as Page, className: 'bg-[#E7F8EF] text-[#14843C]' },
                  { label: '관심공고', icon: Heart, page: 'saved' as Page, className: 'bg-[#FFF1F3] text-[#E11D48]' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} type="button" onClick={() => navigate(item.page)} className="rounded-lg bg-[#F7FAFE] px-2 py-4 text-center text-xs font-extrabold text-[#344054] hover:bg-[#EAF2FF]">
                      <span className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${item.className}`}>
                        <Icon size={17} />
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-[#081B45]">
                <Target size={20} className="text-[#1267E8]" />
                맞춤 조건
              </h2>
              <label className="mt-4 block">
                <span className="text-xs font-extrabold text-[#667085]">희망 직무</span>
                <input
                  value={desiredRole}
                  onChange={event => setDesiredRole(event.target.value)}
                  className="mt-2 h-10 w-full rounded-lg border border-[#D7E1EE] px-3 text-sm font-bold outline-none focus:border-[#1267E8]"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                      selectedSkills.includes(skill) ? 'bg-[#1267E8] text-white' : 'bg-[#F2F6FB] text-[#667085] hover:bg-[#EAF2FF]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F8FF] text-[#101828]">
      <main className="mx-auto max-w-[980px] px-4 py-6">
        <section className="mb-4 rounded-lg bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#081B45]">{title}</h1>
          <div className="mt-4 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              value={searchDraft}
              onChange={event => setSearchDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') submitSearch();
              }}
              placeholder="직무, 회사명, 지역 검색"
              className="h-12 w-full rounded-lg border border-[#D7E1EE] pl-11 pr-4 text-sm font-bold outline-none focus:border-[#1267E8]"
            />
          </div>
        </section>
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobRow key={job.id} job={job} bookmarks={bookmarks} onBookmark={onBookmark} navigate={navigate} />
              ))
            ) : (
              <EmptyState onReset={clearFilters} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function JobRow({
  job,
  bookmarks,
  onBookmark,
  navigate,
  showAnalysis = false,
}: {
  job: RecommendedJob;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
  navigate: (page: Page, jobId?: string) => void;
  showAnalysis?: boolean;
}) {
  return (
    <article className="rounded-lg border border-[#E3EAF3] bg-white px-3 py-3 shadow-[0_1px_0_rgba(16,24,40,0.03)] transition hover:border-[#B9D6FF] hover:shadow-sm">
      <div className="grid gap-3 md:grid-cols-[48px_minmax(0,1fr)_auto] md:items-center">
        <button type="button" onClick={() => navigate('job-detail', job.id)} className={`flex h-12 w-12 items-center justify-center whitespace-pre-line rounded-lg border text-center text-[10px] font-black leading-3 ${job.logoClass}`}>
          {job.logoText}
        </button>

        <button type="button" onClick={() => navigate('job-detail', job.id)} className="min-w-0 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-black text-[#081B45]">{job.title}</h3>
            <span className="text-xs font-extrabold text-[#1267E8]">{job.deadline}</span>
          </div>
          <p className="mt-1 text-xs font-bold text-[#667085]">{job.company}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-[#667085]">
            <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[#1267E8]">{job.employment}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
            <span>{job.career}</span>
          </div>
        </button>

        <div className="flex items-center gap-2 md:justify-end">
          <button
            type="button"
            aria-label={bookmarks.has(job.id) ? '관심 공고 해제' : '관심 공고 저장'}
            onClick={() => onBookmark(job.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#081B45] hover:bg-[#F2F6FB]"
          >
            {bookmarks.has(job.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
          <button
            type="button"
            onClick={() => navigate('job-detail', job.id)}
            className="inline-flex h-9 items-center gap-1 rounded-full bg-[#1267E8] px-4 text-xs font-extrabold text-white hover:bg-[#0E58C9]"
          >
            상세보기 <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 pl-0 md:pl-[60px]">
        {job.tags.map(tag => (
          <span key={tag} className="rounded-full bg-[#F0F4F8] px-2.5 py-1 text-[11px] font-bold text-[#667085]">
            {tag}
          </span>
        ))}
      </div>

      {showAnalysis && (
        <div className="mt-3 grid gap-2 border-t border-[#EEF2F6] pt-3 md:grid-cols-3 md:pl-[60px]">
          <InfoStrip title="추천 이유" value={job.reasons[0]} />
          <InfoStrip title="부족 역량" value={job.missingSkills.length ? job.missingSkills.join(', ') : '핵심 역량 충족'} />
          <InfoStrip title="학습 방향" value={job.learningDirection[0]} />
        </div>
      )}
    </article>
  );
}

function InfoStrip({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F7FAFE] px-3 py-2">
      <p className="text-[11px] font-black text-[#1267E8]">{title}</p>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-[#475467]">{value}</p>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-[#CAD7E6] bg-[#F7FAFE] px-5 py-10 text-center">
      <p className="text-base font-black text-[#081B45]">조건에 맞는 추천 공고가 없습니다.</p>
      <p className="mt-2 text-sm font-bold text-[#667085]">검색어, 지역, 직무 필터를 초기화하면 전체 추천을 다시 볼 수 있습니다.</p>
      <button type="button" onClick={onReset} className="mt-5 h-10 rounded-lg bg-[#1267E8] px-5 text-sm font-extrabold text-white hover:bg-[#0E58C9]">
        조건 초기화
      </button>
    </div>
  );
}
