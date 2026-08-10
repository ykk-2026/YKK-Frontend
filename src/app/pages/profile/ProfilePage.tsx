import { useState } from 'react';
import {
  Bell,
  Bookmark,
  Briefcase,
  Camera,
  CheckCircle2,
  FileText,
  Lock,
  Mail,
  Phone,
  Save,
  UserRound,
} from 'lucide-react';
import type { CurrentUser } from '@/app/types';

interface ProfilePageProps {
  currentUser: CurrentUser | null;
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

export function ProfilePage({ currentUser }: ProfilePageProps) {
  const initialName = currentUser?.name || '김민준';
  const initialAvatar = currentUser?.avatar || initialName.slice(0, 1);
  const [activeMenu, setActiveMenu] = useState('내 프로필');
  const [savedMessage, setSavedMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
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

  const panelText: Record<string, string> = {
    '이력서 관리': '대표 이력서를 관리할 수 있습니다.',
    '지원 현황': '지원한 공고와 진행 상태를 확인할 수 있습니다.',
    '관심 공고': '저장한 공고 목록을 확인할 수 있습니다.',
    'AI 추천 결과': '프로필 기준 추천 공고와 적합도를 확인할 수 있습니다.',
    '계정 설정': '로그인 정보와 알림 설정을 관리할 수 있습니다.',
  };

  return (
    <div className="min-h-screen bg-[#F3F7FF] text-[#111827]">
      <main className="mx-auto grid max-w-[1256px] gap-5 px-5 py-5 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[#DDE3EA] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E7ECF2] pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0D6BEA] text-2xl font-extrabold text-white">
              {initialAvatar}
            </div>
            <div>
              <p className="text-lg font-extrabold">{profileForm.name}</p>
              <p className="text-sm font-semibold text-[#7A8495]">{profileForm.preferredRole}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setActiveMenu(item.label);
                    setSavedMessage('');
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-bold ${
                    activeMenu === item.label ? 'bg-[#E4EFFF] text-[#0D6BEA]' : 'text-[#344054] hover:bg-[#F8FAFC]'
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

          {activeMenu !== '내 프로필' ? (
            <div className="rounded-xl border border-[#DDE3EA] bg-white p-8 text-center shadow-sm">
              <CheckCircle2 size={36} className="mx-auto text-[#0D6BEA]" />
              <h2 className="mt-4 text-xl font-extrabold">{activeMenu}</h2>
              <p className="mt-2 text-sm font-semibold text-[#7A8495]">{panelText[activeMenu]}</p>
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
                    <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={profileForm.name} onChange={event => updateForm('name', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">생년월일</span>
                    <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 text-sm" value={profileForm.birthDate} onChange={event => updateForm('birthDate', event.target.value)} />
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
                      <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 pr-10 text-sm" value={profileForm.email} onChange={event => updateForm('email', event.target.value)} />
                      <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8495]" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">전화번호</span>
                    <div className="relative">
                      <input className="w-full rounded-lg border border-[#DCEAF3] px-3 py-3 pr-10 text-sm" value={profileForm.phone} onChange={event => updateForm('phone', event.target.value)} />
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
