import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ForgotPassword from './ForgotPassword';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Accès administrateur principal
    if (username === 'admin' && password === 'admin') {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'System',
        role: 'gestionnaire_general',
        username: 'admin'
      };
      sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
      sessionStorage.setItem('isAdmin', 'true');
      onClose();
      window.location.href = '/admin';
      return;
    }

    // Vérifier les autres administrateurs dans localStorage
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const admin = admins.find((a: any) => a.username === username && a.password === password);

    if (admin) {
      const adminUser = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        username: admin.username
      };
      sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
      sessionStorage.setItem('isAdmin', 'true');
      onClose();
      window.location.href = '/admin';
      return;
    }

    // Connexion utilisateur normal depuis la base de données
    try {
      const { data: users, error } = await supabase
        .from('local_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();

      if (error) {
        console.error('Login error:', error);
        setError('Erreur lors de la connexion');
        return;
      }

      if (users) {
        const userData = {
          id: users.id,
          firstName: users.first_name,
          lastName: users.last_name,
          userType: users.user_type,
          username: users.username
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        onClose();
        window.location.reload();
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur lors de la connexion');
    }
  };

  if (!isOpen) return null;

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onClose={onClose}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Connexion</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.location.href = '/register'}
                className="text-sm text-[#4F6D0B] hover:underline"
              >
                Créer un compte
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#4F6D0B] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90 transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginDialog;