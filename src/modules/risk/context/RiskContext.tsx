import { createContext, useContext, useState } from "react";
import { User } from "../types/risk";
import { mockUsers } from "../lib/mockData";

interface RiskContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export const RiskProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  return (
    <RiskContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </RiskContext.Provider>
  );
};

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error("useRisk must be used within RiskProvider");
  }
  return context;
};
