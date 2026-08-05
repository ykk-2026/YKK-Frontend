import { Briefcase, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import type { CurrentUser, Page } from '@/app/types';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

const navItems: Array<{ label: string; page: Page }> = [
  { label: '홈', page: 'main' },
  { label: '채용정보', page: 'jobs' },
  { label: '맞춤 추천', page: 'ai-recommend' },
  { label: '저장한 공고', page: 'saved' },
];

export function Navbar({ currentPage, navigate, currentUser, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const userPage: Page = currentUser?.role === 'corporate' ? 'corporate' : currentUser?.role === 'admin' ? 'admin' : 'user-dashboard';

  const goTo = (page: Page) => {
    navigate(page);
    setOpen(false);
  };

  const logout = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo('main')} className="flex items-center gap-2 font-bold text-foreground">
            <span className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">
              <Briefcase size={18} />
            </span>
            JobBridgeAI
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              type="button"
              key={item.page}
              onClick={() => goTo(item.page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === item.page ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => goTo(userPage)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-muted text-foreground inline-flex items-center gap-2 hover:bg-[#EAF4FF]"
              >
                <span className="w-7 h-7 rounded-full bg-[#DDF7F2] text-[#176B87] flex items-center justify-center">
                  {currentUser.avatar ? <span className="text-xs font-bold">{currentUser.avatar}</span> : <UserRound size={15} />}
                </span>
                프로필
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground inline-flex items-center gap-2 hover:bg-muted hover:text-foreground"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => goTo('login')} className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground">
                로그인
              </button>
              <button type="button" onClick={() => goTo('register')} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white">
                회원가입
              </button>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center"
            onClick={() => setOpen(prev => !prev)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              type="button"
              key={item.page}
              onClick={() => goTo(item.page)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                currentPage === item.page ? 'bg-primary text-white font-semibold' : 'hover:bg-muted'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 mt-2 border-t border-border">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => goTo(userPage)}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted"
                >
                  <UserRound size={16} />
                  프로필
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => goTo('login')} className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted">
                  로그인
                </button>
                <button type="button" onClick={() => goTo('register')} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-[#EAF4FF]">
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
