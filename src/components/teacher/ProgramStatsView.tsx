import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, TrendingUp, Award, Activity, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProgramStatsViewProps {
  programId: string;
  onBack: () => void;
}

interface Program {
  title: string;
  subject: string;
  level: string;
}

function ProgramStatsView({ programId, onBack }: ProgramStatsViewProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramData();
  }, [programId]);

  const loadProgramData = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('title, subject, level')
        .eq('id', programId)
        .maybeSingle();

      if (error) throw error;
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6D0B]"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Programme introuvable</p>
        <button onClick={onBack} className="mt-4 text-[#4F6D0B] hover:underline">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
              {program.subject}
            </span>
            <span className="text-gray-600">{program.level}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Élèves inscrits</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0h</div>
          <div className="text-sm text-gray-600">Temps total d'étude</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0%</div>
          <div className="text-sm text-gray-600">Taux de complétion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-[#4F6D0B]" />
            Activité récente
          </h2>
          <div className="text-center py-8 text-gray-500">
            Aucune activité pour le moment
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#4F6D0B]" />
            Performances
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Exercices réussis</span>
                <span className="font-medium text-gray-900">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Leçons terminées</span>
                <span className="font-medium text-gray-900">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-[#4F6D0B]" />
          Objectifs d'apprentissage
        </h2>
        <div className="text-center py-8 text-gray-500">
          Les statistiques détaillées seront disponibles lorsque des élèves s'inscriront à votre programme.
        </div>
      </div>
    </div>
  );
}

export default ProgramStatsView;
