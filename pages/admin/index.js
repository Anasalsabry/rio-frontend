import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Admin = dynamic(() => import("@/components/Admin"), {
  ssr: false,
});
const AdminDashboard = ({ authToken, isAdmin }) => {
  const router = useRouter();
  useEffect(() => {
    if (authToken) {
      if (isAdmin === false) router.push("/products");
    } else {
      router.push("/login");
    }
  }, [authToken, isAdmin, router]); // Include 'router' in the dependency array
  return (
    <>
      <Admin />{" "}
    </>
  );
};


export default AdminDashboard;
