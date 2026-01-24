import React, { createContext, useContext, useState, ReactNode } from 'react';

/* =======================
   TYPES
======================= */

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
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: Date;
  read: boolean;
}

interface ExecutiveContextType {
  /* User */
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;

  /* Notifications */
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  /* UI */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

/* =======================
   MOCK DATA
======================= */

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Compliance Manager', initials: 'JD' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'EHS Officer', initials: 'SC' },
  { id: '3', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'Auditor', initials: 'MR' },
  { id: '4', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Risk Manager', initials: 'JW' },
];

const mockNotifications: Notification[] = [
  { id: '1', title: 'Regulatory Deadline', message: 'Site B regulatory filing due in 3 days', type: 'alert', timestamp: new Date(), read: false },
  { id: '2', title: 'Audit Finding', message: 'High-severity audit finding awaiting closure', type: 'warning', timestamp: new Date(Date.now() - 3600000), read: false },
  { id: '3', title: 'CAPA Overdue', message: '12 CAPA items are past due date', type: 'warning', timestamp: new Date(Date.now() - 7200000), read: false },
  { id: '4', title: 'Compliance Update', message: 'ISO 45001 certification renewed successfully', type: 'success', timestamp: new Date(Date.now() - 86400000), read: true },
  { id: '5', title: 'ESG Report', message: 'Q4 ESG report is now available', type: 'info', timestamp: new Date(Date.now() - 172800000), read: true },
];

/* =======================
   CONTEXT
======================= */

const ExecutiveContext = createContext<ExecutiveContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function ExecutiveProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ExecutiveContext.Provider
      value={{
        currentUser,
        users: mockUsers,
        switchUser,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </ExecutiveContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useExecutive() {
  const context = useContext(ExecutiveContext);
  if (!context) {
    throw new Error('useExecutive must be used within ExecutiveProvider');
  }
  return context;
}
