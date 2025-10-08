import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Dashboard from './Dashboard';
import QuickQuizPage from './quiz/QuickQuizPage';
import MathEditor from './math-editor/MathEditor';
import AffichageView from './AffichageView';
import StudentProgramsView from './programs/StudentProgramsView';
import MyProgramsView from './programs/MyProgramsView';
import TeacherProgramsView from './programs/TeacherProgramsView';
import PerformanceView from './teacher/PerformanceView';
import PaymentsView from './teacher/PaymentsView';
import GettingStartedView from './teacher/GettingStartedView';
import ProgramCreator from './teacher/ProgramCreator';
import ProgramStatsView from './teacher/ProgramStatsView';
import ProgramManagerView from './teacher/ProgramManagerView';
import ForumView from './ForumView';
import ContactUsView from './ContactUsView';
import TeachWithUsView from './TeachWithUsView';
import { Menu } from 'lucide-react';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [hideTopNav, setHideTopNav] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const isTeacher = currentUser?.userType === 'enseignant';

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'dashboard':
        if (isTeacher) {
          return <TeacherProgramsView />;
        }
        return <StudentProgramsView onQuickQuizStart={() => setCurrentView('quick-quiz')} />;
      case 'my-programs':
        return <MyProgramsView
          onViewChange={setCurrentView}
          onSidebarVisibilityChange={setHideSidebar}
          onTopNavVisibilityChange={setHideTopNav}
        />;
      case 'getting-started':
        return <GettingStartedView />;
      case 'program-manager':
        return <TeacherProgramsView
          onCreateProgram={() => setCurrentView('program-creator')}
          onViewStats={(programId) => {
            setSelectedProgramId(programId);
            setCurrentView('program-stats');
          }}
          onManageProgram={(programId) => {
            setSelectedProgramId(programId);
            setCurrentView('program-manage');
          }}
        />;
      case 'program-stats':
        return selectedProgramId ? (
          <ProgramStatsView
            programId={selectedProgramId}
            onBack={() => setCurrentView('program-manager')}
          />
        ) : null;
      case 'program-manage':
        return selectedProgramId ? (
          <ProgramManagerView
            programId={selectedProgramId}
            onBack={() => setCurrentView('program-manager')}
          />
        ) : null;
      case 'program-creator':
        return <ProgramCreator onClose={() => setCurrentView('home')} />;
      case 'homework-manager':
        return <div className="p-8"><h1 className="text-2xl font-bold">Devoir Manager - En construction</h1></div>;
      case 'performance':
        return <PerformanceView />;
      case 'payments':
        return <PaymentsView />;
      case 'quick-quiz':
        return <QuickQuizPage />;
      case 'math-editor':
        return <MathEditor />;
      case 'affichage':
        return <AffichageView onBack={() => setCurrentView('home')} />;
      case 'e-biblio':
        return <div className="p-8"><h1 className="text-2xl font-bold">e-Biblio - En construction</h1></div>;
      case 'forum':
        return <ForumView />;
      case 'contact':
        return <ContactUsView />;
      case 'teach-with-us':
        return <TeachWithUsView />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!hideSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onViewChange={setCurrentView}
          currentView={currentView}
        />
      )}

      <div className="flex-1 flex flex-col">
        {!hideTopNav && (
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <TopNav onViewChange={setCurrentView} />
          </header>
        )}

        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default Layout;