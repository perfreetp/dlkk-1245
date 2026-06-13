
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Calendar, Tag, Edit, Trash2, Save, X } from 'lucide-react';

const confusionTypes = [
  '职业方向困惑', '职业转型困惑', '工作压力', '工作满意度',
  '职业发展瓶颈', '晋升困惑', '职业兴趣探索', '人际关系',
];

export default function InterviewRecords() {
  const { clients, interviews, addInterview } = useAppStore();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [newInterview, setNewInterview] = useState({
    date: '',
    content: '',
    confusionTypes: [] as string[],
  });

  const clientInterviews = selectedClient
    ? interviews.filter((i) => i.clientId === selectedClient)
    : interviews;

  const toggleConfusionType = (type: string) => {
    setNewInterview((prev) => ({
      ...prev,
      confusionTypes: prev.confusionTypes.includes(type)
        ? prev.confusionTypes.filter((t) => t !== type)
        : [...prev.confusionTypes, type],
    }));
  };

  const handleSubmit = () => {
    if (!selectedClient || !newInterview.date || !newInterview.content) return;
    addInterview({
      clientId: selectedClient,
      counselorId: 'c1',
      date: newInterview.date,
      content: newInterview.content,
      confusionTypes: newInterview.confusionTypes,
    });
    setShowModal(false);
    setNewInterview({ date: '', content: '', confusionTypes: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新增记录</span>
        </button>
      </div>

      <div className="space-y-4">
        {clientInterviews.map((interview) => {
          const client = clients.find((c) => c.id === interview.clientId);
          return (
            <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {client?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{client?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{interview.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{interview.content}</p>
              <div className="flex flex-wrap gap-2">
                {interview.confusionTypes.map((type) => (
                  <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    {type}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">新增访谈记录</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">访谈日期</label>
                <input
                  type="date"
                  value={newInterview.date}
                  onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">困惑类型</label>
                <div className="flex flex-wrap gap-2">
                  {confusionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleConfusionType(type)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newInterview.confusionTypes.includes(type)
                          ? 'bg-accent-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">访谈内容</label>
                <textarea
                  value={newInterview.content}
                  onChange={(e) => setNewInterview({ ...newInterview, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请记录访谈要点..."
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
