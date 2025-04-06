export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Application {
  id: string;
  developerId: string;
  name: string;
  domain: string;
  publicKey: string;
  secretKey?: string;  // Make it optional since it's not always returned
  createdAt: string;
}

export interface CreateApplicationRequest {
  name: string;
  domain: string;
}

export interface UpdateApplicationRequest {
  name: string;
  domain: string;
}

export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

// Response data types
export interface TokenResponse {
  token: string;
}

export interface ApplicationsListResponse {
  applications: Application[];
  count: number;
}

export interface UsersListResponse {
  users: User[];
  count: number;
}

export interface User {
  id: string;
  applicationId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}
