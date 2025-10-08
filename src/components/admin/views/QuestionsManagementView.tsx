import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import MathEditor from '../../math-editor/MathEditor';
import { supabase } from '../../../lib/supabase';

interface Question {
  id: string;
  text: string;
  figure_data: any;
  subject?: string;
  level?: string;
  module?: string;
  difficulty?: string;
  created_at: string;
}

function QuestionsManagementView() {
  const [showEditor, setShowEditor] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    loadQuestions();
  }, [showEditor]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  if (showEditor) {
    return (
      <div className="h-full">
        <div className="mb-4">
          <button
            onClick={() => setShowEditor(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour à la liste
          </button>
        </div>
        <MathEditor />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des questions</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Question
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
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <option value="all">Filtres</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Physique-Chimie">Physique-Chimie</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Figure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="line-clamp-1 max-w-xs">{question.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      question.figure_data && question.figure_data.length > 0
                        ? 'text-green-700 bg-green-100'
                        : 'text-gray-700 bg-gray-100'
                    }`}>
                      {question.figure_data && question.figure_data.length > 0 ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(question.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        sessionStorage.setItem('previewQuestionId', question.id);
                        window.location.href = '/quick-quiz';
                      }}
                      className="text-[#4F6D0B] hover:text-[#4F6D0B]/80"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {filteredQuestions.length} question{filteredQuestions.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsManagementView;
