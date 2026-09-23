import { Building2, CalendarDays, Mail, MapPin, Phone, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  closeJobPosting,
  createJobPosting,
  deleteJobPosting,
  getMyJobPostings,
  updateJobPosting,
  type JobPosting,
  type JobPostingForm,
} from '@/app/api/jobPostingApi';
import { getCompanyJobApplications, type JobApplicationRecord } from '@/app/api/jobApplicationApi';
import type { CurrentUser, Page } from '@/app/types';

interface CorporatePageProps {
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  onJobsChanged: () => void;
}

const emptyForm: JobPostingForm = {
  companyName: '',
  title: '',
  jobCategory: '',
  employmentType: 'FULL_TIME',
  location: '',
  salaryMin: null,
  workType: 'ANY',
  experienceLevel: 'ANY',
  requiredCareerYears: null,
  educationLevel: 'ANY',
  description: '',
  requirements: '',
  preferredQualifications: '',
  accessibilityInfo: '',
  wheelchairAccessible: false,
  accessibleRestroom: false,
  disabledParking: false,
  restAreaAvailable: false,
  elevatorAvailable: false,
  assistiveDeviceSupport: false,
  deadline: '',
};

const statusLabel = (status: JobPosting['status']) => ({
  OPEN: '모집 중',
  CLOSED: '마감',
  DELETED: '삭제',
}[status]);

export function CorporatePage({ currentUser, navigate, onJobsChanged }: CorporatePageProps) {
  const [form, setForm] = useState<JobPostingForm>({ ...emptyForm });
  const [myJobs, setMyJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadMyJobs = async () => {
    try {
      setMyJobs(await getMyJobPostings());
    } catch (value) {
      setError(value instanceof Error ? value.message : '내 공고를 불러오지 못했습니다.');
    }
  };

  const loadApplications = async () => {
    try {
      setApplications(await getCompanyJobApplications());
    } catch (value) {
      setApplications([]);
      setError(value instanceof Error ? value.message : '지원자 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'corporate') {
      setForm(previous => ({
        ...previous,
        companyName: previous.companyName || currentUser.companyProfile?.companyName || '',
      }));
      loadMyJobs();
      loadApplications();
    }
  }, [currentUser?.id, currentUser?.role]);

  const updateText = (name: keyof JobPostingForm, value: string) => {
    setForm(previous => ({ ...previous, [name]: value }));
  };

  const updateNumber = (name: 'salaryMin' | 'requiredCareerYears', value: string) => {
    setForm(previous => ({ ...previous, [name]: value ? Number(value) : null }));
  };

  const updateExperienceLevel = (value: string) => {
    setForm(previous => ({
      ...previous,
      experienceLevel: value,
      requiredCareerYears: value === 'EXPERIENCED' ? previous.requiredCareerYears : null,
    }));
  };

  const updateCheck = (name: keyof JobPostingForm, checked: boolean) => {
    setForm(previous => ({ ...previous, [name]: checked }));
  };

  const submitJob = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        ...form,
        experienceLevel: form.experienceLevel === 'EXPERIENCED' && form.requiredCareerYears != null
          ? `EXPERIENCED ${form.requiredCareerYears}` : form.experienceLevel,
      };
      if (editingJobId == null) {
        await createJobPosting(payload);
      } else {
        await updateJobPosting(editingJobId, payload);
      }
      setForm({ ...emptyForm, companyName: form.companyName });
      setMessage(editingJobId == null
        ? '채용공고가 등록되었습니다. 구직자 공고 목록에도 바로 표시됩니다.'
        : '채용공고가 수정되었습니다.');
      setEditingJobId(null);
      await loadMyJobs();
      onJobsChanged();
    } catch (value) {
      setError(value instanceof Error ? value.message : '채용공고 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (job: JobPosting) => {
    setEditingJobId(job.id);
    setForm({
      companyName: job.companyName,
      title: job.title,
      jobCategory: job.jobCategory,
      employmentType: job.employmentType,
      location: job.location,
      salaryMin: job.salaryMin,
      workType: job.workType || 'ANY',
      experienceLevel: job.experienceLevel?.startsWith('EXPERIENCED') ? 'EXPERIENCED' : job.experienceLevel || 'ANY',
      requiredCareerYears: job.requiredCareerYears ?? (Number(job.experienceLevel?.match(/\d+/)?.[0] || '') || null),
      educationLevel: job.educationLevel || '',
      description: job.description || '',
      requirements: job.requirements || '',
      preferredQualifications: job.preferredQualifications || '',
      accessibilityInfo: job.accessibilityInfo || '',
      wheelchairAccessible: Boolean(job.wheelchairAccessible),
      accessibleRestroom: Boolean(job.accessibleRestroom),
      disabledParking: Boolean(job.disabledParking),
      restAreaAvailable: Boolean(job.restAreaAvailable),
      elevatorAvailable: Boolean(job.elevatorAvailable),
      assistiveDeviceSupport: Boolean(job.assistiveDeviceSupport),
      deadline: job.deadline || '',
    });
    setMessage('');
    setError('');
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setForm({ ...emptyForm, companyName: currentUser.companyProfile?.companyName || '' });
    setMessage('');
    setError('');
  };

  const closeJob = async (jobId: number) => {
    if (!window.confirm('이 공고를 마감하시겠습니까?')) return;
    try {
      await closeJobPosting(jobId);
      await loadMyJobs();
      onJobsChanged();
    } catch (value) {
      setError(value instanceof Error ? value.message : '공고 마감에 실패했습니다.');
    }
  };

  const removeJob = async (jobId: number) => {
    if (!window.confirm('이 공고를 삭제하시겠습니까?')) return;
    try {
      await deleteJobPosting(jobId);
      await loadMyJobs();
      onJobsChanged();
    } catch (value) {
      setError(value instanceof Error ? value.message : '공고 삭제에 실패했습니다.');
    }
  };

  if (!currentUser || currentUser.role !== 'corporate') {
    return (
      <div className="min-h-screen bg-[#F3F7FF] px-5 py-12">
        <section className="mx-auto max-w-2xl rounded-xl border border-[#DDE3EA] bg-white p-8 text-center shadow-sm">
          <Building2 className="mx-auto text-[#0D6BEA]" size={38} />
          <h1 className="mt-4 text-xl font-extrabold">기업 로그인이 필요합니다</h1>
          <p className="mt-2 text-sm font-semibold text-[#667085]">기업회원만 채용공고를 등록할 수 있습니다.</p>
          <button type="button" onClick={() => navigate('login')} className="mt-5 rounded-lg bg-[#0D6BEA] px-5 py-3 text-sm font-extrabold text-white">
            기업 로그인
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] text-[#111827]">
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <section className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-extrabold text-[#0D6BEA]"><Building2 size={18} />{currentUser.companyProfile?.companyName}</p>
          <h1 className="mt-2 text-3xl font-black">기업 채용공고 관리</h1>
          <p className="mt-2 text-sm font-semibold text-[#667085]">공고를 등록하면 구직자 채용공고와 AI 추천에 사용됩니다.</p>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={submitJob} className="rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">{editingJobId == null ? '새 채용공고 등록' : '채용공고 수정'}</h2>
              {editingJobId != null && (
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[#D7E1EE] px-3 py-2 text-xs font-extrabold text-[#596273]">수정 취소</button>
              )}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="회사명 *"><input required value={form.companyName} onChange={event => updateText('companyName', event.target.value)} placeholder="공고에 표시할 회사명" /></Field>
              <Field label="공고 제목 *"><input required value={form.title} onChange={event => updateText('title', event.target.value)} /></Field>
              <Field label="직무 분야 *"><input required value={form.jobCategory} onChange={event => updateText('jobCategory', event.target.value)} placeholder="예: 백엔드 개발" /></Field>
              <Field label="고용 형태 *">
                <select value={form.employmentType} onChange={event => updateText('employmentType', event.target.value)}>
                  <option value="ANY">무관</option><option value="FULL_TIME">정규직</option><option value="REGULAR_EMPLOYEE">상용직</option><option value="CONTRACT">계약직</option><option value="PERMANENT_CONTRACT">무기계약직</option><option value="CONVERSION_TYPE">정규직 전환형</option><option value="PART_TIME">시간제·파트타임</option><option value="INTERN">인턴</option><option value="DISPATCH">파견직</option><option value="FREELANCE">프리랜서</option>
                </select>
              </Field>
              <Field label="학력 조건">
                <select value={form.educationLevel} onChange={event => updateText('educationLevel', event.target.value)}>
                  <option value="ANY">학력 무관</option><option value="ELEMENTARY_SCHOOL">초졸 이상</option><option value="MIDDLE_SCHOOL">중졸 이상</option><option value="HIGH_SCHOOL">고졸 이상</option><option value="COLLEGE">전문대졸 이상</option><option value="UNIVERSITY">대졸 이상</option><option value="MASTER">석사 이상</option><option value="DOCTOR">박사 이상</option>
                </select>
              </Field>
              <Field label="실제 근무지 상세주소 *"><input required value={form.location} onChange={event => updateText('location', event.target.value)} placeholder="예: 서울특별시 송파구 올림픽로 300" /></Field>
              <Field label="근무방식">
                <select value={form.workType} onChange={event => updateText('workType', event.target.value)}>
                  <option value="ANY">무관</option><option value="OFFICE">출근</option><option value="REMOTE">재택</option><option value="HYBRID">하이브리드</option>
                </select>
              </Field>
              <Field label="연봉(만원)"><input type="number" min="0" value={form.salaryMin ?? ''} onChange={event => updateNumber('salaryMin', event.target.value)} /></Field>
              <Field label="경력 조건">
                <select value={form.experienceLevel} onChange={event => updateExperienceLevel(event.target.value)}>
                  <option value="ANY">경력 무관</option><option value="ENTRY">신입</option><option value="EXPERIENCED">경력</option>
                </select>
              </Field>
              {form.experienceLevel === 'EXPERIENCED' && (
                <Field label="요구 경력 연수">
                  <input type="number" min="0" required value={form.requiredCareerYears ?? ''} onChange={event => updateNumber('requiredCareerYears', event.target.value)} placeholder="예: 3" />
                </Field>
              )}
              <Field label="마감일"><input type="date" value={form.deadline} onChange={event => updateText('deadline', event.target.value)} /></Field>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="업무 내용"><textarea rows={4} value={form.description} onChange={event => updateText('description', event.target.value)} /></Field>
              <Field label="필수 요건"><textarea rows={3} value={form.requirements} onChange={event => updateText('requirements', event.target.value)} placeholder="쉼표 또는 줄바꿈으로 구분" /></Field>
              <Field label="우대 사항"><textarea rows={3} value={form.preferredQualifications} onChange={event => updateText('preferredQualifications', event.target.value)} /></Field>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Check label="휠체어 접근 가능" checked={form.wheelchairAccessible} onChange={value => updateCheck('wheelchairAccessible', value)} />
              <Check label="장애인 화장실" checked={form.accessibleRestroom} onChange={value => updateCheck('accessibleRestroom', value)} />
              <Check label="장애인 주차" checked={form.disabledParking} onChange={value => updateCheck('disabledParking', value)} />
              <Check label="장애인 휴게공간" checked={form.restAreaAvailable} onChange={value => updateCheck('restAreaAvailable', value)} />
              <Check label="엘리베이터 이용 가능" checked={form.elevatorAvailable} onChange={value => updateCheck('elevatorAvailable', value)} />
              <Check label="보조공학기기 지원" checked={form.assistiveDeviceSupport} onChange={value => updateCheck('assistiveDeviceSupport', value)} />
            </div>
            {message && <p className="mt-4 rounded-lg bg-[#E7F8EF] p-3 text-sm font-bold text-[#14843C]">{message}</p>}
            {error && <p className="mt-4 rounded-lg bg-[#FFF1F1] p-3 text-sm font-bold text-[#D92D20]">{error}</p>}
            <button disabled={loading} className="mt-5 w-full rounded-lg bg-[#0D6BEA] py-3 text-sm font-extrabold text-white disabled:bg-[#9CC4F8]">
              {loading ? '저장 중...' : editingJobId == null ? '채용공고 등록' : '수정 내용 저장'}
            </button>
          </form>

          <aside className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">내가 등록한 공고</h2><span className="text-sm font-bold text-[#0D6BEA]">{myJobs.length}건</span></div>
            <div className="mt-4 grid gap-3">
              {myJobs.length === 0 && <p className="rounded-lg bg-[#F8FAFC] p-5 text-center text-sm font-semibold text-[#667085]">아직 등록한 공고가 없습니다.</p>}
              {myJobs.map(job => (
                <article key={job.id} className="rounded-lg border border-[#E1E6EE] p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="font-extrabold">{job.title}</h3><span className="shrink-0 rounded-full bg-[#EEF5FF] px-2 py-1 text-xs font-bold text-[#0D6BEA]">{statusLabel(job.status)}</span></div>
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#667085]"><MapPin size={13} />{job.location}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#667085]"><CalendarDays size={13} />{job.deadline || '상시채용'}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => navigate('job-detail', `job-${job.id}`)} className="flex-1 rounded-lg border border-[#C8D7EA] py-2 text-xs font-extrabold">보기</button>
                    <button type="button" onClick={() => startEdit(job)} className="flex-1 rounded-lg bg-[#EEF5FF] py-2 text-xs font-extrabold text-[#0D6BEA]">수정</button>
                    {job.status === 'OPEN' && <button type="button" onClick={() => closeJob(job.id)} className="flex-1 rounded-lg bg-[#FFF4E5] py-2 text-xs font-extrabold text-[#B54708]">마감</button>}
                    <button type="button" onClick={() => removeJob(job.id)} className="rounded-lg bg-[#FFF1F1] px-3 text-[#D92D20]" aria-label="공고 삭제"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-5 rounded-xl border border-[#DDE3EA] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-extrabold"><UsersRound size={21} className="text-[#0D6BEA]" />지원자 목록</h2>
              <p className="mt-2 text-sm font-semibold text-[#667085]">내 회사가 등록한 공고에 실제로 지원한 구직자만 표시됩니다.</p>
            </div>
            <span className="rounded-full bg-[#EEF5FF] px-3 py-1 text-sm font-extrabold text-[#0D6BEA]">{applications.length}명</span>
          </div>
          {applications.length === 0 ? (
            <div className="py-12 text-center">
              <UsersRound className="mx-auto text-[#98A2B3]" size={36} />
              <p className="mt-3 text-sm font-semibold text-[#667085]">아직 지원자가 없습니다.</p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[1080px] text-sm">
                <thead className="bg-[#F8FAFC] text-[#667085]">
                  <tr><th className="px-4 py-3 text-left">지원자</th><th className="px-4 py-3 text-left">지원 공고</th><th className="px-4 py-3 text-left">연락처</th><th className="px-4 py-3 text-left">자기소개 및 지원내용</th><th className="px-4 py-3 text-left">지원일</th><th className="px-4 py-3 text-left">상태</th></tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application.id} className="border-t border-[#E7ECF2]">
                      <td className="px-4 py-4 font-extrabold">{application.applicantName}</td>
                      <td className="px-4 py-4 font-semibold">{application.jobTitle}</td>
                      <td className="px-4 py-4 text-[#596273]"><span className="flex items-center gap-1"><Phone size={13} />{application.phone}</span><span className="mt-1 flex items-center gap-1"><Mail size={13} />{application.email}</span></td>
                      <td className="max-w-[360px] whitespace-pre-wrap break-words px-4 py-4 font-semibold leading-6 text-[#344054]">{application.coverLetter || '미입력'}</td>
                      <td className="px-4 py-4 font-semibold text-[#596273]">{application.createdAt ? new Date(application.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-4"><span className="rounded-full bg-[#E7F8EF] px-3 py-1 text-xs font-extrabold text-[#14843C]">{application.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-bold text-[#344054]">{label}<span className="[&_input]:h-11 [&_input]:rounded-lg [&_input]:border [&_input]:border-[#D7E1EE] [&_input]:px-3 [&_select]:h-11 [&_select]:rounded-lg [&_select]:border [&_select]:border-[#D7E1EE] [&_select]:px-3 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#D7E1EE] [&_textarea]:p-3">{children}</span></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] p-3 text-sm font-bold"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />{label}</label>;
}
