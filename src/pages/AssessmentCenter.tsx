
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Send, Eye, BarChart3, FileCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AssessmentCenter() {
  const { scales, assessmentResults, clients } = useAppStore();
  const [selectedScale, setSelectedScale] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const clientResults = selectedClient
    ? assessmentResults.filter((r) => r.clientId === selectedClient)
    : assessmentResults;

  const colors = ['#1e3a5f', '#00d4aa', '#60a5fa', '#f59e0b', '#ef4444'];

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
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
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
    </div>
  );
}
