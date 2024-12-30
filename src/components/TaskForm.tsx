import { useState, useEffect } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (formData: Omit<Task, 'task_id' | 'created_at'>) => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState<Omit<Task, 'task_id' | 'created_at'>>({
    title: '',
    description: '',
    assigned_to: '',
    deadline: '',
    status: 'pending' as Task['status'],
  });

  useEffect(() => {
    if (task) {
      // Set form data without task_id and created_at
      setFormData({
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        status: task.status,
        deadline: task.deadline,
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simply submit the formData without task_id and created_at
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Assigned To (User ID)</label>
        <input
          type="text"
          value={formData.assigned_to}
          onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
