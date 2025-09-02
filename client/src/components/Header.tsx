import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link} from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header() {
  const { user, resetUser } = useUser();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const getHeaderTitle = (): string => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/createNote":
        return "Create Note";
      default:
        return " ";
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        resetUser();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  return (
     <div className="flex justify-between items-center sm:px-8 px-4  w-full min-h-[10vh]">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src="/NoteTakerLogo.png"
              alt="Logo"
              className="w-16 h-16"
            />
          </Link>
          
        </div>
        <div>
          <h1 className="font-semibold text-xl"> {getHeaderTitle()}</h1>
        </div>

        {user?.id ? (

                            <button className={`h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold  flex justify-center items-center ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} onClick={() => { handleSignOut(); }}
                            disabled={loading}>"Sign Out"</button>
        ) : (
          <Link to='/signup'>
            <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center'>Sign Up</div>
          </Link>
        )}
      </div>
  )
}

export default Header
