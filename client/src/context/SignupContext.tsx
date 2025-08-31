import { createContext, useContext, useState, useEffect } from "react";

type SignupData = {
  name: string;
  dob: string;
  email: string;
  verifyingEmail: boolean;
};

type SignupContextType = {
  signup: SignupData;
  setSignup: (data: SignupData) => void;
  resetSignup: () => void;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [signup, setSignupState] = useState<SignupData>(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("signup");
    return saved ? JSON.parse(saved) : { name: "", dob: "", email: "", verifyingEmail: false };
  });

  // Sync to localStorage whenever signup changes
  useEffect(() => {
    localStorage.setItem("signup", JSON.stringify(signup));
  }, [signup]);

  const setSignup = (data: SignupData) => {
    setSignupState(data);
  };

  const resetSignup = () => {
    setSignupState({ name: "", dob: "", email: "", verifyingEmail: false });
    localStorage.removeItem("signup");
  };

  return (
    <SignupContext.Provider value={{ signup, setSignup, resetSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used within SignupProvider");
  return context;
};
