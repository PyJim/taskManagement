import { Search } from 'lucide-react';

interface TaskFilterProps {
  status: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
}

export const TaskFilter = ({ status, search, onStatusChange, onSearchChange }: TaskFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};