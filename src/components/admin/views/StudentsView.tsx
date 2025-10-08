import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  current_class: string;
  school_name: string;
  user_type: string;
  created_at: string;
  email: string;
}

function StudentsView() {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('local_users')
        .select('*')
        .eq('user_type', 'élève')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.school_name && student.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un élève..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.current_class || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.school_name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(student.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-[#4F6D0B] hover:text-[#4F6D0B]/80">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsView;