
import { TrendingUp, Users, ClipboardCheck, Calendar, Target, Award } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'users' | 'tasks' | 'appointments' | 'consultations' | 'completion' | 'clients';
  change?: number;
  suffix?: string;
}

const iconMap = {
  users: Users,
  tasks: ClipboardCheck,
  appointments: Calendar,
  consultations: Target,
  completion: Award,
  clients: Users,
};

const colorMap = {
  users: 'bg-blue-500',
  tasks: 'bg-green-500',
  appointments: 'bg-purple-500',
  consultations: 'bg-orange-500',
  completion: 'bg-accent-500',
  clients: 'bg-primary-500',
};

export default function StatsCard({ title, value, icon, change, suffix }: StatsCardProps) {
  const Icon = iconMap[icon];
  const bgColor = colorMap[icon];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-gray-800">{value}</span>
            {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(change)}% 较上周</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
