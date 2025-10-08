import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

type DifficultyLevel = 'Débutant' | 'Progressif' | 'Moyen' | 'Difficile' | 'Approfondi' | 'Légende';

interface Exam {
  id: string;
  title: string;
  subject: string;
  level: string;
  difficulty: DifficultyLevel;
  duration_minutes: number;
  total_points: number;
  instructions: string;
  exercise_count: number;
  created_at: string;
}

function ExamsManagerView() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: '',
    difficulty: '' as DifficultyLevel | '',
    duration_minutes: 0,
    total_points: 0,
    instructions: ''
  });

  const difficulties: DifficultyLevel[] = [
    'Débutant',
    'Progressif',
    'Moyen',
    'Difficile',
    'Approfondi',
    'Légende'
  ];

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingExam) {
        const { error } = await supabase
          .from('exams')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingExam.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('exams')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      loadExams();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subject: exam.subject,
      level: exam.level,
      difficulty: exam.difficulty,
      duration_minutes: exam.duration_minutes,
      total_points: exam.total_points,
      instructions: exam.instructions
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) return;

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      level: '',
      difficulty: '',
      duration_minutes: 0,
      total_points: 0,
      instructions: ''
    });
    setEditingExam(null);
    setShowForm(false);
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    const colors: Record<DifficultyLevel, string> = {
      'Débutant': 'bg-green-100 text-green-800',
      'Progressif': 'bg-blue-100 text-blue-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Difficile': 'bg-orange-100 text-orange-800',
      'Approfondi': 'bg-pink-100 text-pink-800',
      'Légende': 'bg-purple-100 text-purple-800'
    };
    return colors[difficulty];
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingExam ? 'Modifier l\'examen' : 'Nouvel examen'}
          </h1>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'examen *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: Examen de mathématiques - Trimestre 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: Mathématiques"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="6ème">6ème</option>
                <option value="5ème">5ème</option>
                <option value="4ème">4ème</option>
                <option value="3ème">3ème</option>
                <option value="Seconde">Seconde</option>
                <option value="Première">Première</option>
                <option value="Terminale">Terminale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté *
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              >
                <option value="">Sélectionner une difficulté</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: 120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points totaux
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.total_points}
                onChange={(e) => setFormData({ ...formData, total_points: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: 20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              rows={4}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              placeholder="Instructions générales pour l'examen..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
            >
              {editingExam ? 'Mettre à jour' : 'Créer l\'examen'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Examens</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel examen</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun examen</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre premier examen</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
          >
            <Plus className="w-5 h-5" />
            <span>Créer un examen</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{exam.subject} - {exam.level}</p>
                    <p className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Durée</div>
                    <div className="font-medium text-gray-900">{exam.duration_minutes} min</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Points</div>
                    <div className="font-medium text-gray-900">{exam.total_points}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Exercices</div>
                    <div className="font-medium text-gray-900">{exam.exercise_count}</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(exam)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamsManagerView;
