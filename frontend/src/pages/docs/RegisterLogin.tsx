import { DocLayout } from './DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

export function DocsRegisterLogin() {
    return (
        <DocLayout>
            <h1 className="text-3xl font-bold mb-6">Creating Register and Login Pages</h1>
            
            <p className="mb-4">
                This guide shows you how to implement user registration and login pages using Aegis.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Registration Page</h2>
            
            <p className="mb-4">
                Create a new file called <code className="text-pink-400">pages/register.js</code> with the following code:
            </p>
            
            <CodeBlock
                language="javascript"
                filename="pages/register.js"
                code={`import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/auth';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const response = await registerUser(formData);
        
        if (!response.success || !response.data) {
            setError(response.error || 'Registration failed');
            setIsLoading(false);
            return;
        }

        login(response.data.sessionToken);
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-md">
                <div>
                    <h2 className="text-3xl font-bold text-center text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
                            Sign in
                        </Link>
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-900/30 text-red-400 p-3 rounded-md">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" 
                                    className="block text-sm font-medium text-gray-300">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                        border-gray-600 rounded-md text-white focus:outline-none 
                                        focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" 
                                    className="block text-sm font-medium text-gray-300">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                        border-gray-600 rounded-md text-white focus:outline-none 
                                        focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" 
                                className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                    border-gray-600 rounded-md text-white focus:outline-none 
                                    focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" 
                                className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                    border-gray-600 rounded-md text-white focus:outline-none 
                                    focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-sky-600 text-white rounded-md 
                            hover:bg-sky-700 focus:outline-none focus:ring-2 
                            focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
}`}
            />
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Login Page</h2>
            
            <p className="mb-4">
                Create a new file called <code className="text-pink-400">pages/login.js</code> with the following code:
            </p>
            
            <CodeBlock
                language="javascript"
                filename="pages/login.js"
                code={`import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const response = await loginUser({ email, password });
        
        if (!response.success || !response.data) {
            setError(response.error || 'Login failed');
            setIsLoading(false);
            return;
        }

        // Pass both the token and the user data to the login function
        login(response.data.sessionToken, response.data.user);
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-md">
                <div>
                    <h2 className="text-3xl font-bold text-center text-white">Sign in</h2>
                    <p className="mt-2 text-center text-gray-400">
                        Or{' '}
                        <Link href="/register" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
                            create an account
                        </Link>
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-900/30 text-red-400 p-3 rounded-md">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" 
                                className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                    border-gray-600 rounded-md text-white focus:outline-none 
                                    focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" 
                                className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border 
                                    border-gray-600 rounded-md text-white focus:outline-none 
                                    focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-sky-600 text-white rounded-md 
                            hover:bg-sky-700 focus:outline-none focus:ring-2 
                            focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}`}
            />
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Adding a Home Page with Authentication Redirect</h2>
            
            <p className="mb-4">
                Update your home page in <code className="text-pink-400">pages/index.js</code> to redirect authenticated users:
            </p>
            
            <CodeBlock
                language="javascript"
                filename="pages/index.js"
                code={`import { useEffect } from 'react';
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
        <div className="min-h-screen flex flex-col items-center justify-center 
            bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to My App</h1>
            <p className="text-xl mb-8 text-gray-300">
                Powered by Aegis Authentication
            </p>
            
            <div className="flex space-x-4">
                <Link 
                    href="/login"
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 rounded-md transition-colors duration-200"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}`}
            />
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>
            
            <p className="mb-4">
                Now that you have implemented authentication pages for your users, let's learn how to 
                access and display user details after authentication:
            </p>
            
            <div className="flex flex-col space-y-4">
                <a href="/docs/user-details" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
                    → Continue to User Details
                </a>
            </div>
        </DocLayout>
    );
}
