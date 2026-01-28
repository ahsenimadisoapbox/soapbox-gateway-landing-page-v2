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

/* =======================
   TYPES
======================= */

interface QualityEventsContextType {
  /* User */
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];

  /* Quality Events */
  qualityEvents: QualityEvent[];
  setQualityEvents: React.Dispatch<React.SetStateAction<QualityEvent[]>>;
  addQualityEvent: (event: Omit<QualityEvent, 'id'>) => void;
  updateQualityEvent: (id: string, updates: Partial<QualityEvent>) => void;
  deleteQualityEvent: (id: string) => void;

  /* Incidents */
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  /* Notifications */
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  /* UI */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/* =======================
   CONTEXT
======================= */

const QualityEventsContext = createContext<QualityEventsContextType | undefined>(
  undefined
);

/* =======================
   PROVIDER
======================= */

export function QualityEventsProvider({ children }: { children: ReactNode }) {
  /* User State */
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [users] = useState<User[]>(mockUsers);

  /* Quality Events State */
  const [qualityEvents, setQualityEvents] = useState<QualityEvent[]>(
    mockQualityEvents
  );

  /* Incidents State */
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  /* Notifications State */
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications
  );

  /* UI State */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* =======================
     DERIVED STATE
  ======================= */

  const unreadCount = notifications.filter(n => !n.read).length;

  /* =======================
     QUALITY EVENT ACTIONS
  ======================= */

  const addQualityEvent = (event: Omit<QualityEvent, 'id'>) => {
    const newId = `QE-2025-${String(qualityEvents.length + 1).padStart(3, '0')}`;
    setQualityEvents(prev => [...prev, { ...event, id: newId } as QualityEvent]);
  };

  const updateQualityEvent = (id: string, updates: Partial<QualityEvent>) => {
    setQualityEvents(prev =>
      prev.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const deleteQualityEvent = (id: string) => {
    setQualityEvents(prev => prev.filter(event => event.id !== id));
  };

  /* =======================
     INCIDENT ACTIONS
  ======================= */

  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const newId = `INC-2025-${String(incidents.length + 1).padStart(3, '0')}`;
    setIncidents(prev => [...prev, { ...incident, id: newId } as Incident]);
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === id
          ? { ...inc, ...updates, updatedAt: new Date().toISOString() }
          : inc
      )
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  /* =======================
     NOTIFICATION ACTIONS
  ======================= */

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  /* =======================
     PROVIDER VALUE
  ======================= */

  return (
    <QualityEventsContext.Provider
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
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,

        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </QualityEventsContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useQualityEvents() {
  const context = useContext(QualityEventsContext);
  if (!context) {
    throw new Error(
      'useQualityEvents must be used within QualityEventsProvider'
    );
  }
  return context;
}
