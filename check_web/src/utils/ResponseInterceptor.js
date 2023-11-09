import { useEffect, useRef } from "react";
import { useLogout } from "../services/auth";
import axios from "axios";
import useCustomToastr from "./useCustomToastr";

export const ResponseInterceptor = () => {
  const logout = useLogout();
  const toast = useCustomToastr();

  const interceptorId = useRef(null);

  useEffect(() => {
    interceptorId.current = axios.interceptors.response.use(undefined, (error) => {
      switch (error.response.status) {
        case 0:
          error.response.data = { message: "Please check your internet connection!" };
          throw error;
        case 400:
        case 403:
        case 404:
        case 405:
        case 500:
          throw error;
        case 401:
          logout();
          break;
        default:
          break;
      }
      return Promise.reject(error);
    });
    return () => {
      axios.interceptors.response.eject(interceptorId.current);
    };
  }, [logout, toast]);
  return null;
};
