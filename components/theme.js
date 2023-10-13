import { Roboto } from "@next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

const customTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2b2b2b",
      light: "#0288d1",
      dark: "#363d69",
    },
    secondary: {
      main: "#d13684",
    },
    background: {
      // default: "#002B36",
      default: "#000000",
      paper: "#386073",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#bdbdbd",
    },
    error: {
      main: "#dc322f",
    },
    warning: {
      main: "#cb4b16",
    },
    info: {
      main: "#268bd2",
    },
    success: {
      main: "#859900",
    },
  },
});

const adminTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2b2b2b",
      light: "#0288d1",
      dark: "#363d69",
    },
    secondary: {
      main: "#386073",
    },
    background: {
      default: "#002B36",
      paper: "#386073",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#bdbdbd",
    },
    error: {
      main: "#dc322f",
    },
    warning: {
      main: "#cb4b16",
    },
    info: {
      main: "#268bd2",
    },
    success: {
      main: "#859900",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export { lightTheme, darkTheme, customTheme, adminTheme };
