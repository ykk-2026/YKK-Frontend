import type { Job } from '@/app/types';
import { getJson, postForm } from './http';

export enum WorkType {
  ANY = 'ANY',
  OFFICE = 'OFFICE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export interface JobPostingForm {
  companyName: string;
  title: string;
  jobCategory: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  workType: WorkType;
  experienceLevel: string;
  requiredCareerYears: number | null;
  educationLevel: string;
  description: string;
  requirements: string;
  preferredQualifications: string;
  accessibilityInfo: string;
  wheelchairAccessible: boolean;
  accessibleRestroom: boolean;
  disabledParking: boolean;
  restAreaAvailable: boolean;
  elevatorAvailable: boolean;
  assistiveDeviceSupport: boolean;
  deadline: string;
}

export interface JobPosting extends Omit<JobPostingForm, 'workType'> {
  id: number;
  companyMemberId: number | null;
  workType: WorkType | null;
  salaryAmount?: number | null;
  salaryType?: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'NEGOTIABLE' | string | null;
  source?: 'LOCAL' | 'KEAD' | string;
  externalJobId?: string | null;
  contactNumber?: string | null;
  managingAgency?: string | null;
  externalRegisteredDate?: string | null;
  status: 'OPEN' | 'CLOSED' | 'DELETED';
  createdAt?: string;
  updatedAt?: string;
}

// 백엔드는 GET/POST + 폼 파라미터로 호출하고, 등록/수정/삭제는 MsgDTO { result, msg } 로 응답한다
export const getOpenJobPostings = () => getJson<JobPosting[]>('/api/jobs/getJobList');

export interface KeadJobSyncResult {
  fetchedCount: number;
  savedCount: number;
  pageCount: number;
  message: string;
}

export async function syncKeadJobPostings(): Promise<KeadJobSyncResult> {
  const response = await fetch('/api/jobs/syncKeadJobs', { method: 'POST' });
  if (!response.ok) throw new Error(`KEAD 채용공고 동기화 실패 (${response.status})`);
  return response.json() as Promise<KeadJobSyncResult>;
}

export const getMyJobPostings = () => getJson<JobPosting[]>('/api/jobs/getMyJobList');

export const getJobPosting = (jobId: number | string) => getJson<JobPosting>('/api/jobs/getJobInfo', { jobId });

export const createJobPosting = (form: JobPostingForm) => postForm('/api/jobs/insertJobInfo', form);

export const updateJobPosting = (jobId: number, form: JobPostingForm) =>
  postForm('/api/jobs/updateJobInfo', { ...form, jobId });

export const closeJobPosting = (jobId: number) => postForm('/api/jobs/updateJobClose', { jobId });

export const deleteJobPosting = (jobId: number) => postForm('/api/jobs/deleteJobInfo', { jobId });

const splitText = (value?: string | null) => value
  ? value.split(/[,\n]/).map(item => item.trim()).filter(Boolean)
  : [];

const salaryText = (posting: JobPosting) => {
  if (posting.salaryAmount != null) {
    const label = {
      HOURLY: '시급',
      DAILY: '일급',
      WEEKLY: '주급',
      MONTHLY: '월급',
      ANNUAL: '연봉',
    }[posting.salaryType || ''];
    if (label) return `${label} ${posting.salaryAmount.toLocaleString()}원`;
  }
  if (posting.salaryMin != null) return `연봉 ${posting.salaryMin.toLocaleString()}만원 이상`;
  return '급여 협의';
};

export const toJob = (posting: JobPosting): Job => ({
  id: String(posting.id),
  source: posting.source || 'LOCAL',
  company: posting.companyName,
  companyInitials: posting.companyName.slice(0, 2),
  companyColor: '#2563EB',
  title: posting.title,
  location: posting.location,
  salary: salaryText(posting),
  workType: posting.employmentType,
  workMode: posting.workType || '미확인',
  isRemote: posting.workType === 'REMOTE' || posting.workType === 'HYBRID',
  category: posting.jobCategory,
  experienceLevel: posting.experienceLevel,
  requiredCareerYears: posting.requiredCareerYears,
  educationLevel: posting.educationLevel,
  accessibilityInfo: posting.accessibilityInfo,
  requirements: splitText(posting.requirements),
  deadline: posting.deadline || '상시채용',
  posted: posting.externalRegisteredDate || posting.createdAt?.slice(0, 10) || '',
  aiScore: 0,
  aiReasons: [],
  description: posting.description || '상세 업무 내용은 기업 담당자에게 문의해 주세요.',
  benefits: splitText(posting.preferredQualifications),
  companyDesc: posting.source === 'KEAD'
    ? `${posting.managingAgency || '한국장애인고용공단'}에서 제공한 채용공고입니다.${posting.contactNumber ? ` 문의: ${posting.contactNumber}` : ''}`
    : `${posting.companyName}에서 등록한 채용공고입니다.`,
  accessibility: {
    elevator: posting.elevatorAvailable,
    restArea: posting.restAreaAvailable,
    parking: posting.disabledParking,
    wheelchair: posting.wheelchairAccessible,
    restroom: posting.accessibleRestroom,
    guideDog: false,
    hearingLoop: posting.assistiveDeviceSupport,
  },
  scores: { skill: 0, workCondition: 0, accessibility: 0, location: 0 },
});
