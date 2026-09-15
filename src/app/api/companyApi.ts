import type { CorporateRegisterFormData } from '@/app/types';

export interface CompanyLoginResult {
  member: { id: number; loginId: string; name: string; role: string };
  profile: {
    companyName: string; businessNumber?: string; representativeName?: string;
    industry?: string; companyAddress?: string; companyDetailAddress?: string;
    companyPhone?: string; websiteUrl?: string; companyDescription?: string;
    employeeCount?: number; establishedDate?: string; verificationStatus?: string;
  };
}

const responseError = async (response: Response) => {
  try {
    const body = await response.json() as { detail?: string; message?: string; error?: string };
    return body.detail || body.message || body.error || `요청 실패 (${response.status})`;
  } catch { return `요청 실패 (${response.status})`; }
};

export async function registerCompany(form: CorporateRegisterFormData, passwordConfirm: string) {
  const response = await fetch('/api/companies', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form, passwordConfirm,
      name: form.memberName?.trim() || form.managerName.trim(),
      employeeCount: form.employeeCount ? Number(form.employeeCount) : null,
      establishedDate: form.establishedDate || null,
    }),
  });
  if (!response.ok) throw new Error(await responseError(response));
  return response.json();
}

export async function loginCompany(loginId: string, password: string) {
  const response = await fetch('/api/companies/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: loginId.trim(), password }),
  });
  if (!response.ok) throw new Error(await responseError(response));
  return response.json() as Promise<CompanyLoginResult>;
}
