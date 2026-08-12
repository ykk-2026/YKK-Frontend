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

interface NavItem {
  label: string;
  page: Page;
  menu?: 'jobs';
  authRequired?: boolean;
}

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
    title: '기업별',
    links: ['대기업', '중견기업', '공공기관', '스타트업', '장애친화 기업', '재택 가능 기업'],
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
  const [open, setOpen] = useState(false);
  const [jobMenuOpen, setJobMenuOpen] = useState(false);
  const userPage: Page = currentUser?.role === 'corporate' ? 'corporate' : currentUser?.role === 'admin' ? 'admin' : 'user-dashboard';

  const navItems: NavItem[] = [
    { label: '채용정보', page: 'jobs', menu: 'jobs' },
  ];

  const goTo = (page: Page) => {
    navigate(page);
    setOpen(false);
    setJobMenuOpen(false);
  };

  const goProtected = (page: Page, authRequired?: boolean) => {
    if (authRequired && !currentUser) {
      goTo('login');
      return;
    }

    goTo(page);
  };

  const handleJobMenuLink = (link: string) => {
    if (link === '저장한 공고') {
      goTo('saved');
      return;
    }

    goTo('jobs');
  };

  const logout = () => {
    onLogout();
    setOpen(false);
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
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE3EB] md:hidden"
          onClick={() => setOpen(prev => !prev)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <div className="hidden border-t border-[#F0F2F5] bg-[#FBFCFE] md:block" onMouseLeave={() => setJobMenuOpen(false)}>
        <nav className="mx-auto flex h-12 max-w-[1256px] items-center justify-between px-5 sm:px-8">
          <div className="flex h-full items-center gap-8">
            {navItems.map(item => (
              <button
                type="button"
                key={item.label}
                onMouseEnter={() => item.menu === 'jobs' && setJobMenuOpen(true)}
                onClick={() => goProtected(item.page, item.authRequired)}
                className={`relative flex h-full items-center text-sm font-extrabold transition ${
                  currentPage === item.page ? 'text-[#0D6BEA]' : 'text-[#111827] hover:text-[#0D6BEA]'
                }`}
              >
                {item.label}
                {currentPage === item.page && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D6BEA]" />}
              </button>
            ))}
          </div>
          <div />
        </nav>
      </div>

      {jobMenuOpen && (
        <div
          className="hidden border-t border-[#E5EAF0] bg-white shadow-sm md:block"
          onMouseEnter={() => setJobMenuOpen(true)}
          onMouseLeave={() => setJobMenuOpen(false)}
        >
          <div className="mx-auto grid max-w-[1256px] grid-cols-5 divide-x divide-[#E7ECF2] px-5 py-6 sm:px-8">
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
                      onClick={() => handleJobMenuLink(link)}
                      className="text-left text-sm font-semibold text-[#596273] hover:text-[#0D6BEA]"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {open && (
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
