import React from "react";
import { Outlet } from "react-router-dom";
import { redirectToLogin, useAuth } from "../services/auth";
import api from "../services/api";

function WithPatient() {
  const { user = null, token } = useAuth();
  api.setHeader(token);
  return user && user?.user_role === "patient" ? <Outlet /> : redirectToLogin();
}

export default WithPatient;
