import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  MessageCircle,
  Monitor,
  ParkingSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  Video,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Page } from '@/app/types';

interface InfoPageProps {
  navigate: (page: Page) => void;
}

const companies = [
  {
    name: 'Samsung SDS',
    field: '클라우드 · SI',
    location: '서울 송파구',
    scale: '대기업',
    description: '클라우드와 엔터프라이즈 솔루션 직무를 중심으로 재택근무, 유연근무, 사무공간 접근성 지원을 함께 운영합니다.',
    tags: ['재택근무', '유연근무', '장애인 주차'],
    openings: 3,
    hiring: ['Java 백엔드 개발자', '시스템 운영 엔지니어'],
    accessibility: ['휠체어 이동 동선', '장애인 주차구역', '높낮이 조절 책상'],
    support: ['화상 면접 가능', '근무시간 조정', '보조공학기기 상담'],
    score: 96,
    color: '#1B6EF3',
  },
  {
    name: 'Kakao',
    field: '플랫폼 서비스',
    location: '경기 성남시',
    scale: '대기업',
    description: '플랫폼 개발과 서비스 운영 직무에서 하이브리드 근무, 문자 안내, 보조공학기기 구매 지원 제도를 제공합니다.',
    tags: ['하이브리드', '보조기기', '문자 안내'],
    openings: 2,
    hiring: ['프론트엔드 개발자', '서비스 운영 매니저'],
    accessibility: ['화상 면접', '문자 안내', '보조기기 구매 지원'],
    support: ['청각장애 지원', '원격 협업 도구', '면접 방식 선택'],
    score: 94,
    color: '#F59E0B',
  },
  {
    name: 'LG CNS',
    field: 'AI · 데이터',
    location: '서울 강서구',
    scale: '대기업',
    description: '데이터 분석과 AI 프로젝트 직무 채용을 진행하며 이동 편의시설, 건강검진, 근무시간 조정을 지원합니다.',
    tags: ['정규직', '건강검진', '근무시간 조정'],
    openings: 1,
    hiring: ['데이터 분석가'],
    accessibility: ['엘리베이터', '장애인 화장실', '근무시간 조정'],
    support: ['건강검진 지원', '사무공간 접근성 확인', '멘토 배정'],
    score: 91,
    color: '#8B5CF6',
  },
  {
    name: 'Naver',
    field: '검색 · 커머스',
    location: '경기 성남시',
    scale: '대기업',
    description: '서비스 기획, 운영, 디자인 직무에서 접근성 검토 절차와 원격 협업 환경, 회의 자막 지원을 제공합니다.',
    tags: ['서비스기획', '원격협업', '회의 자막'],
    openings: 4,
    hiring: ['서비스 기획자', '콘텐츠 운영 담당자'],
    accessibility: ['재택 병행', '셔틀버스', '회의 자막 지원'],
    support: ['원격근무 병행', '접근성 리뷰 참여', '셔틀버스'],
    score: 95,
    color: '#10B981',
  },
];

const companyStats = [
  { label: '검증 기업', value: '24곳', helper: '접근성 항목 확인 완료' },
  { label: '진행 공고', value: '86건', helper: '장애친화 조건 포함' },
  { label: '유연근무', value: '41건', helper: '재택·하이브리드 포함' },
  { label: '지원 제도', value: '18건', helper: '보조기기·면접 편의' },
];

const companyFilters = ['전체', 'IT/개발', '서비스', '데이터', '디자인'];

interface CommunityPost {
  id: string;
  category: string;
  title: string;
  author: string;
  content: string;
  comments: CommunityComment[];
  replies: number;
  views: number;
  time: string;
  isNew: boolean;
}

interface CommunityComment {
  id: string;
  author: string;
  content: string;
  time: string;
}

const communityPosts: CommunityPost[] = [];
const communityPostsStorageKey = 'ileeumCommunityPosts';
const communityViewedPostsStorageKey = 'ileeumCommunityViewedPosts';

const communityBoards = [
  { title: '취업후기', description: '지원 과정과 합격 경험을 공유합니다.', count: '47개' },
  { title: '직무 질문', description: '직무 선택, 포트폴리오, 면접 질문을 나눕니다.', count: '83개' },
  { title: '접근성 정보', description: '근무환경과 편의시설 정보를 확인합니다.', count: '31개' },
  { title: '스터디 모집', description: '함께 준비할 스터디와 멘토링을 찾습니다.', count: '16개' },
];

const guideSteps = [
  { title: '프로필 작성', description: '희망 직무, 지역, 근무조건, 필요한 접근성 정보를 입력합니다.', icon: FileText },
  { title: 'AI 추천 확인', description: '프로필과 공고 조건을 비교한 맞춤 추천 일자리를 확인합니다.', icon: Sparkles },
  { title: '공고 비교', description: '연봉, 근무형태, 접근성 시설, 지원 제도를 공고별로 비교합니다.', icon: Search },
  { title: '간편 지원', description: '관심 공고를 저장하고 준비된 이력 정보로 빠르게 지원합니다.', icon: ClipboardCheck },
  { title: '면접 준비', description: '화상 면접, 접근성 요청, 제출 서류를 미리 점검합니다.', icon: Video },
  { title: '지원 현황 관리', description: '제출 완료, 서류 검토, 면접 제안 등 진행 상태를 확인합니다.', icon: CheckCircle2 },
];

const guideFaqs = [
  { question: '장애 정보는 꼭 입력해야 하나요?', answer: '필수는 아닙니다. 다만 필요한 편의시설과 근무 조건을 입력하면 추천 정확도가 높아집니다.' },
  { question: '기업에 접근성 요청을 어떻게 전달하나요?', answer: '지원 전 공고 상세에서 요청 가능 항목을 확인하고, 지원 메모 또는 문의 기능으로 전달할 수 있습니다.' },
  { question: '관심 공고는 어디서 확인하나요?', answer: '상단 메뉴의 프로필 또는 지원 현황에서 저장한 공고와 지원한 공고를 함께 확인할 수 있습니다.' },
];

export function CompanyInfoPage({ navigate }: InfoPageProps) {
  const [activeFilter, setActiveFilter] = useState('전체');
  const filteredCompanies = companies.filter(company => {
    if (activeFilter === '전체') return true;
    const target = [company.field, company.description, ...company.hiring, ...company.tags].join(' ');
    return target.includes(activeFilter.replace('IT/개발', '개발'));
  });

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-5 py-6 sm:px-6">
        <section className="overflow-hidden rounded-xl border border-[#DDE3EA] bg-white shadow-sm">
          <div className="grid gap-6 bg-[#EEF5FF] p-6 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-[#0D6BEA]">기업 정보</span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-black">장애친화 기업 정보를 비교하세요</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#596273]">
                채용 중인 기업의 근무형태, 접근성 시설, 면접 편의, 지원 제도를 공고와 함께 확인할 수 있습니다.
              </p>
            </div>
            <div className="rounded-lg border border-[#D7E6FF] bg-white p-4">
              <p className="text-sm font-black text-black">확인 기준</p>
              <div className="mt-3 space-y-2 text-xs font-bold text-[#596273]">
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#14843C]" /> 이동·출입 접근성</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#14843C]" /> 보조공학기기 지원</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#14843C]" /> 면접 및 근무 편의</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-[#DDE8F8] p-5 sm:grid-cols-4">
            {companyStats.map(item => (
              <div key={item.label} className="rounded-lg bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs font-bold text-[#718096]">{item.label}</p>
                <p className="mt-1 text-xl font-black text-black">{item.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#8A94A6]">{item.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDE3EA] bg-white px-5 py-4 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-black">기업별 상세 정보</h2>
                <p className="mt-1 text-xs font-bold text-[#7A8495]">필터를 누르면 이 페이지 안에서 바로 바뀝니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyFilters.map(filter => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                      activeFilter === filter ? 'bg-[#0D6BEA] text-white' : 'bg-[#F1F4F8] text-[#344054] hover:bg-[#E4EFFF] hover:text-[#0D6BEA]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredCompanies.map(company => (
                <article key={company.name} className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm transition hover:border-[#B9D6FF] hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-black text-white" style={{ backgroundColor: company.color }}>
                        {company.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black text-black">{company.name}</h2>
                        <p className="mt-1 text-sm font-bold text-[#596273]">{company.field}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#E7F8EF] px-3 py-1 text-xs font-black text-[#14843C]">접근성 {company.score}%</span>
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-6 text-[#344054]">{company.description}</p>

                  <div className="mt-4 grid gap-2 text-xs font-bold text-[#596273] sm:grid-cols-2">
                    <p className="rounded-lg bg-[#F8FAFC] px-3 py-2"><span className="text-[#8A94A6]">위치</span><br />{company.location}</p>
                    <p className="rounded-lg bg-[#F8FAFC] px-3 py-2"><span className="text-[#8A94A6]">규모</span><br />{company.scale}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-[#F1F4F8] px-3 py-1 text-xs font-extrabold text-[#344054]">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-[#E7ECF2] pt-4">
                    <p className="text-xs font-black text-[#718096]">채용 직무</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {company.hiring.map(role => (
                        <span key={role} className="rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-extrabold text-[#0D6BEA]">{role}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#E7ECF2] pt-4">
                    <p className="text-xs font-black text-[#718096]">지원 항목</p>
                    <div className="mt-3 grid gap-2">
                      {company.support.map(item => (
                        <p key={item} className="flex items-center gap-2 text-xs font-bold text-[#344054]">
                          <CheckCircle2 size={14} className="text-[#14843C]" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <button type="button" onClick={() => navigate('jobs')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0D6BEA] px-4 text-sm font-extrabold text-white hover:bg-[#0959C7]">
                    채용공고 {company.openings}건 보기 <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-black"><BadgeCheck size={20} /> 확인하는 정보</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold text-[#344054]">
                <p className="flex items-center gap-2"><Accessibility size={17} className="text-[#0D6BEA]" /> 휠체어 접근성과 이동 동선</p>
                <p className="flex items-center gap-2"><ParkingSquare size={17} className="text-[#0D6BEA]" /> 장애인 주차와 출입 편의</p>
                <p className="flex items-center gap-2"><Monitor size={17} className="text-[#0D6BEA]" /> 보조공학기기 및 원격근무</p>
                <p className="flex items-center gap-2"><Video size={17} className="text-[#0D6BEA]" /> 화상 면접과 문자 안내</p>
              </div>
            </section>
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-black"><Building2 size={20} /> 기업회원 안내</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#596273]">채용 공고 등록 시 접근성 지원 항목을 함께 입력하면 구직자가 더 정확하게 공고를 비교할 수 있습니다.</p>
              <button type="button" onClick={() => navigate('corporate')} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#C9D5E5] px-4 text-sm font-extrabold text-[#344054] hover:bg-[#F8FAFC]">
                기업 프로필 보기 <ArrowRight size={16} />
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

const communityTabs = ['전체 게시글', '면접후기', '정보공유', '질문'];
const writableCommunityCategories = communityTabs.slice(1);
const categoryTone: Record<string, string> = {
  면접후기: 'bg-[#E7F8EF] text-[#14843C]',
  정보공유: 'bg-[#EEF5FF] text-[#0D6BEA]',
  질문: 'bg-[#FFF1E7] text-[#C05621]',
};

const communityGuideDetails = [
  {
    title: '개인정보 보호',
    items: ['전화번호, 주소, 주민등록번호 등 개인정보는 게시하지 않습니다.', '장애 유형이나 진단명은 본인이 원할 때만 제한적으로 공유합니다.'],
  },
  {
    title: '게시글 작성 기준',
    items: ['직무, 면접, 근무환경, 접근성처럼 취업 준비에 도움이 되는 내용을 우선합니다.', '특정 기업이나 개인을 확인되지 않은 내용으로 비방하지 않습니다.'],
  },
  {
    title: '신고 및 제한',
    items: ['광고, 도배, 혐오 표현, 사기성 채용 정보는 숨김 처리될 수 있습니다.', '문제가 있는 게시글은 고객지원으로 신고할 수 있습니다.'],
  },
];

export function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    if (typeof window === 'undefined') return communityPosts;

    const savedPosts = localStorage.getItem(communityPostsStorageKey);
    if (!savedPosts) return communityPosts;

    try {
      const parsedPosts = JSON.parse(savedPosts) as CommunityPost[];
      return parsedPosts
        .filter(post => writableCommunityCategories.includes(post.category))
        .map(post => {
          const comments = Array.isArray(post.comments) ? post.comments : [];
          return {
            ...post,
            comments,
            replies: comments.length,
            views: 0,
          };
        });
    } catch {
      localStorage.removeItem(communityPostsStorageKey);
      return communityPosts;
    }
  });
  const [activeTab, setActiveTab] = useState('전체 게시글');
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [viewedPostIds, setViewedPostIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();

    const savedViewedPosts = localStorage.getItem(communityViewedPostsStorageKey);
    if (!savedViewedPosts) return new Set();

    try {
      return new Set(JSON.parse(savedViewedPosts) as string[]);
    } catch {
      localStorage.removeItem(communityViewedPostsStorageKey);
      return new Set();
    }
  });
  const [showWriter, setShowWriter] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: '정보공유', title: '', author: '나', content: '' });
  const [commentForm, setCommentForm] = useState({ author: '나', content: '' });

  useEffect(() => {
    localStorage.setItem(communityPostsStorageKey, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(communityViewedPostsStorageKey, JSON.stringify(Array.from(viewedPostIds)));
  }, [viewedPostIds]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter(post => {
      const matchTab = activeTab === '전체 게시글' || post.category === activeTab;
      const matchQuery = !normalizedQuery || [post.category, post.title, post.author, post.content].join(' ').toLowerCase().includes(normalizedQuery);
      return matchTab && matchQuery;
    });
  }, [activeTab, posts, query]);
  const selectedPost = posts.find(post => post.id === selectedPostId) || null;

  const submitPost = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const nextPost: CommunityPost = {
      id: `post-${Date.now()}`,
      category: form.category,
      title: form.title.trim(),
      author: form.author.trim() || '나',
      content: form.content.trim(),
      comments: [],
      replies: 0,
      views: 0,
      time: '방금 전',
      isNew: true,
    };

    setPosts(prev => [
      nextPost,
      ...prev,
    ]);
    setForm({ category: '정보공유', title: '', author: '나', content: '' });
    setActiveTab('전체 게시글');
    setQuery('');
    setShowWriter(false);
  };

  const openPost = (post: CommunityPost) => {
    setSelectedPostId(post.id);
    setCommentForm({ author: '나', content: '' });
    if (viewedPostIds.has(post.id)) {
      setPosts(prev => prev.map(item => (item.id === post.id ? { ...item, isNew: false } : item)));
      return;
    }

    setViewedPostIds(prev => new Set(prev).add(post.id));
    setPosts(prev => prev.map(item => (item.id === post.id ? { ...item, views: item.views + 1, isNew: false } : item)));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setSelectedPostId(prev => (prev === postId ? null : prev));
    setBookmarks(prev => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  };

  const submitComment = () => {
    if (!selectedPost || !commentForm.content.trim()) return;

    const nextComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      author: commentForm.author.trim() || '나',
      content: commentForm.content.trim(),
      time: '방금 전',
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== selectedPost.id) return post;
      const comments = [...post.comments, nextComment];
      return { ...post, comments, replies: comments.length };
    }));
    setCommentForm({ author: '나', content: '' });
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const comments = post.comments.filter(comment => comment.id !== commentId);
      return { ...post, comments, replies: comments.length };
    }));
  };

  const toggleBookmark = (postId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-6 py-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="relative overflow-hidden rounded-xl border border-[#DDE3EA] bg-white p-7 shadow-sm">
            <div className="relative z-10">
              <span className="rounded-full bg-[#EAF8F3] px-4 py-1.5 text-xs font-extrabold text-[#14843C]">커뮤니티</span>
              <h1 className="mt-5 text-3xl font-black text-black">취업 경험과 정보를 함께 나누세요</h1>
              <p className="mt-4 text-sm font-semibold text-[#596273]">면접 준비, 직무 정보, 취업 노하우를 서로 공유해요.</p>
            </div>
            <div className="pointer-events-none absolute right-12 top-7 hidden h-[120px] w-[210px] md:block">
              <div className="absolute left-14 top-2 rounded-[18px] bg-[#A8DD73] px-6 py-4 text-white">
                <span className="inline-block h-2 w-2 rounded-full bg-white" />
                <span className="ml-3 inline-block h-2 w-2 rounded-full bg-white" />
                <span className="ml-3 inline-block h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="absolute right-0 top-9 rounded-full bg-[#35C984] p-3 text-white">
                <MessageCircle size={22} fill="currentColor" />
              </div>
              <div className="absolute bottom-0 left-18 h-12 w-12 rounded-t-full bg-[#4E86DA]" />
              <div className="absolute bottom-0 left-0 h-9 w-9 rounded-t-full bg-[#4E86DA]" />
              <div className="absolute bottom-0 left-8 h-16 w-[130px] rounded-t-[50%] bg-[#DCEBFF]" />
            </div>
          </section>

          <aside className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-black text-black"><UsersRound size={20} className="text-[#14843C]" /> 이번 주 활동</h2>
            <div className="mt-5 space-y-4 text-sm font-bold text-[#344054]">
              <p className="flex items-center gap-3"><FileText size={17} className="text-[#0D6BEA]" /> 등록 게시글 {posts.length}개</p>
              <p className="flex items-center gap-3"><BadgeCheck size={17} className="text-[#0D6BEA]" /> 저장 게시글 {bookmarks.size}개</p>
              <p className="flex items-center gap-3"><MessageCircle size={17} className="text-[#0D6BEA]" /> 새 게시글 {posts.filter(post => post.isNew).length}개</p>
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-xl border border-[#DDE3EA] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7ECF2] px-6 py-4">
              <div className="flex flex-wrap gap-7">
                {communityTabs.map(tab => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedPostId(null);
                    }}
                    className={`relative h-10 text-sm font-black ${activeTab === tab ? 'text-[#0D6BEA]' : 'text-black hover:text-[#0D6BEA]'}`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute -bottom-4 left-0 right-0 h-[3px] rounded-full bg-[#0D6BEA]" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative w-[170px] sm:w-[210px]">
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="게시글 검색"
                    className="h-10 w-full rounded-lg border border-[#D7DDE5] bg-white px-3 pr-10 text-sm font-semibold outline-none focus:border-[#0D6BEA]"
                  />
                  <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111827]" />
                </div>
                <button type="button" onClick={() => setShowWriter(prev => !prev)} className="h-10 rounded-lg bg-[#0D6BEA] px-5 text-sm font-black text-white hover:bg-[#0959C7]">
                  글쓰기
                </button>
              </div>
            </div>

            {showWriter && (
              <div className="border-b border-[#E7ECF2] bg-[#F8FAFC] px-6 py-4">
                <div className="grid gap-3 md:grid-cols-[130px_1fr_120px]">
                  <select value={form.category} onChange={event => setForm(prev => ({ ...prev, category: event.target.value }))} className="h-11 rounded-lg border border-[#D7DDE5] bg-white px-3 text-sm font-bold outline-none">
                    {writableCommunityCategories.map(tab => <option key={tab}>{tab}</option>)}
                  </select>
                  <input value={form.title} onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))} placeholder="제목을 입력하세요" className="h-11 rounded-lg border border-[#D7DDE5] bg-white px-3 text-sm font-semibold outline-none" />
                  <input value={form.author} onChange={event => setForm(prev => ({ ...prev, author: event.target.value }))} placeholder="작성자" className="h-11 rounded-lg border border-[#D7DDE5] bg-white px-3 text-sm font-semibold outline-none" />
                </div>
                <textarea value={form.content} onChange={event => setForm(prev => ({ ...prev, content: event.target.value }))} placeholder="내용을 입력하세요" className="mt-3 min-h-20 w-full rounded-lg border border-[#D7DDE5] bg-white px-3 py-3 text-sm font-semibold outline-none" />
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowWriter(false)} className="h-9 rounded-lg border border-[#D7DDE5] px-4 text-sm font-bold text-[#344054]">취소</button>
                  <button type="button" onClick={submitPost} disabled={!form.title.trim() || !form.content.trim()} className="h-9 rounded-lg bg-[#0D6BEA] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">등록</button>
                </div>
              </div>
            )}

            {selectedPost ? (
              <div className="px-6 py-5">
                <button type="button" onClick={() => setSelectedPostId(null)} className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#D7DDE5] px-3 py-2 text-sm font-bold text-[#344054] hover:bg-[#F8FAFC]">
                  <ArrowLeft size={16} />
                  목록으로
                </button>

                <article>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${categoryTone[selectedPost.category] || 'bg-[#F1F4F8] text-[#344054]'}`}>{selectedPost.category}</span>
                    {selectedPost.isNew && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-black text-white">N</span>}
                    <span className="text-xs font-bold text-[#7A8495]">{selectedPost.author} · 댓글 {selectedPost.replies} · 조회 {selectedPost.views} · {selectedPost.time}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black leading-8 text-black">{selectedPost.title}</h2>
                  <div className="mt-5 rounded-lg bg-[#F8FAFC] px-5 py-5">
                    <p className="text-sm font-black text-black">소개글</p>
                    <p className="mt-3 min-h-[96px] whitespace-pre-line text-sm font-semibold leading-7 text-[#344054]">
                      {selectedPost.content}
                    </p>
                  </div>
                </article>

                <section className="mt-6 border-t border-[#E7ECF2] pt-5">
                  <h3 className="flex items-center gap-2 text-lg font-black text-black">
                    <MessageCircle size={19} />
                    댓글 {selectedPost.comments.length}
                  </h3>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr_auto]">
                    <input
                      value={commentForm.author}
                      onChange={event => setCommentForm(prev => ({ ...prev, author: event.target.value }))}
                      placeholder="작성자"
                      className="h-11 rounded-lg border border-[#D7DDE5] px-3 text-sm font-semibold outline-none focus:border-[#0D6BEA]"
                    />
                    <input
                      value={commentForm.content}
                      onChange={event => setCommentForm(prev => ({ ...prev, content: event.target.value }))}
                      onKeyDown={event => {
                        if (event.key === 'Enter') submitComment();
                      }}
                      placeholder="댓글을 입력하세요"
                      className="h-11 rounded-lg border border-[#D7DDE5] px-3 text-sm font-semibold outline-none focus:border-[#0D6BEA]"
                    />
                    <button type="button" onClick={submitComment} disabled={!commentForm.content.trim()} className="h-11 rounded-lg bg-[#0D6BEA] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
                      등록
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-[#E7ECF2] rounded-lg border border-[#E7ECF2] bg-white">
                    {selectedPost.comments.map(comment => (
                      <article key={comment.id} className="flex items-start justify-between gap-4 px-4 py-4">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-black">{comment.author}</p>
                          <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6 text-[#344054]">{comment.content}</p>
                          <p className="mt-2 text-xs font-bold text-[#8A94A6]">{comment.time}</p>
                        </div>
                        <button type="button" onClick={() => deleteComment(selectedPost.id, comment.id)} className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-[#D92D20] hover:bg-[#FFF1F1]">
                          삭제
                        </button>
                      </article>
                    ))}
                    {selectedPost.comments.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm font-bold text-[#718096]">첫 댓글을 작성해 주세요.</div>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#E7ECF2]">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="flex items-center justify-between gap-4 px-6 py-5">
                      <button type="button" onClick={() => openPost(post)} className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${categoryTone[post.category] || 'bg-[#F1F4F8] text-[#344054]'}`}>{post.category}</span>
                          {post.isNew && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-black text-white">N</span>}
                        </div>
                        <h3 className="mt-3 truncate text-base font-black text-black">{post.title}</h3>
                        <p className="mt-2 text-sm font-semibold text-[#7A8495]">{post.author} · 댓글 {post.replies} · 조회 {post.views} · {post.time}</p>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <button type="button" onClick={() => toggleBookmark(post.id)} aria-label="게시글 저장" className={`flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#F8FAFC] ${bookmarks.has(post.id) ? 'text-[#0D6BEA]' : 'text-[#111827]'}`}>
                          <Bookmark size={19} fill={bookmarks.has(post.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button type="button" onClick={() => deletePost(post.id)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#D92D20] hover:bg-[#FFF1F1]">
                          삭제
                        </button>
                      </div>
                    </article>
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="px-6 py-14 text-center">
                      <p className="text-base font-black text-black">등록된 게시글이 없습니다.</p>
                      <p className="mt-2 text-sm font-bold text-[#718096]">글쓰기를 눌러 첫 게시글을 작성해 주세요.</p>
                    </div>
                  )}
                </div>

                {filteredPosts.length > 0 && (
                  <div className="flex items-center justify-center border-t border-[#E7ECF2] px-6 py-5 text-sm font-bold text-[#7A8495]">
                    총 {filteredPosts.length}개 게시글
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-black"><Star size={20} className="text-[#FF6B00]" fill="currentColor" /> 인기 주제</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {['#면접후기', '#재택근무', '#보조공학', '#질문'].map(topic => (
                  <button type="button" key={topic} onClick={() => setQuery(topic.replace('#', ''))} className="rounded-lg bg-[#EEF5FF] px-3 py-2 text-sm font-black text-[#0D6BEA] hover:bg-[#DCEBFF]">
                    {topic}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-black"><ShieldCheck size={20} className="text-[#0EA5E9]" /> 커뮤니티 가이드</h2>
              <div className="mt-5 space-y-4 text-sm font-semibold leading-6 text-[#344054]">
                {[
                  '서로 존중하는 건강한 대화를 지향해요.',
                  '개인정보 및 민감한 정보는 공유하지 마세요.',
                  '광고 및 홍보성 글은 등록이 제한됩니다.',
                  '유용한 정보와 따뜻한 응원으로 함께 성장해요!',
                ].map(item => (
                  <p key={item} className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#20B26B]" /> {item}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(prev => !prev)}
                aria-expanded={showGuide}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D7DDE5] text-sm font-black text-[#0D6BEA] hover:bg-[#F8FAFC]"
              >
                {showGuide ? '접기' : '자세히 보기'} <ArrowRight size={16} className={showGuide ? 'rotate-90 transition' : 'transition'} />
              </button>
              {showGuide && (
                <div className="mt-4 space-y-4 rounded-xl border border-[#DDE3EA] bg-[#F8FAFC] p-4">
                  {communityGuideDetails.map(section => (
                    <article key={section.title}>
                      <h3 className="text-sm font-black text-black">{section.title}</h3>
                      <ul className="mt-2 space-y-2">
                        {section.items.map(item => (
                          <li key={item} className="flex gap-2 text-xs font-semibold leading-5 text-[#596273]">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#20B26B]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export function GuidePage({ navigate }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-6 py-6">
        <section className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
          <span className="rounded-full bg-[#FFF4E5] px-4 py-1.5 text-xs font-extrabold text-[#B45309]">이용안내</span>
          <h1 className="mt-4 text-3xl font-black text-black">일이음 이용 흐름을 안내합니다</h1>
          <p className="mt-2 text-sm font-semibold text-[#596273]">회원가입부터 추천 공고 확인, 지원 관리까지 필요한 과정을 단계별로 확인하세요.</p>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guideSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF5FF] text-[#0D6BEA]">
                  <Icon size={23} />
                </span>
                <p className="mt-4 text-xs font-black text-[#0D6BEA]">STEP {index + 1}</p>
                <h2 className="mt-1 text-lg font-black text-black">{step.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#596273]">{step.description}</p>
              </article>
            );
          })}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-black text-black"><ShieldCheck size={20} /> 자주 쓰는 기능</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button type="button" onClick={() => navigate('jobs')} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-4 py-4 text-left text-sm font-extrabold hover:bg-[#EEF5FF]">
                <span className="flex items-center gap-2"><Search size={18} /> 채용정보 검색</span>
                <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => navigate('ai-recommend')} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-4 py-4 text-left text-sm font-extrabold hover:bg-[#EEF5FF]">
                <span className="flex items-center gap-2"><Star size={18} /> AI 추천 보기</span>
                <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => navigate('user-dashboard')} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-4 py-4 text-left text-sm font-extrabold hover:bg-[#EEF5FF]">
                <span className="flex items-center gap-2"><Bell size={18} /> 지원 현황 관리</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <aside className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-black text-black"><BookOpenCheck size={20} /> 자주 묻는 질문</h2>
            <div className="mt-4 space-y-4">
              {guideFaqs.map(item => (
                <article key={item.question} className="border-b border-[#E7ECF2] pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-sm font-black text-black">{item.question}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#596273]">{item.answer}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
