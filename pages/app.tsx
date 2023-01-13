import {
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { EnvModal, openEnvModal } from "../components/EnvModal";
import { NanoToolbar } from "../components/NanoToolbar";

type AppStateStoreType = {
  envModalOpen: boolean;
  envModalValue: string;
  buildModalOpen: boolean;
  buildModalValue: string;
};

const appStateStore = create<AppStateStoreType>()(
  immer((set) => {
    return {
      envModalOpen: false,
      buildModalOpen: false,
      buildModalValue: "",
      envModalValue: "",
    };
  })
);

const AppPage = () => {
  return (
    <div className="flex flex-col gap-3 flex-1 p-4 items-center`">
      <NanoToolbar>
        <div className="flex gap-2 items-center">
          <Button className="text-yellow-500 h-min" variant="contained">
            Download logs
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button className="text-yellow-500 h-min" variant="contained">
            Build now
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            className="h-min text-orange-500"
            color="error"
            variant="text"
          >
            Delete app
          </Button>
        </div>
      </NanoToolbar>
      <div className="flex flex-1 container mx-auto justify-center gap-12">
        <Paper className="w-1/5 flex flex-col gap-3 p-6 rounded-xl h-min">
          <TextField id="standard-basic" label="App name" variant="standard" />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enabled"
          />
          <TextField id="standard-basic" label="Repo url" variant="standard" />
          <TextField
            id="standard-basic"
            label="Branch"
            variant="standard"
            placeholder="default"
          />
          <div className="flex gap-1 items-end items-center">
            <label className="whitespace-nowrap">Environment variables</label>
            <Button
              size="small"
              onClick={() => {
                openEnvModal({
                  title: "Environment variables",
                  onChange: (value) => {
                    toast("Environment variables changed to " + value);
                  },
                  onCancel: () => {
                    toast("Environment variables cancelled");
                  },
                  onSave: () => {
                    toast("Environment variables saved");
                  },
                });
              }}
            >
              Edit
            </Button>
          </div>
          <div className="flex gap-1 items-end">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap">Build variables</label>
              <Button
                size="small"
                onClick={() => {
                  openEnvModal({
                    title: "Build variables",
                    onChange: (value) => {
                      toast("Build variables changed to " + value);
                    },
                    onCancel: () => {
                      toast("Build variables cancelled");
                    },
                    onSave: () => {
                      toast("Build variables saved");
                    },
                  });
                }}
              >
                Edit
              </Button>
            </div>
            <TextField
              id="standard-basic"
              label="Mount point"
              variant="standard"
            />
          </div>
          <div className="flex gap-2 justify-end mt-5">
            <Button
              variant="text"
              color="error"
              onClick={() => {
                toast("App saved");
              }}
            >
              Save
            </Button>
            <Link href="/">
              <Button variant="outlined" className="text-yellow-500">
                Discard
              </Button>
            </Link>
          </div>
        </Paper>
        <Paper className="h-min px-4 rounded-xl" elevation={4}>
          <Paper className="p-4 rounded-xl h-80 w-[45vw] mt-4"></Paper>
          <div className="p-4 justify-end w-full flex">
            <Button>Refetch logs</Button>
            <Button>Download logs</Button>
          </div>
        </Paper>
      </div>
      <EnvModal />
    </div>
  );
};

export default AppPage;
