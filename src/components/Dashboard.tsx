import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Trophy, Clock, GraduationCap } from 'lucide-react';
import StatCard from './StatCard';
import CourseCard from './CourseCard';
import ExamCard from './ExamCard';
import { supabase } from '../lib/supabase';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const stats = [
  { icon: BookOpen, label: 'Cours disponibles', value: '24', color: 'bg-[#4F6D0B]' },
  { icon: Users, label: 'Élèves actifs', value: '2 847', color: 'bg-[#C19620]' },
  { icon: Trophy, label: 'Taux de réussite', value: '94%', color: 'bg-[#462D12]' },
  { icon: Clock, label: "Heures d'études", value: '168', color: 'bg-[#4F6D0B]/80' },
];

const courses = [
  'Mathématiques',
  'Physique-Chimie',
];

interface Question {
  id: string;
  text: string;
  subject: string;
  level: string;
  created_at: string;
}

interface DashboardProps {
  onViewChange: (view: string) => void;
}

function Dashboard({ onViewChange }: DashboardProps) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handlePreview = (questionId: string) => {
    sessionStorage.setItem('previewQuestionId', questionId);
    onViewChange('affichage');
  };

  const renderMathContent = (text: string) => {
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const latex = part.slice(2, -2);
        return <BlockMath key={index} math={latex} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#462D12]">Bienvenue sur KN</h1>
        <p className="text-gray-600 mt-2">Votre plateforme d'apprentissage personnalisée</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#462D12] mb-4">Examens majeurs</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <CourseCard key={course} title={course} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#462D12] mb-4">Questions disponibles</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                      {renderMathContent(question.text)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{question.subject} - {question.level}</p>
                  </div>
                  <button
                    onClick={() => handlePreview(question.id)}
                    className="ml-4 px-3 py-1.5 text-sm text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
                  >
                    Aperçu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;