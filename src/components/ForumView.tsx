import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, Search, TrendingUp, Plus, Eye } from 'lucide-react';
import ForumQuestionDialog from './ForumQuestionDialog';

function ForumView() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'Mathématiques',
    subject: '',
    level: ''
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data: questionsData, error } = await supabase
        .from('forum_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const questionsWithCounts = await Promise.all(
        (questionsData || []).map(async (question) => {
          const { count } = await supabase
            .from('forum_answers')
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id);

          return {
            ...question,
            answer_count: count || 0
          };
        })
      );

      setQuestions(questionsWithCounts);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Toutes', 'Mathématiques', 'Français', 'Physique-Chimie', 'Histoire-Géo', 'SVT', 'Anglais', 'Autre'];

  const handleAskQuestion = async () => {
    if (!newQuestion.title || !newQuestion.content) {
      alert('Veuillez remplir le titre et le contenu de votre question');
      return;
    }

    try {
      const currentUser = sessionStorage.getItem('currentUser');
      const userId = currentUser ? JSON.parse(currentUser).id : null;

      const { error } = await supabase
        .from('forum_questions')
        .insert([{
          ...newQuestion,
          user_id: userId
        }]);

      if (error) throw error;

      setShowAskDialog(false);
      setNewQuestion({ title: '', content: '', category: 'Mathématiques', subject: '', level: '' });
      loadQuestions();
      alert('Question publiée avec succès!');
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la publication');
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Forum Communautaire</h1>
        <p className="text-white/90">
          Posez vos questions, partagez vos connaissances et aidez les autres élèves
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          />
        </div>
        <button
          onClick={() => setShowAskDialog(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Poser une question</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#4F6D0B] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Chargement des questions...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white p-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600">
                Soyez le premier à poser une question dans cette catégorie!
              </p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <div
                key={question.id}
                onClick={() => setSelectedQuestion(question)}
                className="bg-white p-6 border hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium">
                        {question.category}
                      </span>
                      {question.subject && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                          {question.subject}
                        </span>
                      )}
                      {question.level && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                          {question.level}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {question.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {question.content}
                    </p>
                  </div>
                  {question.is_answered && (
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views_count || 0} vues</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{question.answer_count || 0} réponse{(question.answer_count || 0) > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <span>{new Date(question.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Règles du forum
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ Soyez respectueux et courtois envers les autres membres</li>
          <li>✓ Posez des questions claires et détaillées</li>
          <li>✓ Recherchez avant de poser une question (elle a peut-être déjà été répondue)</li>
          <li>✓ Marquez les réponses utiles et acceptez la meilleure réponse</li>
          <li>✗ Pas de spam, publicité ou contenu inapproprié</li>
        </ul>
      </div>

      {showAskDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Poser une question</h2>
              <button
                onClick={() => setShowAskDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la question *
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  placeholder="Ex: Comment résoudre une équation du second degré?"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                >
                  {categories.filter(c => c !== 'Toutes').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    placeholder="Ex: Algèbre"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau (optionnel)
                  </label>
                  <select
                    value={newQuestion.level}
                    onChange={(e) => setNewQuestion({ ...newQuestion, level: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  >
                    <option value="">Sélectionner</option>
                    <option value="6ème">6ème</option>
                    <option value="5ème">5ème</option>
                    <option value="4ème">4ème</option>
                    <option value="3ème">3ème</option>
                    <option value="2nde">2nde</option>
                    <option value="1ère">1ère</option>
                    <option value="Tle">Tle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Détails de la question *
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  placeholder="Décrivez votre question en détail. Plus vous donnez d'informations, plus les réponses seront pertinentes."
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Conseils pour une bonne question:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Soyez précis et clair dans votre titre</li>
                  <li>• Expliquez ce que vous avez déjà essayé</li>
                  <li>• Utilisez un langage simple et compréhensible</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAskDialog(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAskQuestion}
                  className="px-6 py-2 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition"
                >
                  Publier la question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedQuestion && (
        <ForumQuestionDialog
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onUpdate={loadQuestions}
        />
      )}
    </div>
  );
}

export default ForumView;
