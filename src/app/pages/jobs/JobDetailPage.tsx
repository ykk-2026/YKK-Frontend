import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  MapPin,
  Send,
  Users,
} from 'lucide-react';
import { mockJobs } from '@/app/data/mockData';
import type { CurrentUser, Page } from '@/app/types';

interface JobDetailPageProps {
  jobId: string | null;
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  bookmarked: boolean;
  applied: boolean;
  onBookmark: (id: string) => void;
  onApply: (id: string) => void;
  onRequireLoginForApply: (id: string) => void;
}

const accessibilityLabels = [
  { key: 'elevator' as const, label: '엘리베이터' },
  { key: 'parking' as const, label: '장애인 주차' },
  { key: 'wheelchair' as const, label: '휠체어 접근' },
  { key: 'restroom' as const, label: '장애인 화장실' },
  { key: 'guideDog' as const, label: '안내견 동반' },
  { key: 'hearingLoop' as const, label: '보청 지원' },
];

const getNormalizedJobId = (jobId: string | null) => jobId?.replace(/^job-/, '') || '';

export function JobDetailPage({ jobId, currentUser, navigate, bookmarked, applied, onBookmark, onApply, onRequireLoginForApply }: JobDetailPageProps) {
  const normalizedJobId = getNormalizedJobId(jobId);
  const job = mockJobs.find(item => item.id === normalizedJobId) || mockJobs[0];

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

    if (applied) return;

    onApply(job.id);
    window.alert('지원이 완료되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1120px] px-5 py-5 sm:px-8">
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
                <p className="flex items-center gap-1 text-sm font-bold text-[#7A8495]">
                  <Building2 size={15} />
                  {job.company}
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-black">{job.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[#596273]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F6] px-3 py-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F6] px-3 py-1">
                    <BriefcaseBusiness size={14} /> {job.workType}
                  </span>
                  <span className="rounded-full bg-[#F1F3F6] px-3 py-1">{job.salary}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => onBookmark(`job-${job.id}`)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#D7DDE5] px-4 text-sm font-bold hover:bg-[#F8FAFC]"
              >
                {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                {bookmarked ? '저장됨' : '저장'}
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={applied}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-extrabold ${
                  applied ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#0D6BEA] text-white hover:bg-[#0959C7]'
                }`}
              >
                {applied ? <CheckCircle2 size={17} /> : <Send size={17} />}
                {applied ? '지원 완료' : '지원하기'}
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5">
            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">공고 소개</h2>
              <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-[#344054]">{job.description}</p>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">자격 요건</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.requirements.map(requirement => (
                  <span key={requirement} className="rounded-full bg-[#E4EFFF] px-3 py-1.5 text-xs font-extrabold text-[#0D6BEA]">
                    {requirement}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">복리후생</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {job.benefits.map(benefit => (
                  <span key={benefit} className="inline-flex items-center gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm font-bold text-[#344054]">
                    <Check size={15} className="text-[#14843C]" />
                    {benefit}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">접근성 정보</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {accessibilityLabels.map(item => (
                  <span key={item.key} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${job.accessibility[item.key] ? 'bg-[#EAF8F8] text-[#217A83]' : 'bg-[#F1F3F6] text-[#7A8495]'}`}>
                    <CheckCircle2 size={15} />
                    {item.label}
                  </span>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">지원 정보</h2>
              <div className="mt-4 space-y-3 text-sm font-bold text-[#344054]">
                <p className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[#7A8495]"><CalendarDays size={16} /> 마감일</span>
                  <span>{job.deadline}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[#7A8495]"><Users size={16} /> 모집 인원</span>
                  <span>{job.headcount}명</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-[#7A8495]">AI 매칭</span>
                  <span className="text-[#0D6BEA]">{job.aiScore}%</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleApply}
                disabled={applied}
                className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-extrabold ${
                  applied ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#0D6BEA] text-white hover:bg-[#0959C7]'
                }`}
              >
                {applied ? <CheckCircle2 size={17} /> : <Send size={17} />}
                {applied ? '지원 완료' : '지원하기'}
              </button>
            </section>

            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">회사 소개</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#596273]">{job.companyDesc}</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
