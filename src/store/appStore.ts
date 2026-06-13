
import { create } from 'zustand';
import { Client, AssessmentScale, AssessmentResult, Interview, Report, Task, Appointment, KanbanItem, DashboardStats } from '../types';
import { mockClients, mockScales, mockAssessmentResults, mockInterviews, mockReports, mockTasks, mockAppointments, mockKanbanItems } from '../data/mockData';

interface AppState {
  clients: Client[];
  scales: AssessmentScale[];
  assessmentResults: AssessmentResult[];
  interviews: Interview[];
  reports: Report[];
  tasks: Task[];
  appointments: Appointment[];
  kanbanItems: KanbanItem[];
  
  selectedClientId: string | null;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  selectClient: (id: string | null) => void;
  
  // Assessment actions
  getAssessmentResultsByClient: (clientId: string) => AssessmentResult[];
  createAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => void;
  
  // Interview actions
  getInterviewsByClient: (clientId: string) => Interview[];
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  
  // Report actions
  getReportByClient: (clientId: string) => Report | undefined;
  createReport: (report: Omit<Report, 'id' | 'version' | 'generatedAt'>) => void;
  updateReport: (id: string, content: Report['content']) => void;
  
  // Task actions
  getTasksByClient: (clientId: string) => Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  
  // Appointment actions
  getAppointmentsByClient: (clientId: string) => Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  
  // Kanban actions
  updateKanbanItemStatus: (id: string, status: KanbanItem['status']) => void;
  
  // Dashboard stats
  getStats: () => DashboardStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  clients: mockClients,
  scales: mockScales,
  assessmentResults: mockAssessmentResults,
  interviews: mockInterviews,
  reports: mockReports,
  tasks: mockTasks,
  appointments: mockAppointments,
  kanbanItems: mockKanbanItems,
  selectedClientId: null,
  
  addClient: (client) => set((state) => ({
    clients: [...state.clients, {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }],
  })),
  
  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),
  
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
  })),
  
  selectClient: (id) => set({ selectedClientId: id }),
  
  getAssessmentResultsByClient: (clientId) => {
    const { assessmentResults, scales } = get();
    return assessmentResults
      .filter((r) => r.clientId === clientId)
      .map((r) => ({
        ...r,
        scale: scales.find((s) => s.id === r.scaleId),
      }));
  },
  
  createAssessmentResult: (result) => set((state) => ({
    assessmentResults: [...state.assessmentResults, {
      ...result,
      id: `ar-${Date.now()}`,
    }],
  })),
  
  getInterviewsByClient: (clientId) => {
    const { interviews } = get();
    return interviews.filter((i) => i.clientId === clientId);
  },
  
  addInterview: (interview) => set((state) => ({
    interviews: [...state.interviews, {
      ...interview,
      id: `i-${Date.now()}`,
    }],
  })),
  
  updateInterview: (id, updates) => set((state) => ({
    interviews: state.interviews.map((i) => (i.id === id ? { ...i, ...updates } : i)),
  })),
  
  getReportByClient: (clientId) => {
    const { reports } = get();
    return reports.find((r) => r.clientId === clientId);
  },
  
  createReport: (report) => set((state) => ({
    reports: [...state.reports, {
      ...report,
      id: `r-${Date.now()}`,
      version: 1,
      generatedAt: new Date().toISOString().split('T')[0],
    }],
  })),
  
  updateReport: (id, content) => set((state) => ({
    reports: state.reports.map((r) =>
      r.id === id
        ? { ...r, content, version: r.version + 1 }
        : r
    ),
  })),
  
  getTasksByClient: (clientId) => {
    const { tasks } = get();
    return tasks.filter((t) => t.clientId === clientId);
  },
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: `t-${Date.now()}`,
    }],
  })),
  
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
          }
        : t
    ),
  })),
  
  getAppointmentsByClient: (clientId) => {
    const { appointments } = get();
    return appointments.filter((a) => a.clientId === clientId);
  },
  
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, {
      ...appointment,
      id: `a-${Date.now()}`,
    }],
  })),
  
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    ),
  })),
  
  updateKanbanItemStatus: (id, status) => set((state) => ({
    kanbanItems: state.kanbanItems.map((item) =>
      item.id === id ? { ...item, status } : item
    ),
  })),
  
  getStats: () => {
    const { clients, tasks, appointments, assessmentResults } = get();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    
    const upcomingAppointments = appointments.filter((a) => {
      const apptDate = new Date(a.datetime);
      return a.status === 'scheduled' && apptDate >= today;
    }).length;
    
    const thisWeekConsultations = appointments.filter((a) => {
      const apptDate = new Date(a.datetime);
      return a.status === 'completed' && apptDate >= weekAgo && apptDate <= today;
    }).length;
    
    const totalAssessments = assessmentResults.length;
    const completedAssessments = assessmentResults.filter((ar) => ar.completedAt).length;
    const assessmentCompletionRate = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0;
    
    return {
      totalClients: clients.length,
      pendingTasks,
      completedTasks,
      upcomingAppointments,
      thisWeekConsultations,
      assessmentCompletionRate,
    };
  },
}));
