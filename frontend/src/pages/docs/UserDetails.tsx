import { DocLayout } from './DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

export function DocsUserDetails() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-bold mb-6">Working with User Details</h1>
      
      <p className="mb-4">
        This guide covers retrieving and displaying authenticated user details in your application.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Add User Details Fetching</h2>
      
      <p className="mb-4">
        First, add a function to fetch user details to your <code className="text-pink-400">utils/auth.js</code> file:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="utils/auth.js"
        code={`// Get authenticated user details
export async function getUserDetails(sessionToken) {
  const path = '/api/users/me';
  const method = 'GET';
  const timestamp = Date.now().toString();
  const body = '';
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    
    const response = await fetch(\`\${API_URL}\${path}\`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': PUBLIC_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'X-Session-Token': sessionToken,
      },
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return { success: false, error: \`Server error: \${response.status}\` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { success: false, error: \`Network error: \${error.message}\` };
  }
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Update Login Function to Fetch User Details</h2>
      
      <p className="mb-4">
        Modify the login function in <code className="text-pink-400">utils/auth.js</code> to fetch user details after successful login:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="utils/auth.js"
        code={`// Update the login function in utils/auth.js
export async function loginUser(credentials) {
  // ... existing code ...
  
  try {
    // ... existing request code ...
    
    const data = await response.json();
    
    // If login was successful and we have a session token, fetch user details
    if (data.success && data.data && data.data.sessionToken) {
      const userResponse = await getUserDetails(data.data.sessionToken);
      if (userResponse.success && userResponse.data) {
        data.data.user = userResponse.data;
      }
    }
    
    return data;
  } catch (error) {
    // ... existing error handling ...
  }
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: Create a User Profile Component</h2>
      
      <p className="mb-4">
        Create a component to display user information at <code className="text-pink-400">components/UserProfile.js</code>:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="components/UserProfile.js"
        code={`import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-gray-400">User information not available</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
      
      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-white">{user.firstName} {user.lastName}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-white">{user.email}</p>
        </div>
        
        {user.createdAt && (
          <div>
            <p className="text-gray-400 text-sm">Account Created</p>
            <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 4: Create a Dashboard with User Information</h2>
      
      <p className="mb-4">
        Create a dashboard page at <code className="text-pink-400">pages/dashboard.js</code> that displays the user's information:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="pages/dashboard.js"
        code={`import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';

export default function Dashboard() {
  const { isAuthenticated, logout, isLoading, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">My App Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-300">
                Welcome, {user.firstName}
              </span>
            )}
            <button
              onClick={logout}
              className="bg-gray-700 px-4 py-2 text-white rounded-md hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Welcome to the Dashboard!</h2>
              <p className="text-gray-300">
                You are now authenticated with Aegis.
              </p>
              <p className="text-gray-300 mt-4">
                Your session is active.
              </p>
            </div>
            
            {/* User profile section */}
            <div className="mt-6">
              <UserProfile />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 5: Handle Loading and Protected Routes</h2>
      
      <p className="mb-4">
        Your auth context should already handle loading states. In each protected page, add similar protection 
        code as in the dashboard to redirect unauthenticated users:
      </p>
      
      <CodeBlock
        language="javascript"
        filename="example/ProtectedPage.js"
        code={`import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Your protected page content here
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
      
      <p className="mb-4">
        You now have a complete authentication system integrated with Aegis that:
      </p>
      
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Registers new users securely</li>
        <li>Authenticates existing users</li>
        <li>Fetches and displays user profile information</li>
        <li>Protects routes that require authentication</li>
        <li>Manages user sessions</li>
      </ul>
      
      <p className="mb-4">
        For more detailed information about the available API endpoints and parameters, check out our API Reference:
      </p>
      
      <div className="flex flex-col space-y-4">
        <a href="/docs/api" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
          → View the API Reference
        </a>
      </div>
    </DocLayout>
  );
}
