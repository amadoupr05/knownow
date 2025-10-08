import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email: string;
  created_at: string;
}

const ROLE_LABELS = {
  gestionnaire_general: 'Gestionnaire Général',
  gestionnaire: 'Gestionnaire',
  documentier: 'Documentier'
};

function AdminsView() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    role: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newAdmin.password !== newAdmin.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.username,
        password: newAdmin.password,
        options: {
          data: {
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName,
            user_type: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName,
            email: newAdmin.username,
            user_type: 'admin'
          }]);

        if (profileError) throw profileError;
      }

      await loadAdmins();
      setShowAddModal(false);
      setNewAdmin({
        firstName: '',
        lastName: '',
        role: '',
        username: '',
        password: '',
        passwordConfirm: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'administrateur');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Administrateurs</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un administrateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un administrateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.first_name} {admin.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Administrateur
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(admin.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-[#4F6D0B] hover:text-[#4F6D0B]/80">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {filteredAdmins.length} administrateur{filteredAdmins.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Ajouter un administrateur</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="gestionnaire_general">Gestionnaire Général</option>
                    <option value="gestionnaire">Gestionnaire</option>
                    <option value="documentier">Documentier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant
                  </label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={newAdmin.passwordConfirm}
                    onChange={(e) => setNewAdmin({ ...newAdmin, passwordConfirm: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminsView;