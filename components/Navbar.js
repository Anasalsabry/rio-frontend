import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Link,
  useMediaQuery,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Logout } from "@/helpers/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { fetcher } from "@/helpers/clientAPI";
import useSWR from "swr";

const creditStyle = {
  borderRadius: 3,
  backgroundColor: "#859900",
  color: "#bdbdbd",
  fontWeight: "bold",
  px: 2,
  py: 1,
  mx: { xs: 0, md: 3 },
};

const NavBar = ({ authToken }) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [authenticated, setAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(authenticated ? "/users/me" : null, fetcher);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    Logout();
    toast.success("Logged out successefully");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  useEffect(() => {
    console.log(authToken);
    if (authToken) setAuthenticated(true);
    else setAuthenticated(false);
  }, [authToken, router.pathname]);

  useEffect(() => {
    if (authenticated) {
      if (error) toast.error(error);
      if (userData) setUser(userData);
    }
  }, [userData, error, authenticated, user, router.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="background">
        <Toolbar>
          <div style={{ marginRight: "auto", display: "flex" }}>
            <Link
              underline="none"
              sx={{ display: "flex", alignItems: "center" }}
              href="/"
            >
              <Avatar
                style={{ scale: "1" }}
                variant="square"
                sx={{ width: 50, height: 50, bgcolor: "transparent",borderRadius:50 }}
                src="/logo.JPEG"
                alt="LOGO"
              />
            </Link>
            {!isSmall && authenticated && user && (
              <>
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "2rem",
                    fontWeight: "bold",
                  }}
                  href="/products"
                >
                  <Typography variant="h6">Products</Typography>
                </Link>
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    marginLeft: "2rem",
                    fontWeight: "bold",
                  }}
                  href="/purchases"
                >
                  <Typography variant="h6">Purchases</Typography>
                </Link>
              </>
            )}
          </div>
          {authenticated && user ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Box sx={creditStyle}> {`Credit : $${user?.credit}`}</Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography
                color="text.secondary"
                sx={{ display: { xs: "none", md: "block" } }}
              >{`#${user?.username}`}</Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    router.push("/purchases");
                  }}
                  href="/purchases"
                >
                  Purchases
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    router.push("/products");
                  }}
                  href="/products"
                >
                  Products
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Link href="/login" underline="none">
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: "#f0f0f0",
                  fontWeight: "bold",
                  flexGrow: 1,
                }}
              >
                Login
              </Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
