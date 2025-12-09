import React from 'react';
import Header from './components/Header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Favorites from './pages/favourites';
import Planner from './pages/planner';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <main>
        {currentPage === 'home' && <Home user={user} />}
        {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
        {currentPage === 'register' && <Register onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
        {currentPage === 'favorites' && <Favorites user={user} />}
        {currentPage === 'planner' && <Planner user={user} />}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">🍽️ MoodBite - Cook by Mood</p>
          <p className="text-gray-400 text-sm">© 2024 MoodBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
