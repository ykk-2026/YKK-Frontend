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

const recommendationUrls = (memberId: number) => [
  `/api/job-recommendations/${memberId}`,
  `/api/job-recommendations?memberId=${memberId}`,
  `/api/recommendations/jobs/${memberId}`,
  `/api/recommendations/jobs?memberId=${memberId}`,
];

const parseErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { detail?: string; message?: string };
    return body.detail || body.message || `추천 정보를 불러오지 못했습니다. (${response.status})`;
  } catch {
    return `추천 정보를 불러오지 못했습니다. (${response.status})`;
  }
};

const normalizeRecommendationResponse = (body: unknown): JobRecommendationDto[] => {
  if (Array.isArray(body)) return body as JobRecommendationDto[];

  if (body && typeof body === 'object') {
    const payload = body as {
      recommendations?: JobRecommendationDto[];
      items?: JobRecommendationDto[];
      data?: JobRecommendationDto[] | { recommendations?: JobRecommendationDto[]; items?: JobRecommendationDto[] };
    };

    if (Array.isArray(payload.recommendations)) return payload.recommendations;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.data && typeof payload.data === 'object') {
      if (Array.isArray(payload.data.recommendations)) return payload.data.recommendations;
      if (Array.isArray(payload.data.items)) return payload.data.items;
    }
  }

  return [];
};

export async function getJobRecommendations(memberId: number): Promise<JobRecommendationDto[]> {
  let lastError = '';

  for (const url of recommendationUrls(memberId)) {
    const response = await fetch(url);

    if (response.ok) {
      if (response.status === 204) return [];
      return normalizeRecommendationResponse(await response.json());
    }

    lastError = await parseErrorMessage(response);

    if (response.status !== 404 && response.status !== 405) {
      throw new Error(lastError);
    }
  }

  throw new Error(lastError || '추천 API를 찾을 수 없습니다.');
}
