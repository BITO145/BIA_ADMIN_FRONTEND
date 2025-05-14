import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  selectAuthLoading,
  selectAuthError,
} from "../slices/auth/authSlice";
import { loginService } from "../services/authService";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import favicon from "../assets/favicon 1.png";
import Group from "../assets/Group 4.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      hasErrors = true;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      dispatch(loginFailure("Please fill in all required fields.")); // Optional: Dispatch a failure action
      return; // Stop submission
    }

    dispatch(loginStart());
    try {
      const data = await loginService({
        username: formData.username,
        password: formData.password,
      });
      console.log("Login data received:", data);
      dispatch(loginSuccess(data.user));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const errorData = err.response?.data || { message: "Login failed" };
      setErrors({
        username: errorData.message.includes("username")
          ? errorData.message
          : "",
        password: errorData.message.includes("password")
          ? errorData.message
          : "",
      });
      dispatch(loginFailure(errorData));
      toast.error(errorData.message || "Login failed");
    }
  };

  return (
    <div className="bg-white flex justify-center w-full min-h-screen">
      <div className="bg-white w-full max-w-[1440px] relative flex flex-col md:flex-row">
        {/* Logo and brand name */}
        <div className="flex items-center p-6 md:absolute md:top-8 md:left-8 z-10">
          <img
            className="w-16 h-16 md:w-20 md:h-20 object-cover"
            alt="Favicon"
            src={favicon}
          />
          <div className="ml-3 font-['Red_Hat_Display',Helvetica] font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight">
            BITO Admin
          </div>
        </div>

        {/* Login form section */}
        <div className="flex flex-col w-full px-6 py-8 md:w-1/2 md:px-8 lg:px-16 md:py-32 md:justify-center order-2 md:order-1">
          <div className="max-w-md mx-auto w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-col items-start gap-2 mb-">
                <h1 className="font-['Poppins',Helvetica] font-semibold text-3xl md:text-4xl">
                  Login
                </h1>
                <p className="opacity-75 font-['Poppins',Helvetica] font-normal text-sm md:text-base">
                  Login to access your Bito account
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              {/* Form fields */}
              <div className="flex flex-col gap-4">
                <div>
                  {/* Username field */}
                  <label htmlFor="username" className="">
                    Username
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Username"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg border-gray-300 focus:ring-[#a44a0c] focus:border-[#a44a0c] ${
                        errors.username ? "border-red-500" : ""
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {/* Password field */}
                  <label htmlFor="password" className="">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg border-gray-300 focus:ring-[#a44a0c] focus:border-[#a44a0c] ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      )}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember me and Forgot Password */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#a44a0c] cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="font-['Poppins',Helvetica] font-medium text-sm cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="font-['Poppins',Helvetica] font-medium text-[#a44a0c] text-sm hover:underline"
                  >
                    Forgot Password
                  </button>
                </div>
              </div>

              {/* Login button and signup link */}
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full h-12 bg-[#a44a0c] hover:bg-[#8e3f0a] rounded-md font-['Poppins',Helvetica] font-semibold text-[#f3f3f3] text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a44a0c]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Logging In...</span>
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
                <p className="text-center font-['Poppins',Helvetica] text-sm">
                  <span className="font-medium text-[#303030]">
                    Don&apos;t have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-semibold text-[#a44a0c] hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 font-['Poppins',Helvetica] font-normal text-sm whitespace-nowrap">
                Or login with
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* Add actual login logic to these if needed */}
              <button className="flex justify-center items-center p-3 border border-solid border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 128 128"
                >
                  <rect
                    fill="#3d5a98"
                    x="4.83"
                    y="4.83"
                    width="118.35"
                    height="118.35"
                    rx="6.53"
                    ry="6.53"
                  />
                  <path
                    fill="#fff"
                    d="M86.48 123.17V77.34h15.38l2.3-17.86H86.48v-11.4c0-5.17 1.44-8.7 8.85-8.7h9.46v-16A126.56 126.56 0 0091 22.7c-13.62 0-23 8.3-23 23.61v13.17H52.62v17.86H68v45.83z"
                  />
                </svg>
              </button>
              <button
                className="flex justify-center items-center p-3 border border-solid border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => toast.success("Google Sign-in logic here!")} // Replace with actual Google sign-in
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 128 128"
                >
                  <path
                    fill="#fff"
                    d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a6
                    4 64 0 00-42.61-.38z"
                  />
                  <path
                    fill="#e33629"
                    d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"
                  />
                  <path
                    fill="#f8bd00"
                    d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"
                  />
                  <path
                    fill="#587dbd"
                    d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
                  />
                  <path
                    fill="#319f43"
                    d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"
                  />
                </svg>
              </button>
              <button className="flex justify-center items-center p-3 border border-solid border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 128 128"
                >
                  <path d="M97.905 67.885c.174 18.8 16.494 25.057 16.674 25.137-.138.44-2.607 8.916-8.597 17.669-5.178 7.568-10.553 15.108-19.018 15.266-8.318.152-10.993-4.934-20.504-4.934-9.508 0-12.479 4.776-20.354 5.086-8.172.31-14.395-8.185-19.616-15.724C15.822 94.961 7.669 66.8 18.616 47.791c5.438-9.44 15.158-15.417 25.707-15.571 8.024-.153 15.598 5.398 20.503 5.398 4.902 0 14.106-6.676 23.782-5.696 4.051.169 15.421 1.636 22.722 12.324-.587.365-13.566 7.921-13.425 23.639M82.272 21.719c4.338-5.251 7.258-12.563 6.462-19.836-6.254.251-13.816 4.167-18.301 9.416-4.02 4.647-7.54 12.087-6.591 19.216 6.971.54 14.091-3.542 18.43-8.796" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="hidden md:flex md:w-1/2 order-1 md:order-2 relative justify-center items-center p-8 lg:p-12">
          <div className="w-6/5 h-6/5 max-w-md mx-auto">
            <img
              src={Group}
              alt="Login illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
