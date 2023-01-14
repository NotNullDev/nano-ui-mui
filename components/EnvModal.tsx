import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ModalStoreWritableType = {
  open: boolean;
  title: string;
  value: string;
};

export type ModalStoreFunctionalType = {
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  resetStore: () => void;
};

export type ModalStoreType = ModalStoreWritableType & ModalStoreFunctionalType;

const resetStore = () => {
  envModalStore.setState((state) => {
    state.open = false;
    state.title = "";
    state.value = "";
    state.onCancel = () => {};
    state.onSave = () => {};
    state.onChange = () => {};
    state.resetStore = resetStore;
  });
};

export const envModalStore = create<ModalStoreType>()(
  immer((set) => {
    return {
      open: false,
      title: "",
      value: "",
      onCancel: () => {},
      onSave: () => {},
      onChange: (newVal) => {
        toast(newVal);
      },
      resetStore: resetStore,
    };
  })
);

export type OpenModalArguements = {
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
};

export function openEnvModal({
  title = "",
  value = "",
  onChange = () => {},
  onSave = () => {},
  onCancel = () => {},
}: OpenModalArguements) {
  envModalStore.getState().resetStore();

  envModalStore.setState((state) => {
    state.open = true;
    state.title = title;
    state.value = value;
    state.onChange = onChange;
    state.onSave = onSave;
    state.onCancel = onCancel;
  });
}

export const EnvModal = () => {
  const open = envModalStore((state) => state.open);
  const title = envModalStore((state) => state.title);
  const value = envModalStore((state) => state.value);

  const setOpen = (value: boolean) => {
    envModalStore.setState((state) => {
      state.open = value;
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          envModalStore.getState().onCancel();
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
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
            onChange={(e) => {
              const newValue = e.target.value ?? "";

              envModalStore.setState((state) => {
                state.value = newValue;
              });

              envModalStore.getState().onChange(newValue);
            }}
            defaultValue={value}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              envModalStore.getState().onCancel();
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setOpen(false);
              envModalStore.getState().onSave();
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
