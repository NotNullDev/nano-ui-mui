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
import { useState } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  clearBuilds,
  dockerSystemPrune,
  resetGlobalBuildStatus,
  resetToken,
  updateUser,
} from "../api/nanoContext";
import { NanoToolbar } from "../components/NanoToolbar";
import { AuthStore } from "../stores/authStore";
import { globalStore } from "../stores/global";

const ManagementPage = () => {
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col p-4">
      <NanoToolbar>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await dockerSystemPrune();
            toast("success");
          }}
        >
          Run docker system prune
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await clearBuilds();
            toast("success");
          }}
        >
          Clear builds
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await resetGlobalBuildStatus();
            toast("Success");
          }}
        >
          Reset global build status
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={() => {
            window.navigator.clipboard.writeText(
              globalStore.getState().nanoConfig.token
            );
            toast("Copied token to clipboard");
          }}
        >
          Copy token
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            const token = await resetToken();

            globalStore.setState((state) => {
              state.nanoConfig.token = token;
            });

            toast("Token reset. Please refresh the page.");

            window.navigator.clipboard.writeText(token);
            toast("Copied token to clipboard");
          }}
        >
          Reset token
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            toast(AuthStore.getState().serverUrl);
          }}
        >
          Show env
        </Button>
      </NanoToolbar>
      <div className="flex flex-1 justify-center gap-4">
        <Paper className="p-6 rounded-xl flex flex-col gap-3 w-min h-96">
          <div className="text-xl">Login</div>
          <UsernameInput />
          <PasswordInput />
          <Button
            onClick={async () => {
              await updateUser(
                loginStore.getState().username,
                loginStore.getState().password,
                loginStore.getState().repeatPassword
              );

              AuthStore.getState().isLoggedIn = false;
              AuthStore.getState().token = "";

              router.push("/login");

              toast("Credentials updated");
            }}
          >
            Update credentials
          </Button>
        </Paper>

        <Paper className="flex flex-col gap-2 p-6 rounded-xl h-96">
          <div className="text-xl">Metadata</div>
          <NewTokenInput />
          <ServerUrlInput />
        </Paper>
      </div>
    </div>
  );
};

function NewTokenInput() {
  const val = "";
  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-password">New token</InputLabel>
      <Input
        id="standard-adornment-new-token"
        type={"text"}
        value={val}
        onChange={(e) => toast("e")}
      />
    </FormControl>
  );
}

type LoginStoreType = {
  username: string;
  password: string;
  repeatPassword: string;
};

const loginStore = create<LoginStoreType>()(
  immer((set) => {
    return {
      username: "",
      password: "",
      repeatPassword: "",
    };
  })
);

function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  const password = loginStore((state) => state.password);
  const repeatPassword = loginStore((state) => state.repeatPassword);

  return (
    <>
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
      <FormControl
        sx={{
          m: 1,
          width: "25ch",
        }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">
          Repeat password
        </InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? "text" : "password"}
          value={repeatPassword}
          onChange={(e) => {
            loginStore.setState((state) => {
              state.repeatPassword = e.currentTarget.value ?? "";
            });
          }}
        />
      </FormControl>
    </>
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
  const serverUrl = AuthStore((state) => state.serverUrl);

  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-username">Server url</InputLabel>
      <Input
        id="standard-adornment-server-urll"
        type="text"
        onChange={(e) => {}}
        defaultValue={serverUrl}
      />
    </FormControl>
  );
}

export default ManagementPage;
