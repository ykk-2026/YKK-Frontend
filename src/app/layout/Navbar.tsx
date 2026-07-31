import { Briefcase, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { CurrentUser, Page } from '@/app/types';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export function Navbar({ currentPage, navigate, currentUser, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const items: Array<{ label: string; page: Page }> = [
    { label: 'Home', page: 'main' },
    { label: 'Jobs', page: 'jobs' },
    { label: 'AI Match', page: 'ai-recommend' },
    { label: 'Saved', page: 'saved' },
  ];

  const userPage: Page = currentUser?.role === 'corporate' ? 'corporate' : currentUser?.role === 'admin' ? 'admin' : 'user-dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => navigate('main')} className="flex items-center gap-2 font-bold text-foreground">
          <span className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">
            <Briefcase size={18} />
          </span>
          JobBridgeAI
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {items.map(item => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === item.page ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <>
              <button onClick={() => navigate(userPage)} className="px-3 py-2 rounded-lg text-sm font-medium bg-muted text-foreground">
                {currentUser.name}
              </button>
              <button onClick={onLogout} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('login')} className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground">Login</button>
              <button onClick={() => navigate('register')} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white">Sign up</button>
            </>
          )}
        </div>

        <button className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {items.map(item => (
            <button key={item.page} onClick={() => { navigate(item.page); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted">
              {item.label}
            </button>
          ))}
          <button onClick={() => { navigate(currentUser ? userPage : 'login'); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted">
            {currentUser ? 'Dashboard' : 'Login'}
          </button>
        </div>
      )}
    </header>
  );
}
