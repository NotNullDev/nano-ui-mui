import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { login } from "../api/nanoContext";
import { AuthStore } from "../stores/authStore";

type LoginStoreType = {
  username: string;
  password: string;
};

const loginStore = create<LoginStoreType>()(
  immer((set) => {
    return {
      username: "",
      password: "",
    };
  })
);

function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState(false);

  const password = loginStore((state) => state.password);

  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
      <Input
        id="standard-adornment-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) =>
          loginStore.setState((state) => {
            state.password = e.currentTarget.value;
          })
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

function UsernameInput() {
  const username = loginStore((state) => state.username);

  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
      <Input
        id="standard-adornment-username"
        type="text"
        value={username}
        onChange={(e) =>
          loginStore.setState((state) => {
            state.username = e.currentTarget.value;
          })
        }
      />
    </FormControl>
  );
}

function ServerUrlInput() {
  const serverUrl = AuthStore((state) => state.serverUrl);

  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
      <Input
        id="standard-adornment-username"
        type="text"
        value={serverUrl}
        onChange={(e) =>
          AuthStore.setState((state) => {
            state.serverUrl = e.currentTarget.value;
          })
        }
      />
    </FormControl>
  );
}

export const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (AuthStore.getState().isLoggedIn) {
      router.push("/");
    }
  }, []);

  return (
    <main className="flex flex-1 justify-center items-center">
      <Paper className="flex flex-col gap-2 p-24" elevation={3}>
        <h1>Welcome back</h1>
        <UsernameInput />
        <PasswordInput />
        <ServerUrlInput />
        <Button
          onClick={async () => {
            let token = "";
            try {
              token = await login(
                loginStore.getState().username,
                loginStore.getState().password
              );
            } catch (e) {
              toast("Failed to login", { type: "error" });
              return;
            }

            AuthStore.setState((state) => {
              state.token = token;
              state.isLoggedIn = true;
            });

            toast("Logged in successfully", { type: "success" });

            router.push("/");
          }}
        >
          Login
        </Button>
      </Paper>
    </main>
  );
};

export default LoginPage;
