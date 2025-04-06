import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Demo App Dashboard</h1>
          <button
            onClick={logout}
            className="bg-gray-700 px-4 py-2 text-white rounded-md hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Welcome to the Dashboard!</h2>
              <p className="text-gray-300">
                You are now authenticated with the Auth Service.
              </p>
              <p className="text-gray-300 mt-4">
                Your session is active.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}