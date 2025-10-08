import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface Question {
  id: string;
  text: string;
  subject: string;
  level: string;
  difficulty?: string;
  figure_data?: any;
}

interface AffichageViewProps {
  onBack: () => void;
}

function AffichageView({ onBack }: AffichageViewProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const questionId = sessionStorage.getItem('previewQuestionId');
    if (questionId) {
      loadQuestion(questionId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadQuestion = async (questionId: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .maybeSingle();

      if (error) throw error;
      setQuestion(data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
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

  const getDifficultyLabel = (difficulty?: string) => {
    const levels: { [key: string]: string } = {
      beginner: 'Débutant',
      progressive: 'Progressif',
      medium: 'Moyen',
      difficult: 'Difficile',
      advanced: 'Approfondi',
      legend: 'Légende'
    };
    return levels[difficulty || ''] || 'Difficile';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Aucune question sélectionnée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question 1 sur 10</h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Niveau de difficulté :</span>
              <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                {getDifficultyLabel(question.difficulty)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="text-gray-800 text-lg leading-relaxed">
              {renderMathContent(question.text)}
            </div>

            {question.figure_data && question.figure_data.length > 0 && (() => {
              const calculateBounds = () => {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                question.figure_data.forEach((shape: any) => {
                  const points = shape.points || [];

                  switch (shape.type) {
                    case 'line':
                      if (points.length >= 2) {
                        minX = Math.min(minX, points[0].x, points[1].x);
                        maxX = Math.max(maxX, points[0].x, points[1].x);
                        minY = Math.min(minY, points[0].y, points[1].y);
                        maxY = Math.max(maxY, points[0].y, points[1].y);
                      }
                      break;
                    case 'circle':
                      if (points.length >= 1) {
                        const radius = shape.width ? shape.width / 2 : 50;
                        minX = Math.min(minX, points[0].x - radius);
                        maxX = Math.max(maxX, points[0].x + radius);
                        minY = Math.min(minY, points[0].y - radius);
                        maxY = Math.max(maxY, points[0].y + radius);
                      }
                      break;
                    case 'rectangle':
                      if (points.length >= 1) {
                        const w = shape.width || 100;
                        const h = shape.height || 100;
                        minX = Math.min(minX, points[0].x);
                        maxX = Math.max(maxX, points[0].x + w);
                        minY = Math.min(minY, points[0].y);
                        maxY = Math.max(maxY, points[0].y + h);
                      }
                      break;
                    case 'triangle':
                      if (points.length >= 1) {
                        const w = shape.width || 100;
                        const h = shape.height || 100;
                        minX = Math.min(minX, points[0].x);
                        maxX = Math.max(maxX, points[0].x + w);
                        minY = Math.min(minY, points[0].y);
                        maxY = Math.max(maxY, points[0].y + h);
                      }
                      break;
                    case 'polygon':
                      if (points.length >= 3) {
                        points.forEach((p: any) => {
                          minX = Math.min(minX, p.x);
                          maxX = Math.max(maxX, p.x);
                          minY = Math.min(minY, p.y);
                          maxY = Math.max(maxY, p.y);
                        });
                      }
                      break;
                  }
                });

                const padding = 20;
                const width = maxX - minX + padding * 2;
                const height = maxY - minY + padding * 2;

                return {
                  x: minX - padding,
                  y: minY - padding,
                  width,
                  height
                };
              };

              const bounds = calculateBounds();

              return (
                <div className="mt-6 flex justify-center">
                  <svg
                    width="600"
                    height="400"
                    viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {question.figure_data.map((shape: any, index: number) => {
                      const points = shape.points || [];

                      switch (shape.type) {
                      case 'line':
                        if (points.length >= 2) {
                          return (
                            <line
                              key={shape.id || index}
                              x1={points[0].x}
                              y1={points[0].y}
                              x2={points[1].x}
                              y2={points[1].y}
                              stroke={shape.strokeColor || '#000'}
                              strokeWidth={shape.strokeWidth || 2}
                              strokeDasharray={shape.strokeDasharray === 'dashed' ? '5,5' : 'none'}
                              opacity={shape.opacity || 1}
                            />
                          );
                        }
                        return null;

                      case 'circle':
                        if (points.length >= 1) {
                          const radius = shape.width ? shape.width / 2 : 50;
                          return (
                            <circle
                              key={shape.id || index}
                              cx={points[0].x}
                              cy={points[0].y}
                              r={radius}
                              fill={shape.backgroundColor !== 'transparent' ? shape.backgroundColor : 'none'}
                              stroke={shape.strokeColor || '#000'}
                              strokeWidth={shape.strokeWidth || 2}
                              strokeDasharray={shape.strokeDasharray === 'dashed' ? '5,5' : 'none'}
                              opacity={shape.opacity || 1}
                            />
                          );
                        }
                        return null;

                      case 'rectangle':
                        if (points.length >= 1) {
                          return (
                            <rect
                              key={shape.id || index}
                              x={points[0].x}
                              y={points[0].y}
                              width={shape.width || 100}
                              height={shape.height || 100}
                              fill={shape.backgroundColor !== 'transparent' ? shape.backgroundColor : 'none'}
                              stroke={shape.strokeColor || '#000'}
                              strokeWidth={shape.strokeWidth || 2}
                              strokeDasharray={shape.strokeDasharray === 'dashed' ? '5,5' : 'none'}
                              opacity={shape.opacity || 1}
                            />
                          );
                        }
                        return null;

                      case 'triangle':
                        if (points.length >= 1) {
                          const w = shape.width || 100;
                          const h = shape.height || 100;
                          const x = points[0].x;
                          const y = points[0].y;
                          const trianglePoints = `${x},${y + h} ${x + w / 2},${y} ${x + w},${y + h}`;
                          return (
                            <polygon
                              key={shape.id || index}
                              points={trianglePoints}
                              fill={shape.backgroundColor !== 'transparent' ? shape.backgroundColor : 'none'}
                              stroke={shape.strokeColor || '#000'}
                              strokeWidth={shape.strokeWidth || 2}
                              strokeDasharray={shape.strokeDasharray === 'dashed' ? '5,5' : 'none'}
                              opacity={shape.opacity || 1}
                            />
                          );
                        }
                        return null;

                      case 'polygon':
                        if (points.length >= 3) {
                          const polygonPoints = points.map((p: any) => `${p.x},${p.y}`).join(' ');
                          return (
                            <polygon
                              key={shape.id || index}
                              points={polygonPoints}
                              fill={shape.backgroundColor !== 'transparent' ? shape.backgroundColor : 'none'}
                              stroke={shape.strokeColor || '#000'}
                              strokeWidth={shape.strokeWidth || 2}
                              strokeDasharray={shape.strokeDasharray === 'dashed' ? '5,5' : 'none'}
                              opacity={shape.opacity || 1}
                            />
                          );
                        }
                        return null;

                      default:
                        return null;
                    }
                  })}
                </svg>
              </div>
            );
          })()}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="mb-4">
                <span className="text-gray-900 font-semibold">Q.</span>
              </div>
              <p className="text-gray-700 mb-6">Question à développer ou choix multiples apparaîtra ici</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AffichageView;
