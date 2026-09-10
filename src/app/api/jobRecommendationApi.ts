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

const parseErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { detail?: string; message?: string };
    return body.detail || body.message || `추천 정보를 불러오지 못했습니다. (${response.status})`;
  } catch {
    return `추천 정보를 불러오지 못했습니다. (${response.status})`;
  }
};

const normalizeRecommendation = (value: unknown): JobRecommendationDto => {
  const recommendation = value as Record<string, unknown>;
  const nestedJob = recommendation.job && typeof recommendation.job === 'object'
    ? recommendation.job as Record<string, unknown>
    : {};
  const salaryMin = nestedJob.salaryMin as number | null | undefined;
  const salaryMax = nestedJob.salaryMax as number | null | undefined;
  const salary = salaryMin || salaryMax
    ? `${salaryMin ? `${salaryMin.toLocaleString()}만원` : '협의'} ~ ${salaryMax ? `${salaryMax.toLocaleString()}만원` : '협의'}`
    : '협의';

  return {
    ...(recommendation as unknown as JobRecommendationDto),
    jobId: (recommendation.jobId ?? nestedJob.id) as number | string,
    title: String(recommendation.title ?? nestedJob.title ?? ''),
    companyName: String(recommendation.companyName ?? nestedJob.companyName ?? ''),
    job: String(recommendation.jobCategory ?? nestedJob.jobCategory ?? ''),
    location: String(recommendation.location ?? nestedJob.location ?? ''),
    employmentType: String(recommendation.employmentType ?? nestedJob.employmentType ?? ''),
    salary: String(recommendation.salary ?? salary),
    totalScore: Number(recommendation.totalScore ?? 0),
    recommendReason: String(recommendation.recommendReason ?? recommendation.recommendationReason ?? ''),
    mismatchReason: String(recommendation.mismatchReason ?? ''),
    wheelchairAccessible: Boolean(recommendation.wheelchairAccessible ?? nestedJob.wheelchairAccessible),
    accessibleRestroom: Boolean(recommendation.accessibleRestroom ?? nestedJob.accessibleRestroom),
    disabledParking: Boolean(recommendation.disabledParking ?? nestedJob.disabledParking),
    remoteAvailable: Boolean(recommendation.remoteAvailable ?? nestedJob.remoteAvailable),
    flexibleWorkAvailable: Boolean(recommendation.flexibleWorkAvailable ?? nestedJob.flexibleWorkAvailable),
    assistiveDeviceSupport: Boolean(recommendation.assistiveDeviceSupport ?? nestedJob.assistiveDeviceSupport),
    accessibilitySupport: String(recommendation.accessibilitySupport ?? nestedJob.accessibilityInfo ?? ''),
  };
};

const normalizeRecommendationResponse = (body: unknown): JobRecommendationDto[] => {
  let recommendations: unknown[] = [];

  if (Array.isArray(body)) recommendations = body;
  else if (body && typeof body === 'object') {
    const payload = body as {
      recommendations?: unknown[];
      items?: unknown[];
      data?: unknown[] | { recommendations?: unknown[]; items?: unknown[] };
    };

    if (Array.isArray(payload.recommendations)) recommendations = payload.recommendations;
    else if (Array.isArray(payload.items)) recommendations = payload.items;
    else if (Array.isArray(payload.data)) recommendations = payload.data;
    else if (payload.data && typeof payload.data === 'object') {
      if (Array.isArray(payload.data.recommendations)) recommendations = payload.data.recommendations;
      else if (Array.isArray(payload.data.items)) recommendations = payload.data.items;
    }
  }

  return recommendations.map(normalizeRecommendation);
};

export async function getJobRecommendations(_memberId: number): Promise<JobRecommendationDto[]> {
  const response = await fetch('/api/recommendations', { credentials: 'include' });
  if (!response.ok) throw new Error(await parseErrorMessage(response));
  if (response.status === 204) return [];
  return normalizeRecommendationResponse(await response.json());
}
