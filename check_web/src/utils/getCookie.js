import Cookies from "js-cookie";

const getCookie = (cookie = "auth") => {
  if (!Cookies.get(cookie)) return null;
  const data = JSON.parse(Cookies.get(cookie));
  return data;
};

export default getCookie;
