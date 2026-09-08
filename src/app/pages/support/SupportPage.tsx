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
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { CurrentUser } from '@/app/types';

interface SupportPageProps {
  currentUser?: CurrentUser | null;
}

type FaqCategory = '전체' | '지원' | '계정' | '접근성' | '서비스' | '기타';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, '전체'>;
  question: string;
  answer: string;
}

const categories: FaqCategory[] = ['전체', '지원', '계정', '접근성', '서비스', '기타'];

const quickMenus = [
  {
    title: '지원/공고 문의',
    description: '지원 취소, 공고 확인, 전형 상태를 확인합니다.',
    category: '지원' as FaqCategory,
    icon: BriefcaseBusiness,
  },
  {
    title: '계정/로그인 문의',
    description: '로그인, 회원가입, 계정 설정 문제를 해결합니다.',
    category: '계정' as FaqCategory,
    icon: LogIn,
  },
  {
    title: '접근성 문의',
    description: '편의시설, 보조기기, 접근성 정보를 확인합니다.',
    category: '접근성' as FaqCategory,
    icon: Accessibility,
  },
  {
    title: '이용방법 안내',
    description: '일이음의 주요 기능과 이용 절차를 안내합니다.',
    category: '서비스' as FaqCategory,
    icon: HelpCircle,
  },
  {
    title: '기타 문의',
    description: '신고, 제휴, 오류 등 기타 문의를 확인합니다.',
    category: '기타' as FaqCategory,
    icon: MessageCircleQuestion,
  },
];

// FAQ 예시 문구는 제거했다. 실제 백엔드 FAQ API가 연결되면 이 배열을 응답 데이터로 대체하면 된다.
const faqItems: FaqItem[] = [];

export function SupportPage({ currentUser }: SupportPageProps) {
  const faqSectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategory>('전체');
  const [openedFaqId, setOpenedFaqId] = useState('');
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqItems.filter(item => {
      if (category !== '전체' && item.category !== category) return false;
      if (!normalizedQuery) return true;

      return [item.category, item.question, item.answer].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [category, query]);

  const visibleFaqs = showAllFaqs ? filteredFaqs : filteredFaqs.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-5 py-8 sm:px-6 lg:px-8">
        <section className="grid items-center gap-8 rounded-lg border border-[#DDE7F5] bg-white px-6 py-8 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px] lg:px-9">
          <div>
            <p className="text-sm font-extrabold text-[#1769E8]">고객센터</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#0B1F44] sm:text-4xl">
              무엇을 도와드릴까요?
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-[#5B667A]">
              궁금하신 내용을 빠르게 찾아보고 필요한 도움을 받아보세요.
            </p>
            <div className="relative mt-7 max-w-3xl">
              <Search size={21} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1769E8]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="궁금한 내용을 검색해보세요."
                className="h-14 w-full rounded-lg border border-[#CFE0F6] bg-white pl-14 pr-4 text-base font-semibold text-[#111827] outline-none placeholder:text-[#8A94A6] focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/15"
              />
            </div>
          </div>

          <div className="hidden min-h-[210px] items-center justify-center rounded-lg bg-[#EEF5FF] lg:flex">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="absolute -right-5 top-5 rounded-lg bg-[#1769E8] px-3 py-2 text-sm font-black text-white shadow-sm">FAQ</div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DCEBFF] text-[#1769E8]">
                <Headphones size={52} strokeWidth={1.8} />
              </div>
              <div className="absolute bottom-5 left-2 rounded-lg border border-[#CFE0F6] bg-white px-3 py-2 text-xs font-extrabold text-[#234064]">
                상담 안내
              </div>
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
                  setCategory(item.category);
                  setOpenedFaqId('');
                  setShowAllFaqs(false);
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
          <section ref={faqSectionRef} className="rounded-lg border border-[#DDE7F5] bg-white p-5 shadow-sm sm:p-6">
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
                    onClick={() => {
                      setCategory(item);
                      setOpenedFaqId('');
                      setShowAllFaqs(false);
                    }}
                    className={`h-10 rounded-lg px-4 text-sm font-extrabold ${
                      category === item
                        ? 'bg-[#1769E8] text-white'
                        : 'border border-[#DDE7F5] bg-white text-[#344054] hover:bg-[#EEF5FF] hover:text-[#1769E8]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 divide-y divide-[#E7EDF6]">
              {visibleFaqs.map(item => {
                const opened = openedFaqId === item.id;

                return (
                  <article id={`faq-${item.id}`} key={item.id} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenedFaqId(opened ? '' : item.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <span className="min-w-0">
                        <span className="inline-flex rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-black text-[#1769E8]">
                          {item.category}
                        </span>
                        <span className="mt-3 block text-base font-extrabold leading-7 text-[#111827] sm:text-lg">
                          Q. {item.question}
                        </span>
                      </span>
                      <ChevronDown size={22} className={`mt-2 shrink-0 transition ${opened ? 'rotate-180 text-[#1769E8]' : 'text-[#98A2B3]'}`} />
                    </button>
                    {opened && (
                      <div className="mt-4 rounded-lg bg-[#F6F8FB] px-5 py-4 text-base font-semibold leading-8 text-[#344054]">
                        {item.answer}
                      </div>
                    )}
                  </article>
                );
              })}

              {visibleFaqs.length === 0 && (
                <div className="py-16 text-center">
                  <HelpCircle size={34} className="mx-auto text-[#98A2B3]" />
                  <p className="mt-4 text-base font-bold text-[#667085]">등록된 질문이 없습니다.</p>
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
              <button
                type="button"
                onClick={() => window.alert(`${currentUser?.name || '회원'}님의 1:1 문의 페이지는 준비 중입니다.`)}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#1769E8] bg-white text-base font-black text-[#1769E8] hover:bg-[#EEF5FF]"
              >
                1:1 문의하기
                <ArrowRight size={18} />
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
