
import { useAppStore } from '../store/appStore';
import StatsCard from '../components/dashboard/StatsCard';
import KanbanBoard from '../components/dashboard/KanbanBoard';

export default function Dashboard() {
  const { getStats } = useAppStore();
  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          title="来访总量"
          value={stats.totalClients}
          icon="clients"
          change={12}
        />
        <StatsCard
          title="待处理任务"
          value={stats.pendingTasks}
          icon="tasks"
          change={-8}
        />
        <StatsCard
          title="本周咨询"
          value={stats.thisWeekConsultations}
          icon="consultations"
          change={25}
        />
        <StatsCard
          title="即将到来的预约"
          value={stats.upcomingAppointments}
          icon="appointments"
        />
        <StatsCard
          title="已完成任务"
          value={stats.completedTasks}
          icon="tasks"
          change={15}
        />
        <StatsCard
          title="测评完成率"
          value={stats.assessmentCompletionRate}
          icon="completion"
          suffix="%"
        />
      </div>
      
      <KanbanBoard />
    </div>
  );
}
