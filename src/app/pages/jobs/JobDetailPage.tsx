import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircleQuestion,
  Send,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ApplicationFormData, CurrentUser, Job, Page } from '@/app/types';
import { getProfile } from '@/app/api/profileApi';

interface JobDetailPageProps {
  jobs: Job[];
  jobId: string | null;
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  bookmarked: boolean;
  applied: boolean;
  onBookmark: (id: string) => void;
  onApply: (id: string, formData: ApplicationFormData) => void;
  onRequireLoginForApply: (id: string) => void;
}

const accessibilityLabels = [
  { key: 'elevator' as const, label: '엘리베이터 이용 가능' },
  { key: 'restArea' as const, label: '장애인 휴게공간' },
  { key: 'parking' as const, label: '장애인 주차' },
  { key: 'wheelchair' as const, label: '휠체어 접근 가능' },
  { key: 'restroom' as const, label: '장애인 화장실' },
  { key: 'hearingLoop' as const, label: '보조공학기기 지원' },
];

const getNormalizedJobId = (jobId: string | null) => jobId?.replace(/^job-/, '') || '';
const isPartTimeJob = (job: Job) => job.workType === 'PART_TIME' || job.category === 'PartTime' || job.requirements.includes('알바');
const employmentTypeOptions = [
  { value: 'ANY', label: '무관' }, { value: 'FULL_TIME', label: '정규직' },
  { value: 'REGULAR_EMPLOYEE', label: '상용직' },
  { value: 'CONTRACT', label: '계약직' }, { value: 'PERMANENT_CONTRACT', label: '무기계약직' },
  { value: 'CONVERSION_TYPE', label: '정규직 전환형' }, { value: 'PART_TIME', label: '시간제·파트타임' },
  { value: 'INTERN', label: '인턴' }, { value: 'DISPATCH', label: '파견직' },
  { value: 'FREELANCE', label: '프리랜서' },
];
const employmentTypeAliases: Record<string, string> = { INTERNSHIP: 'INTERN', FULL_TIME_CONVERSION: 'CONVERSION_TYPE', FREELANCER: 'FREELANCE' };
const employmentCode = (value?: string) => value ? employmentTypeAliases[value] || value : 'ANY';

const employmentLabel = (value: string) => ({
  ANY: '무관', FULL_TIME: '정규직', REGULAR_EMPLOYEE: '상용직', CONTRACT: '계약직', PERMANENT_CONTRACT: '무기계약직',
  CONVERSION_TYPE: '정규직 전환형', PART_TIME: '시간제·파트타임', INTERN: '인턴',
  INTERNSHIP: '인턴', DISPATCH: '파견직', FREELANCE: '프리랜서',
}[value] || value);

const workModeLabel = (value?: string) => ({
  ANY: '무관', OFFICE: '출근', REMOTE: '재택', HYBRID: '하이브리드',
}[value || 'ANY'] || value || '미입력');

const experienceLabel = (job: Job) => {
  const value = job.experienceLevel || 'ANY';
  const years = job.requiredCareerYears ?? (Number(value.match(/\d+/)?.[0] || '') || null);
  if (value.startsWith('EXPERIENCED')) return years != null ? `경력 ${years}년 이상` : '경력';
  return ({ ANY: '경력 무관', ENTRY: '신입' }[value] || value);
};

const educationLabel = (value?: string) => ({
  ANY: '학력 무관', ELEMENTARY_SCHOOL: '초졸 이상', MIDDLE_SCHOOL: '중졸 이상',
  HIGH_SCHOOL: '고졸 이상', COLLEGE: '전문대졸 이상',
  UNIVERSITY: '대졸 이상', BACHELOR: '대졸 이상', MASTER: '석사 이상', DOCTOR: '박사 이상',
}[value || ''] || value || '미입력');

const getJobMeta = (job: Job) => {
  return {
    employment: employmentLabel(job.workType),
    workMode: workModeLabel(job.workMode),
    experience: experienceLabel(job),
    education: educationLabel(job.educationLevel),
  };
};

export function JobDetailPage({
  jobs,
  jobId,
  currentUser,
  navigate,
  bookmarked,
  applied,
  onBookmark,
  onApply,
  onRequireLoginForApply,
}: JobDetailPageProps) {
  const normalizedJobId = getNormalizedJobId(jobId);
  const job = (jobs.find(item => item.id === normalizedJobId) || jobs[0]) as Job;
  const meta = useMemo(() => getJobMeta(job), [job]);
  const initialPhoneParts = (currentUser?.phone || '').split('-');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [submittedApplied, setSubmittedApplied] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [isProfileIntroductionLoading, setIsProfileIntroductionLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: currentUser?.name || '',
    phone1: initialPhoneParts[0] || '010',
    phone2: initialPhoneParts[1] || '',
    phone3: initialPhoneParts[2] || '',
    email: currentUser?.email || '',
    employmentType: employmentCode(job.workType),
    coverLetter: '',
    privacyAgreed: false,
  });

  const activeAccessibility = accessibilityLabels.filter(item => job.accessibility[item.key]);
  const inactiveAccessibility = accessibilityLabels.filter(item => !job.accessibility[item.key]);
  const isApplied = applied || submittedApplied;

  const updateApplicationForm = (field: keyof typeof applicationForm, value: string | boolean) => {
    setApplicationForm(prev => ({ ...prev, [field]: value }));
    setApplyError('');
  };

  const loadProfileIntroduction = async () => {
    if (!currentUser?.id || isProfileIntroductionLoading) return;

    if (applicationForm.coverLetter.trim() && !window.confirm('작성 중인 내용을 프로필 자기소개로 바꾸시겠습니까?')) return;

    setIsProfileIntroductionLoading(true);
    setApplyError('');
    try {
      const profile = await getProfile(currentUser.id);
      const introduction = profile.introduction?.trim() || '';
      if (!introduction) {
        setApplyError('프로필에 저장된 자기소개가 없습니다.');
        return;
      }
      setApplicationForm(prev => ({ ...prev, coverLetter: introduction.slice(0, 1500) }));
    } catch (error) {
      setApplyError(error instanceof Error ? error.message : '프로필 자기소개를 불러오지 못했습니다.');
    } finally {
      setIsProfileIntroductionLoading(false);
    }
  };

  const handleApply = () => {
    if (!currentUser) {
      window.alert('로그인 후 지원할 수 있습니다.');
      onRequireLoginForApply(job.id);
      return;
    }

    if (currentUser.role !== 'personal') {
      window.alert('구직자 계정으로만 지원할 수 있습니다.');
      return;
    }

    if (isApplied) return;

    setApplicationForm(prev => ({
      ...prev,
      name: prev.name || currentUser.name || '',
      email: prev.email || currentUser.email || '',
      employmentType: employmentCode(prev.employmentType || job.workType),
    }));
    setApplyError('');
    setIsApplyOpen(true);
  };

  const submitApplication = () => {
    const phoneParts = [applicationForm.phone1, applicationForm.phone2, applicationForm.phone3].map(value => String(value).trim());

    if (!applicationForm.privacyAgreed) {
      setApplyError('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    if (!applicationForm.coverLetter.trim()) {
      setApplyError('자기소개 및 지원내용을 입력해 주세요.');
      return;
    }

    const now = new Date().toISOString();
    onApply(job.id, {
      name: applicationForm.name.trim(),
      phone: phoneParts.join('-'),
      email: applicationForm.email.trim(),
      employmentType: applicationForm.employmentType,
      coverLetter: applicationForm.coverLetter.trim(),
      privacyAgreed: applicationForm.privacyAgreed,
      submittedAt: now,
      updatedAt: now,
    });
    setSubmittedApplied(true);
    setIsApplyOpen(false);
    window.alert('지원서가 제출되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1120px] px-4 py-5 sm:px-8">
        <button type="button" onClick={() => navigate('jobs')} className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#344054] hover:text-[#0D6BEA]">
          <ArrowLeft size={17} />
          채용공고 목록
        </button>

        <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-xl font-extrabold text-white" style={{ backgroundColor: job.companyColor }}>
                {job.companyInitials}
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#7A8495]">
                  <Building2 size={15} />
                  {job.company}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold leading-tight text-black sm:text-3xl">{job.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[#596273]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F6] px-3 py-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F6] px-3 py-1">
                    <BriefcaseBusiness size={14} /> {employmentLabel(job.workType)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7E8] px-3 py-1 text-[#B45309]">
                    <WalletCards size={14} /> {job.salary}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
              <button
                type="button"
                onClick={() => onBookmark(`job-${job.id}`)}
                className="inline-flex h-11 min-w-[92px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#D7DDE5] px-4 text-sm font-bold hover:bg-[#F8FAFC]"
              >
                {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                {bookmarked ? '저장됨' : '저장'}
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplied}
                className={`inline-flex h-11 min-w-[116px] items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-sm font-extrabold ${
                  isApplied ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#0D6BEA] text-white hover:bg-[#0959C7]'
                }`}
              >
                {isApplied ? <CheckCircle2 size={17} /> : <Send size={17} />}
                {isApplied ? '지원 완료' : '지원하기'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: '급여', value: job.salary, icon: WalletCards },
            { label: '근무방식', value: meta.workMode, icon: Building2 },
            { label: '경력 조건', value: meta.experience, icon: BriefcaseBusiness },
            { label: '마감일', value: job.deadline, icon: CalendarDays },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-[#DDE3EA] bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 text-xs font-extrabold text-[#7A8495]">
                  <Icon size={16} /> {item.label}
                </p>
                <p className="mt-2 text-base font-extrabold text-black">{item.value}</p>
              </div>
            );
          })}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5">
            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">주요 업무</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#344054]">{job.description}</p>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">필수 요건</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.requirements.length > 0 ? job.requirements.map(requirement => (
                  <span key={requirement} className="rounded-full bg-[#E4EFFF] px-3 py-1.5 text-xs font-extrabold text-[#0D6BEA]">
                    {requirement}
                  </span>
                )) : <p className="text-sm font-semibold text-[#7A8495]">등록된 필수 요건이 없습니다.</p>}
              </div>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">근무 조건</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ['고용형태', meta.employment],
                  ['근무방식', meta.workMode],
                  ['경력조건', meta.experience],
                  ['급여', job.salary],
                  ['근무지', job.location],
                  ['직무분야', job.category || '미입력'],
                  ['학력 조건', meta.education],
                  ['등록일', job.posted || '미입력'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-bold text-[#7A8495]">{label}</p>
                    <p className="mt-2 text-sm font-extrabold text-black">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">우대 사항</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {job.benefits.length > 0 ? job.benefits.map(benefit => (
                  <span key={benefit} className="inline-flex items-center gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm font-bold text-[#344054]">
                    <Check size={15} className="text-[#14843C]" />
                    {benefit}
                  </span>
                )) : <p className="text-sm font-semibold text-[#7A8495]">등록된 우대 사항이 없습니다.</p>}
              </div>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">접근성 정보</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {activeAccessibility.map(item => (
                  <span key={item.key} className="inline-flex items-center gap-2 rounded-lg bg-[#EAF8F8] px-3 py-2 text-sm font-bold text-[#217A83]">
                    <CheckCircle2 size={15} />
                    {item.label}
                  </span>
                ))}
                {inactiveAccessibility.map(item => (
                  <span key={item.key} className="inline-flex items-center gap-2 rounded-lg bg-[#F1F3F6] px-3 py-2 text-sm font-bold text-[#7A8495]">
                    <CheckCircle2 size={15} />
                    {item.label} 미확인
                  </span>
                ))}
              </div>
              {job.accessibilityInfo && (
                <p className="mt-4 whitespace-pre-line rounded-lg bg-[#F8FAFC] px-4 py-3 text-sm font-semibold leading-6 text-[#344054]">
                  {job.accessibilityInfo}
                </p>
              )}
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">전형 절차</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {['간편 지원', '담당자 확인', isPartTimeJob(job) ? '면접/연락' : '면접 안내', '최종 결과'].map((step, index) => (
                  <div key={step} className="rounded-lg border border-[#E1E6EE] bg-white px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E4EFFF] text-xs font-extrabold text-[#0D6BEA]">{index + 1}</span>
                    <p className="mt-3 text-sm font-extrabold text-black">{step}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">지원 정보</h2>
              <div className="mt-4 space-y-3 text-sm font-bold text-[#344054]">
                <p className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[#7A8495]"><CalendarDays size={16} /> 마감일</span>
                  <span>{job.deadline}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[#7A8495]"><BriefcaseBusiness size={16} /> 직무 분야</span>
                  <span>{job.category || '미입력'}</span>
                </p>
                {job.posted && <p className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[#7A8495]"><CalendarDays size={16} /> 등록일</span>
                  <span>{job.posted}</span>
                </p>}
              </div>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplied}
                className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-extrabold ${
                  isApplied ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#0D6BEA] text-white hover:bg-[#0959C7]'
                }`}
              >
                {isApplied ? <CheckCircle2 size={17} /> : <Send size={17} />}
                {isApplied ? '지원 완료' : '즉시 지원하기'}
              </button>
            </section>

            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-black">
                <MessageCircleQuestion size={19} />
                빠른 질문
              </h2>
              <div className="mt-3 space-y-2">
                {[
                  `경력 조건은? ${meta.experience}`,
                  `근무 방식은? ${meta.workMode}`,
                  `지원 마감일은? ${job.deadline}`,
                ].map(question => (
                  <p key={question} className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm font-bold leading-6 text-[#344054]">
                    {question}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">기업 정보</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#596273]">{job.companyDesc}</p>
              <div className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3">
                <p className="text-sm font-extrabold text-black">{job.company}</p>
                <p className="mt-2 text-sm font-bold text-[#596273]">기업회원이 직접 등록한 채용공고입니다.</p>
              </div>
            </section>

            {job.aiReasons.length > 0 && <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">AI 추천 이유</h2>
              <div className="mt-3 space-y-2">
                {job.aiReasons.slice(0, 3).map(reason => (
                  <p key={reason} className="flex gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm font-bold leading-6 text-[#344054]">
                    <HeartHandshake size={16} className="mt-0.5 shrink-0 text-[#14843C]" />
                    {reason}
                  </p>
                ))}
              </div>
            </section>}
          </aside>
        </div>
      </main>

      <div className="sticky bottom-0 z-40 border-t border-[#DDE3EA] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-[1120px] grid-cols-[52px_1fr] gap-2">
          <button
            type="button"
            onClick={() => onBookmark(`job-${job.id}`)}
            aria-label={bookmarked ? '저장 해제' : '공고 저장'}
            className="flex h-12 items-center justify-center rounded-lg border border-[#D7DDE5] text-[#344054]"
          >
            {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplied}
            className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-extrabold ${
              isApplied ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#0D6BEA] text-white'
            }`}
          >
            {isApplied ? <CheckCircle2 size={17} /> : <Send size={17} />}
            {isApplied ? '지원 완료' : '지원하기'}
          </button>
        </div>
      </div>

      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E7ECF2] px-6 py-5">
              <div>
                <p className="text-sm font-bold text-[#0D6BEA]">{job.company}</p>
                <h2 className="mt-1 text-xl font-extrabold text-black">지원서</h2>
                <p className="mt-1 text-sm font-semibold text-[#7A8495]">{job.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F6] text-lg font-bold text-[#596273] hover:bg-[#E1E6EE]"
                aria-label="지원 창 닫기"
              >
                x
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-lg bg-[#F8FAFC] px-4 py-0 text-sm font-bold text-[#344054]">
                공고명: <span className="text-black">{job.title}</span>
              </div>

              <div className="mt-5 divide-y divide-[#E7ECF2] border-t border-[#D7DDE5]">
                <div className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)]">
                  <label htmlFor="application-cover-letter" className="text-sm font-bold text-[#596273]">자기소개 및 지원내용</label>
                  <div className="min-w-0">
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        onClick={loadProfileIntroduction}
                        disabled={isProfileIntroductionLoading}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B8D2F5] bg-[#F4F8FF] px-3 py-1.5 text-[11px] font-bold text-[#0D6BEA] transition-colors hover:border-[#8AB8F2] hover:bg-[#E8F1FF] disabled:cursor-wait disabled:opacity-60 sm:text-xs"
                      >
                        <UserRound size={13} />
                        {isProfileIntroductionLoading ? '불러오는 중...' : '프로필 자기소개 불러오기'}
                      </button>
                    </div>
                    <textarea
                      id="application-cover-letter"
                      value={applicationForm.coverLetter}
                      onChange={event => updateApplicationForm('coverLetter', event.target.value.slice(0, 1500))}
                      placeholder="나의 강점과 경험, 지원 동기와 직무에 적합한 이유를 작성해 주세요."
                      rows={8}
                      className="w-full resize-y rounded border border-[#D7DDE5] px-3 py-3 text-sm leading-6 outline-none focus:border-[#0D6BEA]"
                    />
                  </div>
                </div>

                <label className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)]">
                  <span className="text-sm font-bold text-[#596273]">고용형태</span>
                  <select
                    value={applicationForm.employmentType}
                    onChange={event => updateApplicationForm('employmentType', event.target.value)}
                    className="h-11 rounded border border-[#D7DDE5] bg-white px-3 text-sm font-bold text-[#344054] outline-none focus:border-[#0D6BEA]"
                  >
                    {employmentTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>

              </div>

              <label className="mt-5 flex items-start gap-2 rounded-lg bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-[#344054]">
                <input
                  type="checkbox"
                  checked={applicationForm.privacyAgreed}
                  onChange={event => updateApplicationForm('privacyAgreed', event.target.checked)}
                  className="mt-1"
                />
                지원 진행을 위해 회원 정보와 작성한 지원 내용을 채용 담당자에게 전달하는 데 동의합니다.
              </label>

              {applyError && <p className="mt-4 rounded-lg bg-[#FFF5F5] px-4 py-3 text-sm font-bold text-[#D92D20]">{applyError}</p>}

              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E7ECF2] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsApplyOpen(false)} className="rounded-lg border border-[#D7DDE5] px-5 py-3 text-sm font-extrabold text-[#344054] hover:bg-[#F8FAFC]">
                  취소
                </button>
                <button type="button" onClick={submitApplication} className="inline-flex items-center gap-2 rounded-lg bg-[#0D6BEA] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#0959C7]">
                  <FileText size={17} />
                  지원서 제출
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
