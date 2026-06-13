
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Calendar, CheckCircle, Clock, Circle, X, Save } from 'lucide-react';

export default function PlanTracking() {
  const { clients, tasks, addTask, updateTaskStatus } = useAppStore();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const clientTasks = selectedClient
    ? tasks.filter((t) => t.clientId === selectedClient)
    : tasks;

  const completedCount = clientTasks.filter((t) => t.status === 'completed').length;
  const progress = clientTasks.length > 0 ? Math.round((completedCount / clientTasks.length) * 100) : 0;

  const statusConfig = {
    pending: { icon: Circle, color: 'bg-gray-100 text-gray-600', label: '待开始' },
    in_progress: { icon: Clock, color: 'bg-blue-100 text-blue-600', label: '进行中' },
    completed: { icon: CheckCircle, color: 'bg-green-100 text-green-600', label: '已完成' },
  };

  const handleSubmit = () => {
    if (!selectedClient || !newTask.title || !newTask.deadline) return;
    addTask({
      clientId: selectedClient,
      title: newTask.title,
      description: newTask.description,
      deadline: newTask.deadline,
      status: 'pending',
    });
    setShowModal(false);
    setNewTask({ title: '', description: '', deadline: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部来访者</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>创建任务</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">任务进度</h3>
          <span className="text-sm text-gray-500">{completedCount}/{clientTasks.length} 已完成</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-600 to-accent-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {clientTasks.map((task) => {
          const client = clients.find((c) => c.id === task.clientId);
          const StatusIcon = statusConfig[task.status].icon;
          
          return (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig[task.status].color}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">
                        {client?.name}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>截止日期: {task.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as 'pending' | 'in_progress' | 'completed')}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">待开始</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">创建任务</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">来访者</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择来访者</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">任务标题</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入任务标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">任务描述</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请输入任务描述"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
