import React, { useState, useEffect } from 'react';
import { Play, Star, Users, Clock, DollarSign, Award, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProgramDetailDialog from './ProgramDetailDialog';
import ProgramDiscussionDialog from './ProgramDiscussionDialog';
import ProgramSearchDialog from './ProgramSearchDialog';

interface Program {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  is_free: boolean;
  duration_weeks: number;
  thumbnail_url: string;
  teacher_name: string;
  total_students: number;
}

function StudentProgramsView({ onQuickQuizStart }: { onQuickQuizStart?: () => void }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [discussionProgramId, setDiscussionProgramId] = useState<string | null>(null);
  const [discussionProgramTitle, setDiscussionProgramTitle] = useState<string>('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (programId: string) => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      console.log('DEBUG - User string:', userStr);

      if (!userStr) {
        alert('Vous devez être connecté pour vous inscrire');
        return;
      }

      const user = JSON.parse(userStr);
      console.log('DEBUG - User object:', user);

      const program = programs.find(p => p.id === programId);
      console.log('DEBUG - Program:', program);

      if (!program) {
        alert('Programme non trouvé');
        return;
      }

      const enrollmentData = {
        program_id: programId,
        student_id: user.id,
        payment_status: program.is_free ? 'free' : 'pending',
        payment_amount: program.is_free ? 0 : program.price
      };

      console.log('DEBUG - Enrollment data:', enrollmentData);

      const { data, error } = await supabase
        .from('program_enrollments')
        .insert(enrollmentData)
        .select();

      console.log('DEBUG - Response data:', data);
      console.log('DEBUG - Response error:', error);

      if (error) {
        console.error('Full error object:', JSON.stringify(error, null, 2));
        if (error.code === '23505') {
          alert('Vous êtes déjà inscrit à ce programme');
        } else {
          alert(`Erreur lors de l'inscription: ${error.message}`);
        }
        return;
      }

      alert('Inscription réussie !');
      setSelectedProgram(null);
    } catch (error: any) {
      console.error('Error enrolling:', error);
      alert(`Erreur lors de l'inscription: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const handleOpenDiscussion = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (program) {
      setDiscussionProgramId(programId);
      setDiscussionProgramTitle(program.title);
      setSelectedProgram(null);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="relative bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative p-12 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Testez votre niveau gratuitement
            </h1>
            <p className="text-xl mb-2 text-white/90">
              Découvrez vos points forts et identifiez vos axes d'amélioration
            </p>
            <p className="text-lg mb-6 text-white/80">
              Un test pour évaluer vos compétences et recevoir des recommandations personnalisées
            </p>
            <div className="flex space-x-4">
              <button
                onClick={onQuickQuizStart}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-[#4F6D0B] font-semibold hover:bg-gray-100 transition"
              >
                <Play className="w-5 h-5" />
                <span>Commencer le Test Niveau 0</span>
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#4F6D0B] transition">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Programmes de renforcement disponibles
            </h2>
            <p className="text-gray-600">
              Développez vos compétences avec nos programmes conçus par des enseignants expérimentés
            </p>
          </div>
          <button
            onClick={() => setShowSearchDialog(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg font-semibold hover:bg-[#4F6D0B]/90 transition"
          >
            <Search className="w-5 h-5" />
            <span>Trouver un programme</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Chargement des programmes...</div>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme disponible</h3>
            <p className="text-gray-500">De nouveaux programmes seront bientôt disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {program.subject}
                    </span>
                    {program.is_free ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Gratuit
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {program.price} FCFA
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {program.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{program.total_students || 0} élèves</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration_weeks} semaines</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-gray-300 fill-current" />
                    </div>
                    <span className="text-xs">(4.0)</span>
                  </div>

                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="w-full py-2 bg-[#4F6D0B] text-white rounded-lg font-medium hover:bg-[#4F6D0B]/90 transition"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pourquoi rejoindre nos programmes de renforcement?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Enseignants qualifiés</h3>
            <p className="text-sm text-gray-600">
              Apprenez avec des professeurs expérimentés et passionnés
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">À votre rythme</h3>
            <p className="text-sm text-gray-600">
              Progressez selon votre emploi du temps et vos disponibilités
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Suivi personnalisé</h3>
            <p className="text-sm text-gray-600">
              Recevez un accompagnement adapté à vos besoins spécifiques
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          L'importance du renforcement continu
        </h2>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Le renforcement scolaire continu est essentiel pour consolider vos acquis et combler vos lacunes.
            En participant régulièrement à nos programmes, vous développerez des compétences solides et durables.
          </p>
          <p className="mb-4">
            Nos programmes sont conçus pour compléter votre apprentissage en classe avec des exercices pratiques,
            des explications détaillées et un suivi personnalisé de votre progression.
          </p>
          <p>
            Ne laissez pas les difficultés s'accumuler. Investissez dans votre réussite dès aujourd'hui et
            rejoignez des milliers d'élèves qui ont transformé leurs résultats scolaires grâce à nos programmes.
          </p>
        </div>
      </div>

      {selectedProgram && (
        <ProgramDetailDialog
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onEnroll={handleEnroll}
          onOpenDiscussion={handleOpenDiscussion}
        />
      )}

      {discussionProgramId && (
        <ProgramDiscussionDialog
          programId={discussionProgramId}
          programTitle={discussionProgramTitle}
          onClose={() => setDiscussionProgramId(null)}
        />
      )}

      {showSearchDialog && (
        <ProgramSearchDialog
          onClose={() => setShowSearchDialog(false)}
          onSelectProgram={(program) => {
            setShowSearchDialog(false);
            setSelectedProgram(program);
          }}
        />
      )}
    </div>
  );
}

export default StudentProgramsView;
