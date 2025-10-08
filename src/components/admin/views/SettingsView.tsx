import React from 'react';
import { Save } from 'lucide-react';

function SettingsView() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <button className="flex items-center px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres Généraux</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'établissement
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  defaultValue="KN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  defaultValue="n.mady@bayaala.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 text-[#4F6D0B] focus:ring-[#4F6D0B] border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                  Activer les notifications par email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  className="h-4 w-4 text-[#4F6D0B] focus:ring-[#4F6D0B] border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 text-sm text-gray-700">
                  Activer les notifications par SMS
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;