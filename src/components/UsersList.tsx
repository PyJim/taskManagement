import { Mail, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UsersListProps {
  users: User[];
}

export const UsersList = ({ users }: UsersListProps) => {

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div key={user.user_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.email.split('@')[0]}</h3>
              <p className="text-sm text-gray-500">Team Member</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="text-sm text-gray-500">
              Member ID: {user.user_id}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};