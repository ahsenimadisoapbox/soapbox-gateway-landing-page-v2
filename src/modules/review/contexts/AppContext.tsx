import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  initials: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Compliance Manager', initials: 'JD' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Quality Head', initials: 'SC' },
  { id: '3', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'EHS Officer', initials: 'MR' },
  { id: '4', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Process Owner', initials: 'JW' },
  { id: '5', name: 'David Kim', email: 'david.kim@company.com', role: 'Auditor', initials: 'DK' },
];

const mockNotifications: Notification[] = [
  { id: '1', title: 'Review Due Soon', message: 'Q1 2025 Management Review is due in 3 days', type: 'warning', timestamp: new Date(), read: false },
  { id: '2', title: 'Action Overdue', message: 'Action ACT-001 is overdue by 2 days', type: 'error', timestamp: new Date(Date.now() - 3600000), read: false },
  { id: '3', title: 'CAPA Created', message: 'New CAPA CAPA-015 has been created from review findings', type: 'info', timestamp: new Date(Date.now() - 7200000), read: false },
  { id: '4', title: 'Review Completed', message: 'Q4 2024 Management Review has been closed', type: 'success', timestamp: new Date(Date.now() - 86400000), read: true },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      users: mockUsers,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      sidebarCollapsed,
      setSidebarCollapsed,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
