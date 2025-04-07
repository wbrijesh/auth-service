import { Link } from 'react-router-dom';
import { DocLayout } from './DocLayout';

export function DocsHome() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-bold mb-6">Aegis Documentation</h1>
      
      <p className="mb-4">
        Welcome to the Aegis documentation. This service provides a complete authentication 
        solution for your applications, allowing you to offload user management and authentication 
        to our secure platform.
      </p>
      
    <div className="p-4 bg-neutral-800 rounded-md my-6">
      <div className="flex items-center">
        <span className="text-gray-300 mr-3">📄</span>
        <span>
        If you use LLMs in your development, copy our <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400 transition-colors duration-200 font-medium">llms.txt</a> into the context of your LLMs to make the LLM aware of Aegis and its features. This will help the LLM provide better assistance and suggestions related to Aegis.
        </span>
      </div>
    </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started</h2>
      
      <p className="mb-4">
        To integrate with Aegis, follow these steps:
      </p>
      
      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li>Register for a developer account</li>
        <li>Create an application in your dashboard</li>
        <li>Set up authentication in your application</li>
        <li>Create login and registration pages</li>
        <li>Start authenticating users!</li>
      </ol>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Documentation Sections</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
          <p className="text-gray-400 mb-4">
            Learn how to register, create an application, and get your API keys.
          </p>
          <Link to="/docs/getting-started" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
            Read getting started guide →
          </Link>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Application Setup</h3>
          <p className="text-gray-400 mb-4">
            Set up your Next.js project with Aegis authentication.
          </p>
          <Link to="/docs/application-setup" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
            Read application setup guide →
          </Link>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Register and Login</h3>
          <p className="text-gray-400 mb-4">
            Create authentication pages for your users.
          </p>
          <Link to="/docs/register-login" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
            Read register and login guide →
          </Link>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">User Details</h3>
          <p className="text-gray-400 mb-4">
            Retrieve and display authenticated user information.
          </p>
          <Link to="/docs/user-details" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
            Read user details guide →
          </Link>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">API Reference</h3>
          <p className="text-gray-400 mb-4">
            Complete API documentation for all endpoints and parameters.
          </p>
          <Link to="/docs/api" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
            Read API reference →
          </Link>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-sky-900/20 border border-sky-800 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
        <p className="mb-4">
          Create a developer account to start integrating authentication into your applications.
        </p>
        <div className="flex space-x-4 mt-4">
          <Link to="/register" className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors duration-200">
            Register
          </Link>
          <Link to="/login" className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600 transition-colors duration-200">
            Login
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
