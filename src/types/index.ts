
export interface Client {
  id: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
}

export interface AssessmentScale {
  id: string;
  name: string;
  type: string;
  questions: Question[];
  scoringRules: ScoringRule[];
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  weight: number;
}

export interface ScoringRule {
  range: [number, number];
  label: string;
  description: string;
}

export interface AssessmentResult {
  id: string;
  clientId: string;
  scaleId: string;
  score: number;
  detailedScore: Record<string, number>;
  completedAt: string;
  scale?: AssessmentScale;
}

export interface Interview {
  id: string;
  clientId: string;
  counselorId: string;
  date: string;
  content: string;
  confusionTypes: string[];
}

export interface Report {
  id: string;
  clientId: string;
  counselorId: string;
  content: ReportContent;
  version: number;
  generatedAt: string;
}

export interface ReportContent {
  strengths: string[];
  limitations: string[];
  recommendations: string[];
  careerDirections: string[];
  explorationTasks: string[];
  summary: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  counselorId: string;
  datetime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

export interface DashboardStats {
  totalClients: number;
  pendingTasks: number;
  completedTasks: number;
  upcomingAppointments: number;
  thisWeekConsultations: number;
  assessmentCompletionRate: number;
}

export type KanbanColumn = 'pending' | 'in_progress' | 'completed';

export interface KanbanItem {
  id: string;
  title: string;
  clientName: string;
  type: 'task' | 'appointment' | 'assessment';
  dueDate?: string;
  status: KanbanColumn;
}
