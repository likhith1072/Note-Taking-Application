
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header() {
  const { user, resetUser } = useUser();
  const navigate = useNavigate();
   const location = useLocation();

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
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error signing out:", error);
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
        
                            <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center' onClick={()=>{resetUser(); handleSignOut();}}>Sign Out</div>
        ) : (
          <Link to='/signup'>
                            <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center'>Sign Up</div></Link>
        )}
      </div>
  )
}

export default Header
