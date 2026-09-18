import type { Job } from '@/app/types';
import { getJson, postForm } from './http';

export interface InterestJob {
  id: number;
  companyName: string;
  title: string;
  accessibilityInfo: string | null;
  wheelchairAccessible: boolean;
  accessibleRestroom: boolean;
  disabledParking: boolean;
  remoteAvailable: boolean;
  flexibleWorkAvailable: boolean;
  assistiveDeviceSupport: boolean;
}

const salaryRange = (salary: string) => {
  const values = salary.match(/\d[\d,]*/g)?.map(value => Number(value.replaceAll(',', ''))) || [];
  return { salaryMin: values[0] || null, salaryMax: values[1] || null };
};

const accessibilityLabels: Record<keyof Job['accessibility'], string> = {
  elevator: '엘리베이터',
  parking: '장애인 주차시설',
  wheelchair: '휠체어 접근',
  restroom: '장애인 화장실',
  guideDog: '안내견 동반',
  hearingLoop: '청각 보조장치',
};

const accessibilityText = (job: Job) => (Object.entries(job.accessibility) as [keyof Job['accessibility'], boolean][])
  .filter(([, enabled]) => enabled)
  .map(([name]) => accessibilityLabels[name])
  .join(', ');

// 백엔드는 GET/POST + 폼 파라미터로 호출하고, 등록/삭제 결과는 MsgDTO { result, msg } 로 응답한다
export const getInterestJobs = () => getJson<InterestJob[]>('/api/interest-jobs/getInterestJobList');

export const saveInterestJob = (job: Job) => postForm('/api/interest-jobs/insertInterestJobInfo', {
  jobId: job.id
});

export const deleteInterestJob = (job: Job) =>
  postForm('/api/interest-jobs/deleteInterestJobInfo', { jobId: job.id });
