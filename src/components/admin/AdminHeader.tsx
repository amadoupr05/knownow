import React from 'react';
import { LogOut, Bell, User } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Retour à l'accueil
        </button>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;