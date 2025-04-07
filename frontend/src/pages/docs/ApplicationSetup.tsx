import { DocLayout } from './DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

export function DocsApplicationSetup() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-bold mb-6">Application Setup</h1>
      
      <p className="mb-4">
        This guide will help you set up Aegis authentication in your Next.js application.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Environment Configuration</h2>
      
      <p className="mb-4">
        First, set up your environment variables by creating or updating your <code className="text-pink-400">.env.local</code> file
        in the root of your Next.js project:
      </p>
      
      <CodeBlock
        language="bash"
        filename=".env.local"
        code={`# Authentication settings
NEXT_PUBLIC_AUTH_SERVER_BACKEND_HOST=http://localhost:8080
NEXT_PUBLIC_AEGIS_PUBLIC_KEY=pk_your_public_key_here
AEGIS_SECRET_KEY=sk_your_secret_key_here`}
      />
      
      <div className="p-4 bg-neutral-800 rounded-md my-6">
        <p className="font-semibold text-yellow-400">⚠️ Note</p>
        <p className="text-gray-300">
          Replace <code className="text-pink-400">pk_your_public_key_here</code> and <code className="text-pink-400">sk_your_secret_key_here</code> with the actual keys from your Aegis dashboard.
          Note that the public key uses the <code className="text-pink-400">NEXT_PUBLIC_</code> prefix because it can be exposed to the client,
          while the secret key does not have this prefix as it should only be used server-side.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Create Authentication Utilities</h2>
      
      <p className="mb-4">
        Create a new file called <code className="text-pink-400">utils/auth.js</code> to handle authentication operations:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="utils/auth.js"
        code={`import crypto from 'crypto';

// Configuration from environment variables
const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_BACKEND_HOST || 'http://localhost:8080';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_AEGIS_PUBLIC_KEY;
const SECRET_KEY = process.env.AEGIS_SECRET_KEY;

// Generate HMAC signature for API requests
function generateSignature(method, path, timestamp, body) {
  try {
    const payload = timestamp + method + path + body;
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    return hmac.digest('hex');
  } catch (error) {
    console.error('Signature generation error:', error);
    return '';
  }
}

// Register a new user
export async function registerUser(userData) {
  const path = '/api/users/register';
  const method = 'POST';
  const timestamp = Date.now().toString();
  const body = JSON.stringify(userData);
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    
    const response = await fetch(\`\${API_URL}\${path}\`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': PUBLIC_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      body,
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: \`Server error: \${response.status}\` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: \`Network error: \${error.message}\` };
  }
}

// Login an existing user
export async function loginUser(credentials) {
  const path = '/api/users/login';
  const method = 'POST';
  const timestamp = Date.now().toString();
  const body = JSON.stringify(credentials);
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    
    const response = await fetch(\`\${API_URL}\${path}\`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': PUBLIC_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      body,
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: \`Server error: \${response.status}\` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: \`Network error: \${error.message}\` };
  }
}

// Check API connectivity (useful for debugging)
export async function checkApiConnection() {
  try {
    const response = await fetch(\`\${API_URL}/health\`, {
      method: 'GET',
      mode: 'cors',
    });
    
    if (!response.ok) {
      return { success: false, error: \`Health check failed: \${response.status}\` };
    }
    
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { success: false, error: \`Connection test failed: \${error.message}\` };
  }
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: Create an Authentication Context</h2>
      
      <p className="mb-4">
        Create a new file called <code className="text-pink-400">context/AuthContext.js</code> to manage authentication state throughout your application:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="context/AuthContext.js"
        code={`import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session and user data on mount
    const token = localStorage.getItem('sessionToken');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      setSessionToken(token);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse stored user data');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('sessionToken', token);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
    setSessionToken(token);
  };

  const logout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userData');
    setSessionToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!sessionToken,
      sessionToken,
      user,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 4: Update Your App Component</h2>
      
      <p className="mb-4">
        Update your <code className="text-pink-400">pages/_app.js</code> file to wrap your application with the AuthProvider:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="pages/_app.js"
        code={`import '@/styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>
      
      <p className="mb-4">
        Now that you have set up the basic authentication infrastructure, you're ready to implement 
        the registration and login functionality in your application:
      </p>
      
      <div className="flex flex-col space-y-4">
        <a href="/docs/register-login" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
          → Continue to Register and Login
        </a>
      </div>
    </DocLayout>
  );
}
