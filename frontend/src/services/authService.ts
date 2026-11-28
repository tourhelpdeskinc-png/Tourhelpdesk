interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SocialLoginData {
  idToken: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    isEmailVerified?: boolean;
    lastLogin?: string | null;
    createdAt?: string;
  };
}

const getApiUrls = (endpoint: string): string[] => {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return isLocal
    ? [`http://localhost:5000/api${endpoint}`, `/api${endpoint}`]
    : [`/api${endpoint}`];
};

const emitAuthChange = (user: any | null): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth_change', { detail: user }));
  }
};

async function requestAuth<T = AuthResponse>(
  endpoint: string,
  options: { method?: 'GET' | 'POST'; body?: any; headers?: Record<string, string>; cache?: RequestCache } = {}
): Promise<T> {
  const { method = 'POST', body, headers = {}, cache } = options;
  const urlsToTry = getApiUrls(endpoint);

  let lastError: Error | null = null;

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        method,
        credentials: 'include',
        ...(cache ? { cache } : {}),
        headers: {
          'Accept': 'application/json',
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || `Authentication failed (${response.status})`;
        const err = new Error(errorMsg) as Error & { status?: number };
        err.status = response.status;
        throw err;
      }

      if (data.token) {
        authService.setToken(data.token);
      }
      if (data.user) {
        emitAuthChange(data.user);
      }
      return data as T;
    } catch (err: any) {
      lastError = err;
      // Surface real HTTP / validation / auth responses immediately without retrying fallback
      if (
        typeof err?.status === 'number' ||
        (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError'))
      ) {
        throw err;
      }
    }
  }

  throw new Error(lastError?.message || 'Cannot connect to authentication server. Please try again shortly.');
}

async function postAuth(endpoint: string, body: any): Promise<AuthResponse> {
  return requestAuth<AuthResponse>(endpoint, { method: 'POST', body });
}

export const authService = {
  async signup(userData: SignupData): Promise<AuthResponse> {
    return postAuth('/auth/signup', userData);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return postAuth('/auth/login', credentials);
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return postAuth('/auth/google', { idToken });
  },

  async socialLogin(socialData: SocialLoginData): Promise<AuthResponse> {
    return postAuth('/auth/social', socialData);
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return requestAuth<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    return postAuth('/auth/reset-password', { token, password });
  },

  async getProfile(): Promise<any | null> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      return await requestAuth<any>('/auth/profile', {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
    } catch (error: any) {
      // Only clear stored token when the server explicitly rejects the token (401/403)
      if (error?.status === 401 || error?.status === 403) {
        this.logout();
      } else {
        console.error('Profile fetch error:', error);
      }
      return null;
    }
  },

  setToken(token: string): void {
    localStorage.setItem('tourhelpdesk_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('tourhelpdesk_token');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('tourhelpdesk_token');
    emitAuthChange(null);
    for (const url of getApiUrls('/auth/logout')) {
      try {
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
        });
        break;
      } catch {
        // Ignore network errors during logout
      }
    }
  }
};