import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  HelpCircle,
  FileText,
  Brain,
  Timer,
  Menu,
  X,
  FileTerminal,
  Shield,
  FunctionSquare,
  Eye,
  Home,
  Library,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

const studentMenuItems = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'dashboard', icon: BookOpen, label: 'Programmes' },
  { id: 'my-programs', icon: Briefcase, label: 'Mes Programmes' },
  { id: 'e-biblio', icon: Library, label: 'e-Biblio' },
  { id: 'forum', icon: MessageSquare, label: 'Forum' },
  { id: 'exams', icon: GraduationCap, label: 'Examens' },
];

const teacherMenuItems = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'getting-started', icon: Compass, label: 'Où commencer' },
  { id: 'program-manager', icon: BookOpen, label: 'Programme Manager' },
  { id: 'homework-manager', icon: ClipboardList, label: 'Devoir Manager' },
  { id: 'performance', icon: TrendingUp, label: 'Performance' },
  { id: 'payments', icon: DollarSign, label: 'Rémunération' },
];

function Sidebar({ isOpen, onClose, onViewChange, currentView }: SidebarProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const menuItems = currentUser?.userType === 'enseignant'
    ? teacherMenuItems
    : studentMenuItems;
  const handleLegalClick = (path: string) => {
    window.location.href = path;
  };

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'exams') {
      window.location.href = '/exams';
    } else {
      onViewChange(itemId);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <div className="bg-[#462D12] text-white p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-[#462D12]">KN</h1>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`flex items-center px-2 py-3 w-full rounded-lg transition-colors group
                    ${currentView === item.id 
                      ? 'bg-[#4F6D0B] text-white' 
                      : 'text-gray-700 hover:bg-[#4F6D0B] hover:text-white'
                    }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    currentView === item.id ? 'text-white' : 'group-hover:text-white'
                  }`} />
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="bg-[#C19620]/10 rounded-lg p-4">
              <p className="text-sm text-[#462D12] font-medium">Besoin d'aide ?</p>
              <p className="text-xs text-gray-600 mt-1">Notre équipe est là pour vous accompagner</p>
              <button
                onClick={() => {
                  onViewChange('contact');
                  onClose();
                }}
                className="mt-3 w-full bg-[#C19620] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C19620]/90 transition-colors"
              >
                Contactez-nous
              </button>
            </div>

            <div className="flex flex-col space-y-2 pt-2 border-t">
              <button
                onClick={() => handleLegalClick('/terms')}
                className="flex items-center text-sm text-gray-600 hover:text-[#4F6D0B]"
              >
                <FileTerminal className="h-4 w-4 mr-2" />
                Conditions générales
              </button>
              <button
                onClick={() => handleLegalClick('/privacy')}
                className="flex items-center text-sm text-gray-600 hover:text-[#4F6D0B]"
              >
                <Shield className="h-4 w-4 mr-2" />
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;