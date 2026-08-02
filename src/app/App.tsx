import { useState } from 'react';
import type { Page, CurrentUser, UserRole } from '@/app/types';
import { mockUser, mockCorporateUser, mockAdminUser } from '@/app/data/mockData';
import { Navbar } from '@/app/layout/Navbar';
import { Footer } from '@/app/layout/Footer';
import { MainPage } from '@/app/pages/home/MainPage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { RegisterPage } from '@/app/pages/auth/RegisterPage';
import { AdminPage } from '@/app/pages/admin/AdminPage';
import { ProfilePage } from '@/app/pages/profile/ProfilePage';

// MARKER-MAKE-KIT-INVOKED
const noNavPages: Page[] = ['login', 'register'];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['1', '2']));

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (role: UserRole) => {
    if (role === 'admin') setCurrentUser(mockAdminUser);
    else if (role === 'corporate') setCurrentUser(mockCorporateUser);
    else setCurrentUser(mockUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;

      case 'register':
        return <RegisterPage navigate={navigate} onLogin={handleLogin} />;

      case 'admin':
        return <AdminPage />;

      case 'user-dashboard':
      case 'corporate':
        return <ProfilePage currentUser={currentUser} />;

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
