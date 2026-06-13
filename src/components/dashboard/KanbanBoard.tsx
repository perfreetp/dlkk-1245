
import { useAppStore } from '../../store/appStore';
import { KanbanItem } from '../../types';
import { ClipboardList, Calendar, FileCheck, ChevronRight } from 'lucide-react';

const columns = [
  { id: 'pending', title: '待跟进', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'in_progress', title: '进行中', color: 'bg-blue-100 text-blue-700' },
  { id: 'completed', title: '已完成', color: 'bg-green-100 text-green-700' },
] as const;

const typeIcons = {
  task: ClipboardList,
  appointment: Calendar,
  assessment: FileCheck,
};

const typeLabels = {
  task: '任务',
  appointment: '预约',
  assessment: '测评',
};

export default function KanbanBoard() {
  const { kanbanItems, updateKanbanItemStatus } = useAppStore();

  const handleDragStart = (e: React.DragEvent, item: KanbanItem) => {
    e.dataTransfer.setData('itemId', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: KanbanItem['status']) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    if (itemId) {
      updateKanbanItemStatus(itemId, status);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">待跟进看板</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          查看全部
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => {
          const filteredItems = kanbanItems.filter((item) => item.status === column.id);
          return (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-700">{column.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${column.color}`}>
                  {filteredItems.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{typeLabels[item.type]}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <h5 className="font-medium text-gray-800 mt-2">{item.title}</h5>
                      <p className="text-sm text-gray-500 mt-1">{item.clientName}</p>
                      {item.dueDate && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{item.dueDate}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
