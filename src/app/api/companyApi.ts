import type { CorporateRegisterFormData } from '@/app/types';
import { getJson, postForm } from './http';

export interface CompanyLoginResult {
  member: { id: number; loginId: string; name: string; role: string };
  profile: {
    companyName: string; businessNumber?: string; representativeName?: string;
    industry?: string; companyAddress?: string; companyDetailAddress?: string;
    companyPhone?: string; websiteUrl?: string; companyDescription?: string;
    employeeCount?: number; establishedDate?: string; verificationStatus?: string;
  };
}

// 백엔드 CompanyProfileDTO : 기업정보 + MEMBER 테이블 JOIN 값(memberId, loginId, name, role)이 한 객체로 온다
interface CompanyProfileDTO extends CompanyLoginResult['profile'] {
  memberId?: number;
  loginId?: string;
  name?: string;
  role?: string;
}

export async function registerCompany(form: CorporateRegisterFormData, passwordConfirm: string) {
  return postForm('/api/companies/insertCompanyInfo', {
    ...form, passwordConfirm,
    name: form.memberName?.trim() || form.managerName.trim(),
    employeeCount: form.employeeCount ? Number(form.employeeCount) : '',
    establishedDate: form.establishedDate || '',
  });
}

// 로그인된 기업정보 : 기업회원으로 로그인 안 했으면 null
export async function getCurrentCompany(): Promise<CompanyLoginResult | null> {
  const c = await getJson<CompanyProfileDTO>('/api/companies/getCompanyInfo');
  if (!c.loginId) return null;
  return {
    member: { id: c.memberId as number, loginId: c.loginId, name: c.name ?? '', role: c.role ?? 'COMPANY' },
    profile: c,
  };
}

// 기업 로그인 : 결과는 MsgDTO 이므로 성공 후 기업정보를 다시 조회한다
export async function loginCompany(loginId: string, password: string) {
  await postForm('/api/companies/login', { loginId: loginId.trim(), password });
  const result = await getCurrentCompany();
  if (!result) throw new Error('기업 로그인 정보를 불러오지 못했습니다.');
  return result;
}
