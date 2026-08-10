import { useState } from 'react';
import type { CurrentUser, Page, RegisterFormData, UserRole } from '@/app/types';
import { mockAdminUser, mockCorporateUser, mockUser } from '@/app/data/mockData';
import { Navbar } from '@/app/layout/Navbar';
import { Footer } from '@/app/layout/Footer';
import { MainPage } from '@/app/pages/home/MainPage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { RegisterPage } from '@/app/pages/auth/RegisterPage';
import { AdminPage } from '@/app/pages/admin/AdminPage';
import { ProfilePage } from '@/app/pages/profile/ProfilePage';
import { JobsPage } from '@/app/pages/jobs/JobsPage';

// MARKER-MAKE-KIT-INVOKED
const noNavPages: Page[] = ['login', 'register'];
const registeredUserStorageKey = 'jobBridgeRegisteredUser';
const autoLoginStorageKey = 'jobBridgeAutoLogin';

interface AutoLoginSession {
  role: UserRole;
  loginId?: string;
}

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

const createUserFromForm = (role: UserRole, formData: RegisterFormData): CurrentUser => ({
  role,
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

const getMockUserByRole = (role: UserRole): CurrentUser => {
  if (role === 'admin') return mockAdminUser;
  if (role === 'corporate') return mockCorporateUser;
  return mockUser;
};

const getAutoLoggedInUser = (registeredUser: RegisterFormData | null): CurrentUser | null => {
  const session = loadAutoLoginSession();
  if (!session) return null;

  if (session.role === 'personal' && session.loginId && registeredUser?.loginId.trim() === session.loginId) {
    return createUserFromForm('personal', registeredUser);
  }

  if (session.role === 'personal' && session.loginId === 'demo') {
    return mockUser;
  }

  if (session.role === 'admin' || session.role === 'corporate') {
    return getMockUserByRole(session.role);
  }

  clearAutoLoginSession();
  return null;
};

export default function App() {
  const [registeredUser, setRegisteredUser] = useState<RegisterFormData | null>(() => loadRegisteredUser());
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getAutoLoggedInUser(registeredUser));
  const [currentPage, setCurrentPage] = useState<Page>(() => (getAutoLoggedInUser(registeredUser) ? 'user-dashboard' : 'main'));
  const [pageHistory, setPageHistory] = useState<Page[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['1', '2']));

  const navigate = (page: Page) => {
    if (page !== currentPage) {
      setPageHistory(prev => [...prev, currentPage]);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    const previousPage = pageHistory[pageHistory.length - 1] || 'main';
    setPageHistory(prev => prev.slice(0, -1));
    setCurrentPage(previousPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (formData: RegisterFormData) => {
    setRegisteredUser(formData);
    localStorage.setItem(registeredUserStorageKey, JSON.stringify(formData));
  };

  const handleResetPassword = (newPassword: string) => {
    setRegisteredUser(prev => {
      if (!prev) return prev;

      const updatedUser = { ...prev, password: newPassword };
      localStorage.setItem(registeredUserStorageKey, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleLogin = (role: UserRole, formData?: RegisterFormData, keepLoggedIn = false) => {
    if (!keepLoggedIn) {
      clearAutoLoginSession();
    }

    if (formData) {
      if (keepLoggedIn) saveAutoLoginSession({ role, loginId: formData.loginId.trim() });
      setCurrentUser(createUserFromForm(role, formData));
      return;
    }

    if (role === 'personal' && registeredUser) {
      if (keepLoggedIn) saveAutoLoginSession({ role, loginId: registeredUser.loginId.trim() });
      setCurrentUser(createUserFromForm(role, registeredUser));
      return;
    }

    if (keepLoggedIn) saveAutoLoginSession({ role, loginId: role === 'personal' ? 'demo' : undefined });
    setCurrentUser(getMockUserByRole(role));
  };

  const handleLogout = () => {
    clearAutoLoginSession();
    setCurrentUser(null);
    setPageHistory([]);
    setCurrentPage('main');
  };

  const handleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showNavFooter = !noNavPages.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} />;

      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} registeredUser={registeredUser} onBack={handleBack} onResetPassword={handleResetPassword} />;

      case 'register':
        return <RegisterPage navigate={navigate} onRegister={handleRegister} onBack={handleBack} />;

      case 'admin':
        return <AdminPage />;

      case 'user-dashboard':
      case 'corporate':
        return <ProfilePage currentUser={currentUser} />;

      case 'jobs':
        return <JobsPage navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} />;

      case 'saved':
        return <JobsPage mode="saved" navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} />;

      case 'ai-recommend':
        return <JobsPage mode="recommended" navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} />;

      default:
        return <MainPage navigate={navigate} bookmarks={bookmarks} onBookmark={handleBookmark} />;
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
        />
      )}

      <main className="flex-1">
        {renderPage()}
      </main>

      {showNavFooter && currentPage !== 'user-dashboard' && currentPage !== 'corporate' && currentPage !== 'admin' && (
        <Footer navigate={navigate} />
      )}
    </div>
  );
}
