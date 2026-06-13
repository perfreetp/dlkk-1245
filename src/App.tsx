
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import AssessmentCenter from './pages/AssessmentCenter';
import InterviewRecords from './pages/InterviewRecords';
import ReportCenter from './pages/ReportCenter';
import PlanTracking from './pages/PlanTracking';
import AppointmentPage from './pages/AppointmentPage';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: '仪表盘', subtitle: '查看您的工作概览' },
  clients: { title: '来访者档案', subtitle: '管理来访者信息' },
  clientDetail: { title: '来访者详情', subtitle: '查看来访者完整信息' },
  assessments: { title: '测评中心', subtitle: '量表管理与测评结果' },
  interviews: { title: '访谈记录', subtitle: '记录访谈要点' },
  reports: { title: '诊断报告', subtitle: '生成和管理诊断报告' },
  plans: { title: '方案跟踪', subtitle: '跟踪任务完成情况' },
  appointments: { title: '预约管理', subtitle: '安排咨询时间' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedClientId(null);
  };

  const handleSelectClient = (id: string) => {
    setSelectedClientId(id);
    setCurrentPage('clientDetail');
  };

  const handleBackToList = () => {
    setSelectedClientId(null);
    setCurrentPage('clients');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientList onSelectClient={handleSelectClient} />;
      case 'clientDetail':
        return selectedClientId ? (
          <ClientDetail clientId={selectedClientId} onBack={handleBackToList} />
        ) : (
          <ClientList onSelectClient={handleSelectClient} />
        );
      case 'assessments':
        return <AssessmentCenter />;
      case 'interviews':
        return <InterviewRecords />;
      case 'reports':
        return <ReportCenter />;
      case 'plans':
        return <PlanTracking />;
      case 'appointments':
        return <AppointmentPage />;
      default:
        return <Dashboard />;
    }
  };

  const pageInfo = pageTitles[currentPage === 'clientDetail' ? 'clientDetail' : currentPage] || { title: '职业诊断' };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage === 'clientDetail' ? 'clients' : currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
