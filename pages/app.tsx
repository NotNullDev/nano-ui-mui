import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
              appStateStore.setState((state) => {
                state.envModalOpen = true;
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
              appStateStore.setState((state) => {
                state.buildModalOpen = true;
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

const EnvModal = () => {
  const open = appStateStore((state) => state.envModalOpen);

  const setOpen = (value: boolean) => {
    appStateStore.setState((state) => {
      state.envModalOpen = value;
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Environment varibales</DialogTitle>
        <DialogContent>
          <TextField
            rows={10}
            autoFocus
            multiline
            className="w-full"
            sx={{
              ":focus": {
                outline: "none",
              },
              ":active": {
                outline: "none",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppPage;
