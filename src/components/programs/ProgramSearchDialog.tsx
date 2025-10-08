import React, { useState, useEffect } from 'react';
import { X, Search, Filter, BookOpen, Clock, DollarSign } from 'lucide-react';
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
  total_lessons: number;
  total_exercises: number;
}

interface ProgramSearchDialogProps {
  onClose: () => void;
  onSelectProgram: (program: Program) => void;
}

function ProgramSearchDialog({ onClose, onSelectProgram }: ProgramSearchDialogProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableModules, setAvailableModules] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  const subjects = ['Mathématiques', 'Physique', 'Chimie', 'SVT', 'Français', 'Anglais', 'Histoire-Géo', 'Philosophie'];
  const levels = ['6e', '5e', '4e', '3e', '2nd', '1ere', 'Tle'];

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [programs, searchTerm, selectedSubject, selectedLevel, selectedModule, showFreeOnly, maxPrice, minDuration, maxDuration]);

  useEffect(() => {
    if (selectedSubject && selectedLevel) {
      loadModules();
    } else {
      setAvailableModules([]);
      setSelectedModule('');
    }
  }, [selectedSubject, selectedLevel]);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPrograms(data || []);
      setFilteredPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    try {
      const { data: programsData } = await supabase
        .from('programs')
        .select('id')
        .eq('subject', selectedSubject)
        .eq('level', selectedLevel)
        .eq('is_active', true);

      if (!programsData || programsData.length === 0) {
        setAvailableModules([]);
        return;
      }

      const programIds = programsData.map(p => p.id);
      const { data: modulesData, error } = await supabase
        .from('program_modules')
        .select('title')
        .in('program_id', programIds);

      if (error) throw error;

      const uniqueModules = [...new Set((modulesData || []).map(m => m.title))];
      setAvailableModules(uniqueModules);
    } catch (error) {
      console.error('Error loading modules:', error);
      setAvailableModules([]);
    }
  };

  const applyFilters = async () => {
    let filtered = [...programs];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(p => p.subject === selectedSubject);
    }

    if (selectedLevel) {
      filtered = filtered.filter(p => p.level === selectedLevel);
    }

    if (selectedModule) {
      const programIdsWithModule: string[] = [];
      for (const program of filtered) {
        const { data: modules } = await supabase
          .from('program_modules')
          .select('id')
          .eq('program_id', program.id)
          .eq('title', selectedModule)
          .limit(1);

        if (modules && modules.length > 0) {
          programIdsWithModule.push(program.id);
        }
      }
      filtered = filtered.filter(p => programIdsWithModule.includes(p.id));
    }

    if (showFreeOnly) {
      filtered = filtered.filter(p => p.is_free);
    }

    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      filtered = filtered.filter(p => p.is_free || p.price <= maxPriceNum);
    }

    if (minDuration) {
      const minDurationNum = parseInt(minDuration);
      filtered = filtered.filter(p => p.duration_weeks >= minDurationNum);
    }

    if (maxDuration) {
      const maxDurationNum = parseInt(maxDuration);
      filtered = filtered.filter(p => p.duration_weeks <= maxDurationNum);
    }

    setFilteredPrograms(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedLevel('');
    setSelectedModule('');
    setShowFreeOnly(false);
    setMaxPrice('');
    setMinDuration('');
    setMaxDuration('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Search className="w-6 h-6 text-[#4F6D0B]" />
            <h2 className="text-2xl font-bold text-gray-900">Trouver un programme</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              >
                <option value="">Toutes</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              >
                <option value="">Tous</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                disabled={!selectedSubject || !selectedLevel}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Tous les modules</option>
                {availableModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
              {(!selectedSubject || !selectedLevel) && (
                <p className="text-xs text-gray-500 mt-1">Sélectionnez une matière et un niveau</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix maximum (FCFA)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Aucune limite"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (semaines)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                />
                <input
                  type="number"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="w-4 h-4 text-[#4F6D0B] border-gray-300 rounded focus:ring-[#4F6D0B]"
              />
              <span className="text-sm font-medium text-gray-700">Programmes gratuits uniquement</span>
            </label>

            <button
              onClick={resetFilters}
              className="text-sm text-[#4F6D0B] hover:text-[#4F6D0B]/80 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {filteredPrograms.length} programme{filteredPrograms.length > 1 ? 's' : ''} trouvé{filteredPrograms.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Chargement des programmes...
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucun programme ne correspond à vos critères</p>
              <p className="text-sm text-gray-500 mt-2">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => onSelectProgram(program)}
                  className="bg-white border border-gray-200 rounded-lg hover:border-[#4F6D0B] hover:shadow-md transition cursor-pointer p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {program.subject}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          {program.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{program.title}</h3>
                    </div>
                    {program.is_free ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Gratuit
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {program.price} FCFA
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {program.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration_weeks} sem.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{program.total_lessons || 0} leçons</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramSearchDialog;
