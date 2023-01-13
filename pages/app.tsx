import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { EnvModal, openEnvModal } from "../components/EnvModal";

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
    <div className="flex flex-col gap-3 flex-1 p-6 items-center mt-12`">
      <div className="flex flex-col gap-3 w-1/5">
        <TextField id="standard-basic" label="App name" variant="standard" />
        <FormControlLabel control={<Switch defaultChecked />} label="Enabled" />
        <TextField id="standard-basic" label="Repo url" variant="standard" />
        <TextField
          id="standard-basic"
          label="Branch"
          variant="standard"
          placeholder="default"
        />
        <div className="flex gap-1 items-end">
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
          <TextField
            id="standard-basic"
            label="Mount point"
            variant="standard"
          />
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <Button variant="outlined">Save</Button>
          <Button variant="outlined">Discard</Button>
        </div>
      </div>
      <EnvModal />
    </div>
  );
};

export default AppPage;
