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
import { useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
  const [showPassword, setShowPassword] = useState(false);
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
  const [showPassword, setShowPassword] = useState(false);
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

export const LoginPage = () => {
  return (
    <main className="flex flex-1 justify-center items-center">
      <Paper className="flex flex-col gap-2 p-24" elevation={3}>
        <h1>Welcome back</h1>
        <UsernameInput />
        <PasswordInput />
        <ServerUrlInput />
        <Button>Login</Button>
      </Paper>
    </main>
  );
};

export default LoginPage;
