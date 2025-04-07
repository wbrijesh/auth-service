import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import type { Application, APIResponse, ApplicationsListResponse } from '../types/auth';

export function Applications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data: APIResponse<Application> = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create application');
      }

      await fetchApplications();
      setIsCreating(false);
      setFormData({ name: '', domain: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
    }
  };

  const handleUpdate = async (id: string) => {
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

      await fetchApplications();
      setEditingId(null);
      setFormData({ name: '', domain: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`${API_URL}/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: APIResponse<null> = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete application');
      }

      await fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
        >
          Create New Application
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {isCreating && (
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Create New Application</h2>
          <form onSubmit={handleCreate} className="space-y-4">
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
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 mt-6">
        {applications.length === 0 ? (
          <div className="bg-neutral-800 p-6 rounded-lg text-center">
            <p className="text-gray-400">You don't have any applications yet.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 text-sky-500 hover:text-sky-400"
            >
              Create your first application
            </button>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="bg-neutral-800 p-6 rounded-lg">
              {editingId === app.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-neutral-700 border-neutral-600 text-white"
                  />
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    className="w-full px-3 py-2 rounded-md bg-neutral-700 border-neutral-600 text-white"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleUpdate(app.id)}
                      className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{app.name}</h3>
                      <p className="text-gray-400 mt-1">{app.domain}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingId(app.id);
                          setFormData({ name: app.name, domain: app.domain });
                        }}
                        className="bg-neutral-700 text-white px-3 py-1 rounded-md hover:bg-neutral-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-neutral-900 rounded-md">
                    <p className="text-sm font-mono text-gray-400">Public Key: {app.publicKey}</p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
