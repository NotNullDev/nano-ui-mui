import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Button, CssBaseline, Toolbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import type { AppProps } from "next/app";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: "dark",
            primary: {
              main: "#fbc02d",
              light: "#fbc02d",
            },
            background: {
              default: "#312e81",
              paper: "#312e81",
            },
            text: {
              primary: "#ecebeb",
              secondary: "rgba(249,249,249,0.7)",
              disabled: "rgba(255,255,255,0.5)",
            },
          },
          components: {
            MuiButton: {
              defaultProps: { disableRipple: true },
            },
          },
        })}
      >
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

const Header = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" className="text-xl mr-4">
            Nano CI CD
          </Link>
          <div className="flex-1 gap-3 flex ">
            <Link href="/app" color="inherit">
              Builds
            </Link>
            <Link href="/app" color="inherit">
              Stats
            </Link>
          </div>
          <Button color="inherit">
            <Link href="/login">Login</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
