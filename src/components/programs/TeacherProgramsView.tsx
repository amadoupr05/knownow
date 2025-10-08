import React, { useState, useEffect } from 'react';
import { Plus, Eye, Settings, Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Program {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  is_free: boolean;
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
}

interface ProgramStats {
  total_students: number;
  avg_minutes_per_week: number;
  completion_rate: number;
}

interface TeacherProgramsViewProps {
  onCreateProgram?: () => void;
  onViewStats?: (programId: string) => void;
  onManageProgram?: (programId: string) => void;
}

function TeacherProgramsView({ onCreateProgram, onViewStats, onManageProgram }: TeacherProgramsViewProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<Record<string, ProgramStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrograms(data || []);

      if (data) {
        for (const program of data) {
          const { data: statsData } = await supabase
            .from('program_stats')
            .select('*')
            .eq('program_id', program.id)
            .maybeSingle();

          if (statsData) {
            setStats(prev => ({
              ...prev,
              [program.id]: statsData
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] p-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Créez votre programme de formation
          </h1>
          <p className="text-xl mb-6 text-white/90">
            Partagez votre expertise et aidez les élèves à progresser tout en générant des revenus
          </p>
          <button
            onClick={onCreateProgram}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-[#4F6D0B] font-semibold hover:bg-gray-100 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Créer un nouveau programme</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Mes programmes
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Chargement...</div>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme créé</h3>
            <p className="text-gray-500 mb-6">Commencez par créer votre premier programme</p>
            <button
              onClick={onCreateProgram}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
            >
              <Plus className="w-5 h-5" />
              <span>Créer mon premier programme</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => {
              const programStats = stats[program.id] || {
                total_students: 0,
                avg_minutes_per_week: 0,
                completion_rate: 0
              };

              return (
                <div key={program.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {program.title}
                        </h3>
                        {!program.is_active && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Inactif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {program.subject}
                        </span>
                        <span>{program.level}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {program.is_free ? (
                        <span className="text-sm font-medium text-green-600">Gratuit</span>
                      ) : (
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {program.price} FCFA
                          </div>
                          <div className="text-xs text-gray-500">par élève</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-1 text-gray-500 text-xs mb-1">
                        <Users className="w-3 h-3" />
                        <span>Élèves</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {programStats.total_students}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-gray-500 text-xs mb-1">
                        <Clock className="w-3 h-3" />
                        <span>Moy/sem</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(programStats.avg_minutes_per_week)}m
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-gray-500 text-xs mb-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Taux</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(programStats.completion_rate)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewStats?.(program.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir stats</span>
                    </button>
                    <button
                      onClick={() => onManageProgram?.(program.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90 transition"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manager</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Conseils pour créer un programme réussi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Objectifs clairs</h3>
            <p className="text-sm text-gray-600">
              Définissez des objectifs d'apprentissage précis et mesurables
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Contenu engageant</h3>
            <p className="text-sm text-gray-600">
              Utilisez des exemples concrets et des exercices variés
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Suivi régulier</h3>
            <p className="text-sm text-gray-600">
              Évaluez la progression et ajustez le contenu si nécessaire
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProgramsView;
