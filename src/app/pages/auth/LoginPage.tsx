import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { Page, UserRole } from '@/app/types';

interface LoginPageProps {
  navigate: (page: Page) => void;
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ navigate, onLogin }: LoginPageProps) {
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>('personal');

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-border rounded-xl p-6 shadow-sm">
        <button onClick={() => navigate('main')} className="flex items-center gap-2 font-bold mb-6">
          <span className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">
            <Briefcase size={18} />
          </span>
          JobBridgeAI
        </button>
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-muted-foreground mb-6">Choose a demo role and continue.</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {(['personal', 'corporate', 'admin'] as UserRole[]).map(item => (
            <button key={item} onClick={() => setRole(item)} className={`py-2 rounded-lg text-sm font-medium border ${role === item ? 'bg-primary text-white border-primary' : 'border-border'}`}>
              {item}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">Email</label>
        <input className="w-full px-3 py-2 rounded-lg border border-border mb-4" defaultValue="demo@example.com" />
        <label className="block text-sm font-medium mb-2">Password</label>
        <div className="relative mb-6">
          <input type={showPw ? 'text' : 'password'} className="w-full px-3 py-2 pr-10 rounded-lg border border-border" defaultValue="password" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPw(!showPw)}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button onClick={() => { onLogin(role); navigate(role === 'admin' ? 'admin' : role === 'corporate' ? 'corporate' : 'user-dashboard'); }} className="w-full py-3 rounded-lg bg-primary text-white font-medium">
          Login
        </button>
        <button onClick={() => navigate('register')} className="w-full mt-3 text-sm text-primary font-medium">Create account</button>
      </div>
    </div>
  );
}
