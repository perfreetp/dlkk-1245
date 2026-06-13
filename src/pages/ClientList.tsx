
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Search, MoreVertical, Mail, Phone, Calendar, X, Save, User } from 'lucide-react';

export default function ClientList({ onSelectClient }: { onSelectClient: (id: string) => void }) {
  const { clients, addClient } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    gender: '男',
    age: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'completed',
  });

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleSubmit = () => {
    if (!newClient.name || !newClient.email) return;
    addClient({
      name: newClient.name,
      gender: newClient.gender,
      age: parseInt(newClient.age) || 0,
      email: newClient.email,
      phone: newClient.phone,
      status: newClient.status,
    });
    setShowModal(false);
    setNewClient({
      name: '',
      gender: '男',
      age: '',
      email: '',
      phone: '',
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索来访者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="inactive">暂停</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建档案</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">来访者</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">联系方式</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">状态</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">创建时间</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.age}岁 · {client.gender}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                    {statusLabels[client.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{client.createdAt}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectClient(client.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      查看详情
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">新建来访者档案</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入姓名"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                  <select
                    value={newClient.gender}
                    onChange={(e) => setNewClient({ ...newClient, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                  <input
                    type="number"
                    value={newClient.age}
                    onChange={(e) => setNewClient({ ...newClient, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入年龄"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入邮箱"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入电话号码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({ ...newClient, status: e.target.value as 'active' | 'inactive' | 'completed' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">进行中</option>
                  <option value="inactive">暂停</option>
                  <option value="completed">已完成</option>
                </select>
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
