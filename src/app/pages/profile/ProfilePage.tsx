import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Camera,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Lock,
  Mail,
  MapPin,
  Plus,
  Phone,
  Save,
  Trash2,
  UserRound,
} from 'lucide-react';
import { mockJobs } from '@/app/data/mockData';
import type { CurrentUser, Job, Page } from '@/app/types';

interface ProfilePageProps {
  currentUser: CurrentUser | null;
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
}

const regionOptions = [
  '서울특별시 송파구',
  '서울특별시 강남구',
  '서울특별시 강서구',
  '서울특별시 마포구',
  '경기도 성남시',
  '경기도 수원시',
  '경기도 고양시',
  '인천광역시',
  '부산광역시',
  '대구광역시',
  '대전광역시',
  '광주광역시',
  '울산광역시',
  '세종특별자치시',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

const menuItems = [
  { label: '내 프로필', icon: UserRound },
  { label: '이력서 관리', icon: FileText },
  { label: '지원 현황', icon: Briefcase },
  { label: '관심 공고', icon: Bookmark },
  { label: 'AI 추천 결과', icon: Bell },
  { label: '계정 설정', icon: Lock },
];

const workTypes = ['재택근무', '유연근무', '하이브리드', '출퇴근 근무'];
const maxIntroLength = 500;

interface ResumeItem {
  id: string;
  title: string;
  updatedAt: string;
}

export function ProfilePage({ currentUser, navigate, bookmarks, onBookmark }: ProfilePageProps) {
  const initialName = currentUser?.name || '김민준';
  const initialAvatar = currentUser?.avatar || initialName.slice(0, 1);
  const [activeMenu, setActiveMenu] = useState('내 프로필');
  const [savedMessage, setSavedMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Job[]>([]);
  const [accountForm, setAccountForm] = useState({
    loginId: currentUser?.loginId || currentUser?.id || 'minjun_kim',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '010-1234-5678',
    currentPassword: '',
    newPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    deadline: true,
    recommendation: true,
    application: true,
  });
  const [profileForm, setProfileForm] = useState({
    name: initialName,
    birthDate: currentUser?.birthDate || '1998-05-23',
    gender: currentUser?.gender || '남성',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '010-1234-5678',
    currentRegion: currentUser?.currentRegion || '서울특별시 송파구',
    preferredRole: currentUser?.preferredRole || '',
    employmentType: '',
    salary: '',
    workTypes: [],
    introduction: '',
  });

  const updateForm = (field: keyof typeof profileForm, value: string | string[]) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    setSavedMessage('');
  };

  const toggleWorkType = (workType: string) => {
    setProfileForm(prev => ({
      ...prev,
      workTypes: prev.workTypes.includes(workType)
        ? prev.workTypes.filter(item => item !== workType)
        : [...prev.workTypes, workType],
    }));
    setSavedMessage('');
  };

  const handleSave = () => {
    setSavedMessage('프로필 정보가 저장되었습니다.');
    window.alert('프로필 정보가 저장되었습니다.');
  };

  const addResume = () => {
    const nextResume = {
      id: `resume-${Date.now()}`,
      title: `새 이력서 ${resumes.length + 1}`,
      updatedAt: '2026-08-12',
    };
    setResumes(prev => [nextResume, ...prev]);
    setSavedMessage('새 이력서가 추가되었습니다.');
  };

  const deleteResume = (resumeId: string) => {
    setResumes(prev => prev.filter(resume => resume.id !== resumeId));
    setSavedMessage('이력서가 삭제되었습니다.');
  };

  const updateAccountForm = (field: keyof typeof accountForm, value: string) => {
    setAccountForm(prev => ({ ...prev, [field]: value }));
    setSavedMessage('');
  };

  const saveAccountSettings = () => {
    setSavedMessage('계정 설정이 저장되었습니다.');
    setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
  };

  const toggleNotification = (field: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [field]: !prev[field] }));
    setSavedMessage('알림 설정이 변경되었습니다.');
  };

  const savedJobs = mockJobs
    .map(job => {
      const savedKey = bookmarks.has(`job-${job.id}`) ? `job-${job.id}` : '';
      return { ...job, savedKey };
    })
    .filter(job => job.savedKey);

  const refreshAiRecommendations = () => {
    setAiRecommendations([...mockJobs].sort((a, b) => b.aiScore - a.aiScore).slice(0, 4));
    setSavedMessage('AI 추천 결과를 새로 계산했습니다.');
  };

  return (
    <div className="min-h-screen bg-[#F3F7FF] text-[#111827]">
      <main className="mx-auto grid max-w-[1256px] gap-5 px-5 py-5 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[#DDE3EA] bg-white p-4 shadow-sm">
          <div className="mb-4 rounded-xl bg-[#F4F8FC] px-4 py-4">
            <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4EFFF] text-lg font-extrabold text-[#0D6BEA]">
              {initialAvatar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-black">{profileForm.name}</p>
              <p className="mt-1 truncate text-xs font-bold text-[#7A8495]">{profileForm.preferredRole || '개인회원'}</p>
            </div>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={activeMenu === item.label}
                  onClick={() => {
                    setActiveMenu(item.label);
                    setSavedMessage('');
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-bold transition ${
                    activeMenu === item.label ? 'bg-[#E4EFFF] text-[#0D6BEA]' : 'bg-transparent text-[#344054] hover:text-[#0D6BEA]'
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-5">
          <div className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0D6BEA]">{activeMenu}</p>
                <h1 className="mt-1 text-2xl font-extrabold text-black">프로필 관리</h1>
                <p className="mt-2 text-sm font-semibold text-[#7A8495]">기업이 확인할 기본 정보와 구직 조건을 관리합니다.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsPreviewOpen(true)} className="rounded-lg border border-[#D7DDE5] px-4 py-2 text-sm font-bold hover:bg-[#F8FAFC]">
                  미리보기
                </button>
                <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-[#0D6BEA] px-4 py-2 text-sm font-bold text-white hover:bg-[#0959C7]">
                  <Save size={16} />
                  저장
                </button>
              </div>
            </div>
            {savedMessage && <p className="mt-4 rounded-lg bg-[#E7F8EF] px-4 py-3 text-sm font-bold text-[#14843C]">{savedMessage}</p>}
          </div>

          {activeMenu === '이력서 관리' ? (
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-black">이력서 관리</h2>
                  <p className="mt-1 text-sm font-semibold text-[#7A8495]">등록한 이력서를 관리합니다.</p>
                </div>
                <button type="button" onClick={addResume} className="inline-flex items-center gap-2 rounded-lg bg-[#0D6BEA] px-4 py-2 text-sm font-bold text-white hover:bg-[#0959C7]">
                  <Plus size={16} />
                  이력서 추가
                </button>
              </div>

              {resumes.length > 0 ? (
                <div className="grid gap-3">
                  {resumes.map(resume => (
                    <article key={resume.id} className="rounded-lg border border-[#E1E6EE] bg-white p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-black">{resume.title}</h3>
                          <p className="mt-2 text-sm font-semibold text-[#7A8495]">최근 수정 {resume.updatedAt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <button type="button" onClick={() => window.alert(`${resume.title} 미리보기를 엽니다.`)} className="inline-flex items-center gap-1 rounded-lg border border-[#D7DDE5] px-3 py-2 text-sm font-bold hover:bg-[#F8FAFC]">
                            <Eye size={15} />
                            미리보기
                          </button>
                          <button type="button" onClick={() => window.alert(`${resume.title} PDF 다운로드를 시작합니다.`)} className="inline-flex items-center gap-1 rounded-lg border border-[#D7DDE5] px-3 py-2 text-sm font-bold hover:bg-[#F8FAFC]">
                            <Download size={15} />
                            PDF
                          </button>
                          <button type="button" onClick={() => deleteResume(resume.id)} className="inline-flex items-center gap-1 rounded-lg border border-[#F4B7B7] px-3 py-2 text-sm font-bold text-[#D92D20] hover:bg-[#FFF5F5]">
                            <Trash2 size={15} />
                            삭제
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#D7DDE5] bg-[#F8FAFC] p-8 text-center">
                  <FileText size={32} className="mx-auto text-[#7A8495]" />
                  <p className="mt-3 text-base font-extrabold text-black">등록한 이력서가 없습니다.</p>
                  <button type="button" onClick={addResume} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0D6BEA] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0959C7]">
                    <Plus size={16} />
                    이력서 추가
                  </button>
                </div>
              )}
            </section>
          ) : activeMenu === '지원 현황' ? (
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-black">지원 현황</h2>
                  <p className="mt-1 text-sm font-semibold text-[#7A8495]">지원한 공고를 확인할 수 있습니다.</p>
                </div>
                <button type="button" onClick={() => navigate('jobs')} className="inline-flex items-center gap-1 text-sm font-extrabold text-[#0D6BEA]">
                  공고 더 보기 <ArrowRight size={15} />
                </button>
              </div>

              <div className="rounded-lg border border-dashed border-[#D7DDE5] bg-[#F8FAFC] p-8 text-center">
                <Briefcase size={32} className="mx-auto text-[#7A8495]" />
                <p className="mt-3 text-base font-extrabold text-black">지원한 공고가 없습니다.</p>
                <button type="button" onClick={() => navigate('jobs')} className="mt-4 rounded-lg bg-[#0D6BEA] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0959C7]">
                  공고 보러가기
                </button>
              </div>
            </section>
          ) : activeMenu === '관심 공고' ? (
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-black">관심 공고</h2>
                  <p className="mt-1 text-sm font-semibold text-[#7A8495]">저장한 공고 {savedJobs.length}건을 확인할 수 있습니다.</p>
                </div>
                <button type="button" onClick={() => navigate('saved')} className="inline-flex items-center gap-1 text-sm font-extrabold text-[#0D6BEA]">
                  전체 보기 <ArrowRight size={15} />
                </button>
              </div>

              {savedJobs.length > 0 ? (
                <div className="grid gap-3">
                  {savedJobs.map(job => (
                    <article key={job.id} className="rounded-lg border border-[#E1E6EE] bg-white p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <button type="button" onClick={() => navigate('jobs')} className="flex min-w-0 items-start gap-3 text-left">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-extrabold text-white" style={{ backgroundColor: job.companyColor }}>
                            {job.companyInitials}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-[#7A8495]">{job.company}</span>
                            <span className="mt-1 block text-lg font-extrabold text-black">{job.title}</span>
                            <span className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-[#596273]">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F6] px-3 py-1">
                                <MapPin size={13} /> {job.location}
                              </span>
                              <span className="rounded-full bg-[#F1F3F6] px-3 py-1">{job.workType}</span>
                              <span className="rounded-full bg-[#F1F3F6] px-3 py-1">{job.salary}</span>
                            </span>
                          </span>
                        </button>

                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <button
                            type="button"
                            onClick={() => onBookmark(job.savedKey)}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D7DDE5] px-3 text-sm font-bold hover:bg-[#F8FAFC]"
                          >
                            <BookmarkCheck size={16} />
                            저장됨
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#D7DDE5] bg-[#F8FAFC] p-8 text-center">
                  <Bookmark size={32} className="mx-auto text-[#7A8495]" />
                  <p className="mt-3 text-base font-extrabold text-black">저장한 관심 공고가 없습니다.</p>
                  <button type="button" onClick={() => navigate('jobs')} className="mt-4 rounded-lg bg-[#0D6BEA] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0959C7]">
                    공고 보러가기
                  </button>
                </div>
              )}
            </section>
          ) : activeMenu === 'AI 추천 결과' ? (
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-black">AI 추천 결과</h2>
                  <p className="mt-1 text-sm font-semibold text-[#7A8495]">현재 프로필과 가까운 공고를 적합도순으로 보여줍니다.</p>
                </div>
                <button type="button" onClick={refreshAiRecommendations} className="rounded-lg border border-[#D7DDE5] px-4 py-2 text-sm font-bold hover:bg-[#F8FAFC]">
                  {aiRecommendations.length > 0 ? '다시 추천받기' : '추천받기'}
                </button>
              </div>

              {aiRecommendations.length > 0 ? (
                <div className="grid gap-3">
                  {aiRecommendations.map(job => {
                    const savedKey = `job-${job.id}`;
                    const isSaved = bookmarks.has(savedKey);
                    return (
                      <article key={job.id} className="rounded-lg border border-[#E1E6EE] bg-white p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-extrabold text-white" style={{ backgroundColor: job.companyColor }}>
                              {job.companyInitials}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#7A8495]">{job.company}</p>
                              <h3 className="mt-1 text-lg font-extrabold text-black">{job.title}</h3>
                              <p className="mt-2 text-sm font-semibold text-[#596273]">{job.aiReasons[0]}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {job.requirements.slice(0, 4).map(requirement => (
                                  <span key={requirement} className="rounded-full bg-[#E4EFFF] px-3 py-1 text-xs font-bold text-[#0D6BEA]">{requirement}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                            <button type="button" onClick={() => onBookmark(savedKey)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D7DDE5] px-3 text-sm font-bold hover:bg-[#F8FAFC]">
                              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                              {isSaved ? '저장됨' : '저장'}
                            </button>
                            <button type="button" onClick={() => navigate('jobs')} className="inline-flex h-9 items-center gap-1 text-sm font-extrabold text-[#0D6BEA]">
                              공고 보기 <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#D7DDE5] bg-[#F8FAFC] p-8 text-center">
                  <Bell size={32} className="mx-auto text-[#7A8495]" />
                  <p className="mt-3 text-base font-extrabold text-black">아직 AI 추천 결과가 없습니다.</p>
                  <button type="button" onClick={refreshAiRecommendations} className="mt-4 rounded-lg bg-[#0D6BEA] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0959C7]">
                    추천받기
                  </button>
                </div>
              )}
            </section>
          ) : activeMenu === '계정 설정' ? (
            <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-black">계정 설정</h2>
                <p className="mt-1 text-sm font-semibold text-[#7A8495]">로그인 정보와 알림 수신 여부를 관리합니다.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">로그인 아이디</span>
                  <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={accountForm.loginId} onChange={event => updateAccountForm('loginId', event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter') saveAccountSettings();
                  }} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">이메일</span>
                  <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={accountForm.email} onChange={event => updateAccountForm('email', event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter') saveAccountSettings();
                  }} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">전화번호</span>
                  <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={accountForm.phone} onChange={event => updateAccountForm('phone', event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter') saveAccountSettings();
                  }} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">현재 비밀번호</span>
                  <input type="password" className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={accountForm.currentPassword} onChange={event => updateAccountForm('currentPassword', event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter') saveAccountSettings();
                  }} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold">새 비밀번호</span>
                  <input type="password" className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={accountForm.newPassword} onChange={event => updateAccountForm('newPassword', event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter') saveAccountSettings();
                  }} placeholder="변경할 때만 입력하세요" />
                </label>
              </div>

              <div className="mt-6 border-t border-[#E7ECF2] pt-5">
                <h3 className="text-base font-extrabold text-black">알림 설정</h3>
                <div className="mt-3 grid gap-3">
                  {[
                    { key: 'deadline' as const, title: '마감 임박 알림', desc: '관심 공고 마감일이 가까워지면 알려줍니다.' },
                    { key: 'recommendation' as const, title: 'AI 추천 알림', desc: '프로필에 맞는 새 공고를 알려줍니다.' },
                    { key: 'application' as const, title: '지원 상태 알림', desc: '서류 검토, 면접 제안 등 상태 변경을 알려줍니다.' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => toggleNotification(item.key)}
                      className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E6EE] px-4 py-3 text-left hover:bg-[#F8FAFC]"
                    >
                      <span>
                        <span className="block text-sm font-extrabold text-black">{item.title}</span>
                        <span className="mt-1 block text-xs font-semibold text-[#7A8495]">{item.desc}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${notificationSettings[item.key] ? 'bg-[#0D6BEA] text-white' : 'bg-[#F1F3F6] text-[#596273]'}`}>
                        {notificationSettings[item.key] ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={saveAccountSettings} className="mt-6 rounded-lg bg-[#0D6BEA] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0959C7]">
                계정 설정 저장
              </button>
            </section>
          ) : activeMenu !== '내 프로필' ? (
            <div className="rounded-xl border border-[#DDE3EA] bg-white p-8 text-center shadow-sm">
              <CheckCircle2 size={36} className="mx-auto text-[#0D6BEA]" />
              <h2 className="mt-4 text-xl font-extrabold">{activeMenu}</h2>
            </div>
          ) : (
            <>
              <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">기본 정보</h2>
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[#D7DDE5] px-3 py-2 text-sm font-bold hover:bg-[#F8FAFC]">
                    <Camera size={16} />
                    사진 변경
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">이름</span>
                    <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={profileForm.name} onChange={event => updateForm('name', event.target.value)} onKeyDown={event => {
                      if (event.key === 'Enter') handleSave();
                    }} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">생년월일</span>
                    <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={profileForm.birthDate} onChange={event => updateForm('birthDate', event.target.value)} onKeyDown={event => {
                      if (event.key === 'Enter') handleSave();
                    }} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">성별</span>
                    <select className="w-full rounded-lg border border-[#DCEAF3] bg-white px-3 py-3 text-sm" value={profileForm.gender} onChange={event => updateForm('gender', event.target.value)}>
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                      <option value="선택 안함">선택 안함</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">이메일</span>
                    <div className="relative">
                      <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 pr-10 text-sm" value={profileForm.email} onChange={event => updateForm('email', event.target.value)} onKeyDown={event => {
                        if (event.key === 'Enter') handleSave();
                      }} />
                      <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8495]" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">전화번호</span>
                    <div className="relative">
                      <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 pr-10 text-sm" value={profileForm.phone} onChange={event => updateForm('phone', event.target.value)} onKeyDown={event => {
                        if (event.key === 'Enter') handleSave();
                      }} />
                      <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8495]" />
                    </div>
                  </label>
                  <label className="relative block">
                    <span className="mb-2 block text-sm font-bold">현재 거주지역</span>
                    <button
                      type="button"
                      onClick={() => setIsRegionOpen(prev => !prev)}
                      className="flex w-full items-center justify-between rounded-lg border border-[#DCEAF3] bg-white px-3 py-3 text-left text-sm"
                    >
                      {profileForm.currentRegion}
                      <span className="text-[#7A8495]">⌄</span>
                    </button>
                    {isRegionOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-[#DCEAF3] bg-white shadow-lg">
                        {regionOptions.map(region => (
                          <button
                            type="button"
                            key={region}
                            onClick={() => {
                              updateForm('currentRegion', region);
                              setIsRegionOpen(false);
                            }}
                            className={`block w-full px-3 py-2.5 text-left text-sm hover:bg-[#F4F8FC] ${
                              profileForm.currentRegion === region ? 'bg-[#E4EFFF] font-bold text-[#0D6BEA]' : 'text-[#111827]'
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    )}
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-lg font-extrabold">희망 조건</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">희망 직무</span>
                    <input
                      className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm"
                      value={profileForm.preferredRole}
                      onChange={event => updateForm('preferredRole', event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') handleSave();
                      }}
                      placeholder="예: 백엔드 개발자"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">고용형태</span>
                    <select className="w-full rounded-lg border border-[#DCEAF3] bg-white px-3 py-3 text-sm" value={profileForm.employmentType} onChange={event => updateForm('employmentType', event.target.value)}>
                      <option value="" disabled>고용형태 선택</option>
                      <option>정규직</option>
                      <option>계약직</option>
                      <option>아르바이트</option>
                      <option>인턴</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">희망 연봉</span>
                    <input
                      className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm"
                      value={profileForm.salary}
                      onChange={event => updateForm('salary', event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') handleSave();
                      }}
                      placeholder="예: 4,000"
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-bold">근무 방식</p>
                  <div className="flex flex-wrap gap-2">
                    {workTypes.map(workType => (
                      <button
                        type="button"
                        key={workType}
                        onClick={() => toggleWorkType(workType)}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                          profileForm.workTypes.includes(workType) ? 'bg-[#0D6BEA] text-white' : 'bg-[#F1F3F6] text-black'
                        }`}
                      >
                        {workType}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#DDE3EA] bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-lg font-extrabold">자기소개</h2>
                <textarea
                  value={profileForm.introduction}
                  onChange={event => updateForm('introduction', event.target.value.slice(0, maxIntroLength))}
                  rows={6}
                  placeholder="자기소개를 입력하세요."
                  className="w-full resize-none rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D6BEA]/15"
                />
                <p className="mt-2 text-right text-sm font-bold text-[#7A8495]">{profileForm.introduction.length} / {maxIntroLength}자</p>
              </section>
            </>
          )}
        </section>
      </main>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#0D6BEA]">프로필 미리보기</p>
                <h2 className="mt-1 text-2xl font-extrabold">{profileForm.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[#7A8495]">{profileForm.preferredRole}</p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg border border-[#D7DDE5] px-3 py-2 text-sm font-bold">
                닫기
              </button>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <p><b>전화번호</b> {profileForm.phone}</p>
              <p><b>이메일</b> {profileForm.email || '미입력'}</p>
              <p><b>현재 거주지역</b> {profileForm.currentRegion}</p>
              <p><b>근무 방식</b> {profileForm.workTypes.join(', ')}</p>
              <p className="whitespace-pre-line"><b>자기소개</b><br />{profileForm.introduction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
