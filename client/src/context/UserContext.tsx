import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  dob: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserData | null>(() => {
    // Load from localStorage on first render
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : {id:"", name: "", dob: "", email: ""};
  });



  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  const setUser = (user: UserData | null) => {
    setUserState(user);
  };

  const resetUser = () => {
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
