import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Complaint,
  User,
  Notification,
  mockComplaints,
  mockUsers,
  mockNotifications,
  currentUser as defaultUser,
} from '../data/mockData';

/* =======================
   TYPES
======================= */

interface ComplaintsCustomerContextType {
  /* User */
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];

  /* Complaints */
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;

  /* Notifications */
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  /* UI */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/* =======================
   CONTEXT
======================= */

const ComplaintsCustomerContext =
  createContext<ComplaintsCustomerContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function ComplaintsCustomerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [complaints, setComplaints] =
    useState<Complaint[]>(mockComplaints);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* =======================
     COMPLAINT ACTIONS
  ======================= */

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev]);
  };

  const updateComplaint = (
    id: string,
    updates: Partial<Complaint>
  ) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  /* =======================
     NOTIFICATIONS
  ======================= */

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ComplaintsCustomerContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: mockUsers,
        complaints,
        setComplaints,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        notifications,
        markNotificationRead,
        unreadCount,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </ComplaintsCustomerContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useComplaintsCustomer() {
  const context = useContext(ComplaintsCustomerContext);
  if (!context) {
    throw new Error(
      'useComplaintsCustomer must be used within ComplaintsCustomerProvider'
    );
  }
  return context;
}
