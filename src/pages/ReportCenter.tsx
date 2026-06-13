
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Download, Edit3, Eye, Check, X } from 'lucide-react';

export default function ReportCenter() {
  const { clients, reports, createReport } = useAppStore();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [newReport, setNewReport] = useState({
    strengths: [''],
    limitations: [''],
    recommendations: [''],
    careerDirections: [''],
    explorationTasks: [''],
    summary: '',
  });

  const handleAddField = (field: keyof typeof newReport) => {
    if (Array.isArray(newReport[field])) {
      setNewReport((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), ''],
      }));
    }
  };

  const handleUpdateField = (field: keyof typeof newReport, index: number, value: string) => {
    if (Array.isArray(newReport[field])) {
      const updated = [...(newReport[field] as string[])];
      updated[index] = value;
      setNewReport((prev) => ({ ...prev, [field]: updated }));
    }
  };

  const handleRemoveField = (field: keyof typeof newReport, index: number) => {
    if (Array.isArray(newReport[field]) && (newReport[field] as string[]).length > 1) {
      const updated = (newReport[field] as string[]).filter((_, i) => i !== index);
      setNewReport((prev) => ({ ...prev, [field]: updated }));
    }
  };

  const handleSubmit = () => {
    if (!selectedClient) return;
    
    const filteredReport = {
      ...newReport,
      strengths: newReport.strengths.filter(Boolean),
      limitations: newReport.limitations.filter(Boolean),
      recommendations: newReport.recommendations.filter(Boolean),
      careerDirections: newReport.careerDirections.filter(Boolean),
      explorationTasks: newReport.explorationTasks.filter(Boolean),
    };

    createReport({
      clientId: selectedClient,
      counselorId: 'c1',
      content: filteredReport,
    });

    setShowModal(false);
    setNewReport({
      strengths: [''],
      limitations: [''],
      recommendations: [''],
      careerDirections: [''],
      explorationTasks: [''],
      summary: '',
    });
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
          <span>生成报告</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {reports.map((report) => {
          const client = clients.find((c) => c.id === report.clientId);
          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                      {client?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client?.name}</p>
                      <p className="text-sm text-gray-500">版本 {report.version} · {report.generatedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>预览</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>导出</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">核心优势</h4>
                  <div className="flex flex-wrap gap-1">
                    {report.content.strengths.slice(0, 3).map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">推荐方向</h4>
                  <div className="flex flex-wrap gap-1">
                    {report.content.careerDirections.slice(0, 3).map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">摘要</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{report.content.summary}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">生成诊断报告</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">优势因素</label>
                <div className="space-y-2">
                  {newReport.strengths.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateField('strengths', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入优势..."
                      />
                      {newReport.strengths.length > 1 && (
                        <button onClick={() => handleRemoveField('strengths', index)} className="p-2 text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => handleAddField('strengths')} className="flex items-center gap-1 text-sm text-primary-600">
                    <Plus className="w-4 h-4" />
                    <span>添加优势</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">限制因素</label>
                <div className="space-y-2">
                  {newReport.limitations.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateField('limitations', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入限制因素..."
                      />
                      {newReport.limitations.length > 1 && (
                        <button onClick={() => handleRemoveField('limitations', index)} className="p-2 text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => handleAddField('limitations')} className="flex items-center gap-1 text-sm text-primary-600">
                    <Plus className="w-4 h-4" />
                    <span>添加限制因素</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">职业建议</label>
                <div className="space-y-2">
                  {newReport.recommendations.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateField('recommendations', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入建议..."
                      />
                      {newReport.recommendations.length > 1 && (
                        <button onClick={() => handleRemoveField('recommendations', index)} className="p-2 text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => handleAddField('recommendations')} className="flex items-center gap-1 text-sm text-primary-600">
                    <Plus className="w-4 h-4" />
                    <span>添加建议</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">推荐职业方向</label>
                <div className="space-y-2">
                  {newReport.careerDirections.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateField('careerDirections', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入职业方向..."
                      />
                      {newReport.careerDirections.length > 1 && (
                        <button onClick={() => handleRemoveField('careerDirections', index)} className="p-2 text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => handleAddField('careerDirections')} className="flex items-center gap-1 text-sm text-primary-600">
                    <Plus className="w-4 h-4" />
                    <span>添加方向</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">探索任务</label>
                <div className="space-y-2">
                  {newReport.explorationTasks.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateField('explorationTasks', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入任务..."
                      />
                      {newReport.explorationTasks.length > 1 && (
                        <button onClick={() => handleRemoveField('explorationTasks', index)} className="p-2 text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => handleAddField('explorationTasks')} className="flex items-center gap-1 text-sm text-primary-600">
                    <Plus className="w-4 h-4" />
                    <span>添加任务</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报告摘要</label>
                <textarea
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请输入报告摘要..."
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
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>生成报告</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
