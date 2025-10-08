import React from 'react';
import { Users, GraduationCap, BookOpen, Settings, School, CreditCard as Edit, UserCog, Database, FileText, FileCheck, ClipboardList, BookMarked, Building2, FunctionSquare, Plus } from 'lucide-react';

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { icon: GraduationCap, label: 'Gestion des Élèves', view: 'students', roles: ['gestionnaire_general', 'gestionnaire'] },
  { icon: School, label: 'Gestion des Enseignants', view: 'teachers', roles: ['gestionnaire_general', 'gestionnaire'] },
  { icon: Building2, label: 'Gestion des Écoles', view: 'schools', roles: ['gestionnaire_general', 'gestionnaire'] },
  { icon: UserCog, label: 'Administrateurs', view: 'admins', roles: ['gestionnaire_general'] },
  { icon: BookOpen, label: 'Contenu', view: 'content', roles: ['gestionnaire_general', 'gestionnaire'] },
  { icon: BookMarked, label: 'Gestion des Programmes', view: 'programs', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: Database, label: 'Gestion des Questions', view: 'questions', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: FileCheck, label: 'Gestion des Examens', view: 'exams', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: ClipboardList, label: 'Gestion des Devoirs', view: 'homeworks', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: BookMarked, label: 'Gestion des Exercices', view: 'exercises', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: FunctionSquare, label: 'Éditeur Math', view: 'math-editor', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: Edit, label: 'Poster', view: 'poster', roles: ['gestionnaire_general', 'gestionnaire', 'documentier'] },
  { icon: Settings, label: 'Paramètres', view: 'settings', roles: ['gestionnaire_general', 'gestionnaire'] },
];

function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  const userRole = currentUser.role || '';

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full px-3 py-4 flex flex-col">
        <div className="flex items-center px-2 mb-8">
          <div className="bg-[#462D12] text-white p-2 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-[#462D12]">Admin</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {filteredMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.view)}
              className={`flex items-center px-2 py-3 w-full rounded-lg transition-colors group ${
                currentView === item.view
                  ? 'bg-[#4F6D0B] text-white'
                  : 'text-gray-700 hover:bg-[#4F6D0B] hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                currentView === item.view ? 'text-white' : 'group-hover:text-white'
              }`} />
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="px-2 py-3">
            <div className="text-xs font-medium text-gray-400 uppercase">Statistiques</div>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Élèves actifs</span>
                <span className="font-medium text-gray-900">2,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Enseignants</span>
                <span className="font-medium text-gray-900">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;