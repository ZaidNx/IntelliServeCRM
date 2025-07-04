import { useState, useEffect } from "react";
import { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user info
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem("token");
            throw new Error("Invalid token");
          }
        })
        .then((user) => {
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        })
        .catch(() => {
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        });
    } else {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user, token } = await response.json();
    localStorage.setItem("token", token);

    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });

    return { user, token };
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user, token } = await response.json();
    localStorage.setItem("token", token);

    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });

    return { user, token };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateUser = (updatedUser: User) => {
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };
}
