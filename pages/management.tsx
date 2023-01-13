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
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NanoToolbar } from "../components/NanoToolbar";

const ManagementPage = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <NanoToolbar>
        <div className="flex items-center gap-2">
          <Button variant="outlined" className="text-yellow-500">
            Copy token
          </Button>
          <Button variant="outlined" color="error">
            Reset token
          </Button>
        </div>
      </NanoToolbar>
      <div className="flex flex-1 justify-center gap-4">
        <Paper className="p-6 rounded-xl flex flex-col gap-3 w-min h-96">
          <div className="text-xl">Login</div>
          <UsernameInput />
          <PasswordInput />
          <Button>Update password</Button>
        </Paper>

        <Paper className="flex flex-col gap-2 p-6 rounded-xl h-96">
          <div className="text-xl">Metadata</div>
          <NewTokenInput />
          <ServerUrlInput />
          <Button>Update metadata</Button>
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
              ></IconButton>
            </InputAdornment>
          }
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
      <InputLabel htmlFor="standard-adornment-username">Server url</InputLabel>
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

export default ManagementPage;
