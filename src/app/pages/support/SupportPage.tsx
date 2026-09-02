import {
  CheckCircle2,
  Clock3,
  Inbox,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CurrentUser } from '@/app/types';

interface SupportPageProps {
  currentUser?: CurrentUser | null;
}

type InquiryStatus = '접수' | '답변 완료';

interface Inquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  answer?: string;
}

const supportInquiryStorageKey = 'ileeumSupportInquiriesV2';
const inquiryTypes = ['지원 문의', '계정 문의', '접근성 정보 문의', '기업회원 문의', '신고/오류'];

const getTimestamp = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

const normalizeInquiry = (inquiry: Partial<Inquiry>): Inquiry => ({
  id: inquiry.id || `inquiry-${Date.now()}`,
  type: inquiry.type || '지원 문의',
  name: inquiry.name || '',
  email: inquiry.email || '',
  message: inquiry.message || '',
  status: inquiry.status || '접수',
  createdAt: inquiry.createdAt || getTimestamp(),
  answer: inquiry.answer,
});

export function SupportPage({ currentUser }: SupportPageProps) {
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    type: '지원 문의',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    message: '',
  });
  const [submittedId, setSubmittedId] = useState('');
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    if (typeof window === 'undefined') return [];

    const savedInquiries = localStorage.getItem(supportInquiryStorageKey);
    if (!savedInquiries) return [];

    try {
      return (JSON.parse(savedInquiries) as Inquiry[]).map(normalizeInquiry);
    } catch {
      localStorage.removeItem(supportInquiryStorageKey);
      return [];
    }
  });

  const filteredInquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return inquiries;

    return inquiries.filter(inquiry => (
      [inquiry.type, inquiry.name, inquiry.email, inquiry.message, inquiry.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    ));
  }, [inquiries, query]);

  const updateInquiries = (nextInquiries: Inquiry[]) => {
    setInquiries(nextInquiries);
    if (typeof window !== 'undefined') {
      localStorage.setItem(supportInquiryStorageKey, JSON.stringify(nextInquiries));
    }
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setSubmittedId('');
  };

  const submitInquiry = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim() || !emailPattern.test(form.email.trim()) || form.message.trim().length < 10) {
      setError('이름, 이메일, 문의 내용을 정확히 입력해 주세요. 문의 내용은 10자 이상이어야 합니다.');
      return;
    }

    const nextInquiry: Inquiry = {
      id: `inquiry-${Date.now()}`,
      type: form.type,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      status: '접수',
      createdAt: getTimestamp(),
    };

    updateInquiries([nextInquiry, ...inquiries]);
    setSubmittedId(nextInquiry.id);
    setError('');
    setQuery('');
    setForm(prev => ({ ...prev, message: '' }));
  };

  const completeInquiry = (inquiryId: string) => {
    updateInquiries(inquiries.map(inquiry => (
      inquiry.id === inquiryId
        ? { ...inquiry, status: '답변 완료', answer: '담당자가 문의 내용을 확인했습니다.' }
        : inquiry
    )));
  };

  const removeInquiry = (inquiryId: string) => {
    updateInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      <main className="mx-auto max-w-[1256px] px-5 py-6 sm:px-8">
        <section className="border-b border-[#D8E0EA] pb-6">
          <span className="text-sm font-black text-[#0D6BEA]">고객센터</span>
          <h1 className="mt-3 text-[32px] font-black leading-tight text-black">문의가 접수되면 이 화면에 바로 표시됩니다</h1>
          <p className="mt-3 max-w-[720px] text-sm font-semibold leading-6 text-[#596273]">
            기본으로 노출되는 샘플 항목은 없습니다. 직접 접수한 문의만 내역에 저장되고 표시됩니다.
          </p>

          <div className="relative mt-5 max-w-[620px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#344054]" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="내 문의 검색"
              className="h-12 w-full rounded-lg border border-[#D7DDE5] bg-white pl-11 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#0D6BEA]/15"
            />
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-black">
              <Inbox size={20} />
              문의 내역
            </h2>

            <div className="mt-4 space-y-3">
              {filteredInquiries.map(inquiry => (
                <article key={inquiry.id} className="rounded-lg border border-[#E7ECF2] bg-[#FBFCFE] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#EEF5FF] px-2.5 py-1 text-xs font-black text-[#0D6BEA]">{inquiry.type}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-black ${inquiry.status === '답변 완료' ? 'bg-[#E7F8EF] text-[#14843C]' : 'bg-[#FFF4E5] text-[#B45309]'}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-[#344054]">{inquiry.message}</p>
                      <p className="mt-3 flex items-center gap-1 text-xs font-bold text-[#8A94A6]">
                        <Clock3 size={13} /> {inquiry.createdAt} · {inquiry.name}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeInquiry(inquiry.id)} aria-label="문의 삭제" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#D92D20] hover:bg-[#FFF1F1]">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {inquiry.answer && <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#344054]">{inquiry.answer}</p>}
                  {inquiry.status !== '답변 완료' && (
                    <div className="mt-3 flex justify-end">
                      <button type="button" onClick={() => completeInquiry(inquiry.id)} className="h-8 rounded-lg bg-[#EAF8F3] px-3 text-xs font-black text-[#14843C] hover:bg-[#DDF4EA]">
                        답변 확인 처리
                      </button>
                    </div>
                  )}
                </article>
              ))}

              {filteredInquiries.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#D7DDE5] px-4 py-14 text-center">
                  <p className="text-base font-black text-black">표시할 문의가 없습니다.</p>
                  <p className="mt-2 text-sm font-semibold text-[#718096]">오른쪽 문의 작성 영역에서 직접 접수하면 이곳에 나타납니다.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-black">
                <MessageSquareText size={20} />
                1:1 문의 작성
              </h2>
              <div className="mt-4 grid gap-3">
                <select value={form.type} onChange={event => updateForm('type', event.target.value)} className="h-11 rounded-lg border border-[#D7DDE5] bg-white px-3 text-sm font-bold outline-none">
                  {inquiryTypes.map(type => <option key={type}>{type}</option>)}
                </select>
                <input value={form.name} onChange={event => updateForm('name', event.target.value)} placeholder="이름" className="h-11 rounded-lg border border-[#D7DDE5] px-3 text-sm font-semibold outline-none" />
                <input value={form.email} onChange={event => updateForm('email', event.target.value)} placeholder="이메일" className="h-11 rounded-lg border border-[#D7DDE5] px-3 text-sm font-semibold outline-none" />
                <textarea value={form.message} onChange={event => updateForm('message', event.target.value)} placeholder="문의 내용을 입력해 주세요." className="min-h-32 rounded-lg border border-[#D7DDE5] px-3 py-3 text-sm font-semibold outline-none" />
              </div>
              {error && <p className="mt-3 rounded-lg bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#D92D20]">{error}</p>}
              {submittedId && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-[#E7F8EF] px-3 py-2 text-sm font-bold text-[#14843C]">
                  <CheckCircle2 size={16} /> 문의가 접수되었습니다.
                </p>
              )}
              <button type="button" onClick={submitInquiry} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0D6BEA] text-sm font-extrabold text-white hover:bg-[#0959C7]">
                <Send size={17} />
                문의 올리기
              </button>
            </section>

            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-black">연락처</h2>
              <div className="mt-4 space-y-3 text-sm font-bold text-[#596273]">
                <p className="flex items-center gap-2"><Phone size={16} /> 1588-0000</p>
                <p className="flex items-center gap-2"><Mail size={16} /> help@ileeum.kr</p>
                <p className="flex items-center gap-2"><MapPin size={16} /> 평일 09:00-18:00 운영</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
