import React, { useState } from 'react';
import { X, ChevronLeft, AlertCircle, User } from 'lucide-react';

interface ForgotPasswordProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

function ForgotPassword({ onClose, onBackToLogin }: ForgotPasswordProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <button
              onClick={onBackToLogin}
              className="mr-3 p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Mot de passe oublié
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                Instructions de réinitialisation envoyées à l'administrateur.
              </div>
              <button
                onClick={onBackToLogin}
                className="text-[#4F6D0B] hover:underline"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Entrez votre nom d'utilisateur pour réinitialiser votre mot de passe.
                  L'administrateur sera notifié et vous contactera pour la réinitialisation.
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F6D0B] text-white px-4 py-2 rounded-lg hover:bg-[#4F6D0B]/90 transition-colors"
              >
                Réinitialiser le mot de passe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;