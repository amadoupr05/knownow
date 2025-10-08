import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard as Edit, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProgramManagerViewProps {
  programId: string;
  onBack: () => void;
}

interface Program {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  is_free: boolean;
  duration_weeks: number;
  learning_outcomes: string;
  target_audience: string;
  prerequisites: string;
  status: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_number: number;
  duration_hours: number;
}

function ProgramManagerView({ programId, onBack }: ProgramManagerViewProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProgramData();
  }, [programId]);

  const loadProgramData = async () => {
    try {
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .maybeSingle();

      if (programError) throw programError;
      setProgram(programData);

      const { data: modulesData, error: modulesError } = await supabase
        .from('program_modules')
        .select('*')
        .eq('program_id', programId)
        .order('order_number', { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!program) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('programs')
        .update({
          title: program.title,
          description: program.description,
          subject: program.subject,
          level: program.level,
          price: program.price,
          is_free: program.is_free,
          duration_weeks: program.duration_weeks,
          learning_outcomes: program.learning_outcomes,
          target_audience: program.target_audience,
          prerequisites: program.prerequisites,
          status: program.status
        })
        .eq('id', programId);

      if (error) throw error;

      alert('Programme mis à jour avec succès');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) return;

    try {
      const { error } = await supabase
        .from('program_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      setModules(modules.filter(m => m.id !== moduleId));
      alert('Module supprimé avec succès');
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Erreur lors de la suppression');
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Gérer le programme</h1>
        </div>
        <div className="flex items-center space-x-2">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#3d5609] transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#3d5609] transition"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              value={program.title}
              onChange={(e) => setProgram({ ...program, title: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
            <input
              type="text"
              value={program.subject}
              onChange={(e) => setProgram({ ...program, subject: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
            <input
              type="text"
              value={program.level}
              onChange={(e) => setProgram({ ...program, level: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durée (semaines)</label>
            <input
              type="number"
              value={program.duration_weeks}
              onChange={(e) => setProgram({ ...program, duration_weeks: parseInt(e.target.value) || 0 })}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={program.description}
              onChange={(e) => setProgram({ ...program, description: e.target.value })}
              disabled={!editMode}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Modules du programme</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#3d5609] transition">
            <Plus className="w-4 h-4" />
            <span>Ajouter un module</span>
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun module pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {module.duration_hours}h
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteModule(module.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgramManagerView;
