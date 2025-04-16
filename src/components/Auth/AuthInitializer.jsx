// src/AuthInitializer.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  rehydrateSuccess,
  rehydrateFailure,
} from "../../slices/auth/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
          {
            withCredentials: true,
          }
        );
        // Assuming the response contains a "user" object.
        dispatch(rehydrateSuccess(response.data.user));
      } catch (error) {
        dispatch(rehydrateFailure());
        console.error(
          "Rehydration failed:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
