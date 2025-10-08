import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

type DifficultyLevel = 'Débutant' | 'Progressif' | 'Moyen' | 'Difficile' | 'Approfondi' | 'Légende';

interface Homework {
  id: string;
  title: string;
  subject: string;
  level: string;
  difficulty: DifficultyLevel;
  devoir_date: string;
  instructions: string;
  exercise_count: number;
  created_at: string;
}

function HomeworksManagerView() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: '',
    difficulty: '' as DifficultyLevel | '',
    devoir_date: '',
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
    loadHomeworks();
  }, []);

  const loadHomeworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('homeworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHomeworks(data || []);
    } catch (error) {
      console.error('Error loading homeworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingHomework) {
        const { error } = await supabase
          .from('homeworks')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingHomework.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('homeworks')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      loadHomeworks();
    } catch (error) {
      console.error('Error saving homework:', error);
    }
  };

  const handleEdit = (homework: Homework) => {
    setEditingHomework(homework);
    setFormData({
      title: homework.title,
      subject: homework.subject,
      level: homework.level,
      difficulty: homework.difficulty,
      devoir_date: homework.devoir_date,
      instructions: homework.instructions
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) return;

    try {
      const { error } = await supabase
        .from('homeworks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadHomeworks();
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      level: '',
      difficulty: '',
      devoir_date: '',
      instructions: ''
    });
    setEditingHomework(null);
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
            {editingHomework ? 'Modifier le devoir' : 'Nouveau devoir'}
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
                Titre du devoir *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: Devoir de mathématiques - Chapitre 3"
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
                Date du devoir
              </label>
              <input
                type="date"
                value={formData.devoir_date}
                onChange={(e) => setFormData({ ...formData, devoir_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
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
              placeholder="Instructions générales pour le devoir..."
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
              {editingHomework ? 'Mettre à jour' : 'Créer le devoir'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Devoirs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau devoir</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : homeworks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devoir</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre premier devoir</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
          >
            <Plus className="w-5 h-5" />
            <span>Créer un devoir</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworks.map((homework) => (
            <div key={homework.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{homework.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{homework.subject} - {homework.level}</p>
                    <p className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                        {homework.difficulty}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <div className="text-gray-500">Date du devoir</div>
                    <div className="font-medium text-gray-900">{homework.devoir_date ? new Date(homework.devoir_date).toLocaleDateString('fr-FR') : 'Non définie'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Exercices</div>
                    <div className="font-medium text-gray-900">{homework.exercise_count}</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(homework)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(homework.id)}
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

export default HomeworksManagerView;
