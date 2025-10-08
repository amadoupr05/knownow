import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, BookOpen, Clock, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ProgramsManagerViewProps {
  onCreateProgram: () => void;
}

interface Program {
  id: string;
  title: string;
  level: string;
  subject: string;
  teacher_id: string;
  created_at: string;
  lesson_count?: number;
  teacher_name?: string;
}

function ProgramsManagerView({ onCreateProgram }: ProgramsManagerViewProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (programsError) throw programsError;

      if (!programsData) {
        setPrograms([]);
        return;
      }

      const programsWithCounts = await Promise.all(
        programsData.map(async (program) => {
          const { data: modulesData } = await supabase
            .from('program_modules')
            .select('id')
            .eq('program_id', program.id);

          let lessonCount = 0;
          if (modulesData && modulesData.length > 0) {
            const { data: lessonsData } = await supabase
              .from('program_lessons')
              .select('id')
              .in('module_id', modulesData.map(m => m.id));
            lessonCount = lessonsData?.length || 0;
          }

          return {
            id: program.id,
            title: program.title,
            level: program.level || 'Non défini',
            subject: program.subject || 'Non défini',
            teacher_id: program.teacher_id,
            created_at: program.created_at,
            lesson_count: lessonCount
          };
        })
      );

      setPrograms(programsWithCounts);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (programId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;

      setPrograms(programs.filter(p => p.id !== programId));
      alert('Programme supprimé avec succès');
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Erreur lors de la suppression du programme');
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || program.level === filterLevel;
    const matchesSubject = filterSubject === 'all' || program.subject === filterSubject;
    return matchesSearch && matchesLevel && matchesSubject;
  });

  const subjects = Array.from(new Set(programs.map(p => p.subject)));
  const levels = Array.from(new Set(programs.map(p => p.level)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Programmes</h1>
          <p className="text-gray-600 mt-1">Gérer tous les programmes pédagogiques</p>
        </div>
        <button
          onClick={onCreateProgram}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#3d5609] transition"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Programme</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent"
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent"
          >
            <option value="all">Toutes les matières</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6D0B]"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucun programme trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Titre</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Niveau</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Matière</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Leçons</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date de création</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-[#4F6D0B] mr-2" />
                        <span className="font-medium text-gray-900">{program.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {program.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{program.subject}</td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{program.lesson_count} leçon{program.lesson_count !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(program.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => deleteProgram(program.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
            <div className="text-sm text-gray-600">Programmes totaux</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {programs.reduce((sum, p) => sum + (p.lesson_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Leçons totales</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{subjects.length}</div>
            <div className="text-sm text-gray-600">Matières</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{levels.length}</div>
            <div className="text-sm text-gray-600">Niveaux</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramsManagerView;
