import { Cookies } from "react-cookie";

export const getAuthToken = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  return token;
};

export const isUserAdmin = () => {
  const cookies = new Cookies();
  const admin = cookies.get("admin");
  return admin ? true : false;
};

export const setAuthToken = (token, isAdmin) => {
  const cookies = new Cookies();
  cookies.set("token", token);
  if (isAdmin) cookies.set("admin", isAdmin);
};

export const Logout = () => {
  const cookies = new Cookies();
  cookies.remove("token");
  cookies.remove("admin");
};
