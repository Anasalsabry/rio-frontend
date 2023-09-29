import React, { cloneElement, useEffect, useState } from "react";
import { Container } from "@mui/material";
import { darkTheme } from "@/components/theme";
import NavBar from "@/components/Navbar";
import Copyright from "./Copyright";
import { getAuthToken, isUserAdmin } from "@/helpers/auth";
import { useRouter } from "next/router";

const Wrapper = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();
  router.pathname.startsWith("/admin");
  const token = getAuthToken();
  useEffect(() => {
    setIsAdmin(isUserAdmin());
  }, []);
  return (
    <>
      {!router.pathname.startsWith("/admin") ? (
        <>
          <NavBar authToken={token} />
          <Container
            sx={{
              bgcolor: "background.default",
              color: "text.primary",
              height: "fit-content",
              minHeight: "100vh",
              width: "100vw",
              maxWidth: "none !important",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "space-around",
            }}
            // maxWidth="lg"
          >
            {cloneElement(children, { authToken: token, isAdmin })}
            <Copyright sx={{ mt: "auto" }} />
          </Container>
        </>
      ) : (
        cloneElement(children, { authToken: token, isAdmin })
      )}
    </>
  );
};

export default Wrapper;
