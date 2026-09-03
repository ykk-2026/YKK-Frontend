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
import { useMemo, useState } from 'react';
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

const faqItems: FaqItem[] = [
  {
    id: 'resume-preview',
    category: '지원',
    question: '내 이력서가 실제로 기업에게 어떻게 보이는지 알고 싶어요.',
    answer: '마이페이지의 프로필 미리보기를 통해 기업에 전달되는 기본 정보를 확인할 수 있습니다. 지원 시에는 이름, 연락처, 이메일, 희망 고용형태 등 지원서에 입력한 정보가 함께 전달됩니다.',
  },
  {
    id: 'personal-job-post',
    category: '지원',
    question: '개인회원으로는 채용공고를 등록할 수 없나요?',
    answer: '채용공고 등록과 지원자 관리는 기업회원 계정에서만 가능합니다. 개인회원은 채용정보 조회, 관심공고 저장, 입사지원, 지원 현황 확인 기능을 사용할 수 있습니다.',
  },
  {
    id: 'apply-again',
    category: '지원',
    question: '이미 지원한 기업에 지원을 취소하고 다시 지원할 수 있나요?',
    answer: '지원 현황에서 지원서를 삭제한 뒤 같은 공고에 다시 지원할 수 있습니다. 다만 기업이 이미 전형을 진행 중인 경우에는 취소 전 채용 담당자에게 확인하는 것이 좋습니다.',
  },
  {
    id: 'view-status',
    category: '지원',
    question: '온라인 지원 후 기업이 내 이력서를 봤는지 알 수 있나요?',
    answer: '지원 현황에서 지원 완료, 서류 검토, 면접 등 전형 상태를 확인할 수 있습니다. 기업이 상태를 변경하면 지원 현황에 반영됩니다.',
  },
  {
    id: 'withdraw',
    category: '계정',
    question: '회원탈퇴는 어디에서 하나요?',
    answer: '마이페이지의 계정 설정 메뉴에서 회원탈퇴를 진행할 수 있습니다. 탈퇴 시 저장된 프로필, 관심공고, 지원 내역이 함께 삭제될 수 있으니 필요한 정보는 미리 확인해 주세요.',
  },
  {
    id: 'private-resume',
    category: '계정',
    question: '이력서 비공개 상태에서 지원하면 기업이 이력서를 볼 수 있나요?',
    answer: '프로필을 비공개로 설정해도 직접 지원한 공고의 기업 담당자는 지원 검토에 필요한 정보를 확인할 수 있습니다. 공개 설정은 기업의 일반 검색 노출 여부에 적용됩니다.',
  },
  {
    id: 'login-fail',
    category: '계정',
    question: '아이디 또는 비밀번호가 맞는데 로그인이 되지 않습니다.',
    answer: '입력한 아이디의 공백, 대소문자, 브라우저 자동완성 값을 먼저 확인해 주세요. 계속 문제가 있으면 비밀번호 찾기를 진행하거나 고객센터로 문의해 주세요.',
  },
  {
    id: 'accessibility-info',
    category: '접근성',
    question: '공고의 접근성 정보는 어디에서 확인하나요?',
    answer: '채용공고 상세 페이지에서 엘리베이터, 장애인 주차, 휠체어 접근, 장애인 화장실 등 편의시설 정보를 확인할 수 있습니다.',
  },
  {
    id: 'wrong-accessibility',
    category: '접근성',
    question: '접근성 정보가 실제와 다르면 어떻게 하나요?',
    answer: '공고 상세의 기업 문의 또는 고객센터 문의를 통해 정보 정정을 요청할 수 있습니다. 확인된 정보는 공고에 반영되도록 처리됩니다.',
  },
  {
    id: 'ai-recommend',
    category: '서비스',
    question: 'AI 추천일자리는 어떤 기준으로 보여주나요?',
    answer: '프로필의 희망 직무, 근무 지역, 고용형태, 접근성 조건, 경력 정보를 바탕으로 적합도가 높은 공고를 우선 추천합니다.',
  },
  {
    id: 'saved-jobs',
    category: '서비스',
    question: '관심 공고는 어디에서 다시 볼 수 있나요?',
    answer: '상단 메뉴 또는 마이페이지의 관심 공고 메뉴에서 저장한 공고를 다시 확인할 수 있습니다.',
  },
  {
    id: 'report',
    category: '기타',
    question: '허위 공고나 부적절한 게시글은 어떻게 신고하나요?',
    answer: '공고 상세 또는 커뮤니티 게시글에서 신고할 수 있습니다. 신고된 내용은 운영 기준에 따라 검토 후 조치됩니다.',
  },
];

const topFaqIds = ['resume-preview', 'apply-again', 'view-status', 'private-resume', 'accessibility-info'];

export function SupportPage({ currentUser }: SupportPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategory>('전체');
  const [openedFaqId, setOpenedFaqId] = useState('resume-preview');

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqItems.filter(item => {
      if (category !== '전체' && item.category !== category) return false;
      if (!normalizedQuery) return true;

      return [item.category, item.question, item.answer].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [category, query]);

  const topFaqs = topFaqIds
    .map(id => faqItems.find(item => item.id === id))
    .filter((item): item is FaqItem => Boolean(item));

  const openFaq = (faq: FaqItem) => {
    setCategory('전체');
    setOpenedFaqId(faq.id);
    window.setTimeout(() => {
      document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

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
          <section className="rounded-lg border border-[#DDE7F5] bg-white p-5 shadow-sm sm:p-6">
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
              {filteredFaqs.map(item => {
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

              {filteredFaqs.length === 0 && (
                <div className="py-16 text-center">
                  <HelpCircle size={34} className="mx-auto text-[#98A2B3]" />
                  <p className="mt-4 text-base font-bold text-[#667085]">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#DDE7F5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-[#0B1F44]">자주 묻는 질문 TOP 5</h2>
                <button
                  type="button"
                  onClick={() => setCategory('전체')}
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-[#1769E8]"
                >
                  더보기 <ArrowRight size={15} />
                </button>
              </div>
              <ol className="mt-4 space-y-3">
                {topFaqs.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openFaq(item)}
                      className="flex w-full gap-3 rounded-lg border border-[#E7EDF6] px-3 py-3 text-left hover:border-[#1769E8] hover:bg-[#F8FBFF]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1769E8] text-sm font-black text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm font-extrabold leading-6 text-[#24324A]">{item.question}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

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
