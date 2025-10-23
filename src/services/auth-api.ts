export const API_BASE_URL = "http://localhost:3000/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  restaurant_id: number;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    role: string;
    iat: number;
    exp: number;
  };
}

class AuthService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async protectedRoute(): Promise<AuthResponse> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/protected`);
  }

  // Utility to get token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Utility to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Clear authentication data
  logout(): void {
    localStorage.removeItem("authToken");
  }
}

export const authAPI = new AuthService();
