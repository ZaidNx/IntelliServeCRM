import { useState, useEffect, useRef } from 'react';
import { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Global state to prevent flickering during navigation
let globalAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

let globalHasLoaded = false;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If we already have user data and token, don't make unnecessary API calls
    if (
      token &&
      globalAuthState.user &&
      globalAuthState.isAuthenticated &&
      globalHasLoaded
    ) {
      setAuthState(globalAuthState);
      return;
    }

    if (token) {
      // Verify token and get user info
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem('token');
            throw new Error('Invalid token');
          }
        })
        .then((user) => {
          globalHasLoaded = true;
          globalAuthState = {
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          };
          setAuthState(globalAuthState);
        })
        .catch(() => {
          globalHasLoaded = false;
          globalAuthState = {
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          };
          setAuthState(globalAuthState);
        });
    } else {
      globalHasLoaded = false;
      globalAuthState = {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
      setAuthState(globalAuthState);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user, token } = await response.json();
    localStorage.setItem('token', token);

    globalHasLoaded = true;
    globalAuthState = {
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    };
    setAuthState(globalAuthState);

    return { user, token };
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user, token } = await response.json();
    localStorage.setItem('token', token);

    globalHasLoaded = true;
    globalAuthState = {
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    };
    setAuthState(globalAuthState);

    return { user, token };
  };

  const logout = () => {
    localStorage.removeItem('token');
    globalHasLoaded = false;
    globalAuthState = {
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    };
    setAuthState(globalAuthState);
  };

  const updateUser = (updatedUser: User) => {
    globalAuthState = {
      ...globalAuthState,
      user: updatedUser,
    };
    setAuthState(globalAuthState);
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };
}
