import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Demo App</h1>
      <p className="text-xl mb-8 text-gray-300">Powered by Auth Service</p>
      
      <div className="flex space-x-4">
        <Link 
          href="/login"
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 rounded-md transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}