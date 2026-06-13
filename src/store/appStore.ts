
import { create } from 'zustand';
import { Client, AssessmentScale, AssessmentResult, AssessmentDelivery, Interview, Report, Task, Appointment, KanbanItem, DashboardStats, KanbanColumn } from '../types';
import { mockClients, mockScales, mockAssessmentResults, mockInterviews, mockReports, mockTasks, mockAppointments } from '../data/mockData';

interface AppState {
  clients: Client[];
  scales: AssessmentScale[];
  assessmentResults: AssessmentResult[];
  assessmentDeliveries: AssessmentDelivery[];
  interviews: Interview[];
  reports: Report[];
  tasks: Task[];
  appointments: Appointment[];
  
  selectedClientId: string | null;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  selectClient: (id: string | null) => void;
  
  // Assessment actions
  getAssessmentResultsByClient: (clientId: string) => AssessmentResult[];
  createAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => void;
  deliverAssessment: (clientId: string, scaleId: string) => void;
  getAssessmentDeliveriesByClient: (clientId: string) => AssessmentDelivery[];
  
  // Interview actions
  getInterviewsByClient: (clientId: string) => Interview[];
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  
  // Report actions
  getReportByClient: (clientId: string) => Report | undefined;
  createReport: (report: Omit<Report, 'id' | 'version' | 'generatedAt'>) => void;
  updateReport: (id: string, content: Report['content']) => void;
  sendReportSummary: (id: string) => void;
  
  // Task actions
  getTasksByClient: (clientId: string) => Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  
  // Appointment actions
  getAppointmentsByClient: (clientId: string) => Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  startConsultation: (id: string) => void;
  cancelAppointment: (id: string) => void;
  
  // Kanban actions
  getKanbanItems: () => KanbanItem[];
  updateKanbanItemStatus: (id: string, status: KanbanColumn) => void;
  
  // Dashboard stats
  getStats: () => DashboardStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  clients: mockClients,
  scales: mockScales,
  assessmentResults: mockAssessmentResults,
  assessmentDeliveries: [],
  interviews: mockInterviews,
  reports: mockReports.map(r => ({ ...r, sendStatus: 'draft' as const })),
  tasks: mockTasks,
  appointments: mockAppointments,
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
  
  deliverAssessment: (clientId, scaleId) => {
    const url = `https://example.com/assessment/${clientId}/${scaleId}/${Date.now()}`;
    set((state) => ({
      assessmentDeliveries: [...state.assessmentDeliveries, {
        id: `ad-${Date.now()}`,
        clientId,
        scaleId,
        url,
        deliveredAt: new Date().toISOString().split('T')[0],
        status: 'sent',
      }],
    }));
    return url;
  },
  
  getAssessmentDeliveriesByClient: (clientId) => {
    const { assessmentDeliveries, scales } = get();
    return assessmentDeliveries
      .filter((d) => d.clientId === clientId)
      .map((d) => ({
        ...d,
        scale: scales.find((s) => s.id === d.scaleId),
      }));
  },
  
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
      sendStatus: 'draft',
    }],
  })),
  
  updateReport: (id, content) => set((state) => ({
    reports: state.reports.map((r) =>
      r.id === id
        ? { ...r, content, version: r.version + 1 }
        : r
    ),
  })),
  
  sendReportSummary: (id) => set((state) => ({
    reports: state.reports.map((r) =>
      r.id === id
        ? { ...r, sentAt: new Date().toISOString().split('T')[0], sendStatus: 'sent' }
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
  
  startConsultation: (id) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === id ? { ...a, status: 'completed' as const } : a
    ),
  })),
  
  cancelAppointment: (id) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    ),
  })),
  
  getKanbanItems: () => {
    const { tasks, appointments, clients } = get();
    const items: KanbanItem[] = [];
    
    tasks.forEach((task) => {
      const client = clients.find((c) => c.id === task.clientId);
      items.push({
        id: task.id,
        title: task.title,
        clientName: client?.name || '',
        type: 'task',
        dueDate: task.deadline,
        status: task.status,
      });
    });
    
    appointments.forEach((appt) => {
      if (appt.status === 'scheduled') {
        const client = clients.find((c) => c.id === appt.clientId);
        items.push({
          id: appt.id,
          title: '职业咨询预约',
          clientName: client?.name || '',
          type: 'appointment',
          dueDate: appt.datetime.split(' ')[0],
          status: 'pending',
        });
      }
    });
    
    return items;
  },
  
  updateKanbanItemStatus: (id: string, status: KanbanColumn) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    
    if (task) {
      get().updateTaskStatus(id, status);
    }
  },
  
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
