import { Navigate, Outlet } from "react-router-dom";
import { useUser} from "./context/UserContext";

// helper to check login (token in cookie/localStorage, or context)
const isLoggedIn = ():boolean => {
    const { user } = useUser();
    return !!user?.id;
};

// Protect signup/signin routes
export const AuthRedirect = () => {
  return isLoggedIn() ? <Navigate to="/" replace /> : <Outlet />;
};
