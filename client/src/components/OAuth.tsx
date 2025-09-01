
import { AiFillGoogleCircle } from "react-icons/ai";
import type { UserCredential } from "firebase/auth";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function OAuth() {
  const { setUser } = useUser();
  const auth = getAuth(app);

  const navigate = useNavigate();

  const handleGoogleClick = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle: UserCredential = await signInWithPopup(
        auth,
        provider
      );

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // allow cookies
        body: JSON.stringify({
          username: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({
          id: data.rest._id,
          username: data.rest.username,
          email: data.rest.email,
          dob: "",
        });
        navigate("/");
      } else {
        console.error(data.message || "Google sign-in failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div>
      <div className="inline-block rounded-md bg-gradient-to-r from-pink-500 to-orange-500 p-[2px]">
        <button
          type="button"
          className="flex w-70 box-border items-center gap-2 bg-white hover:bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-md font-semibold dark:bg-gradient-to-r cursor-pointer hover:from-pink-600 hover:to-orange-600"
          onClick={handleGoogleClick}
        >
          <AiFillGoogleCircle className="w-6 h-6 mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
