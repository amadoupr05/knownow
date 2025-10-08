import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

function ContentView() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h1>
        <button className="flex items-center px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Contenu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher du contenu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder content cards */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Cours de Mathématiques</h3>
              <p className="text-sm text-gray-500 mt-1">Dernière mise à jour: 12/03/2024</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Cours de Physique</h3>
              <p className="text-sm text-gray-500 mt-1">Dernière mise à jour: 10/03/2024</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Cours de Chimie</h3>
              <p className="text-sm text-gray-500 mt-1">Dernière mise à jour: 08/03/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentView;