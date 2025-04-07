import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import type { Application, APIResponse } from '../../types/auth';

export function EditApplication() {
  const { id } = useParams<{id: string}>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/applications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data: APIResponse<Application> = await res.json();
        
        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to fetch application');
        }

        setFormData({
          name: data.data.name,
          domain: data.data.domain,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load application');
        navigate('/app/applications');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id, token, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data: APIResponse<Application> = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update application');
      }

      // Navigate to application details instead of list
      navigate(`/app/applications/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    }
  };

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
        <h1 className="text-2xl font-bold">Edit Application</h1>
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 rounded-md bg-neutral-700 border-neutral-600 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({...formData, domain: e.target.value})}
              className="w-full px-3 py-2 rounded-md bg-neutral-700 border-neutral-600 text-white"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/applications')}
              className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
