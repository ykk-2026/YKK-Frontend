import { ChevronRight, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/app/components/BrandLogo';
import type { CurrentUser, Page } from '@/app/types';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

type MenuPanel = 'all' | 'jobs' | 'brand' | null;

interface NavItem {
  label: string;
  page: Page;
  panel?: Exclude<MenuPanel, null>;
  authRequired?: boolean;
}

const allMenuSections = [
  {
    title: '개인회원',
    links: [
      { label: '프로필 관리', page: 'user-dashboard' as Page, authRequired: true },
      { label: '이력서 관리', page: 'user-dashboard' as Page, authRequired: true },
      { label: '지원 현황', page: 'user-dashboard' as Page, authRequired: true },
      { label: '관심 공고', page: 'saved' as Page },
    ],
  },
  {
    title: '채용 탐색',
    links: [
      { label: '전체 채용정보', page: 'jobs' as Page },
      { label: '마감 임박 공고', page: 'jobs' as Page },
      { label: '재택 가능 공고', page: 'jobs' as Page },
      { label: '장애친화 공고', page: 'jobs' as Page },
    ],
  },
  {
    title: '기업회원',
    links: [
      { label: '기업 프로필', page: 'corporate' as Page, authRequired: true },
      { label: '공고 관리', page: 'corporate' as Page, authRequired: true },
      { label: '지원자 관리', page: 'corporate' as Page, authRequired: true },
      { label: '채용 통계', page: 'corporate' as Page, authRequired: true },
    ],
  },
  {
    title: '안내',
    links: [
      { label: '취업스토리', page: 'main' as Page },
      { label: '고객지원', page: 'main' as Page },
      { label: '회원가입', page: 'register' as Page },
      { label: '로그인', page: 'login' as Page },
    ],
  },
];

const jobMenuSections = [
  {
    title: '채용정보',
    links: ['전체 채용정보', '오늘 올라온 공고', '마감 임박 공고', '저장한 공고'],
  },
  {
    title: '지역별',
    links: ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '전국'],
  },
  {
    title: '직무별',
    links: ['개발', '데이터', '디자인', '서비스 기획', '운영', '고객지원'],
  },
  {
    title: '근무조건',
    links: ['재택근무', '하이브리드', '유연근무', '장애인 주차', '보조기기 지원', '화상 면접'],
  },
];

const brandCompanies = [
  '네이버클라우드',
  '카카오',
  '쿠팡',
  '라인플러스',
  '우아한형제들',
  '토스',
  '스타벅스',
  '이마트',
  '롯데',
  'CJ',
  '삼성전자',
  '현대백화점',
  'SK텔레콤',
  'KT',
  'LG유플러스',
  '당근',
  '무신사',
  '배달의민족',
  '컬리',
  'GS리테일',
  '신세계',
  '올리브영',
  '파리바게뜨',
  '공공기관',
];

export function Navbar({ currentPage, navigate, currentUser, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<MenuPanel>(null);
  const userPage: Page = currentUser?.role === 'corporate' ? 'corporate' : currentUser?.role === 'admin' ? 'admin' : 'user-dashboard';

  const navItems: NavItem[] = [
    { label: '전체메뉴', page: 'jobs', panel: 'all' },
    { label: '채용정보', page: 'jobs', panel: 'jobs' },
    { label: '브랜드채용', page: 'jobs', panel: 'brand' },
    { label: '인재정보', page: userPage, authRequired: true },
    { label: '취업스토리', page: 'main' },
    { label: '고객지원', page: 'main' },
  ];

  const goTo = (page: Page) => {
    navigate(page);
    setMobileOpen(false);
    setActivePanel(null);
  };

  const goProtected = (page: Page, authRequired?: boolean) => {
    if (authRequired && !currentUser) {
      goTo('login');
      return;
    }

    goTo(page);
  };

  const handleJobLink = (link: string) => {
    goTo(link === '저장한 공고' ? 'saved' : 'jobs');
  };

  const logout = () => {
    onLogout();
    setMobileOpen(false);
    setActivePanel(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5EAF0] bg-white">
      <div className="mx-auto flex h-20 max-w-[1256px] items-center justify-between px-5 sm:px-8">
        <button type="button" onClick={() => goTo('main')} className="flex items-center gap-3" aria-label="일이음 홈으로 이동">
          <BrandLogo compact />
        </button>

        <div className="hidden items-center gap-5 md:flex">
          {currentUser ? (
            <>
              <button type="button" onClick={() => goTo(userPage)} className="text-base font-bold text-[#111827] hover:text-[#0D6BEA]">
                프로필
              </button>
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-[#DCE3EB] px-3.5 py-2 text-sm font-bold text-[#475467] hover:bg-[#F7F9FC]">
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => goTo('login')} className="text-base font-bold text-[#111827] hover:text-[#0D6BEA]">
                로그인
              </button>
              <button type="button" onClick={() => goTo('register')} className="rounded-lg bg-[#0D6BEA] px-5 py-2.5 text-base font-bold text-white shadow-sm hover:bg-[#0959C7]">
                회원가입
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE3EB] md:hidden"
          onClick={() => setMobileOpen(prev => !prev)}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <div className="hidden border-t border-[#F0F2F5] bg-white md:block" onMouseLeave={() => setActivePanel(null)}>
        <nav className="mx-auto flex h-12 max-w-[1256px] items-center px-5 sm:px-8">
          <div className="flex h-full items-center gap-8">
            {navItems.map(item => (
              <button
                type="button"
                key={item.label}
                onMouseEnter={() => setActivePanel(item.panel || null)}
                onClick={() => goProtected(item.page, item.authRequired)}
                className="relative flex h-full items-center gap-1 text-sm font-extrabold text-[#111827] transition hover:text-[#0D6BEA]"
              >
                {item.label === '전체메뉴' && <Menu size={16} />}
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {activePanel && (
        <div
          className="hidden border-t border-[#E5EAF0] bg-white shadow-sm md:block"
          onMouseEnter={() => setActivePanel(activePanel)}
          onMouseLeave={() => setActivePanel(null)}
        >
          {activePanel === 'all' && (
            <div className="mx-auto grid max-w-[1256px] grid-cols-4 divide-x divide-[#E7ECF2] px-5 py-6 sm:px-8">
              {allMenuSections.map(section => (
                <div key={section.title} className="px-5 first:pl-0 last:pr-0">
                  <h3 className="mb-4 text-base font-extrabold text-black">{section.title}</h3>
                  <div className="grid gap-2.5">
                    {section.links.map(link => (
                      <button
                        type="button"
                        key={link.label}
                        onClick={() => goProtected(link.page, link.authRequired)}
                        className="text-left text-sm font-semibold text-[#596273] hover:text-[#0D6BEA]"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activePanel === 'jobs' && (
            <div className="mx-auto grid max-w-[1256px] grid-cols-4 divide-x divide-[#E7ECF2] px-5 py-6 sm:px-8">
              {jobMenuSections.map(section => (
                <div key={section.title} className="px-5 first:pl-0 last:pr-0">
                  <button
                    type="button"
                    onClick={() => goTo('jobs')}
                    className="mb-4 inline-flex items-center gap-1 text-base font-extrabold text-black hover:text-[#0D6BEA]"
                  >
                    {section.title}
                    <ChevronRight size={15} />
                  </button>
                  <div className="grid gap-2.5">
                    {section.links.map(link => (
                      <button
                        type="button"
                        key={link}
                        onClick={() => handleJobLink(link)}
                        className="text-left text-sm font-semibold text-[#596273] hover:text-[#0D6BEA]"
                      >
                        {link}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activePanel === 'brand' && (
            <div className="mx-auto max-w-[1256px] px-5 py-5 sm:px-8">
              <h3 className="mb-4 text-sm font-extrabold text-black">주요 기업 채용</h3>
              <div className="grid grid-cols-4 gap-3 lg:grid-cols-6">
                {brandCompanies.map(company => (
                  <button
                    type="button"
                    key={company}
                    onClick={() => goTo('jobs')}
                    className="min-h-[54px] rounded-lg border border-[#E1E7EF] bg-[#FAFBFD] px-3 py-2 text-center text-xs font-extrabold text-[#1F2A44] hover:border-[#0D6BEA] hover:bg-white hover:text-[#0D6BEA]"
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-[#E5EAF0] bg-white px-5 py-4 md:hidden">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                type="button"
                key={item.label}
                onClick={() => goProtected(item.page, item.authRequired)}
                className={`block w-full rounded-lg px-3 py-3 text-left text-base font-bold ${
                  currentPage === item.page ? 'bg-[#EEF5FF] text-[#0D6BEA]' : 'text-[#1F2A44] hover:bg-[#F7F9FC]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="mt-3 border-t border-[#E5EAF0] pt-3">
              {currentUser ? (
                <>
                  <button type="button" onClick={() => goTo(userPage)} className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-bold hover:bg-[#F7F9FC]">
                    <UserRound size={18} />
                    프로필
                  </button>
                  <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-bold text-red-600 hover:bg-red-50">
                    <LogOut size={18} />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => goTo('login')} className="block w-full rounded-lg px-3 py-3 text-left text-base font-bold hover:bg-[#F7F9FC]">
                    로그인
                  </button>
                  <button type="button" onClick={() => goTo('register')} className="block w-full rounded-lg px-3 py-3 text-left text-base font-bold text-[#0D6BEA] hover:bg-[#EEF5FF]">
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
