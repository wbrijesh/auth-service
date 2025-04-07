import crypto from 'crypto';

// Use environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_BACKEND_HOST || 'http://localhost:8080';
const PUBLIC_KEY = 'pk_kcnjpOlaKkzB0JXeMbE_-T8EwNKKH5bF';
const SECRET_KEY = 'sk_Z5OLPzADYkWNVLr-e2yR736bkQdIx3KF';

// Generate HMAC signature for API requests
function generateSignature(method, path, timestamp, body) {
  try {
    const payload = timestamp + method + path + body;
    console.log('Generating signature for payload:', payload);
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
  const path = '/api/users/register'; // Updated path
  const method = 'POST';
  const timestamp = Date.now().toString();
  const body = JSON.stringify(userData);
  
  console.log('Registering user with data:', userData);
  console.log('API URL:', `${API_URL}${path}`);
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    console.log('Generated signature:', signature);
    
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': PUBLIC_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      body,
      // Next.js specific CORS settings
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      return { success: false, error: `Server error: ${response.status}` };
    }
    
    const data = await response.json();
    console.log('Registration response:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: `Network error: ${error.message}` };
  }
}

// Login an existing user
export async function loginUser(credentials) {
  const path = '/api/users/login'; // Updated path
  const method = 'POST';
  const timestamp = Date.now().toString();
  const body = JSON.stringify(credentials);
  
  console.log('Logging in with credentials:', { email: credentials.email, passwordLength: credentials.password?.length });
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': PUBLIC_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      body,
      // Next.js specific CORS settings
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      return { success: false, error: `Server error: ${response.status}` };
    }
    
    const data = await response.json();
    console.log('Login response:', data);
    
    // If login was successful and we have a session token, fetch user details
    if (data.success && data.data && data.data.sessionToken) {
      const userResponse = await getUserDetails(data.data.sessionToken);
      if (userResponse.success && userResponse.data) {
        data.data.user = userResponse.data;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: `Network error: ${error.message}` };
  }
}

// Get authenticated user details
export async function getUserDetails(sessionToken) {
  const path = '/api/users/me';
  const method = 'GET';
  const timestamp = Date.now().toString();
  const body = '';
  
  try {
    const signature = generateSignature(method, path, timestamp, body);
    
    const response = await fetch(`${API_URL}${path}`, {
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
      return { success: false, error: `Server error: ${response.status}` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { success: false, error: `Network error: ${error.message}` };
  }
}

// Simple function to test API connectivity
export async function checkApiConnection() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      mode: 'cors',
    });
    
    if (!response.ok) {
      return { success: false, error: `Health check failed: ${response.status}` };
    }
    
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error: `Connection test failed: ${error.message}` };
  }
}