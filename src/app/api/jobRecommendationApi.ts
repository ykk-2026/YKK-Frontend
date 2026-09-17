export interface JobRecommendationDto {
  jobId: number | string;
  title: string;
  companyName: string;
  job?: string | null;
  jobCategory?: string | null;
  duty?: string | null;
  location: string;
  employmentType: string;
  salary: string;
  totalScore: number;
  jobScore?: number;
  regionScore?: number;
  employmentTypeScore?: number;
  careerScore?: number;
  salaryScore?: number;
  workStyleScore?: number;
  accessibilityScore?: number;
  recommendReason?: string | null;
  reason?: string | null;
  mismatchReason?: string | null;
  wheelchairAccessible?: boolean;
  wheelchairAccess?: boolean;
  disabledRestroom?: boolean;
  accessibleRestroom?: boolean;
  disabledParking?: boolean;
  remoteWorkAvailable?: boolean;
  remoteAvailable?: boolean;
  flexibleWorkAvailable?: boolean;
  flexibleAvailable?: boolean;
  assistiveTechnologySupport?: boolean;
  assistiveDeviceSupport?: boolean;
  accessibilitySupport?: string | null;
}

interface ApiRecommendation extends Omit<JobRecommendationDto, 'job'> {
  recommendationReason?: string | null;
  job?: {
    title: string;
    companyName: string;
    jobCategory: string;
    location: string;
    employmentType: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    wheelchairAccessible?: boolean;
    accessibleRestroom?: boolean;
    disabledParking?: boolean;
    remoteAvailable?: boolean;
    flexibleWorkAvailable?: boolean;
    assistiveDeviceSupport?: boolean;
    accessibilityInfo?: string | null;
  } | null;
}

const recommendationUrls = (_memberId: number) => ['/api/recommendations'];

export class JobRecommendationApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'JobRecommendationApiError';
  }
}

const parseErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { detail?: string; message?: string };
    return body.detail || body.message || `추천 정보를 불러오지 못했습니다. (${response.status})`;
  } catch {
    return `추천 정보를 불러오지 못했습니다. (${response.status})`;
  }
};

const salaryText = (min?: number | null, max?: number | null) => {
  if (min != null && max != null) return `연봉 ${min.toLocaleString()}~${max.toLocaleString()}만원`;
  if (min != null) return `연봉 ${min.toLocaleString()}만원 이상`;
  if (max != null) return `연봉 ${max.toLocaleString()}만원 이하`;
  return '급여 협의';
};

const flattenRecommendation = (item: ApiRecommendation): JobRecommendationDto => {
  if (!item.job || typeof item.job !== 'object') return item as JobRecommendationDto;
  const job = item.job;
  return {
    ...item,
    title: job.title,
    companyName: job.companyName,
    job: job.jobCategory,
    jobCategory: job.jobCategory,
    location: job.location,
    employmentType: job.employmentType,
    salary: salaryText(job.salaryMin, job.salaryMax),
    recommendReason: item.recommendReason || item.recommendationReason,
    wheelchairAccessible: job.wheelchairAccessible,
    accessibleRestroom: job.accessibleRestroom,
    disabledParking: job.disabledParking,
    remoteAvailable: job.remoteAvailable,
    flexibleWorkAvailable: job.flexibleWorkAvailable,
    assistiveDeviceSupport: job.assistiveDeviceSupport,
    accessibilitySupport: job.accessibilityInfo,
  };
};

const normalizeRecommendationResponse = (body: unknown): JobRecommendationDto[] => {
  if (Array.isArray(body)) return (body as ApiRecommendation[]).map(flattenRecommendation);

  if (body && typeof body === 'object') {
    const payload = body as {
      recommendations?: JobRecommendationDto[];
      items?: JobRecommendationDto[];
      data?: JobRecommendationDto[] | { recommendations?: JobRecommendationDto[]; items?: JobRecommendationDto[] };
    };

    if (Array.isArray(payload.recommendations)) return (payload.recommendations as ApiRecommendation[]).map(flattenRecommendation);
    if (Array.isArray(payload.items)) return (payload.items as ApiRecommendation[]).map(flattenRecommendation);
    if (Array.isArray(payload.data)) return (payload.data as ApiRecommendation[]).map(flattenRecommendation);
    if (payload.data && typeof payload.data === 'object') {
      if (Array.isArray(payload.data.recommendations)) return (payload.data.recommendations as ApiRecommendation[]).map(flattenRecommendation);
      if (Array.isArray(payload.data.items)) return (payload.data.items as ApiRecommendation[]).map(flattenRecommendation);
    }
  }

  return [];
};

export async function getJobRecommendations(memberId: number): Promise<JobRecommendationDto[]> {
  let lastError = '';

  for (const url of recommendationUrls(memberId)) {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });

    if (response.ok) {
      if (response.status === 204) return [];
      return normalizeRecommendationResponse(await response.json());
    }

    lastError = await parseErrorMessage(response);

    if (response.status !== 404 && response.status !== 405) {
      throw new JobRecommendationApiError(lastError, response.status);
    }
  }

  throw new JobRecommendationApiError(lastError || '추천 API를 찾을 수 없습니다.', 404);
}
