import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserLoginResponse } from '../types';
import { userAuthApi } from '../api/userAuthApi';

interface UserAuthContextType {
  user: UserProfile | null;
  token: string | null;
  isUserAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    password: string;
    otp?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  setAuthSession: (res: UserLoginResponse) => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ss_user_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ss_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isUserAuthenticated = !!token && !!user;

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem('ss_user');
      return;
    }

    userAuthApi.getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('ss_user', JSON.stringify(profile));
      })
      .catch(() => {
        // Token expired or invalid
        logout();
      });
  }, [token]);

  const handleAuthSuccess = (res: UserLoginResponse) => {
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ss_user_token', res.token);
    localStorage.setItem('ss_user', JSON.stringify(res.user));
  };

  const login = async (payload: { email: string; password: string }) => {
    const res = await userAuthApi.login(payload);
    handleAuthSuccess(res);
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    password: string;
    otp?: string;
  }) => {
    const res = await userAuthApi.register(payload);
    handleAuthSuccess(res);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ss_user_token');
    localStorage.removeItem('ss_user');
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await userAuthApi.getProfile();
      setUser(profile);
      localStorage.setItem('ss_user', JSON.stringify(profile));
    } catch {
      // Ignored
    }
  };

  const updateUser = (updated: UserProfile) => {
    setUser(updated);
    localStorage.setItem('ss_user', JSON.stringify(updated));
  };

  const setAuthSession = (res: UserLoginResponse) => {
    handleAuthSuccess(res);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        token,
        isUserAuthenticated,
        login,
        register,
        logout,
        refreshProfile,
        updateUser,
        setAuthSession,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
