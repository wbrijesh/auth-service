import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import type { Application, APIResponse, ApplicationsListResponse } from '../../types/auth';

export function Applications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: APIResponse<ApplicationsListResponse> = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch applications');
      }
      
      const responseData = data.data;
      setApplications(responseData?.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        <Link
          to="/app/applications/new"
          className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors duration-200"
        >
          Create New Application
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid gap-6 mt-6">
        {applications.length === 0 ? (
          <div className="bg-neutral-800 p-6 rounded-lg text-center">
            <p className="text-gray-400">You don't have any applications yet.</p>
            <Link
              to="/app/applications/new"
              className="mt-4 text-sky-500 hover:text-sky-400 inline-block transition-colors duration-200"
            >
              Create your first application
            </Link>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="bg-neutral-800 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <Link 
                    to={`/app/applications/${app.id}`}
                    className="text-xl font-bold hover:text-sky-400 transition-colors duration-200"
                  >
                    {app.name}
                  </Link>
                  <p className="text-gray-400 mt-1">{app.domain}</p>
                </div>
                <Link
                  to={`/app/applications/${app.id}/edit`}
                  className="bg-neutral-700 text-white px-3 py-1 rounded-md hover:bg-neutral-600 transition-colors duration-200"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
