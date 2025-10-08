import React from 'react';

interface AccountStepProps {
  formData: {
    username: string;
    password: string;
    passwordConfirm: string;
  };
  setFormData: (data: any) => void;
}

function AccountStep({ formData, setFormData }: AccountStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Création du compte</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom d'utilisateur souhaité
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
          minLength={6}
        />
        <p className="mt-1 text-sm text-gray-500">
          Le mot de passe doit contenir au moins 6 caractères
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          value={formData.passwordConfirm}
          onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        />
        {formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
          <p className="mt-1 text-sm text-red-500">
            Les mots de passe ne correspondent pas
          </p>
        )}
      </div>
    </div>
  );
}

export default AccountStep;