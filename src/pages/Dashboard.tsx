import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/TaskCard';
import { Navbar } from '../components/Navbar';
import { TaskFilter } from '../components/TaskFilter';
import { Task } from '../types';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { tasks, addTask, updateTask, deleteTask, getUserTasks, filterTasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    task_id: '',
    title: '',
    description: '',
    assigned_to: '',
    status: 'pending' as Task['status'],
    created_at: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {

    if (!(user && accessToken)) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const isAdmin = user?.groups?.includes('Admins') || false;

  // Fetch tasks when component mounts and user is present
  useEffect(() => {
    if (user) {
      setLoading(true); // Set loading to true when tasks are being fetched
      getUserTasks(user?.username || '', isAdmin).finally(() => setLoading(false)); // Set loading to false when done
    }
  }, [user, isAdmin, getUserTasks]);

  // Apply filters to tasks after they are fetched
  const filteredTasks = isAdmin
  ? filterTasks(status, search).filter((task) => task && task.task_id)
  : tasks
      .filter((task) => 
        task && 
        (status === 'all' || task.status === status) &&
        (search === '' || 
         task.title.toLowerCase().includes(search.toLowerCase()) ||
         task.description.toLowerCase().includes(search.toLowerCase()))
      )
      .filter((task) => task && task.task_id); // Ensure valid tasks only


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.task_id, formData);
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ task_id: '', title: '', description: '', assigned_to: '', status: 'pending', created_at: '', deadline: '' });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      status: task.status,
      created_at: task.created_at,
      deadline: task.deadline,
      task_id: task.task_id,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Add Task
            </button>
          )}
        </div>

        <TaskFilter
          status={status}
          search={search}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
        />

        {/* Show loading spinner when tasks are loading */}
        {loading ? (
          <div className="text-center mt-8">
            <p>Loading tasks...</p>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              return (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onEdit={isAdmin ? handleEdit : undefined}
                  onDelete={isAdmin ? deleteTask : undefined}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
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
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
