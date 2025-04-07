import { DocLayout } from './DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

export function DocsAPI() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-bold mb-6">API Reference</h1>
      
      <p className="mb-4">
        Complete reference for all available API endpoints, including authentication, user management,
        and application configuration.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Authentication Headers</h2>
      
      <p className="mb-4">
        All API requests must include the following headers:
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 mb-6">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Header</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">X-Public-Key</td>
              <td className="px-6 py-4 text-sm text-gray-300">Your application's public key</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Always</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">X-Timestamp</td>
              <td className="px-6 py-4 text-sm text-gray-300">Current timestamp in milliseconds</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Always</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">X-Signature</td>
              <td className="px-6 py-4 text-sm text-gray-300">HMAC signature of request</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Always</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">X-Session-Token</td>
              <td className="px-6 py-4 text-sm text-gray-300">User's session token</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">For authenticated endpoints</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Content-Type</td>
              <td className="px-6 py-4 text-sm text-gray-300">application/json</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">For requests with a body</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Generating the Signature</h3>
      
      <CodeBlock
        language="javascript"
        filename="signature-example.js"
        code={`// Signature generation example (JavaScript)
function generateSignature(method, path, timestamp, body) {
  const payload = timestamp + method + path + body;
  const hmac = crypto.createHmac('sha256', YOUR_SECRET_KEY);
  hmac.update(payload);
  return hmac.digest('hex');
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">User Endpoints</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-neutral-800 rounded-md">
          <div className="flex items-center mb-2">
            <span className="bg-green-700 text-white px-2 py-1 rounded text-xs font-medium mr-2">POST</span>
            <span className="font-mono">/api/users/register</span>
          </div>
          <p className="text-gray-300 mb-2">Register a new user for your application</p>
          <h4 className="font-semibold mt-3 mb-1">Request Body</h4>
          <CodeBlock
            language="json"
            filename="request.json"
            code={`{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}`}
          />
          <h4 className="font-semibold mt-3 mb-1">Response</h4>
          <CodeBlock
            language="json"
            filename="response.json"
            code={`{
  "success": true,
  "data": {
    "sessionToken": "user_session_token",
    "expiresAt": "2023-12-31T23:59:59Z"
  }
}`}
          />
        </div>
        
        <div className="p-4 bg-neutral-800 rounded-md">
          <div className="flex items-center mb-2">
            <span className="bg-green-700 text-white px-2 py-1 rounded text-xs font-medium mr-2">POST</span>
            <span className="font-mono">/api/users/login</span>
          </div>
          <p className="text-gray-300 mb-2">Authenticate an existing user</p>
          <h4 className="font-semibold mt-3 mb-1">Request Body</h4>
          <CodeBlock
            language="json"
            filename="request.json"
            code={`{
  "email": "user@example.com",
  "password": "securepassword"
}`}
          />
          <h4 className="font-semibold mt-3 mb-1">Response</h4>
          <CodeBlock
            language="json"
            filename="response.json"
            code={`{
  "success": true,
  "data": {
    "sessionToken": "user_session_token",
    "expiresAt": "2023-12-31T23:59:59Z"
  }
}`}
          />
        </div>
        
        <div className="p-4 bg-neutral-800 rounded-md">
          <div className="flex items-center mb-2">
            <span className="bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium mr-2">GET</span>
            <span className="font-mono">/api/users/me</span>
          </div>
          <p className="text-gray-300 mb-2">Get the profile of the authenticated user</p>
          <h4 className="font-semibold mt-3 mb-1">Headers</h4>
          <p className="text-gray-300">X-Session-Token: user_session_token</p>
          <h4 className="font-semibold mt-3 mb-1">Response</h4>
          <CodeBlock
            language="json"
            filename="response.json"
            code={`{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}`}
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Error Handling</h2>
      
      <p className="mb-4">
        All API endpoints return consistent error responses with helpful error messages.
      </p>
      
      <CodeBlock
        language="json"
        filename="error-response.json"
        code={`{
  "success": false,
  "error": "Detailed error message"
}`}
      />
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Common HTTP Status Codes</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 mb-6">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">200 OK</td>
              <td className="px-6 py-4 text-sm text-gray-300">Request successful</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">400 Bad Request</td>
              <td className="px-6 py-4 text-sm text-gray-300">Invalid request parameters</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">401 Unauthorized</td>
              <td className="px-6 py-4 text-sm text-gray-300">Authentication required or failed</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">403 Forbidden</td>
              <td className="px-6 py-4 text-sm text-gray-300">Permission denied</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">404 Not Found</td>
              <td className="px-6 py-4 text-sm text-gray-300">Resource not found</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">500 Internal Server Error</td>
              <td className="px-6 py-4 text-sm text-gray-300">Server-side error</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Rate Limiting</h2>
      
      <p className="mb-4">
        To ensure service reliability, the API implements rate limiting:
      </p>
      
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Maximum of 100 requests per minute per IP address</li>
        <li>Maximum of 1000 requests per hour per application</li>
      </ul>
      
      <p className="mb-4">
        When a rate limit is exceeded, the API will respond with a 429 Too Many Requests status code
        and specify the time at which the limit will reset.
      </p>
    </DocLayout>
  );
}
