import { Briefcase, Check } from 'lucide-react';
import { useState } from 'react';
import type { Page, UserRole } from '@/app/types';

interface RegisterPageProps {
  navigate: (page: Page) => void;
  onLogin: (role: UserRole) => void;
}

export function RegisterPage({ navigate, onLogin }: RegisterPageProps) {
  const [role, setRole] = useState<UserRole>('personal');

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white border border-border rounded-xl p-6 shadow-sm">
        <button onClick={() => navigate('main')} className="flex items-center gap-2 font-bold mb-6">
          <span className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">
            <Briefcase size={18} />
          </span>
          JobBridgeAI
        </button>
        <h1 className="text-2xl font-bold mb-2">회원가입</h1>
        <p className="text-sm text-muted-foreground mb-6">이 데모에서는 로컬 세션만 생성됩니다.</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(['personal', 'corporate'] as UserRole[]).map(item => (
            <button key={item} onClick={() => setRole(item)} className={`p-4 rounded-xl border text-left ${role === item ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <Check size={16} className={role === item ? 'text-primary' : 'text-muted-foreground'} />
              <p className="font-medium mt-2">{item === 'personal' ? '구직자' : '기업 회원'}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <input className="px-3 py-2 rounded-lg border border-border" placeholder="이름" />
          <input className="px-3 py-2 rounded-lg border border-border" placeholder="이메일" />
          <input className="px-3 py-2 rounded-lg border border-border sm:col-span-2" placeholder="희망 직무" />
        </div>
        <button onClick={() => { onLogin(role); navigate(role === 'corporate' ? 'corporate' : 'user-dashboard'); }} className="w-full py-3 rounded-lg bg-primary text-white font-medium">
          시작하기
        </button>
        <button onClick={() => navigate('login')} className="w-full mt-3 text-sm text-primary font-medium">이미 계정이 있으신가요?</button>
      </div>
    </div>
  );
}
