import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
});

const MOCK_USERS_KEY = "gf_users";
const CURRENT_USER_KEY = "gf_current_user";

interface StoredUser extends User {
  password: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _p, ...userData } = found;
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    const users = getUsers();
    if (users.find((u) => u.email === email)) return false;

    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _p, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
