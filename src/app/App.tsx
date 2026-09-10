import { useEffect, useState } from 'react';
import type { ApplicationFormData, CorporateRegisterFormData, CurrentUser, Page, RegisterFormData, UserRole } from '@/app/types';
import { mockAdminUser, mockCorporateUser, mockUser } from '@/app/data/mockData';
import { Navbar } from '@/app/layout/Navbar';
import { Footer } from '@/app/layout/Footer';
import { MainPage } from '@/app/pages/home/MainPage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { RegisterPage } from '@/app/pages/auth/RegisterPage';
import { ProfilePage } from '@/app/pages/profile/ProfilePage';
import { JobDetailPage } from '@/app/pages/jobs/JobDetailPage';
import { JobsPage } from '@/app/pages/jobs/JobsPage';
import { AiJobRecommendationPage } from '@/app/pages/jobs/AiJobRecommendationPage';
import { SupportPage } from '@/app/pages/support/SupportPage';
import { CommunityPage, GuidePage } from '@/app/pages/info/InfoPages';
import { CorporatePage } from '@/app/pages/corporate/CorporatePage';
import {
  getCurrentMember,
  loginMember,
  logoutMember,
  registerMember,
  type LoginMember,
} from '@/app/api/memberApi';
import type { ApiJobSeekerProfile } from '@/app/api/profileApi';

// MARKER-MAKE-KIT-INVOKED
const noNavPages: Page[] = ['login', 'register'];
const registeredUserStorageKey = 'jobBridgeRegisteredUser';
const registeredCorporateUserStorageKey = 'jobBridgeRegisteredCorporateUser';
const autoLoginStorageKey = 'jobBridgeAutoLogin';
const currentPageStorageKey = 'jobBridgeCurrentPage';
const currentJobStorageKey = 'jobBridgeCurrentJob';
const appliedJobsStorageKey = 'jobBridgeAppliedJobs';
const applicationFormsStorageKey = 'jobBridgeApplicationForms';
const pendingApplicationStorageKey = 'jobBridgePendingApplicationJob';
const pageValues: Page[] = [
  'main',
  'login',
  'register',
  'user-dashboard',
  'jobs',
  'job-detail',
  'saved',
  'applications',
  'ai-recommend',
  'community',
  'guide',
  'support',
  'corporate',
];

interface AutoLoginSession {
  role: UserRole;
  loginId?: string;
}

interface LoginCredentials {
  loginId: string;
  password: string;
}

const toCurrentUser = (member: LoginMember): CurrentUser => ({
  role: member.role === 'ADMIN'
    ? 'admin'
    : member.role === 'COMPANY' || member.role === 'CORPORATE' || member.role === 'EMPLOYER'
      ? 'corporate'
      : 'personal',
  name: member.name,
  id: String(member.id),
  avatar: member.name.slice(0, 1),
  loginId: member.loginId,
  memberRole: member.role === 'ADMIN' ? 'ADMIN' : member.role === 'COMPANY' ? 'COMPANY' : 'JOB_SEEKER',
  status: 'ACTIVE',
});

const loadRegisteredUser = (): RegisterFormData | null => {
  if (typeof window === 'undefined') return null;

  const savedUser = localStorage.getItem(registeredUserStorageKey);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as RegisterFormData;
  } catch {
    localStorage.removeItem(registeredUserStorageKey);
    return null;
  }
};

const loadRegisteredCorporateUser = (): CorporateRegisterFormData | null => {
  if (typeof window === 'undefined') return null;

  const savedUser = localStorage.getItem(registeredCorporateUserStorageKey);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as CorporateRegisterFormData;
  } catch {
    localStorage.removeItem(registeredCorporateUserStorageKey);
    return null;
  }
};

const loadAutoLoginSession = (): AutoLoginSession | null => {
  if (typeof window === 'undefined') return null;

  const savedSession = localStorage.getItem(autoLoginStorageKey);
  if (!savedSession) return null;

  try {
    return JSON.parse(savedSession) as AutoLoginSession;
  } catch {
    localStorage.removeItem(autoLoginStorageKey);
    return null;
  }
};

const saveAutoLoginSession = (session: AutoLoginSession) => {
  localStorage.setItem(autoLoginStorageKey, JSON.stringify(session));
};

const clearAutoLoginSession = () => {
  localStorage.removeItem(autoLoginStorageKey);
  localStorage.removeItem('savedLoginId');
};

const loadCurrentPage = (): Page | null => {
  if (typeof window === 'undefined') return null;

  const savedPage = localStorage.getItem(currentPageStorageKey);
  if (!savedPage) return null;

  return pageValues.includes(savedPage as Page) ? (savedPage as Page) : null;
};

const saveCurrentPage = (page: Page) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(currentPageStorageKey, page);
};

const loadCurrentJobId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(currentJobStorageKey);
};

const saveCurrentJobId = (jobId?: string) => {
  if (typeof window === 'undefined') return;
  if (jobId) localStorage.setItem(currentJobStorageKey, jobId);
};

const normalizeJobId = (id: string) => id.replace(/^job-/, '');

const loadAppliedJobIds = () => {
  if (typeof window === 'undefined') return new Set<string>();

  const savedJobs = localStorage.getItem(appliedJobsStorageKey);
  if (!savedJobs) return new Set<string>();

  try {
    const parsedJobs = JSON.parse(savedJobs) as string[];
    return new Set(parsedJobs.map(normalizeJobId));
  } catch {
    localStorage.removeItem(appliedJobsStorageKey);
    return new Set<string>();
  }
};

const saveAppliedJobIds = (jobIds: Set<string>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(appliedJobsStorageKey, JSON.stringify(Array.from(jobIds).map(normalizeJobId)));
};

const loadApplicationForms = () => {
  if (typeof window === 'undefined') return {} as Record<string, ApplicationFormData>;

  const savedForms = localStorage.getItem(applicationFormsStorageKey);
  if (!savedForms) return {} as Record<string, ApplicationFormData>;

  try {
    const parsedForms = JSON.parse(savedForms) as Record<string, ApplicationFormData>;
    return Object.fromEntries(
      Object.entries(parsedForms).map(([jobId, form]) => [normalizeJobId(jobId), form]),
    ) as Record<string, ApplicationFormData>;
  } catch {
    localStorage.removeItem(applicationFormsStorageKey);
    return {} as Record<string, ApplicationFormData>;
  }
};

const saveApplicationForms = (forms: Record<string, ApplicationFormData>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(applicationFormsStorageKey, JSON.stringify(forms));
};

const loadPendingApplicationJobId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(pendingApplicationStorageKey);
};

const savePendingApplicationJobId = (jobId: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(pendingApplicationStorageKey, jobId);
};

const clearPendingApplicationJobId = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(pendingApplicationStorageKey);
};

const createUserFromForm = (role: UserRole, formData: RegisterFormData): CurrentUser => ({
  role,
  memberRole: role === 'admin' ? 'ADMIN' : 'JOB_SEEKER',
  status: 'ACTIVE',
  name: formData.name.trim() || '구직자',
  id: formData.loginId.trim() || 'new_user',
  avatar: (formData.name.trim() || '회').slice(0, 1),
  loginId: formData.loginId,
  email: formData.email,
  phone: formData.phone,
  currentRegion: formData.currentRegion,
  birthDate: formData.birthDate,
  gender: formData.gender,
  preferredRole: formData.preferredRole,
});

const createCorporateUserFromForm = (formData: CorporateRegisterFormData): CurrentUser => ({
  role: 'corporate',
  memberRole: 'COMPANY',
  status: 'ACTIVE',
  name: `${formData.companyName.trim()} 채용담당자`,
  id: formData.loginId.trim() || 'corporate_user',
  avatar: (formData.companyName.trim() || 'C').slice(0, 1),
  loginId: formData.loginId,
  email: formData.email,
  phone: formData.phone,
  companyProfile: {
    companyName: formData.companyName,
    businessNumber: formData.businessNumber,
    representativeName: formData.representativeName || formData.managerName,
    industry: formData.industry,
    companyAddress: formData.companyAddress || '',
    companyDetailAddress: formData.companyDetailAddress,
    companyPhone: formData.companyPhone,
    websiteUrl: formData.websiteUrl,
    companyDescription: formData.companyDescription,
    employeeCount: formData.employeeCount ? Number(formData.employeeCount) : undefined,
    establishedDate: formData.establishedDate,
    verificationStatus: formData.verificationStatus || 'PENDING',
  },
});

const getMockUserByRole = (role: UserRole): CurrentUser => {
  if (role === 'corporate') return mockCorporateUser;
  if (role === 'admin') return mockAdminUser;
  return mockUser;
};

const getAutoLoggedInUser = (
  registeredUser: RegisterFormData | null,
  registeredCorporateUser: CorporateRegisterFormData | null,
): CurrentUser | null => {
  const session = loadAutoLoginSession();
  if (!session) return null;

  if (session.role === 'personal' && session.loginId && registeredUser?.loginId.trim() === session.loginId) {
    return createUserFromForm('personal', registeredUser);
  }

  if (session.role === 'personal' && session.loginId === 'demo') {
    return mockUser;
  }

  if (session.role === 'corporate' || session.role === 'admin') {
    if (session.role === 'corporate' && session.loginId && registeredCorporateUser?.loginId.trim() === session.loginId) {
      return createCorporateUserFromForm(registeredCorporateUser);
    }

    return getMockUserByRole(session.role);
  }

  clearAutoLoginSession();
  return null;
};

export default function App() {
  const [registeredUser, setRegisteredUser] = useState<RegisterFormData | null>(() => loadRegisteredUser());
  const [registeredCorporateUser, setRegisteredCorporateUser] = useState<CorporateRegisterFormData | null>(() => loadRegisteredCorporateUser());
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getAutoLoggedInUser(registeredUser, registeredCorporateUser));
  const [currentPage, setCurrentPage] = useState<Page>(() => loadCurrentPage() || 'main');
  const [currentJobId, setCurrentJobId] = useState<string | null>(() => loadCurrentJobId());
  const [pageHistory, setPageHistory] = useState<Page[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => loadAppliedJobIds());
  const [applicationForms, setApplicationForms] = useState<Record<string, ApplicationFormData>>(() => loadApplicationForms());
  const [pendingApplicationJobId, setPendingApplicationJobId] = useState<string | null>(() => loadPendingApplicationJobId());
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  useEffect(() => {
    getCurrentMember()
      .then(member => {
        if (member) setCurrentUser(toCurrentUser(member));
        else if (currentUser?.role === 'personal') setCurrentUser(null);
      })
      .catch(() => {
        if (currentUser?.role === 'personal') setCurrentUser(null);
      });
  }, []);

  const navigate = (page: Page, jobId?: string) => {
    if (page !== currentPage) {
      setPageHistory(prev => [...prev, currentPage]);
    }
    if (jobId) {
      setCurrentJobId(jobId);
      saveCurrentJobId(jobId);
    }
    saveCurrentPage(page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    const previousPage = pageHistory[pageHistory.length - 1] || 'main';
    setPageHistory(prev => prev.slice(0, -1));
    saveCurrentPage(previousPage);
    setCurrentPage(previousPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = async (role: UserRole, formData: RegisterFormData | CorporateRegisterFormData) => {
    if (role === 'corporate') {
      const corporateForm = formData as CorporateRegisterFormData;
      setRegisteredCorporateUser(corporateForm);
      localStorage.setItem(registeredCorporateUserStorageKey, JSON.stringify(corporateForm));
      return;
    }

    const personalForm = formData as RegisterFormData;
    await registerMember(personalForm, personalForm.password);
    setRegisteredUser(personalForm);
    localStorage.setItem(registeredUserStorageKey, JSON.stringify(personalForm));
  };

  const handleResetPassword = (newPassword: string) => {
    setRegisteredUser(prev => {
      if (!prev) return prev;

      const updatedUser = { ...prev, password: newPassword };
      localStorage.setItem(registeredUserStorageKey, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleLogin = async (
    role: UserRole,
    formData?: RegisterFormData | CorporateRegisterFormData,
    keepLoggedIn = false,
    credentials?: LoginCredentials,
  ) => {
    if (role === 'personal' && credentials) {
      const member = await loginMember(credentials.loginId, credentials.password);
      if (keepLoggedIn) saveAutoLoginSession({ role: 'personal', loginId: member.loginId });
      else clearAutoLoginSession();
      setCurrentUser(toCurrentUser(member));
      return;
    }

    if (formData && role === 'personal') {
      const personalForm = formData as RegisterFormData;
      saveAutoLoginSession({ role, loginId: personalForm.loginId.trim() });
      setCurrentUser(createUserFromForm(role, personalForm));
      return;
    }

    if (formData && role === 'corporate') {
      const corporateForm = formData as CorporateRegisterFormData;
      saveAutoLoginSession({ role, loginId: corporateForm.loginId.trim() });
      setCurrentUser(createCorporateUserFromForm(corporateForm));
      return;
    }

    if (role === 'corporate' && registeredCorporateUser) {
      saveAutoLoginSession({ role, loginId: registeredCorporateUser.loginId.trim() });
      setCurrentUser(createCorporateUserFromForm(registeredCorporateUser));
      return;
    }

    if (role === 'personal' && registeredUser) {
      saveAutoLoginSession({ role, loginId: registeredUser.loginId.trim() });
      setCurrentUser(createUserFromForm(role, registeredUser));
      return;
    }

    saveAutoLoginSession({ role, loginId: role === 'personal' ? 'demo' : undefined });
    setCurrentUser(getMockUserByRole(role));
  };

  const handleLogout = async () => {
    try {
      if (currentUser?.role === 'personal') await logoutMember();
    } finally {
      clearAutoLoginSession();
      setCurrentUser(null);
      setPageHistory([]);
      saveCurrentPage('main');
      setCurrentPage('main');
    }
  };

  const handleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApplyJob = (id: string, formData: ApplicationFormData) => {
    const normalizedJobId = normalizeJobId(id);
    setAppliedJobIds(prev => {
      const next = new Set(prev);
      next.add(normalizedJobId);
      saveAppliedJobIds(next);
      return next;
    });
    setApplicationForms(prev => {
      const next = {
        ...prev,
        [normalizedJobId]: {
          ...formData,
          applicationStatus: formData.applicationStatus || 'APPLIED',
          submittedAt: formData.submittedAt || new Date().toISOString(),
          updatedAt: formData.updatedAt || new Date().toISOString(),
        },
      };
      saveApplicationForms(next);
      return next;
    });
  };

  const handleUpdateApplication = (id: string, formData: ApplicationFormData) => {
    const normalizedJobId = normalizeJobId(id);
    setApplicationForms(prev => {
      const next = {
        ...prev,
        [normalizedJobId]: {
          ...formData,
          applicationStatus: formData.applicationStatus || prev[normalizedJobId]?.applicationStatus || 'APPLIED',
          submittedAt: prev[normalizedJobId]?.submittedAt || formData.submittedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      saveApplicationForms(next);
      return next;
    });
  };

  const handleDeleteApplication = (id: string) => {
    const normalizedJobId = normalizeJobId(id);
    setAppliedJobIds(prev => {
      const next = new Set(prev);
      next.delete(normalizedJobId);
      saveAppliedJobIds(next);
      return next;
    });
    setApplicationForms(prev => {
      const next = { ...prev };
      delete next[normalizedJobId];
      saveApplicationForms(next);
      return next;
    });
  };

  const handleRequireLoginForApply = (id: string) => {
    const normalizedJobId = id.replace(/^job-/, '');
    setPendingApplicationJobId(normalizedJobId);
    savePendingApplicationJobId(normalizedJobId);
    navigate('login', `job-${normalizedJobId}`);
  };

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'personal' && pendingApplicationJobId) {
      const normalizedJobId = pendingApplicationJobId.replace(/^job-/, '');
      setPendingApplicationJobId(null);
      clearPendingApplicationJobId();
      navigate('job-detail', `job-${normalizedJobId}`);
      return;
    }

    if (role === 'corporate') {
      setPendingApplicationJobId(null);
      clearPendingApplicationJobId();
      navigate('corporate');
      return;
    }

    navigate('main');
  };

  const handleHeaderSearch = (query: string) => {
    setHeaderSearchQuery(query.trim());
    navigate('jobs');
  };

  const handleProfileSaved = (profile: ApiJobSeekerProfile) => {
    setCurrentUser(previous => previous ? {
      ...previous,
      name: profile.name,
      avatar: profile.name.trim().slice(0, 1) || previous.avatar,
      email: profile.email,
      phone: profile.phone,
      currentRegion: profile.residenceRegion || previous.currentRegion,
      preferredRole: profile.desiredJob || previous.preferredRole,
      remotePreferred: Boolean(profile.remotePreferred),
      flexiblePreferred: Boolean(profile.flexiblePreferred),
    } : previous);
  };

  const showNavFooter = !noNavPages.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} onSearch={handleHeaderSearch} />;

      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} onLoginSuccess={handleLoginSuccess} registeredUser={registeredUser} registeredCorporateUser={registeredCorporateUser} onBack={handleBack} onResetPassword={handleResetPassword} />;

      case 'register':
        return <RegisterPage navigate={navigate} onRegister={handleRegister} onBack={handleBack} />;

      case 'job-detail': {
        const normalizedJobId = normalizeJobId(currentJobId || '1');
        return (
          <JobDetailPage
            jobId={currentJobId}
            currentUser={currentUser}
            navigate={navigate}
            bookmarked={bookmarks.has(`job-${normalizedJobId}`)}
            applied={appliedJobIds.has(normalizedJobId)}
            onBookmark={handleBookmark}
            onApply={handleApplyJob}
            onRequireLoginForApply={handleRequireLoginForApply}
          />
        );
      }

      case 'user-dashboard':
      case 'applications':
        return (
          <ProfilePage
            currentUser={currentUser}
            navigate={navigate}
            bookmarks={bookmarks}
            appliedJobIds={appliedJobIds}
            applicationForms={applicationForms}
            onProfileSaved={handleProfileSaved}
            initialMenu={currentPage === 'applications' ? '지원 현황' : '내 프로필'}
            onBookmark={handleBookmark}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        );

      case 'corporate':
        return (
          <CorporatePage
            currentUser={currentUser}
            navigate={navigate}
            appliedJobIds={appliedJobIds}
            applicationForms={applicationForms}
          />
        );

      case 'jobs':
        return <JobsPage mode="recommended" navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} initialQuery={headerSearchQuery} />;

      case 'ai-recommend':
        return <AiJobRecommendationPage currentUser={currentUser} navigate={navigate} />;

      case 'saved':
        return <JobsPage mode="saved" navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} initialQuery={headerSearchQuery} />;

      case 'community':
        return <CommunityPage />;

      case 'guide':
        return <GuidePage navigate={navigate} />;

      case 'support':
        return <SupportPage currentUser={currentUser} />;

      default:
        return <MainPage navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} onSearch={handleHeaderSearch} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showNavFooter && (
        <Navbar
          currentPage={currentPage}
          navigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSearch={handleHeaderSearch}
        />
      )}

      <main className="flex-1">
        {renderPage()}
      </main>

      {showNavFooter && currentPage !== 'user-dashboard' && currentPage !== 'corporate' && currentPage !== 'applications' && (
        <Footer navigate={navigate} />
      )}
    </div>
  );
}
