import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

export function setAxiosHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
  }
}
