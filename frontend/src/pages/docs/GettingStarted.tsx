import { DocLayout } from './DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

export function DocsGettingStarted() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-bold mb-6">Getting Started with Aegis</h1>
      
      <p className="mb-4">
        This guide will walk you through the initial setup process to obtain your authentication credentials.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Create a Developer Account</h2>
      
      <p className="mb-4">
        To get started with Aegis, you need to create a developer account:
      </p>
      
      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li>Navigate to the <a href="/register" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">registration page</a></li>
        <li>Fill in your details and create an account</li>
        <li>Verify your email address if required</li>
        <li>Log in to access your developer dashboard</li>
      </ol>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Create an Application</h2>
      
      <p className="mb-4">
        Once logged in to your dashboard, you can create a new application:
      </p>
      
      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li>Click on "Applications" in the navigation menu</li>
        <li>Click the "Create New Application" button</li>
        <li>Enter a name for your application (e.g., "My Web App")</li>
        <li>Enter the domain where your application will run (e.g., "myapp.com")</li>
        <li>Click "Create" to generate your application</li>
      </ol>
      
      <div className="p-4 bg-neutral-800 rounded-md my-6">
        <p className="font-semibold text-yellow-400">⚠️ Important</p>
        <p className="text-gray-300">
          The domain you enter should match where your application will be hosted. For local development,
          you can use "localhost" or "127.0.0.1".
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: Save Your API Keys</h2>
      
      <p className="mb-4">
        After creating your application, you'll be provided with two important keys:
      </p>
      
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Public Key</strong> - Used to identify your application (e.g., <code className="text-pink-400">pk_kcnjpOlaKkzB0JXeMbE_-T8EwNKKH5bF</code>)</li>
        <li><strong>Secret Key</strong> - Used to sign API requests (e.g., <code className="text-pink-400">sk_Z5OLPzADYkWNVLr-e2yR736bkQdIx3KF</code>)</li>
      </ul>
      
      <CodeBlock
        language="bash"
        filename="example-keys.txt"
        code={`# Example API Keys
PUBLIC_KEY=pk_kcnjpOlaKkzB0JXeMbE_-T8EwNKKH5bF
SECRET_KEY=sk_Z5OLPzADYkWNVLr-e2yR736bkQdIx3KF`}
      />
      
      <div className="p-4 bg-red-900/30 border border-red-700 rounded-md my-6">
        <p className="font-semibold text-red-400">🔒 Security Warning</p>
        <p className="text-gray-300">
          Your Secret Key should be treated as sensitive information. Never expose it in client-side code
          or commit it to version control. For production applications, always store it securely in
          environment variables.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>
      
      <p className="mb-4">
        Now that you have your API keys, you're ready to integrate Aegis into your application:
      </p>
      
      <div className="flex flex-col space-y-4">
        <a href="/docs/application-setup" className="text-sky-500 hover:text-sky-400 transition-colors duration-200">
          → Continue to Application Setup
        </a>
      </div>
    </DocLayout>
  );
}
