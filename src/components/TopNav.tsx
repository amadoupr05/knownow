import React, { useState, useEffect } from 'react';
import LoginDialog from './auth/LoginDialog';
import { Home, Search } from 'lucide-react';

interface User {
  firstName: string;
  lastName: string;
  userType?: string;
}

interface TopNavProps {
  onViewChange?: (view: string) => void;
}

function TopNav({ onViewChange }: TopNavProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.href = '/';
  };

  const handleAdminClick = () => {
    sessionStorage.setItem('isAdmin', 'true');
    window.location.href = '/admin';
  };

  const getInitials = (user: User) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="flex items-center justify-between w-full px-4">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {!currentUser && (
          <>
            <button
              onClick={() => onViewChange?.('quick-quiz')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              Quiz Rapide
            </button>
            <button
              onClick={() => onViewChange?.('forum')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              À la une
            </button>
            <button
              onClick={() => onViewChange?.('contact')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              Nous contacter
            </button>
            <button
              onClick={() => onViewChange?.('teach-with-us')}
              className="px-4 py-2 text-sm font-medium text-white bg-[#4F6D0B] hover:bg-[#4F6D0B]/90 rounded-lg transition-colors"
            >
              Enseignez avec nous
            </button>
          </>
        )}
        {currentUser?.userType === 'élève' && (
          <>
            <button
              onClick={() => onViewChange?.('quick-quiz')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              Quiz Rapide
            </button>
            <button
              onClick={() => onViewChange?.('forum')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              À la une
            </button>
            <button
              onClick={() => onViewChange?.('contact')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
            >
              Nous contacter
            </button>
          </>
        )}
        {currentUser?.userType === 'enseignant' && (
          <button
            onClick={() => onViewChange?.('contact')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
          >
            Nous contacter
          </button>
        )}

        {currentUser ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full bg-[#4F6D0B] text-white flex items-center justify-center text-sm font-medium"
            >
              {getInitials(currentUser)}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLoginDialog(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
          >
            Connexion
          </button>
        )}
      </div>

      {showLoginDialog && (
        <LoginDialog
          isOpen={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
        />
      )}
    </div>
  );
}

export default TopNav;