import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NCR, RCA, CAPA, Verification, User, Notification } from '../types/ncr';
import { mockNCRs, mockDraftNCRs, mockRCAs, mockCAPAs, mockVerifications, mockUsers, mockNotifications } from '../data/mockData';

interface NCRContextType {
  ncrs: NCR[];
  draftNCRs: NCR[];
  rcas: RCA[];
  capas: CAPA[];
  verifications: Verification[];
  users: User[];
  notifications: Notification[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  addNCR: (ncr: NCR) => void;
  updateNCR: (id: string, updates: Partial<NCR>) => void;
  deleteNCR: (id: string) => void;
  addDraftNCR: (ncr: NCR) => void;
  updateDraftNCR: (id: string, updates: Partial<NCR>) => void;
  deleteDraftNCR: (id: string) => void;
  submitDraftNCR: (id: string) => void;
  addRCA: (rca: RCA) => void;
  updateRCA: (id: string, updates: Partial<RCA>) => void;
  addCAPA: (capa: CAPA) => void;
  updateCAPA: (id: string, updates: Partial<CAPA>) => void;
  addVerification: (verification: Verification) => void;
  updateVerification: (id: string, updates: Partial<Verification>) => void;
  markNotificationRead: (id: string) => void;
}

const NCRContext = createContext<NCRContextType | undefined>(undefined);

export function NCRProvider({ children }: { children: ReactNode }) {
  const [ncrs, setNCRs] = useState<NCR[]>(mockNCRs);
  const [draftNCRs, setDraftNCRs] = useState<NCR[]>(mockDraftNCRs);
  const [rcas, setRCAs] = useState<RCA[]>(mockRCAs);
  const [capas, setCAPAs] = useState<CAPA[]>(mockCAPAs);
  const [verifications, setVerifications] = useState<Verification[]>(mockVerifications);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[1]); // Sarah Johnson - EHS Officer

  const addNCR = (ncr: NCR) => {
    setNCRs(prev => [...prev, ncr]);
  };

  const updateNCR = (id: string, updates: Partial<NCR>) => {
    setNCRs(prev => prev.map(ncr => ncr.id === id ? { ...ncr, ...updates } : ncr));
  };

  const deleteNCR = (id: string) => {
    setNCRs(prev => prev.filter(ncr => ncr.id !== id));
  };

  const addDraftNCR = (ncr: NCR) => {
    setDraftNCRs(prev => [...prev, ncr]);
  };

  const updateDraftNCR = (id: string, updates: Partial<NCR>) => {
    setDraftNCRs(prev => prev.map(ncr => ncr.id === id ? { ...ncr, ...updates } : ncr));
  };

  const deleteDraftNCR = (id: string) => {
    setDraftNCRs(prev => prev.filter(ncr => ncr.id !== id));
  };

  const submitDraftNCR = (id: string) => {
    const draft = draftNCRs.find(ncr => ncr.id === id);
    if (draft) {
      const submittedNCR: NCR = {
        ...draft,
        id: `NCR-2024-${String(ncrs.length + 7).padStart(3, '0')}`,
        status: 'Submitted',
        timeline: [
          ...draft.timeline,
          { id: `t${Date.now()}`, action: 'Submitted', user: currentUser.name, timestamp: new Date().toISOString() }
        ]
      };
      addNCR(submittedNCR);
      deleteDraftNCR(id);
    }
  };

  const addRCA = (rca: RCA) => {
    setRCAs(prev => [...prev, rca]);
  };

  const updateRCA = (id: string, updates: Partial<RCA>) => {
    setRCAs(prev => prev.map(rca => rca.id === id ? { ...rca, ...updates } : rca));
  };

  const addCAPA = (capa: CAPA) => {
    setCAPAs(prev => [...prev, capa]);
  };

  const updateCAPA = (id: string, updates: Partial<CAPA>) => {
    setCAPAs(prev => prev.map(capa => capa.id === id ? { ...capa, ...updates } : capa));
  };

  const addVerification = (verification: Verification) => {
    setVerifications(prev => [...prev, verification]);
  };

  const updateVerification = (id: string, updates: Partial<Verification>) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <NCRContext.Provider value={{
      ncrs,
      draftNCRs,
      rcas,
      capas,
      verifications,
      users: mockUsers,
      notifications,
      currentUser,
      setCurrentUser,
      addNCR,
      updateNCR,
      deleteNCR,
      addDraftNCR,
      updateDraftNCR,
      deleteDraftNCR,
      submitDraftNCR,
      addRCA,
      updateRCA,
      addCAPA,
      updateCAPA,
      addVerification,
      updateVerification,
      markNotificationRead,
    }}>
      {children}
    </NCRContext.Provider>
  );
}

export function useNCR() {
  const context = useContext(NCRContext);
  if (!context) {
    throw new Error('useNCR must be used within NCRProvider');
  }
  return context;
}
