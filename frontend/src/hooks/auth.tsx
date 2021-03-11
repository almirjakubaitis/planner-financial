import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface AuthState {
  token: string;
  // user: Record<string, unknown>; // object
  user: User;
}

interface SingInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  // user: Record<string, unknown>;
  user: User;

  signIn(credentials: SingInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Planner:token');
    const user = localStorage.getItem('@Planner:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {

    const response = await api.post('sessions', {
      email,
      password,
    });

     const { token, user } = response.data;

    localStorage.setItem('@Planner:token', token);
    localStorage.setItem('@Planner:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Planner:token');
    localStorage.removeItem('@Planner:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
