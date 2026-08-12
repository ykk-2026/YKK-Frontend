import { ChevronRight, LogOut, Menu, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/app/components/BrandLogo';
import type { CurrentUser, Page } from '@/app/types';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

type MenuPanel = 'all' | 'jobs' | null;

interface NavItem {
  label: string;
  page: Page;
  panel?: Exclude<MenuPanel, null>;
  authRequired?: boolean;
}

const allMenuSections = [
  {
    title: '채용분류',
    links: ['전체 채용정보', '오늘 올라온 공고', '마감 임박 공고', '저장한 공고', 'AI 추천 공고'],
  },
  {
    title: '지역별 채용',
    links: ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '전국'],
  },
  {
    title: '직무별 채용',
    links: ['개발', '데이터', '디자인', '서비스 기획', '운영', '고객지원', '사무보조'],
  },
  {
    title: '근무조건',
    links: ['재택근무', '하이브리드', '유연근무', '장애인 주차', '보조기기 지원', '화상 면접', '초보 가능'],
  },
  {
    title: '회원서비스',
    links: ['프로필 관리', '이력서 관리', '지원 현황', '관심 공고', '고객지원'],
  },
];

const jobMenuSections = [
  {
    title: '채용정보',
    links: ['전체 채용정보', '오늘 올라온 공고', '마감 임박 공고', '저장한 공고'],
  },
  {
    title: '지역별',
    links: ['서울', '경기', '인천', '부산', '대구', '전국'],
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

export function Navbar({ currentPage, navigate, currentUser, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<MenuPanel>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userPage: Page = currentUser?.role === 'corporate' ? 'corporate' : currentUser?.role === 'admin' ? 'admin' : 'user-dashboard';

  const navItems: NavItem[] = [
    { label: '전체메뉴', page: 'jobs', panel: 'all' },
    { label: '채용정보', page: 'jobs', panel: 'jobs' },
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

  const openPanel = (panel: Exclude<MenuPanel, null>) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const handleMenuLink = (label: string) => {
    if (label === '저장한 공고' || label === '관심 공고') {
      goTo('saved');
      return;
    }

    if (label === 'AI 추천 공고') {
      goTo('ai-recommend');
      return;
    }

    if (['프로필 관리', '이력서 관리', '지원 현황'].includes(label)) {
      goProtected(userPage, true);
      return;
    }

    if (label === '고객지원') {
      goTo('main');
      return;
    }

    goTo('jobs');
  };

  const submitSearch = () => {
    goTo('jobs');
  };

  const logout = () => {
    onLogout();
    setMobileOpen(false);
    setActivePanel(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5EAF0] bg-white">
      <div className="mx-auto flex h-20 max-w-[1256px] items-center justify-between gap-5 px-5 sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <button type="button" onClick={() => goTo('main')} className="flex shrink-0 items-center gap-3" aria-label="일이음 홈으로 이동">
            <BrandLogo compact />
          </button>

          <div className="relative hidden w-full max-w-[520px] md:block">
            <Search size={18} strokeWidth={2.6} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F2A44]" />
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') submitSearch();
              }}
              placeholder="직무, 회사, 지역, 편의시설 검색"
              className="h-11 w-full rounded-lg border border-[#D7DDE5] bg-[#F8FAFC] pl-11 pr-12 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#8A94A6] focus:border-[#0D6BEA] focus:bg-white focus:ring-4 focus:ring-[#0D6BEA]/10"
            />
            <button
              type="button"
              onClick={submitSearch}
              aria-label="검색"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-[#0D6BEA] text-white hover:bg-[#0959C7]"
            >
              <Search size={16} strokeWidth={2.8} />
            </button>
          </div>
        </div>

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
                onClick={() => (item.panel ? openPanel(item.panel) : goProtected(item.page, item.authRequired))}
                className={`relative flex h-full items-center gap-1 text-sm font-extrabold transition ${
                  activePanel === item.panel ? 'text-[#0D6BEA]' : 'text-[#111827] hover:text-[#0D6BEA]'
                }`}
              >
                {item.label === '전체메뉴' && <Menu size={16} />}
                {item.label}
                {activePanel === item.panel && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D6BEA]" />}
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
            <div className="mx-auto grid max-w-[1256px] grid-cols-5 divide-x divide-[#E7ECF2] px-5 py-6 sm:px-8">
              {allMenuSections.map(section => (
                <div key={section.title} className="px-5 first:pl-0 last:pr-0">
                  <h3 className="mb-4 text-base font-extrabold text-black">{section.title}</h3>
                  <div className="grid gap-2.5">
                    {section.links.map(link => (
                      <button
                        type="button"
                        key={link}
                        onClick={() => handleMenuLink(link)}
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
                        onClick={() => handleMenuLink(link)}
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
