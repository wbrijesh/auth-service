import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { APIResponse } from '../types/auth';

export function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data: APIResponse<{ token: string }> = await res.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setToken(data.data.token);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                placeholder="Enter your first name"
                className="text-sm px-3 py-2 mt-1 block w-full rounded-md bg-neutral-700 border-neutral-600 text-white placeholder-gray-400
                focus:border-sky-500 focus:ring-sky-500"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                placeholder="Enter your last name"
                className="text-sm px-3 py-2 mt-1 block w-full rounded-md bg-neutral-700 border-neutral-600 text-white placeholder-gray-400
                focus:border-sky-500 focus:ring-sky-500"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                className="text-sm px-3 py-2 mt-1 block w-full rounded-md bg-neutral-700 border-neutral-600 text-white placeholder-gray-400
                focus:border-sky-500 focus:ring-sky-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Choose a password"
                className="text-sm px-3 py-2 mt-1 block w-full rounded-md bg-neutral-700 border-neutral-600 text-white placeholder-gray-400
                focus:border-sky-500 focus:ring-sky-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
