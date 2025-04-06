import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session on mount
    const token = localStorage.getItem('sessionToken');
    if (token) {
      setSessionToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('sessionToken', token);
    setSessionToken(token);
  };

  const logout = () => {
    localStorage.removeItem('sessionToken');
    setSessionToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!sessionToken,
      sessionToken,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);