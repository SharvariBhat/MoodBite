import React from 'react';

export default function Header({ user, onLogout, currentPage, onNavigate }) {
  return (
    <header className="bg-gradient-warm text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="text-3xl">🍽️</div>
          <h1 className="text-2xl font-bold">MoodBite</h1>
        </div>

        <nav className="hidden md:flex gap-6">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded transition ${
              currentPage === 'home' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
            }`}
            aria-label="Go to home"
          >
            Home
          </button>
          {user && (
            <>
              <button
                onClick={() => onNavigate('favorites')}
                className={`px-4 py-2 rounded transition ${
                  currentPage === 'favorites' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                aria-label="Go to favorites"
              >
                ❤️ Favorites
              </button>
              <button
                onClick={() => onNavigate('planner')}
                className={`px-4 py-2 rounded transition ${
                  currentPage === 'planner' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                aria-label="Go to meal planner"
              >
                📅 Planner
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <button
                onClick={onLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className={`px-4 py-2 rounded transition ${
                  currentPage === 'login' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                aria-label="Go to login"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-white text-primary-600 px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition"
                aria-label="Go to register"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
