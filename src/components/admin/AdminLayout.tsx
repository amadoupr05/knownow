import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import StudentsView from './views/StudentsView';
import TeachersView from './views/TeachersView';
import ContentView from './views/ContentView';
import SettingsView from './views/SettingsView';
import AdminsView from './views/AdminsView';
import QuestionsView from './views/QuestionsView';
import PosterView from './views/PosterView';
import QuestionsManagementView from './views/QuestionsManagementView';
import ProgramCreator from '../teacher/ProgramCreator';
import MathEditor from '../math-editor/MathEditor';
import ExamsManagerView from './views/ExamsManagerView';
import HomeworksManagerView from './views/HomeworksManagerView';
import ExercisesManagerView from './views/ExercisesManagerView';
import SchoolsManagerView from './views/SchoolsManagerView';
import ProgramsManagerView from './views/ProgramsManagerView';

function AdminLayout() {
  const [currentView, setCurrentView] = useState('students');

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  // Verify admin session
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'content':
        return <ContentView />;
      case 'settings':
        return <SettingsView />;
      case 'admins':
        return <AdminsView />;
      case 'questions':
        return <QuestionsManagementView />;
      case 'schools':
        return <SchoolsManagerView />;
      case 'exams':
        return <ExamsManagerView />;
      case 'homeworks':
        return <HomeworksManagerView />;
      case 'exercises':
        return <ExercisesManagerView />;
      case 'math-editor':
        return <MathEditor />;
      case 'poster':
        return <PosterView />;
      case 'program-creator':
        return <ProgramCreator onClose={() => setCurrentView('programs')} />;
      case 'programs':
        return <ProgramsManagerView onCreateProgram={() => setCurrentView('program-creator')} />;
      default:
        return <StudentsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onLogout={handleLogout} />
        <main className="flex-1 overflow-x-auto">
          <div className="p-8 min-w-[1024px]">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;