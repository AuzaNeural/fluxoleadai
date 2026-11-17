import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';

interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => storage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!storage.getToken());

  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      setIsAuthenticated(true);
      setUser(storage.getUser());
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Simula validação
    await new Promise((r) => setTimeout(r, 600));

    const token = 'jwt_fluxo_' + Math.random().toString(36).substring(2);
    storage.setToken(token);

    const currentUser = storage.getUser();
    const updatedUser: User = {
      ...currentUser,
      email: email || currentUser.email
    };
    storage.setUser(updatedUser);
    setUser(updatedUser);
    setIsAuthenticated(true);

    storage.addHistory({
      action: 'Login Realizado',
      details: `Acesso autenticado com sucesso (${email})`,
      category: 'Conta'
    });

    return true;
  };

  const logout = () => {
    storage.removeToken();
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData: Partial<User>) => {
    const newUser = { ...user, ...updatedData };
    storage.setUser(newUser);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

