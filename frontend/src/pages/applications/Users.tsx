import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import type { User, APIResponse, UsersListResponse } from '../../types/auth';

export function ApplicationUsers() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [application, setApplication] = useState({ name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationAndUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch application details
        const appRes = await fetch(`${API_URL}/api/applications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const appData = await appRes.json();
        
        if (!appData.success || !appData.data) {
          throw new Error(appData.error || 'Failed to fetch application details');
        }
        
        setApplication({
          name: appData.data.name
        });

        // Fetch users
        const usersRes = await fetch(`${API_URL}/api/applications/${id}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const usersData: APIResponse<UsersListResponse> = await usersRes.json();
        
        if (!usersData.success) {
          throw new Error(usersData.error || 'Failed to fetch users');
        }
        
        setUsers(usersData.data?.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchApplicationAndUsers();
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="bg-neutral-800 p-6 rounded-lg">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{application.name} - Users</h1>
          <p className="text-gray-400 mt-1">
            Manage users for this application
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/app/applications/${id}`}
            className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
          >
            Back to Application
          </Link>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="bg-neutral-800 p-6 rounded-lg">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No users have registered for this application yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
