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
