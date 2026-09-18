import type { Job } from '@/app/types';
import { getJson, postForm } from './http';

export interface JobApplicationForm {
  applicantName: string;
  phone: string;
  email: string;
  employmentType: string;
  coverLetter?: string;
}

export interface JobApplicationRecord extends JobApplicationForm {
  id: number;
  jobId: number;
  companyName: string;
  jobTitle: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// 백엔드는 GET/POST + 폼 파라미터로 호출하고, 지원 결과는 MsgDTO { result, msg } 로 응답한다
export const getJobApplications = () =>
  getJson<JobApplicationRecord[]>('/api/job-applications/getApplicationList');

export const getCompanyJobApplications = () =>
  getJson<JobApplicationRecord[]>('/api/job-applications/getCompanyApplicationList');

export const saveJobApplication = (job: Job, form: JobApplicationForm) =>
  postForm('/api/job-applications/insertApplicationInfo', { jobId: job.id, ...form });
