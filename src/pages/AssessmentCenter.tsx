
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Send, Eye, BarChart3, FileCheck, X, Copy, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AssessmentCenter() {
  const { scales, assessmentResults, clients, deliverAssessment, assessmentDeliveries } = useAppStore();
  const [selectedScale, setSelectedScale] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const clientResults = selectedClient
    ? assessmentResults.filter((r) => r.clientId === selectedClient)
    : assessmentResults;

  const colors = ['#1e3a5f', '#00d4aa', '#60a5fa', '#f59e0b', '#ef4444'];

  const handleDeliver = () => {
    if (!selectedClient || !selectedScale) return;
    const url = `https://example.com/assessment/${selectedClient}/${selectedScale}/${Date.now()}`;
    deliverAssessment(selectedClient, selectedScale);
    setCopiedUrl(url);
  };

  const handleCopyUrl = () => {
    if (copiedUrl) {
      navigator.clipboard.writeText(copiedUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedClient || ''}
            onChange={(e) => setSelectedClient(e.target.value || null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部来访者</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>创建量表</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">量表库</h3>
          {scales.map((scale) => (
            <div
              key={scale.id}
              onClick={() => setSelectedScale(scale.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedScale === scale.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{scale.name}</p>
                  <p className="text-xs text-gray-500">{scale.type}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScale(scale.id);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>发放</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">测评结果</h3>
            <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <Eye className="w-4 h-4" />
              <span>查看详情</span>
            </button>
          </div>

          {clientResults.length > 0 ? (
            <div className="space-y-6">
              {clientResults.slice(0, 3).map((result) => {
                const client = clients.find((c) => c.id === result.clientId);
                const scale = scales.find((s) => s.id === result.scaleId);
                
                const data = Object.entries(result.detailedScore).map(([key, value]) => ({
                  name: key,
                  score: value,
                }));

                return (
                  <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-gray-800">{scale?.name}</p>
                        <p className="text-sm text-gray-500">{client?.name} · {result.completedAt}</p>
                      </div>
                      <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                        总分: {result.score}
                      </span>
                    </div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                            {data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">暂无测评结果</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">发放测评</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择来访者</label>
                <select
                  value={selectedClient || ''}
                  onChange={(e) => setSelectedClient(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择来访者</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择量表</label>
                <select
                  value={selectedScale || ''}
                  onChange={(e) => setSelectedScale(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择量表</option>
                  {scales.map((scale) => (
                    <option key={scale.id} value={scale.id}>{scale.name}</option>
                  ))}
                </select>
              </div>
              
              {copiedUrl && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">测评链接</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={copiedUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copiedUrl ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">已生成测评链接，请复制发送给来访者</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDeliver}
                  disabled={!selectedClient || !selectedScale}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedClient && selectedScale
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>生成链接</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
