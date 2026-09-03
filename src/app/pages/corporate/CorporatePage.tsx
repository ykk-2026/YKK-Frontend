import { BriefcaseBusiness, Mail, Phone, Search, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockJobs } from '@/app/data/mockData';
import type { ApplicationFormData, CurrentUser, Page } from '@/app/types';

interface CorporatePageProps {
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  appliedJobIds: Set<string>;
  applicationForms: Record<string, ApplicationFormData>;
}

const getCompanyName = (user: CurrentUser | null) => {
  if (!user || user.role !== 'corporate') return '';
  return user.name.replace(/\s*채용담당자\s*$/, '').trim();
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export function CorporatePage({ currentUser, navigate, appliedJobIds, applicationForms }: CorporatePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const companyName = getCompanyName(currentUser);

  const companyJobs = useMemo(
    () => mockJobs.filter(job => !companyName || job.company === companyName),
    [companyName],
  );

  const applicantRows = useMemo(() => {
    return companyJobs
      .filter(job => appliedJobIds.has(job.id))
      .map(job => ({
        job,
        application: applicationForms[job.id],
      }))
      .filter(row => row.application);
  }, [appliedJobIds, applicationForms, companyJobs]);

  const filteredRows = applicantRows.filter(({ job, application }) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [job.title, application.name, application.phone, application.email, application.employmentType]
      .some(value => value.toLowerCase().includes(query));
  });

  if (!currentUser || currentUser.role !== 'corporate') {
    return (
      <div className="min-h-screen bg-[#F3F7FF] px-5 py-12">
        <section className="mx-auto max-w-2xl rounded-xl border border-[#DDE3EA] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-extrabold text-black">기업 로그인이 필요합니다</h1>
          <p className="mt-2 text-sm font-semibold text-[#667085]">지원자 목록은 기업회원만 확인할 수 있습니다.</p>
          <button
            type="button"
            onClick={() => navigate('login')}
            className="mt-5 rounded-lg bg-[#0D6BEA] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0959C7]"
          >
            로그인하기
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] text-[#111827]">
      <main className="mx-auto max-w-[1256px] px-5 py-6 sm:px-8">
        <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-[#0D6BEA]">{companyName || '기업회원'}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-black">지원자 목록</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-[#F4F8FC] px-4 py-3">
                <p className="text-xs font-bold text-[#667085]">등록 공고</p>
                <p className="mt-1 text-xl font-extrabold text-black">{companyJobs.length}</p>
              </div>
              <div className="rounded-lg bg-[#F4F8FC] px-4 py-3">
                <p className="text-xs font-bold text-[#667085]">지원자</p>
                <p className="mt-1 text-xl font-extrabold text-black">{applicantRows.length}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-[#F4F8FC] px-4 py-3 sm:col-span-1">
                <p className="text-xs font-bold text-[#667085]">진행 상태</p>
                <p className="mt-1 text-xl font-extrabold text-black">채용중</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness size={18} className="text-[#0D6BEA]" />
              <h2 className="font-extrabold text-black">내 공고</h2>
            </div>
            <div className="grid gap-3">
              {companyJobs.map(job => {
                const applicantCount = appliedJobIds.has(job.id) && applicationForms[job.id] ? 1 : 0;

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => navigate('job-detail', `job-${job.id}`)}
                    className="rounded-lg border border-[#E1E6EE] p-4 text-left hover:border-[#0D6BEA]"
                  >
                    <p className="text-sm font-extrabold text-black">{job.title}</p>
                    <p className="mt-2 text-xs font-bold text-[#667085]">{job.location} · {job.workType}</p>
                    <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-extrabold text-[#0D6BEA]">
                      <UsersRound size={13} />
                      지원자 {applicantCount}명
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-xl border border-[#DDE3EA] bg-white shadow-sm">
            <div className="border-b border-[#E7ECF2] p-5">
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="지원자, 공고명, 연락처 검색"
                  className="h-11 w-full rounded-lg border border-[#D7DDE5] bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-[#0D6BEA] focus:ring-4 focus:ring-[#0D6BEA]/15"
                />
              </div>
            </div>

            {filteredRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-[#F8FAFC] text-[#667085]">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold">지원자</th>
                      <th className="px-5 py-3 text-left font-bold">공고</th>
                      <th className="px-5 py-3 text-left font-bold">연락처</th>
                      <th className="px-5 py-3 text-left font-bold">지원일</th>
                      <th className="px-5 py-3 text-left font-bold">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map(({ job, application }) => (
                      <tr key={job.id} className="border-t border-[#E7ECF2]">
                        <td className="px-5 py-4">
                          <p className="font-extrabold text-black">{application.name}</p>
                          <p className="mt-1 text-xs font-semibold text-[#667085]">{application.employmentType}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#344054]">{job.title}</td>
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-2 font-semibold text-[#344054]"><Phone size={14} />{application.phone}</p>
                          <p className="mt-1 flex items-center gap-2 font-semibold text-[#344054]"><Mail size={14} />{application.email}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#344054]">{formatDate(application.submittedAt)}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#E7F8EF] px-3 py-1 text-xs font-extrabold text-[#14843C]">지원 완료</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-14 text-center">
                <UsersRound className="mx-auto text-[#98A2B3]" size={34} />
                <h2 className="mt-4 text-lg font-extrabold text-black">표시할 지원자가 없습니다</h2>
                <p className="mt-2 text-sm font-semibold text-[#667085]">구직자가 {companyName || '기업'} 공고에 지원하면 이 목록에 바로 표시됩니다.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
