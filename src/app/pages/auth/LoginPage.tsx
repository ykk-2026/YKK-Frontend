import { Briefcase, ClipboardList, Eye, EyeOff, ShieldCheck, Target } from 'lucide-react';
import { useState } from 'react';
import type { Page, RegisterFormData, UserRole } from '@/app/types';

interface LoginPageProps {
  navigate: (page: Page) => void;
  onLogin: (role: UserRole, formData?: RegisterFormData) => void;
  registeredUser: RegisterFormData | null;
}

export function LoginPage({ navigate, onLogin, registeredUser }: LoginPageProps) {
  const [showPw, setShowPw] = useState(false);
  const [loginId, setLoginId] = useState(registeredUser?.loginId ?? 'demo');
  const [password, setPassword] = useState(registeredUser ? '' : 'password');
  const [error, setError] = useState('');

  const submitLogin = () => {
    if (registeredUser) {
      if (loginId.trim() !== registeredUser.loginId.trim() || password !== registeredUser.password) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      onLogin('personal', registeredUser);
      navigate('user-dashboard');
      return;
    }

    if (loginId.trim() !== 'demo' || password !== 'password') {
      setError('데모 계정은 아이디 demo, 비밀번호 password로 로그인할 수 있습니다.');
      return;
    }

    onLogin('personal');
    navigate('user-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F7FF] flex items-stretch justify-center">
      <aside className="hidden lg:flex w-[360px] bg-gradient-to-b from-white to-[#EAF4FF] px-8 py-10 flex-col justify-between border-r border-[#DCEAF3]">
        <div>
          <button onClick={() => navigate('main')} className="flex items-center gap-2 font-bold text-foreground mb-12">
            <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Briefcase size={18} />
            </span>
            JobBridgeAI
          </button>

          <h1 className="text-3xl font-bold leading-tight text-foreground">
            다시 이어가는
            <br />
            <span className="text-primary">나에게 맞는 기회</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-6 mt-6">
            저장한 공고, 지원 현황, 맞춤 추천을 로그인 후 한곳에서 확인할 수 있습니다.
          </p>

          <div className="space-y-7 mt-12">
            {[
              { title: '맞춤 추천 유지', desc: '프로필 조건에 맞는 공고를 계속 추천합니다.', icon: Target },
              { title: '지원 현황 확인', desc: '제출한 지원서와 진행 상태를 확인할 수 있습니다.', icon: ClipboardList },
              { title: '안전한 계정 관리', desc: '개인정보와 저장 공고를 안전하게 관리합니다.', icon: ShieldCheck },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#DDEBFF] text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-28 rounded-t-[80px] bg-[#CFE8FF] opacity-70" />
      </aside>

      <main className="w-full max-w-3xl bg-white px-5 py-8 sm:px-8 lg:px-12 lg:py-10 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <button onClick={() => navigate('main')} className="lg:hidden flex items-center gap-2 font-bold text-foreground mb-8">
            <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Briefcase size={18} />
            </span>
            JobBridgeAI
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">로그인</h1>
            <p className="text-sm text-muted-foreground mt-2">아이디와 비밀번호를 입력해 주세요.</p>
          </div>

          <div className="mb-7">
            <h2 className="text-center text-xl font-bold text-foreground">개인회원 로그인</h2>
            <div className="mt-4 h-px bg-border" />
          </div>

          {registeredUser && (
            <div className="mb-5 rounded-lg bg-[#F0FBF8] px-4 py-3 text-sm text-[#176B87]">
              회원가입이 완료되었습니다. 가입한 아이디로 로그인해 주세요.
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium mb-2">아이디</span>
              <input
                value={loginId}
                onChange={event => {
                  setLoginId(event.target.value);
                  setError('');
                }}
                className="w-full px-3 py-3 rounded-lg border border-border"
                placeholder="아이디를 입력해 주세요."
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-2">비밀번호</span>
              <div className="relative">
                <input
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  type={showPw ? 'text' : 'password'}
                  className="w-full px-3 py-3 pr-10 rounded-lg border border-border"
                  placeholder="비밀번호를 입력해 주세요."
                />
                <button type="button" aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" />
              아이디 저장
            </label>
            <button className="text-muted-foreground hover:text-foreground">아이디/비밀번호 찾기</button>
          </div>

          <button onClick={submitLogin} className="mt-6 w-full py-3.5 rounded-lg bg-primary text-white font-medium shadow-sm hover:bg-primary/90">
            로그인
          </button>
          <button onClick={() => navigate('register')} className="w-full mt-4 text-sm text-muted-foreground">
            아직 계정이 없으신가요? <span className="font-semibold text-primary">회원가입</span>
          </button>
        </div>
      </main>
    </div>
  );
}
