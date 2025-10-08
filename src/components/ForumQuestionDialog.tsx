import React, { useState, useEffect } from 'react';
import { X, Send, User, Clock, ThumbsUp, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Answer {
  id: string;
  content: string;
  is_accepted: boolean;
  helpful_count: number;
  created_at: string;
  user_id: string;
  user?: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  subject: string;
  level: string;
  created_at: string;
  user_id: string;
  views_count: number;
}

interface ForumQuestionDialogProps {
  question: Question;
  onClose: () => void;
  onUpdate: () => void;
}

function ForumQuestionDialog({ question, onClose, onUpdate }: ForumQuestionDialogProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
    loadAnswers();
    incrementViewCount();
  }, []);

  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_question_views', { question_id: question.id });
      onUpdate();
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const loadAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_answers')
        .select(`
          *,
          user:local_users(first_name, last_name, user_type)
        `)
        .eq('question_id', question.id)
        .order('is_accepted', { ascending: false })
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) {
      alert('Veuillez écrire une réponse');
      return;
    }

    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      alert('Vous devez être connecté pour répondre');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(userStr);
      const { error } = await supabase
        .from('forum_answers')
        .insert({
          question_id: question.id,
          user_id: user.id,
          content: newAnswer.trim()
        });

      if (error) throw error;

      setNewAnswer('');
      await loadAnswers();
      onUpdate();
    } catch (error) {
      console.error('Error posting answer:', error);
      alert('Erreur lors de la publication de la réponse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (answerId: string) => {
    try {
      const answer = answers.find(a => a.id === answerId);
      if (!answer) return;

      const { error } = await supabase
        .from('forum_answers')
        .update({ helpful_count: answer.helpful_count + 1 })
        .eq('id', answerId);

      if (error) throw error;
      await loadAnswers();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                {question.category}
              </span>
              {question.subject && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {question.subject}
                </span>
              )}
              {question.level && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {question.level}
                </span>
              )}
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(question.created_at)}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {answers.length} Réponse{answers.length > 1 ? 's' : ''}
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Chargement des réponses...
              </div>
            ) : answers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune réponse pour le moment</p>
                <p className="text-sm text-gray-400 mt-2">Soyez le premier à répondre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`border rounded-lg p-4 ${
                      answer.is_accepted ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {answer.user?.first_name} {answer.user?.last_name}
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              {answer.user?.user_type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(answer.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      {answer.is_accepted && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-5 h-5 fill-current" />
                          <span className="text-sm font-medium">Réponse acceptée</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{answer.content}</p>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleHelpful(answer.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#4F6D0B]"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Utile ({answer.helpful_count})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Votre réponse</h3>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Écrivez votre réponse..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !newAnswer.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-[#4F6D0B] text-white rounded-lg font-medium hover:bg-[#4F6D0B]/90 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'Publication...' : 'Publier la réponse'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumQuestionDialog;
