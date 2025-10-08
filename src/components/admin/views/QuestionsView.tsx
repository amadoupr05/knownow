import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2 } from 'lucide-react';

function QuestionsView() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Base de Données des Questions</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulté</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DescID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Exo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* La table est vide pour l'instant */}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Aucune question dans la base de données
            </div>
          </div>
        </div>
      </div>

      {/* Modal de revue (caché par défaut) */}
      <div className="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Détails de la question</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Contenu</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Question</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Réponses proposées</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Réponse correcte</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Explication</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Astuces</h3>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsView;