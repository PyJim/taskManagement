import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UsersList } from '../components/UsersList';
import { User } from '../types/index';

export const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://y97kbmz70d.execute-api.eu-west-1.amazonaws.com/dev/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data.users as User[]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [setUsers]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Members</h1>
        {isLoading ? (
          <div className="text-gray-600">Loading users...</div>
        ) : (
          <UsersList users={users} />
        )}
      </div>
    </div>
  );
};