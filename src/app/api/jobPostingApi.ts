import type { Job } from '@/app/types';

export interface JobPostingForm {
  companyName: string;
  title: string;
  jobCategory: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string;
  educationLevel: string;
  description: string;
  requirements: string;
  preferredQualifications: string;
  accessibilityInfo: string;
  wheelchairAccessible: boolean;
  accessibleRestroom: boolean;
  disabledParking: boolean;
  remoteAvailable: boolean;
  flexibleWorkAvailable: boolean;
  assistiveDeviceSupport: boolean;
  deadline: string;
}

export interface JobPosting extends JobPostingForm {
  id: number;
  companyMemberId: number;
  status: 'OPEN' | 'CLOSED' | 'DELETED';
  createdAt?: string;
  updatedAt?: string;
}

const responseError = async (response: Response) => {
  try {
    const body = await response.json() as { detail?: string; message?: string; error?: string };
    return body.detail || body.message || body.error || `요청 실패 (${response.status})`;
  } catch {
    return `요청 실패 (${response.status})`;
  }
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(await responseError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const getOpenJobPostings = () => request<JobPosting[]>('/api/jobs?limit=100');

export const getMyJobPostings = () => request<JobPosting[]>('/api/jobs/my');

export const createJobPosting = (form: JobPostingForm) => request<JobPosting>('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});

export const updateJobPosting = (jobId: number, form: JobPostingForm) => request<JobPosting>(`/api/jobs/${jobId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});

export const closeJobPosting = (jobId: number) => request<void>(`/api/jobs/${jobId}/close`, {
  method: 'PATCH',
});

export const deleteJobPosting = (jobId: number) => request<void>(`/api/jobs/${jobId}`, {
  method: 'DELETE',
});

const splitText = (value?: string | null) => value
  ? value.split(/[,\n]/).map(item => item.trim()).filter(Boolean)
  : [];

const salaryText = (min: number | null, max: number | null) => {
  if (min != null && max != null) return `연봉 ${min.toLocaleString()}~${max.toLocaleString()}만원`;
  if (min != null) return `연봉 ${min.toLocaleString()}만원 이상`;
  if (max != null) return `연봉 ${max.toLocaleString()}만원 이하`;
  return '급여 협의';
};

export const toJob = (posting: JobPosting): Job => ({
  id: String(posting.id),
  company: posting.companyName,
  companyInitials: posting.companyName.slice(0, 2),
  companyColor: '#2563EB',
  title: posting.title,
  location: posting.location,
  salary: salaryText(posting.salaryMin, posting.salaryMax),
  workType: posting.employmentType,
  isRemote: posting.remoteAvailable,
  category: posting.jobCategory,
  requirements: splitText(posting.requirements),
  deadline: posting.deadline || '상시채용',
  posted: posting.createdAt?.slice(0, 10) || '',
  aiScore: 0,
  aiReasons: [],
  description: posting.description || '상세 업무 내용은 기업 담당자에게 문의해 주세요.',
  benefits: splitText(posting.preferredQualifications),
  companyDesc: `${posting.companyName}에서 등록한 채용공고입니다.`,
  headcount: 1,
  accessibility: {
    elevator: false,
    parking: posting.disabledParking,
    wheelchair: posting.wheelchairAccessible,
    restroom: posting.accessibleRestroom,
    guideDog: false,
    hearingLoop: posting.assistiveDeviceSupport,
  },
  scores: { skill: 0, workCondition: 0, accessibility: 0, location: 0 },
});
