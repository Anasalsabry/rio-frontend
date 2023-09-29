import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import API from "@/helpers/API";
import { toast } from "react-toastify";
import { decodeToken } from "react-jwt";
import { setAuthToken } from "@/helpers/auth";
import { useRouter } from "next/router";
import Image from "next/image";

const Login = ({ authToken, isAdmin }) => {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter();
  const validation = () => {
    let valErrors = { username: "", password: "" };
    let valid = true;
    if (!values?.username) {
      valErrors = { ...valErrors, username: "Username is required" };
      valid = false;
    }
    if (!values?.password) {
      valErrors = { ...valErrors, password: "Password is required" };
      valid = false;
    }
    setErrors(valErrors);
    return valid;
  };
  const logginIn = (data) => {

    const token = decodeToken(data?.access_token);
    setAuthToken(data?.access_token, token?.is_admin);
    setTimeout(() => {
      if (token?.is_admin) router.push("/admin");
      else router.push("/products");
    }, 500);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validation()) return false;
    const loginPromise = API.post("/token", { ...values });
    toast.promise(loginPromise, {
      pending: "Logging In...",
      success: {
        render: ({ data }) => {
          logginIn(data?.data);
          return `Success: Welcome ${values?.username}!`;
        },
      },
      error: {
        render: ({ data: err }) => {
          console.error(err);
          return err?.response?.status === 401
            ? "Error: Invalid Credentials."
            : "Something went wrong, Please contact the admin.";
        },
      },
    });
  };
  useEffect(() => {
    setTimeout(() => {
      if (authToken && typeof isAdmin === "boolean") {
        if (isAdmin === true) router.push("/admin");
        else router.push("/products");
      }
    }, 500);
  }, [authToken, isAdmin, router]);

  return (
    <Container
      // sx={{ bgcolor: "background.default", color: "text.primary" }}
      component="main"
      maxWidth="xs"
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          width="300"
          height="250"
          style={{
            marginTop: "2rem",
            marginBottom: "0.5rem",
          }}
          src="/logo.JPEG"
          alt="LOGO"
        />
        {/* <Typography component="h1" variant="h5">
          Log In
        </Typography> */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(errors?.username)}
            helperText={errors?.username}
            margin="normal"
            required
            fullWidth
            value={values?.username}
            onChange={(event) => {
              setValues({ ...values, username: event.target.value });
            }}
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            error={Boolean(errors?.password)}
            helperText={errors?.password}
            margin="normal"
            required
            fullWidth
            value={values?.password}
            onChange={(event) => {
              setValues({ ...values, password: event.target.value });
            }}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password? Contact Admin
              </Link>
              <Link href="https://t.me/rhhho" variant="body2" sx={{ ml: 2 }}>
                Conatact us wit , telegram
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
