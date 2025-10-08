import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface School {
  id: string;
  name: string;
  type: 'Lycée' | 'Collège';
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  director_name: string;
  student_count: number;
  is_active: boolean;
  created_at: string;
}

function SchoolsManagerView() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lycée' as 'Lycée' | 'Collège',
    region: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    director_name: '',
    student_count: 0,
    is_active: true
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchool) {
        const { error } = await supabase
          .from('schools')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingSchool.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schools')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      loadSchools();
    } catch (error) {
      console.error('Error saving school:', error);
    }
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      type: school.type,
      region: school.region,
      city: school.city,
      address: school.address,
      phone: school.phone,
      email: school.email,
      director_name: school.director_name,
      student_count: school.student_count,
      is_active: school.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette école ?')) return;

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Lycée',
      region: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      director_name: '',
      student_count: 0,
      is_active: true
    });
    setEditingSchool(null);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingSchool ? 'Modifier l\'école' : 'Nouvelle école'}
          </h1>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'établissement *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: Lycée Moderne d'Akoupé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Lycée' | 'Collège' })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              >
                <option value="Lycée">Lycée</option>
                <option value="Collège">Collège</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région *
              </label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: La Mé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: Akoupé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Adresse complète"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: +225 XX XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="contact@ecole.ci"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du directeur
              </label>
              <input
                type="text"
                value={formData.director_name}
                onChange={(e) => setFormData({ ...formData, director_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Nom complet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'élèves
              </label>
              <input
                type="number"
                min="0"
                value={formData.student_count}
                onChange={(e) => setFormData({ ...formData, student_count: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="Ex: 500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#4F6D0B] border-gray-300 rounded focus:ring-[#4F6D0B]"
              />
              <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                École active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
            >
              {editingSchool ? 'Mettre à jour' : 'Créer l\'école'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Écoles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle école</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : schools.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune école</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre première école</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
          >
            <Plus className="w-5 h-5" />
            <span>Créer une école</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    {!school.is_active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Inactif</span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-blue-600">{school.type}</p>
                    <p>{school.city}, {school.region}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="space-y-2 text-sm">
                  {school.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Téléphone:</span>
                      <span className="font-medium text-gray-900">{school.phone}</span>
                    </div>
                  )}
                  {school.director_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Directeur:</span>
                      <span className="font-medium text-gray-900">{school.director_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Élèves:</span>
                    <span className="font-medium text-gray-900">{school.student_count}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(school)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SchoolsManagerView;
