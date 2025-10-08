import React, { useState, useEffect } from 'react';
import QuizTimer from './QuizTimer';
import QuizAnswer from './QuizAnswer';
import QuizSidebar from './QuizSidebar';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { supabase } from '../../lib/supabase';

interface QuizQuestionPageProps {
  subject: string;
  level: string;
  module: string;
  difficulty: string;
  onComplete: () => void;
  onBack: () => void;
  previewQuestion?: any;
}

function QuizQuestionPage({ subject, level, module, difficulty, onComplete, onBack, previewQuestion }: QuizQuestionPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTime, setQuestionTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewQuestion) {
      setQuestions([previewQuestion]);
      setLoading(false);
    } else {
      loadQuestions();
    }
  }, [subject, level, module, difficulty, previewQuestion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTime(prev => prev + 1);
      setQuestionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const subjectMap: any = {
        'maths': 'Mathématiques',
        'physics': 'Physique-Chimie'
      };

      let query = supabase
        .from('questions')
        .select('*')
        .eq('subject', subjectMap[subject] || subject)
        .eq('level', level)
        .eq('module', module);

      if (difficulty !== 'random') {
        const difficultyMap: any = {
          'beginner': 'Débutant',
          'progressive': 'Progressif',
          'medium': 'Moyen',
          'difficult': 'Difficile',
          'advanced': 'Approfondi',
          'legend': 'Légende'
        };
        query = query.eq('difficulty', difficultyMap[difficulty] || difficulty);
      }

      const { data, error: fetchError } = await query.limit(10);

      if (fetchError) {
        console.error('Erreur lors du chargement des questions:', fetchError);
        setError('Impossible de charger les questions');
        return;
      }

      if (!data || data.length === 0) {
        setError('Aucune question disponible pour ces critères');
        return;
      }

      setQuestions(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionTime(0);
      setSelectedAnswer(null);
    } else {
      onComplete();
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      handleSkipQuestion();
    }
  };

  const handleRequestHint = () => {
    // Logique pour demander une astuce
    console.log('Demande d\'astuce');
  };

  const renderQuestionText = (text: string) => {
    return text.split(/(\$[^$]+\$)/g).map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        try {
          const math = part.slice(1, -1);
          return (
            <span key={index} className="inline-flex items-center">
              <InlineMath math={math} />
            </span>
          );
        } catch (error) {
          return <span key={index}>{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderFigure = (figureData: any) => {
    if (!figureData || !Array.isArray(figureData) || figureData.length === 0) {
      return null;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    figureData.forEach((shape: any) => {
      if (shape.points) {
        shape.points.forEach((p: any) => {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        });
      }
      if (shape.vertices) {
        shape.vertices.forEach((v: any) => {
          minX = Math.min(minX, v.x);
          minY = Math.min(minY, v.y);
          maxX = Math.max(maxX, v.x);
          maxY = Math.max(maxY, v.y);
        });
      }
    });

    const padding = 30;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

    return (
      <div className="my-4 flex justify-center">
        <svg width="400" height="300" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" style={{ background: 'white' }}>
          {figureData.map((shape: any, idx: number) => {
            const commonProps = {
              stroke: shape.strokeColor,
              strokeWidth: shape.strokeWidth,
              strokeDasharray: shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray,
              fill: shape.backgroundColor || 'transparent',
              fillOpacity: shape.opacity,
              vectorEffect: 'non-scaling-stroke' as const
            };

            if (shape.type === 'line' && shape.points) {
              const [p1, p2] = shape.points;
              return <line key={idx} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...commonProps} />;
            }

            if (shape.type === 'circle' && shape.points && shape.width) {
              const center = shape.points[0];
              const radius = shape.width / 2;
              return <circle key={idx} cx={center.x} cy={center.y} r={radius} {...commonProps} />;
            }

            if (shape.type === 'ellipse' && shape.points && shape.width && shape.height) {
              const center = shape.points[0];
              return <ellipse key={idx} cx={center.x} cy={center.y} rx={shape.width / 2} ry={shape.height / 2} {...commonProps} />;
            }

            if (shape.vertices) {
              const pathData = shape.vertices.map((point: any, i: number) =>
                `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
              ).join(' ') + ' Z';
              return <path key={idx} d={pathData} {...commonProps} />;
            }

            return null;
          })}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6D0B] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Aucune question disponible'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  const getDifficultyColor = (diff: string) => {
    const colors: any = {
      'Débutant': 'bg-green-100 text-green-800',
      'Progressif': 'bg-blue-100 text-blue-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Difficile': 'bg-orange-100 text-orange-800',
      'Approfondi': 'bg-red-100 text-red-800',
      'Légende': 'bg-purple-100 text-purple-800'
    };
    return colors[diff] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="sticky top-0 bg-white border-b shadow-sm -mx-4 px-4 py-4 mb-6">
          <div className="flex items-center justify-between">
            <QuizTimer time={totalTime} label="Temps de réponse au quiz" />
            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Quitter
              </button>
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Passer' : 'Terminer'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Question {currentQuestion + 1} sur {questions.length}
            </h1>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Niveau de difficulté :</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestionData.difficulty)}`}>
                {currentQuestionData.difficulty}
              </span>
            </div>
          </div>

          <div className="min-h-[200px] border-t border-b py-6 my-6">
            <div className="text-gray-600 whitespace-pre-wrap">
              {renderQuestionText(currentQuestionData.text)}
            </div>
            {currentQuestionData.figure_data && renderFigure(currentQuestionData.figure_data)}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 bg-[#FBF7EF] p-6 rounded-lg">
              <div className="mb-6">
                <h3 className="font-bold mb-2">Q.</h3>
                <p className="text-gray-800">{currentQuestionData.text}</p>
              </div>

              <div className="space-y-4">
                <QuizAnswer
                  id="A"
                  text="Option A"
                  isSelected={selectedAnswer === 'A'}
                  onSelect={handleAnswerSelect}
                />
                <QuizAnswer
                  id="B"
                  text="Option B"
                  isSelected={selectedAnswer === 'B'}
                  onSelect={handleAnswerSelect}
                />
                <QuizAnswer
                  id="C"
                  text="Option C"
                  isSelected={selectedAnswer === 'C'}
                  onSelect={handleAnswerSelect}
                />
              </div>
            </div>

            <QuizSidebar
              questionTime={questionTime}
              selectedAnswer={selectedAnswer}
              onRequestHint={handleRequestHint}
              onSubmitAnswer={handleSubmitAnswer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizQuestionPage;