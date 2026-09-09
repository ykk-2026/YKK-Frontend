import {
  Accessibility,
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  FileQuestion,
  Headphones,
  HelpCircle,
  LogIn,
  Mail,
  MessageCircleQuestion,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CurrentUser } from '@/app/types';

interface SupportPageProps {
  currentUser?: CurrentUser | null;
}

type InquiryCategory = '전체' | '지원' | '계정' | '접근성' | '서비스' | '기타';

interface InquiryForm {
  name: string;
  email: string;
  category: Exclude<InquiryCategory, '전체'>;
  title: string;
  content: string;
}

interface Inquiry extends InquiryForm {
  id: string;
  submittedAt: string;
  status: '접수 완료';
}

const categories: InquiryCategory[] = ['전체', '지원', '계정', '접근성', '서비스', '기타'];

const categoryOptions: Array<Exclude<InquiryCategory, '전체'>> = ['지원', '계정', '접근성', '서비스', '기타'];

const quickMenus = [
  {
    title: '지원공고 문의',
    description: '지원 취소, 공고 확인, 전형 상태를 문의합니다.',
    category: '지원' as InquiryCategory,
    icon: BriefcaseBusiness,
  },
  {
    title: '계정/로그인 문의',
    description: '로그인, 회원가입, 계정 설정 문제를 문의합니다.',
    category: '계정' as InquiryCategory,
    icon: LogIn,
  },
  {
    title: '접근성 문의',
    description: '편의시설, 보조기기, 접근성 정보를 문의합니다.',
    category: '접근성' as InquiryCategory,
    icon: Accessibility,
  },
  {
    title: '이용방법 안내',
    description: '일이음의 주요 기능과 이용 절차를 문의합니다.',
    category: '서비스' as InquiryCategory,
    icon: HelpCircle,
  },
  {
    title: '기타 문의',
    description: '신고, 제휴, 오류 등 기타 문의를 남깁니다.',
    category: '기타' as InquiryCategory,
    icon: MessageCircleQuestion,
  },
];

const inquiryStorageKey = 'jobBridgeSupportInquiries';

const loadInquiries = (): Inquiry[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = JSON.parse(localStorage.getItem(inquiryStorageKey) || '[]') as Inquiry[];
    return Array.isArray(saved) ? saved : [];
  } catch {
    localStorage.removeItem(inquiryStorageKey);
    return [];
  }
};

const formatSubmittedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function SupportPage({ currentUser }: SupportPageProps) {
  const inquirySectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<InquiryCategory>('전체');
  const [openedInquiryId, setOpenedInquiryId] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => loadInquiries());
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    category: '지원',
    title: '',
    content: '',
  });

  useEffect(() => {
    localStorage.setItem(inquiryStorageKey, JSON.stringify(inquiries));
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return inquiries.filter(item => {
      if (category !== '전체' && item.category !== category) return false;
      if (!normalizedQuery) return true;

      return [item.category, item.title, item.content, item.name, item.email].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [category, inquiries, query]);

  const selectCategory = (nextCategory: InquiryCategory) => {
    setCategory(nextCategory);
    setOpenedInquiryId('');
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateInquiryForm = (field: keyof InquiryForm, value: string) => {
    setInquiryForm(prev => ({ ...prev, [field]: value }));
    setInquiryError('');
    setInquirySubmitted(false);
  };

  const openInquiry = (nextCategory?: InquiryCategory) => {
    setInquiryOpen(true);
    setInquiryError('');
    setInquirySubmitted(false);
    setInquiryForm(prev => ({
      ...prev,
      name: prev.name || currentUser?.name || '',
      email: prev.email || currentUser?.email || '',
      category: nextCategory && nextCategory !== '전체' ? nextCategory : prev.category,
    }));
  };

  const submitInquiry = () => {
    if (!inquiryForm.name.trim()) {
      setInquiryError('이름을 입력해주세요.');
      return;
    }

    if (!inquiryForm.email.trim() || !inquiryForm.email.includes('@')) {
      setInquiryError('답변 받을 이메일을 정확히 입력해주세요.');
      return;
    }

    if (!inquiryForm.title.trim()) {
      setInquiryError('문의 제목을 입력해주세요.');
      return;
    }

    if (inquiryForm.content.trim().length < 10) {
      setInquiryError('문의 내용을 10자 이상 입력해주세요.');
      return;
    }

    const nextInquiry: Inquiry = {
      ...inquiryForm,
      name: inquiryForm.name.trim(),
      email: inquiryForm.email.trim(),
      title: inquiryForm.title.trim(),
      content: inquiryForm.content.trim(),
      id: `inquiry-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: '접수 완료',
    };

    setInquiries(prev => [nextInquiry, ...prev]);
    setCategory('전체');
    setOpenedInquiryId(nextInquiry.id);
    setInquirySubmitted(true);
    setInquiryError('');
    setInquiryForm(prev => ({ ...prev, title: '', content: '' }));
    setTimeout(() => {
      setInquiryOpen(false);
      inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  };

  const deleteInquiry = (id: string) => {
    const confirmed = window.confirm('이 문의를 삭제하시겠습니까?');
    if (!confirmed) return;

    setInquiries(prev => prev.filter(item => item.id !== id));
    setOpenedInquiryId(prev => (prev === id ? '' : prev));
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-5 py-8 sm:px-6 lg:px-8">
        <section className="grid items-center gap-8 rounded-lg border border-[#DDE7F5] bg-white px-6 py-8 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px] lg:px-9">
          <div>
            <p className="text-sm font-extrabold text-[#1769E8]">고객센터</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#0B1F44] sm:text-4xl">무엇을 도와드릴까요?</h1>
            <p className="mt-3 text-base font-semibold leading-7 text-[#5B667A]">문의 내용을 남기면 이곳에 접수 내역이 바로 올라옵니다.</p>
            <div className="relative mt-7 max-w-3xl">
              <Search size={21} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1769E8]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="내 문의 제목, 내용, 유형을 검색해보세요."
                className="h-14 w-full rounded-lg border border-[#CFE0F6] bg-white pl-14 pr-4 text-base font-semibold text-[#111827] outline-none placeholder:text-[#8A94A6] focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/15"
              />
            </div>
          </div>

          <div className="hidden min-h-[210px] items-center justify-center rounded-lg bg-[#EEF5FF] lg:flex">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="absolute -right-5 top-5 rounded-lg bg-[#1769E8] px-3 py-2 text-sm font-black text-white shadow-sm">문의</div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DCEBFF] text-[#1769E8]">
                <Headphones size={52} strokeWidth={1.8} />
              </div>
              <div className="absolute bottom-5 left-2 rounded-lg border border-[#CFE0F6] bg-white px-3 py-2 text-xs font-extrabold text-[#234064]">상담 안내</div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickMenus.map(item => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.title}
                onClick={() => {
                  selectCategory(item.category);
                  openInquiry(item.category);
                }}
                className="rounded-lg border border-[#DDE7F5] bg-white p-4 text-left shadow-sm transition hover:border-[#1769E8] hover:bg-[#F8FBFF]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF5FF] text-[#1769E8]">
                  <Icon size={20} />
                </span>
                <span className="mt-3 block text-base font-extrabold text-[#0B1F44]">{item.title}</span>
                <span className="mt-2 block text-sm font-semibold leading-6 text-[#667085]">{item.description}</span>
              </button>
            );
          })}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]">
          <section ref={inquirySectionRef} className="rounded-lg border border-[#DDE7F5] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-black text-[#0B1F44]">
                <FileQuestion size={24} className="text-[#1769E8]" />
                문의하기
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(item => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => selectCategory(item)}
                    className={`h-10 rounded-lg px-4 text-sm font-extrabold ${
                      category === item ? 'bg-[#1769E8] text-white' : 'border border-[#DDE7F5] bg-white text-[#344054] hover:bg-[#EEF5FF] hover:text-[#1769E8]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 divide-y divide-[#E7EDF6]">
              {filteredInquiries.map(item => {
                const opened = openedInquiryId === item.id;

                return (
                  <article id={item.id} key={item.id} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                    <button type="button" onClick={() => setOpenedInquiryId(opened ? '' : item.id)} className="flex min-w-0 flex-1 items-start justify-between gap-4 text-left">
                      <span className="min-w-0">
                        <span className="inline-flex rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-black text-[#1769E8]">{item.category}</span>
                        <span className="ml-2 inline-flex rounded-full bg-[#E7F8EF] px-3 py-1 text-xs font-black text-[#14843C]">{item.status}</span>
                        <span className="ml-2 text-xs font-bold text-[#98A2B3]">{formatSubmittedAt(item.submittedAt)}</span>
                        <span className="mt-3 block text-base font-extrabold leading-7 text-[#111827] sm:text-lg">Q. {item.title}</span>
                      </span>
                      <ChevronDown size={22} className={`mt-2 shrink-0 transition ${opened ? 'rotate-180 text-[#1769E8]' : 'text-[#98A2B3]'}`} />
                    </button>
                      <button
                        type="button"
                        onClick={() => deleteInquiry(item.id)}
                        className="mt-1 h-8 shrink-0 rounded-lg border border-[#FAD1D1] px-3 text-xs font-extrabold text-[#D92D20] hover:bg-[#FFF1F1]"
                      >
                        삭제
                      </button>
                    </div>
                    {opened && (
                      <div className="mt-4 rounded-lg bg-[#F6F8FB] px-5 py-4 text-base font-semibold leading-8 text-[#344054]">
                        <p>{item.content}</p>
                        <p className="mt-3 text-sm font-bold text-[#667085]">답변 받을 이메일: {item.email}</p>
                      </div>
                    )}
                  </article>
                );
              })}

              {filteredInquiries.length === 0 && (
                <div className="py-16 text-center">
                  <HelpCircle size={34} className="mx-auto text-[#98A2B3]" />
                  <p className="mt-4 text-base font-bold text-[#667085]">아직 등록된 문의가 없습니다.</p>
                  <button type="button" onClick={() => openInquiry(category)} className="mt-5 h-10 rounded-lg bg-[#1769E8] px-5 text-sm font-extrabold text-white hover:bg-[#1157C7]">
                    문의 작성하기
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#DDE7F5] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-[#0B1F44]">고객센터 안내</h2>
              <div className="mt-4 space-y-3 text-base font-bold text-[#344054]">
                <p className="flex items-center gap-2">
                  <Headphones size={18} className="text-[#1769E8]" />
                  운영시간: 평일 09:00 ~ 18:00
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={18} className="text-[#1769E8]" />
                  help@ileeum.kr
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="text-[#1769E8]" />
                  1588-0000
                </p>
              </div>
              <button type="button" onClick={() => openInquiry(category)} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#1769E8] bg-white text-base font-black text-[#1769E8] hover:bg-[#EEF5FF]">
                1:1 문의하기
                <ArrowRight size={18} />
              </button>
            </section>
          </aside>
        </div>
      </main>

      {inquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E7EDF6] px-6 py-5">
              <div>
                <p className="text-sm font-extrabold text-[#1769E8]">고객센터</p>
                <h2 className="mt-1 text-2xl font-black text-[#0B1F44]">1:1 문의하기</h2>
                <p className="mt-1 text-sm font-semibold text-[#667085]">접수한 문의는 문의하기 목록에 바로 표시됩니다.</p>
              </div>
              <button type="button" onClick={() => setInquiryOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F5FA] text-[#667085] hover:bg-[#E4ECF6]" aria-label="문의 창 닫기">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-[#344054]">이름</span>
                  <input value={inquiryForm.name} onChange={event => updateInquiryForm('name', event.target.value)} className="h-11 rounded-lg border border-[#D7E1EE] px-3 text-sm font-bold outline-none focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-[#344054]">이메일</span>
                  <input type="email" value={inquiryForm.email} onChange={event => updateInquiryForm('email', event.target.value)} placeholder="email@example.com" className="h-11 rounded-lg border border-[#D7E1EE] px-3 text-sm font-bold outline-none focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10" />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-[#344054]">문의 유형</span>
                <select value={inquiryForm.category} onChange={event => updateInquiryForm('category', event.target.value as InquiryForm['category'])} className="h-11 rounded-lg border border-[#D7E1EE] bg-white px-3 text-sm font-bold outline-none focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10">
                  {categoryOptions.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-[#344054]">제목</span>
                <input value={inquiryForm.title} onChange={event => updateInquiryForm('title', event.target.value)} placeholder="문의 제목을 입력해주세요." className="h-11 rounded-lg border border-[#D7E1EE] px-3 text-sm font-bold outline-none focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-[#344054]">문의 내용</span>
                <textarea value={inquiryForm.content} onChange={event => updateInquiryForm('content', event.target.value)} placeholder="궁금한 내용이나 도움이 필요한 상황을 자세히 적어주세요." className="min-h-[150px] resize-y rounded-lg border border-[#D7E1EE] px-3 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10" />
              </label>

              {inquiryError && <p className="rounded-lg bg-[#FFF1F1] px-4 py-3 text-sm font-extrabold text-[#D92D20]">{inquiryError}</p>}
              {inquirySubmitted && <p className="rounded-lg bg-[#E7F8EF] px-4 py-3 text-sm font-extrabold text-[#14843C]">문의가 접수되었습니다. 문의하기 목록에 추가됩니다.</p>}

              <div className="flex flex-col-reverse gap-2 border-t border-[#E7EDF6] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setInquiryOpen(false)} className="h-11 rounded-lg border border-[#D7E1EE] px-5 text-sm font-extrabold text-[#344054] hover:bg-[#F6F8FB]">닫기</button>
                <button type="button" onClick={submitInquiry} className="h-11 rounded-lg bg-[#1769E8] px-6 text-sm font-extrabold text-white hover:bg-[#1157C7]">문의 접수</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
