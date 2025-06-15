"use client";

import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from storage or API
    const storedUserId = localStorage.getItem('currentUser');
    if (storedUserId) {
      const user = mockUsers.find(u => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', userId);
    } else {
      // In a real app, handle login failure
      console.error("User not found for login");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
