
import { LayoutDashboard, Users, ClipboardList, FileText, BarChart3, Calendar, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { id: 'clients', icon: Users, label: '来访者档案' },
  { id: 'assessments', icon: BarChart3, label: '测评中心' },
  { id: 'interviews', icon: ClipboardList, label: '访谈记录' },
  { id: 'reports', icon: FileText, label: '诊断报告' },
  { id: 'plans', icon: ClipboardList, label: '方案跟踪' },
  { id: 'appointments', icon: Calendar, label: '预约管理' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-primary-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary-600">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </span>
          职业诊断
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-600">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-700 hover:text-white transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">设置</span>
        </button>
      </div>
    </aside>
  );
}
