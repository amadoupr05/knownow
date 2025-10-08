import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, ThumbsUp, MessageSquare, Award, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContentStats {
  total_questions: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  avg_rating: number;
}

function PerformanceView() {
  const [stats, setStats] = useState<ContentStats>({
    total_questions: 0,
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    avg_rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance de mes contenus</h1>
        <p className="text-gray-600">
          Suivez l'impact de vos questions, exercices et programmes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total_questions}
          </div>
          <div className="text-sm text-gray-600">Questions publiées</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+24%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total_views.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Vues totales</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+18%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total_likes}
          </div>
          <div className="text-sm text-gray-600">Mentions j'aime</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.avg_rating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Évolution des performances (30 derniers jours)
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Graphique d'évolution à venir
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Contenus les plus populaires
          </h2>
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              Aucun contenu publié pour le moment
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Retours des élèves
          </h2>
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              Aucun commentaire pour le moment
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Conseils pour améliorer vos performances
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Publiez régulièrement du contenu de qualité</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Répondez aux commentaires et questions des élèves</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Variez les types d'exercices et de contenus</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Analysez les statistiques pour identifier ce qui fonctionne le mieux</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PerformanceView;
