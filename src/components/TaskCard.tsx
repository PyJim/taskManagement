import { Edit2, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { useAuthStore } from '../store/authStore';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Task['status']) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  // Parse the date and ensure it's handled correctly
  const formattedDate = new Date(task.deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(task)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete?.(task.task_id)}
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="flex justify-between items-center">
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(task.task_id, e.target.value as Task['status'])}
          className="px-3 py-1 border rounded-md text-sm"
          disabled={!onStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <span className="text-sm text-gray-500">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
