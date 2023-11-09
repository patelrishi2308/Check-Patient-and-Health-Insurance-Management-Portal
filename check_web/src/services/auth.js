import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const useAuth = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return {};
  const data = JSON.parse(auth);
  return data;
};

export const updateUserLocalData = (newUserData) => {
  const auth = localStorage.getItem("auth");
  if (!auth) return false;
  const data = JSON.parse(auth);
  localStorage.setItem("auth", JSON.stringify({ ...data, user: { ...data.user, ...newUserData } }));
  return true;
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };
  return logout;
};

export const redirectToLogin = () => {
  localStorage.removeItem("auth");
  return <Navigate to="/login" replace />;
};
