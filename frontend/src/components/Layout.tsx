import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { isAuthenticated, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white font-medium">Auth Service</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/app/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                  <Link to="/app/applications" className="text-gray-300 hover:text-white">Applications</Link>
                  <Link to="/app/profile" className="text-gray-300 hover:text-white">Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-neutral-700 text-white hover:bg-neutral-600 px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
