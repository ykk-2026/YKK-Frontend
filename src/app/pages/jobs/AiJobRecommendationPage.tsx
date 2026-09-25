import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { JobRecommendationApiError, getJobRecommendations, type JobRecommendationDto } from '@/app/api/jobRecommendationApi';
import { loadJobSeekerProfile, type SavedJobSeekerProfile } from '@/app/profileStorage';
import type { CurrentUser, Page } from '@/app/types';

interface AiJobRecommendationPageProps {
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  onSessionExpired: () => void;
}

type IconType = ComponentType<{ size?: number; className?: string }>;

const accessibilityBadges: Array<{
  key: keyof JobRecommendationDto;
  aliases?: Array<keyof JobRecommendationDto>;
  label: string;
}> = [
  { key: 'wheelchairAccessible', aliases: ['wheelchairAccess'], label: '휠체어 접근 가능' },
  { key: 'disabledRestroom', aliases: ['accessibleRestroom'], label: '장애인 화장실' },
  { key: 'disabledParking', label: '장애인 주차' },
  { key: 'restAreaAvailable', label: '장애인 휴게공간' },
  { key: 'elevatorAvailable', label: '엘리베이터 이용 가능' },
  { key: 'assistiveTechnologySupport', aliases: ['assistiveDeviceSupport'], label: '보조공학기기 지원' },
];

const getProfileUserId = (currentUser: CurrentUser | null) => currentUser?.loginId || currentUser?.id || 'guest';

const resolveMemberId = (currentUser: CurrentUser | null) => {
  const parsedId = Number(currentUser?.id);
  return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : null;
};

const scoreToPercent = (score: number) => {
  const normalizedScore = score <= 1 ? score * 100 : score;
  return Math.min(100, Math.max(0, Math.round(normalizedScore)));
};

const textOrDash = (value: unknown) => {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text || '-';
};

const normalizeEmploymentType = (value?: string) => {
  switch (value) {
    case 'ANY':
      return '무관';
    case 'FULL_TIME':
      return '정규직';
    case 'REGULAR_EMPLOYEE':
      return '상용직';
    case 'CONTRACT':
      return '계약직';
    case 'PERMANENT_CONTRACT':
      return '무기계약직';
    case 'CONVERSION_TYPE':
      return '정규직 전환형';
    case 'PART_TIME':
      return '시간제·파트타임';
    case 'INTERN':
    case 'INTERNSHIP':
      return '인턴';
    case 'DISPATCH':
      return '파견직';
    case 'FREELANCE':
      return '프리랜서';
    default:
      return '';
  }
};

const getJobRole = (recommendation: JobRecommendationDto) =>
  textOrDash(recommendation.job || recommendation.jobCategory || recommendation.duty);

const getReason = (recommendation: JobRecommendationDto) =>
  textOrDash(recommendation.recommendReason || recommendation.reason);

const getReasonTitle = (totalScore: number) => {
  if (totalScore >= 70) return '추천 이유';
  if (totalScore >= 50) return '조건 비교 결과';
  return '주요 미일치 조건';
};

const getDetailJobId = (jobId: number | string) => `job-${String(jobId).replace(/^job-/, '')}`;

const getProfileChips = (profile: Partial<SavedJobSeekerProfile> | null) => {
  if (!profile) return [];

  return [
    profile.desiredJob ? `희망직무 ${profile.desiredJob}` : '',
    profile.residenceRegion ? `현재 거주지 ${profile.residenceRegion}` : '',
    normalizeEmploymentType(profile.employmentType) ? `고용형태 ${normalizeEmploymentType(profile.employmentType)}` : '',
    profile.minSalary ? `희망연봉 ${profile.minSalary}만원 이상` : '',
    profile.wheelchairRequired ? '휠체어 접근 필요' : '',
    profile.accessibleRestroomRequired ? '장애인 화장실 필요' : '',
    profile.disabledParkingRequired ? '장애인 주차 필요' : '',
    profile.assistiveDeviceRequired ? '보조공학기기 필요' : '',
    profile.restAreaRequired ? '장애인 휴게공간 필요' : '',
    profile.elevatorRequired ? '엘리베이터 이용 필요' : '',
  ].filter(Boolean);
};

export function AiJobRecommendationPage({ currentUser, navigate, onSessionExpired }: AiJobRecommendationPageProps) {
  const memberId = useMemo(() => resolveMemberId(currentUser), [currentUser]);
  const profileUserId = useMemo(() => getProfileUserId(currentUser), [currentUser]);
  const [refreshKey, setRefreshKey] = useState(0);
  const savedProfile = useMemo(() => loadJobSeekerProfile(profileUserId), [profileUserId, refreshKey]);
  // The backend profile is the source of truth. A user can have a complete
  // profile in the database even when this browser has no localStorage copy.
  const profileReady = currentUser?.role === 'personal' && memberId !== null;
  const profileChips = useMemo(() => getProfileChips(savedProfile), [savedProfile]);
  const [recommendations, setRecommendations] = useState<JobRecommendationDto[]>([]);
  const [loading, setLoading] = useState(Boolean(profileReady));
  const [error, setError] = useState('');
  const [calculationKey, setCalculationKey] = useState(0);
  const [lastCalculatedAt, setLastCalculatedAt] = useState('');

  useEffect(() => {
    const refresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener('jobBridgeProfileSaved', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('jobBridgeProfileSaved', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useEffect(() => {
    if (!profileReady) {
      setRecommendations([]);
      setLoading(false);
      setError('');
      return;
    }

    let mounted = true;
    setLoading(true);
    setError('');

    if (!memberId) {
      setRecommendations([]);
      setError('로그인 후 AI 추천을 이용해 주세요.');
      setLoading(false);
      return;
    }

    getJobRecommendations(memberId)
      .then(items => {
        if (!mounted) return;
        setRecommendations(items);
        setLastCalculatedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      })
      .catch(errorValue => {
        if (!mounted) return;
        if (errorValue instanceof JobRecommendationApiError && errorValue.status === 401) {
          onSessionExpired();
          return;
        }
        const message = errorValue instanceof Error ? errorValue.message : '추천 정보를 불러오지 못했습니다.';
        setRecommendations([]);
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [calculationKey, memberId, onSessionExpired, profileReady, savedProfile]);

  const topRecommendation = recommendations[0];
  const averageScore = recommendations.length
    ? Math.round(recommendations.reduce((sum, item) => sum + scoreToPercent(item.totalScore), 0) / recommendations.length)
    : 0;
  const recalculateRecommendations = () => {
    setError('');
    setRefreshKey(prev => prev + 1);
    setCalculationKey(prev => prev + 1);
  };
  const goToProfile = () => {
    navigate(currentUser ? 'user-dashboard' : 'login');
  };

  return (
    <div className="min-h-screen bg-[#F3F8FF] text-[#101828]">
      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8">
        <section className="overflow-hidden rounded-xl border border-[#DDEBFF] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-extrabold text-[#0D6BEA]">
                <Sparkles size={14} />
                AI 추천
              </p>
              <h1 className="mt-4 text-3xl font-black leading-tight text-[#081B45] sm:text-4xl">AI 맞춤 일자리 추천</h1>
              <p className="mt-3 max-w-[620px] text-sm font-bold leading-6 text-[#596273]">
                프로필의 희망조건과 근무환경을 분석해
                <br />
                나에게 잘 맞는 채용공고를 추천해드려요.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={recalculateRecommendations}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0D6BEA] px-4 text-sm font-extrabold text-white hover:bg-[#0959C7] disabled:cursor-not-allowed disabled:bg-[#9CC4F8]"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  {loading ? '계산 중' : '추천 다시 계산'}
                </button>
                <button
                  type="button"
                  onClick={goToProfile}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#C8D7EA] bg-white px-4 text-sm font-extrabold text-[#344054] hover:bg-[#F7FAFE]"
                >
                  <UserRound size={16} />
                  {currentUser ? '프로필 수정' : '로그인하기'}
                </button>
              </div>
              {lastCalculatedAt && (
                <p className="mt-3 text-xs font-bold text-[#667085]">
                  최근 계산: {lastCalculatedAt}
                </p>
              )}
              {error && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-[#D92D20]" role="alert">
                  <CircleAlert size={16} />
                  {error}
                </p>
              )}
            </div>

            <aside className="border-t border-[#E7EEF8] bg-[#F7FAFE] p-6 lg:border-l lg:border-t-0">
              <p className="text-xs font-black text-[#667085]">내 추천 기준</p>
              {profileChips.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileChips.slice(0, 8).map(chip => (
                    <span key={chip} className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#0D6BEA] shadow-sm">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm font-bold leading-6 text-[#667085]">프로필을 저장하면 희망조건이 여기에 표시됩니다.</p>
              )}
            </aside>
          </div>
        </section>

        {profileReady && recommendations.length > 0 && (
          <section className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryCard icon={Gauge} label="평균 적합도" value={`${averageScore}%`} />
            <SummaryCard icon={BriefcaseBusiness} label="추천 공고" value={`${recommendations.length}건`} />
            <SummaryCard icon={ShieldCheck} label="최고 추천" value={`${scoreToPercent(topRecommendation.totalScore)}%`} />
          </section>
        )}

        <section className="mt-5">
          {loading && (
            <div className="flex min-h-[260px] items-center justify-center rounded-xl bg-white shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-extrabold text-[#596273]">
                <Loader2 size={18} className="animate-spin text-[#0D6BEA]" />
                추천 공고를 분석하고 있습니다.
              </p>
            </div>
          )}

          {!loading && !profileReady && (
            <div className="rounded-xl border border-dashed border-[#B9D6FF] bg-white px-5 py-12 text-center shadow-sm">
              <p className="text-base font-black text-[#081B45]">맞춤 추천을 받으려면 먼저 프로필을 작성해주세요.</p>
              <button
                type="button"
                onClick={goToProfile}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0D6BEA] px-5 text-sm font-extrabold text-white hover:bg-[#0959C7]"
              >
                {currentUser ? '프로필 작성하기' : '로그인하고 프로필 작성하기'} <ArrowRight size={17} />
              </button>
            </div>
          )}

          {!loading && profileReady && error && (
            <div className="rounded-xl border border-[#FED7D7] bg-white px-5 py-8 text-center shadow-sm">
              <p className="inline-flex items-center justify-center gap-2 text-sm font-extrabold text-[#D92D20]">
                <CircleAlert size={18} />
                {error}
              </p>
            </div>
          )}

          {!loading && profileReady && !error && recommendations.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#CAD7E6] bg-white px-5 py-12 text-center shadow-sm">
              <p className="text-base font-black text-[#081B45]">현재 추천할 수 있는 채용공고가 없습니다.</p>
            </div>
          )}

          {!loading && profileReady && !error && recommendations.length > 0 && (
            <div className="grid gap-4">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard key={`${recommendation.jobId}`} recommendation={recommendation} rank={index + 1} navigate={navigate} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E3EAF3] bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-black text-[#667085]">
        <Icon size={16} className="text-[#0D6BEA]" />
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#081B45]">{value}</p>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  rank,
  navigate,
}: {
  recommendation: JobRecommendationDto;
  rank: number;
  navigate: (page: Page, jobId?: string) => void;
}) {
  const percent = scoreToPercent(recommendation.totalScore);
  const activeBadges = accessibilityBadges.filter(item => {
    if (recommendation[item.key]) return true;
    return item.aliases?.some(alias => Boolean(recommendation[alias]));
  });
  const scoreDetails = [
    { label: '직무·기술', score: Math.min(30, Math.max(0, recommendation.jobScore ?? 0)), maximum: 30 },
    { label: '지역', score: Math.min(15, Math.max(0, recommendation.regionScore ?? 0)), maximum: 15 },
    { label: '고용형태', score: Math.min(10, Math.max(0, recommendation.employmentTypeScore ?? 0)), maximum: 10 },
    { label: '경력', score: Math.min(10, Math.max(0, recommendation.careerScore ?? 0)), maximum: 10 },
    { label: '급여', score: Math.min(10, Math.max(0, recommendation.salaryScore ?? 0)), maximum: 10 },
    { label: '학력조건', score: Math.min(10, Math.max(0, recommendation.educationScore ?? 0)), maximum: 10 },
    { label: '접근성', score: Math.min(10, Math.max(0, recommendation.accessibilityScore ?? 0)), maximum: 10 },
  ];

  return (
    <article className="overflow-hidden rounded-xl border border-[#E3EAF3] bg-white shadow-sm transition hover:border-[#B9D6FF] hover:shadow-md">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF] text-sm font-black text-[#0D6BEA]">
              #{rank}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#667085]">
                <Building2 size={16} />
                {textOrDash(recommendation.companyName)}
              </p>
              <h2 className="mt-2 text-xl font-black leading-snug text-[#081B45]">{textOrDash(recommendation.title)}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-[#596273]">
                <MetaPill icon={BriefcaseBusiness} text={getJobRole(recommendation)} tone="blue" />
                <MetaPill icon={MapPin} text={textOrDash(recommendation.location)} />
                <span className="rounded-full bg-[#F1F3F6] px-3 py-1">{normalizeEmploymentType(recommendation.employmentType) || '-'}</span>
                <MetaPill icon={WalletCards} text={textOrDash(recommendation.salary)} tone="amber" />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <InfoBlock title={getReasonTitle(recommendation.totalScore)} value={getReason(recommendation)} />
          </div>

          <div className="mt-4 rounded-lg border border-[#E3EAF3] p-4">
            <p className="text-xs font-black text-[#667085]">항목별 적합도 점수</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {scoreDetails.map(item => (
                <div key={item.label} className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-[#596273]">{item.label}</span>
                    <span className="text-[#0D6BEA]">{item.score ?? 0}/{item.maximum}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DCEAF3]">
                    <div className="h-full rounded-full bg-[#0D6BEA]" style={{ width: `${Math.min(100, ((item.score ?? 0) / item.maximum) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4">
            <p className="text-xs font-black text-[#667085]">접근성/편의지원</p>
            {activeBadges.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeBadges.map(item => (
                  <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF8F8] px-3 py-1.5 text-xs font-extrabold text-[#217A83]">
                    <CheckCircle2 size={14} />
                    {item.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm font-bold text-[#7A8495]">{textOrDash(recommendation.accessibilitySupport)}</p>
            )}
          </div>
        </div>

        <aside className="flex flex-col justify-between border-t border-[#E7EEF8] bg-[#F7FAFE] p-5 lg:border-l lg:border-t-0">
          <div>
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs font-black text-[#667085]">AI 적합도</p>
              <p className="text-3xl font-black text-[#0D6BEA]">{percent}%</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#DCEAF3]">
              <div className="h-full rounded-full bg-[#0D6BEA]" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-extrabold text-[#596273]">
              <span className="rounded-lg bg-white px-3 py-2 shadow-sm">프로필 반영</span>
              <span className="rounded-lg bg-white px-3 py-2 shadow-sm">조건 분석</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('job-detail', getDetailJobId(recommendation.jobId))}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0D6BEA] px-5 text-sm font-extrabold text-white hover:bg-[#0959C7]"
          >
            공고 상세보기 <ArrowRight size={17} />
          </button>
        </aside>
      </div>
    </article>
  );
}

function MetaPill({
  icon: Icon,
  text,
  tone = 'gray',
}: {
  icon: IconType;
  text: string;
  tone?: 'blue' | 'amber' | 'gray';
}) {
  const className = tone === 'blue'
    ? 'bg-[#EEF5FF] text-[#0D6BEA]'
    : tone === 'amber'
      ? 'bg-[#FFF7E8] text-[#B45309]'
      : 'bg-[#F1F3F6] text-[#596273]';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${className}`}>
      <Icon size={14} />
      {text}
    </span>
  );
}

function InfoBlock({ title, value, warning = false }: { title: string; value: string; warning?: boolean }) {
  return (
    <div className={`rounded-lg px-4 py-3 ${warning ? 'bg-[#FFF7E8]' : 'bg-[#F7FAFE]'}`}>
      <p className={`text-xs font-black ${warning ? 'text-[#B45309]' : 'text-[#0D6BEA]'}`}>{title}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#344054]">{value}</p>
    </div>
  );
}
