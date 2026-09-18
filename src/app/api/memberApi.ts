import type { RegisterFormData } from '@/app/types';
import { getJson, postForm } from './http';

export interface LoginMember {
  id: number;
  loginId: string;
  name: string;
  role: string;
}

// 아이디 중복 체크 : 백엔드는 { existsYn: 'Y' | 'N' } 으로 응답
export async function checkLoginIdAvailability(loginId: string) {
  const json = await getJson<{ existsYn?: string }>('/api/members/getLoginIdExists', { loginId });
  const available = json.existsYn !== 'Y';
  return {
    available,
    message: available ? '사용 가능한 아이디입니다.' : '사용할 수 없거나 이미 사용 중인 아이디입니다.',
  };
}

// 로그인 : 결과는 MsgDTO 이므로 성공 후 세션에 저장된 회원정보를 다시 조회한다
export async function loginMember(loginId: string, password: string) {
  await postForm('/api/members/login', { loginId: loginId.trim(), password });
  const member = await getCurrentMember();
  if (!member) throw new Error('로그인 정보를 불러오지 못했습니다.');
  return member;
}

// 로그인된 회원정보 : 로그인 안 했으면 빈 객체 {} 가 오므로 null 로 바꾼다
export async function getCurrentMember() {
  const json = await getJson<Partial<LoginMember>>('/api/members/getLoginInfo');
  return json.loginId ? (json as LoginMember) : null;
}

export async function logoutMember() {
  await fetch('/api/members/logout', { method: 'POST' });
}

export async function registerMember(form: RegisterFormData, passwordConfirm: string) {
  const loginId = form.loginId.trim().toLowerCase();
  const name = form.name.trim();
  const json = await postForm('/api/members/insertMemberInfo', {
    loginId,
    password: form.password,
    passwordConfirm,
    name,
    birthDate: form.birthDate.trim(),
    gender: form.gender || 'OTHER',
    email: form.email.trim(),
    phone: form.phone,
    role: 'JOB_SEEKER',
    desiredJob: form.preferredRole.trim(),
  });
  return { loginId, name, message: json.msg ?? '회원가입이 완료되었습니다.' };
}
