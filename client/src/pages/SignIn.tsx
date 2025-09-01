import { useState } from "react";
import { toast } from 'react-toastify';
import { useUser } from "../context/UserContext";
// import { useSignin } from "../context/SigninContext";
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth.tsx';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SigninPage() {
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  // const { signin, setSignin, resetSignin } = useSignin();

  const [email, setEmail] = useState<string>("");
  const [verifyingEmail, setVerifyingEmail] = useState<boolean>(false);
  const [OTP, setOTP] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleResendOTP = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please fill out all fields.");
    }

    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Please verify using OTP.");

    } else {
      toast.error(data.message);

    }


  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verifyingEmail) {
      setLoading(true);
      // Verify email with OTP (sign in flow)
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp: OTP, keepMeLoggedIn }), 
      });

      const data = await response.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
        setUser({ id: data.rest._id, username: data.rest.username, email: data.rest.email, dob: data.rest.dob }); // ✅ use full user object
        console.log(data)
        setVerifyingEmail(false);

        setLoading(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } else {
      setLoading(true);
      if (!email) {
        setLoading(false);
        return toast.error("Please fill out all fields.");
      }

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Please verify using OTP.");
        setVerifyingEmail(true);

        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center w-full ">


      {/* Left form section */}
      <div className=" lg:w-[40vw] w-full  flex flex-col h-[100vh] pt-15 sm:pt-0">
        {/* Logo */}
        <div className="flex items-center sm:justify-start justify-center sm:p-3 ">
          <img src="/NoteTakerLogo.png" alt="Logo" className="rounded-full w-12 h-12" />
        </div>
        <div className="mx-auto flex flex-col  items-center justify-center lg:w-[40vw] md:w-[45vw] sm:w-[55vw] w-[90vw] p-[2vw] sm:h-full   ">
          <div className="flex flex-col sm:items-start items-center justify-center xl:w-[25vw] lg:w-[30vw] md:w-[35vw] sm:w-[40vw] w-[80vw]">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-500 mb-4">
              Please login to continue to your account.
            </p>
          </div>


          <form
            className="space-y-6 xl:w-[25vw] lg:w-[30vw] md:w-[35vw] sm:w-[40vw] w-[80vw] p-1"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <div className="relative">

              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`peer w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none ${!verifyingEmail && "focus:border-blue-600"} `}
                required
                readOnly={verifyingEmail}
              />
              <label
                htmlFor="email"
                className={`absolute left-2 top-0 text-xs -translate-y-1/2 z-20 font-semibold bg-white px-1
               transition-all cursor-text  ${email ? "block" : "hidden"} peer-focus:block 
               peer-focus:top-0 ${!verifyingEmail && "peer-focus:text-blue-600"}`}
              >Email
              </label>
            </div>

            {/* OTP */}
            {verifyingEmail && (<>
              <div className="relative">
                <input
                  type={showOTP ? "numeric" : "password"}
                  id="otp"
                  placeholder="OTP"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                  className="peer w-full p-2 border-2 border-gray-400 rounded-lg 
                 focus:outline-none focus:border-blue-600"
                  required
                  maxLength={6}         // limit digits
                />
                <label
                  htmlFor="otp"
                  className={`absolute left-2 top-0 text-xs -translate-y-1/2 z-20 font-semibold bg-white px-1
                 transition-all cursor-text  ${OTP ? "block" : "hidden"} peer-focus:block 
                 peer-focus:top-0 peer-focus:text-blue-600`}
                >
                  OTP
                </label>
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowOTP((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showOTP ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <button className="text-blue-500 hover:underline hover:text-blue-700 underline cursor-pointer" onClick={handleResendOTP}
                  >
                    Resend OTP
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="box1"
                      checked={keepMeLoggedIn}
                      onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                      className="cursor-pointer w-4 h-4 "
                    />
                    <label htmlFor="box1" className="cursor-pointer ">
                      Keep me logged in
                    </label>
                  </div>

                </div>

            </>

            )
            }



            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold  hover:bg-blue-600 transition
                            ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={loading}
            >
              {verifyingEmail ? "Sign In" : "Get OTP"}
            </button>
            <div className="flex justify-center items-center"><OAuth /></div>
          </form>


          <p className="mt-6 text-sm text-gray-600 text-center">
            Need an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline hover:text-blue-600">
              Create One
            </Link>
          </p>
        </div>

      </div>

      {/* Right Image Section (hidden on small screens) */}
      <div className="hidden lg:flex items-center justify-center lg:w-[60vw] h-[100vh]">
        <div className="h-[95vh]  lg:w-[50vw] flex items-center justify-center">
          <img
            src="/SignUpSideImage.jpg" // replace with your image path
            alt="Signup Illustration"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

      </div>

    </div>
  );
}
