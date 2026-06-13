
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Mail, Phone, Calendar, FileText, ClipboardList, Target, Link, Send } from 'lucide-react';
import { AssessmentScale } from '../types';

export default function ClientDetail({ clientId, onBack }: { clientId: string; onBack: () => void }) {
  const { clients, getAssessmentResultsByClient, getInterviewsByClient, getTasksByClient, getAppointmentsByClient, getReportByClient, getAssessmentDeliveriesByClient } = useAppStore();
  
  const client = clients.find((c) => c.id === clientId);
  const assessments = getAssessmentResultsByClient(clientId);
  const interviews = getInterviewsByClient(clientId);
  const tasks = getTasksByClient(clientId);
  const appointments = getAppointmentsByClient(clientId);
  const report = getReportByClient(clientId);
  const deliveries = getAssessmentDeliveriesByClient(clientId);

  if (!client) return null;

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const statusLabels = {
    active: '进行中',
    inactive: '暂停',
    completed: '已完成',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回列表</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-white/70 mt-1">{client.age}岁 · {client.gender}</p>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                {statusLabels[client.status]}
              </span>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 text-white/70">
              <Mail className="w-4 h-4" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Phone className="w-4 h-4" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="w-4 h-4" />
              <span>创建于 {client.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">测评记录</p>
              <p className="text-xl font-bold text-gray-800">{assessments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">访谈记录</p>
              <p className="text-xl font-bold text-gray-800">{interviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">诊断报告</p>
              <p className="text-xl font-bold text-gray-800">{report ? report.version : 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">预约记录</p>
              <p className="text-xl font-bold text-gray-800">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">测评发放记录</h3>
            {deliveries.length > 0 ? (
              <div className="space-y-4">
                {deliveries.map((delivery: typeof deliveries[0] & { scale?: AssessmentScale }) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-800">{delivery.scale?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Link className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500 truncate max-w-xs">{delivery.url}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">发放于 {delivery.deliveredAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === 'completed' ? 'bg-green-100 text-green-700' :
                      delivery.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {delivery.status === 'completed' ? '已完成' : delivery.status === 'sent' ? '已发送' : '已过期'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">暂无测评发放记录</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">最近测评</h3>
            {assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.slice(0, 3).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{assessment.scale?.name}</p>
                      <p className="text-sm text-gray-500">完成于 {assessment.completedAt}</p>
                    </div>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                      得分: {assessment.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">暂无测评记录</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">任务进度</h3>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <p className={`text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</p>
                  <p className="text-xs text-gray-400">{task.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
