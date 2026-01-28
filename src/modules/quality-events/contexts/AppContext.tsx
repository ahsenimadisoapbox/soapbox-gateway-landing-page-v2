import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  QualityEvent,
  Incident,
  Notification,
  mockUsers,
  mockQualityEvents,
  mockIncidents,
  mockNotifications,
  currentUser as defaultUser,
} from '../data/mockData';

interface AppContextType {
  // User Management
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  
  // Quality Events
  qualityEvents: QualityEvent[];
  setQualityEvents: React.Dispatch<React.SetStateAction<QualityEvent[]>>;
  addQualityEvent: (event: Omit<QualityEvent, 'id'>) => void;
  updateQualityEvent: (id: string, updates: Partial<QualityEvent>) => void;
  deleteQualityEvent: (id: string) => void;
  
  // Incidents
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  
  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // User State
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [users] = useState<User[]>(mockUsers);
  
  // Quality Events State
  const [qualityEvents, setQualityEvents] = useState<QualityEvent[]>(mockQualityEvents);
  
  // Incidents State
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  
  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Quality Event Actions
  const addQualityEvent = (event: Omit<QualityEvent, 'id'>) => {
    const newId = `QE-2025-${String(qualityEvents.length + 1).padStart(3, '0')}`;
    setQualityEvents(prev => [...prev, { ...event, id: newId } as QualityEvent]);
  };

  const updateQualityEvent = (id: string, updates: Partial<QualityEvent>) => {
    setQualityEvents(prev =>
      prev.map(event => (event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event))
    );
  };

  const deleteQualityEvent = (id: string) => {
    setQualityEvents(prev => prev.filter(event => event.id !== id));
  };

  // Incident Actions
  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const newId = `INC-2025-${String(incidents.length + 1).padStart(3, '0')}`;
    setIncidents(prev => [...prev, { ...incident, id: newId } as Incident]);
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, ...updates, updatedAt: new Date().toISOString() } : inc))
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        qualityEvents,
        setQualityEvents,
        addQualityEvent,
        updateQualityEvent,
        deleteQualityEvent,
        incidents,
        setIncidents,
        addIncident,
        updateIncident,
        deleteIncident,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
