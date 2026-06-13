
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Calendar, Clock, CheckCircle, XCircle, Save, X } from 'lucide-react';

export default function AppointmentPage() {
  const { clients, appointments, addAppointment } = useAppStore();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    datetime: '',
    notes: '',
  });

  const clientAppointments = selectedClient
    ? appointments.filter((a) => a.clientId === selectedClient)
    : appointments;

  const statusConfig = {
    scheduled: { icon: Clock, color: 'bg-blue-100 text-blue-600', label: '已预约' },
    completed: { icon: CheckCircle, color: 'bg-green-100 text-green-600', label: '已完成' },
    cancelled: { icon: XCircle, color: 'bg-red-100 text-red-600', label: '已取消' },
  };

  const handleSubmit = () => {
    if (!selectedClient || !newAppointment.datetime) return;
    addAppointment({
      clientId: selectedClient,
      counselorId: 'c1',
      datetime: newAppointment.datetime,
      notes: newAppointment.notes,
      status: 'scheduled',
    });
    setShowModal(false);
    setNewAppointment({ datetime: '', notes: '' });
  };

  const groupedAppointments = clientAppointments.reduce((acc, appt) => {
    const date = appt.datetime.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(appt);
    return acc;
  }, {} as Record<string, typeof appointments>);

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
          <span>安排预约</span>
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedAppointments).map(([date, appts]) => (
          <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">{date}</span>
                <span className="text-sm text-gray-500">({appts.length} 个预约)</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {appts.map((appt) => {
                const client = clients.find((c) => c.id === appt.clientId);
                const StatusIcon = statusConfig[appt.status].icon;
                
                return (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig[appt.status].color}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-800">{client?.name}</span>
                          <span className="text-sm text-gray-500">{appt.datetime.split(' ')[1]}</span>
                        </div>
                        {appt.notes && (
                          <p className="text-sm text-gray-500 mt-1">{appt.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {appt.status === 'scheduled' && (
                        <>
                          <button className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            开始咨询
                          </button>
                          <button className="px-3 py-1.5 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                            取消
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">安排咨询预约</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">预约时间</label>
                <input
                  type="datetime-local"
                  value={newAppointment.datetime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, datetime: e.target.value.replace('T', ' ') })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请输入备注信息..."
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
                  <span>保存预约</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
