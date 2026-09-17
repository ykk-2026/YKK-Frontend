import { Bookmark, BookmarkCheck, BriefcaseBusiness, MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Job, Page } from '@/app/types';

interface JobsPageProps {
  jobs: Job[];
  mode?: 'all' | 'saved' | 'recommended';
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
  initialQuery?: string;
}

const employmentLabel = (value: string) => ({
  FULL_TIME: '정규직',
  CONTRACT: '계약직',
  PART_TIME: '파트타임',
  INTERN: '인턴',
}[value] || value);

export function JobsPage({
  jobs,
  mode = 'all',
  navigate,
  bookmarks,
  onBookmark,
  initialQuery = '',
}: JobsPageProps) {
  const [searchDraft, setSearchDraft] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState('전체');

  useEffect(() => {
    setSearchDraft(initialQuery);
    setQuery(initialQuery);
  }, [initialQuery]);

  const regions = useMemo(() => [
    '전체',
    ...Array.from(new Set(jobs.map(job => job.location).filter(Boolean))),
  ], [jobs]);

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return jobs.filter(job => {
      if (mode === 'saved' && !bookmarks.has(`job-${job.id}`)) return false;
      if (region !== '전체' && job.location !== region) return false;
      if (!keyword) return true;
      return [job.company, job.title, job.location, job.category, job.workType, ...job.requirements]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [bookmarks, jobs, mode, query, region]);

  const title = mode === 'saved' ? '관심 공고' : '기업회원 등록 채용공고';

  return (
    <div className="min-h-screen bg-[#F3F7FF] text-[#111827]">
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <section className="rounded-xl bg-[#DCEEFF] p-7">
          <p className="text-sm font-extrabold text-[#0D6BEA]">JobBridge 채용정보</p>
          <h1 className="mt-2 text-3xl font-black text-[#081B45]">{title}</h1>
          <p className="mt-3 text-sm font-semibold text-[#31527A]">
            기업회원이 직접 등록하고 현재 모집 중인 공고만 표시됩니다.
          </p>
        </section>

        <section className="mt-5 rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_240px_100px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" size={18} />
              <input
                value={searchDraft}
                onChange={event => setSearchDraft(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && setQuery(searchDraft)}
                placeholder="회사명, 공고명, 직무 검색"
                className="h-12 w-full rounded-lg border border-[#D7E1EE] pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#0D6BEA]"
              />
            </div>
            <select
              value={region}
              onChange={event => setRegion(event.target.value)}
              className="h-12 rounded-lg border border-[#D7E1EE] px-4 text-sm font-semibold outline-none focus:border-[#0D6BEA]"
            >
              {regions.map(item => <option key={item}>{item}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setQuery(searchDraft)}
              className="h-12 rounded-lg bg-[#0D6BEA] text-sm font-extrabold text-white hover:bg-[#0959C7]"
            >
              검색
            </button>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-extrabold text-[#344054]">총 {filteredJobs.length}건</p>
        </div>

        {filteredJobs.length === 0 ? (
          <section className="mt-4 rounded-xl border border-[#DDE3EA] bg-white py-20 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto text-[#98A2B3]" size={38} />
            <h2 className="mt-4 text-lg font-extrabold">표시할 채용공고가 없습니다</h2>
            <p className="mt-2 text-sm font-semibold text-[#667085]">
              기업회원이 공고를 등록하면 이곳에 바로 표시됩니다.
            </p>
          </section>
        ) : (
          <section className="mt-4 grid gap-4 md:grid-cols-2">
            {filteredJobs.map(job => {
              const bookmarkId = `job-${job.id}`;
              const bookmarked = bookmarks.has(bookmarkId);
              return (
                <article key={job.id} className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm transition hover:border-[#9EC5FF] hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <button type="button" onClick={() => navigate('job-detail', bookmarkId)} className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-extrabold text-[#0D6BEA]">{job.company}</p>
                      <h2 className="mt-2 text-xl font-black text-black">{job.title}</h2>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookmark(job.id)}
                      className="rounded-lg p-2 text-[#0D6BEA] hover:bg-[#EEF5FF]"
                      aria-label={bookmarked ? '관심 공고 해제' : '관심 공고 저장'}
                    >
                      {bookmarked ? <BookmarkCheck size={21} /> : <Bookmark size={21} />}
                    </button>
                  </div>
                  <button type="button" onClick={() => navigate('job-detail', bookmarkId)} className="mt-4 block w-full text-left">
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-[#596273]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F4F7] px-3 py-1.5"><MapPin size={13} />{job.location}</span>
                      <span className="rounded-full bg-[#F2F4F7] px-3 py-1.5">{employmentLabel(job.workType)}</span>
                      <span className="rounded-full bg-[#F2F4F7] px-3 py-1.5">{job.category}</span>
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-[#344054]">{job.salary}</p>
                    <p className="mt-2 text-xs font-bold text-[#D92D20]">마감일 {job.deadline}</p>
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
