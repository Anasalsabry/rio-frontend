import * as React from "react";
import { Layout, AppBar, useNotify } from "react-admin";
import { Typography, Avatar, IconButton, Tooltip, Alert } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Logout } from "@/helpers/auth";
import { useRouter } from "next/router";

const MyAppBar = (props) => {
  const router = useRouter();
  const notify = useNotify();
  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    notify("ra.notification.logged_out", { type: "success" });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };
  return (
    <AppBar
      sx={{
        "& .RaAppBar-title": {
          flex: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }}
      {...props}
    >
      <Typography
        variant="h6"
        color="inherit"
        //   className={classes.title}
        id="react-admin-title"
      />
      <Avatar
        variant="square"
        sx={{
          //   scale: "3",
          width: 80,
          height: 90,
          marginInline: "auto",
          marginBlock: "0.5rem 0.5rem",
          // marginBottom: "3rem",
          bgcolor: "transparent",
          borderRadius:20
        }}
        src="/logo.JPEG"
        alt="LOGO"
      />
      <Tooltip title="Logout">
        <IconButton aria-label="Logout" color="warning" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </AppBar>
  );
};

const MyLayout = (props) => (
  <Layout
    {...props}
    sx={{ "& .RaLayout-contentWithSidebar": { marginTop: "2rem" } }}
    appBar={MyAppBar}
  />
);

export default MyLayout;
