import {
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { deleteApp, fetchLogs, runBuild, updateApp } from "../api/nanoContext";
import { EnvModal, envModalStore, openEnvModal } from "../components/EnvModal";
import { NanoToolbar } from "../components/NanoToolbar";
import { appInfoStore, globalStore } from "../stores/global";
import { queryClient } from "./_app";

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

let byeTimeout: NodeJS.Timeout | null;

function useAppPageInit() {
  const router = useRouter();
  const { appId } = router.query;

  useEffect(() => {
    appInfoStore.getState().resetStore();

    if (!appId) {
      toast("No app id provided, redirecting to home");

      if (byeTimeout) {
        clearTimeout(byeTimeout);
        byeTimeout = null;
      }

      byeTimeout = setTimeout(() => {
        router.push("/");
      }, 4000);
      return;
    }

    const foundApp = globalStore
      .getState()
      .apps.find((app) => app.ID === Number(appId));

    if (!foundApp) {
      toast(`App with id ${appId} not found, redirecting to home`);
      setTimeout(() => {
        router.push("/");
      }, 4000);
      return;
    }

    if (byeTimeout) {
      clearTimeout(byeTimeout);
      byeTimeout = null;
      toast.dismiss();
    }

    appInfoStore.setState((state) => {
      state = {
        ...state,
        ...foundApp,
      };
      return state;
    });
  }, [appId, router.asPath]);
}

const AppPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 flex-1 p-4 items-center`">
      <NanoToolbar>
        <div className="flex gap-2 items-center"></div>
        <div className="flex gap-2 items-center">
          <Button
            className="text-yellow-500 h-min"
            variant="contained"
            onClick={() => {
              runBuild(appInfoStore.getState().appName);
            }}
          >
            Build now
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            className="h-min text-orange-500"
            color="error"
            variant="text"
            onClick={async () => {
              await deleteApp(Number(getAppIdFromWindowLocation()));
              await queryClient.invalidateQueries(["nanoContext"]);
              toast("App successfully deleted");
              router.push("/");
            }}
          >
            Delete app
          </Button>
        </div>
      </NanoToolbar>
      <AppInfoArea />
      <EnvModal />
    </div>
  );
};

const AppInfoArea = () => {
  useAppPageInit();
  const app = appInfoStore((state) => state);

  return (
    <div
      className="flex flex-1 container mx-auto justify-center gap-12"
      key={app.ID}
    >
      <Paper className="flex flex-col gap-3 p-6 rounded-xl h-min">
        <TextField
          id="standard-basic"
          label="App name"
          variant="standard"
          defaultValue={app.appName}
        />
        <FormControlLabel control={<Switch defaultChecked />} label="Enabled" />
        <TextField
          id="standard-basic"
          label="Repo url"
          variant="standard"
          defaultValue={app.repoUrl}
        />
        <TextField
          id="standard-basic"
          label="Branch"
          variant="standard"
          placeholder="default"
          defaultValue={app.repoBranch}
        />
        <div className="flex gap-1 items-center">
          <label className="whitespace-nowrap">Environment variables</label>
          <Button
            size="small"
            onClick={() => {
              openEnvModal({
                title: "Environment variables",
                value: app.envVal,
                onChange: (value) => {
                  toast("Environment variables changed to " + value);
                },
                onCancel: () => {
                  toast("Environment variables cancelled");
                },
                onSave: () => {
                  toast("Environment variables saved");
                  appInfoStore.setState((state) => {
                    state.envVal = envModalStore.getState().value;
                  });
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
                  value: app.buildVal,
                  onChange: (value) => {
                    toast("Build variables changed to " + value);
                  },
                  onCancel: () => {
                    toast.error("Build variables cancelled");
                  },
                  onSave: () => {
                    appInfoStore.setState((state) => {
                      state.buildVal = envModalStore.getState().value;
                    });
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
            defaultValue={app.buildValMountPath}
          />
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <Button
            variant="text"
            color="error"
            onClick={() => {
              toast("App saved");
              updateApp(appInfoStore.getState());
            }}
          >
            Update
          </Button>
          <Link href="/">
            <Button variant="outlined" className="text-yellow-500">
              Discard
            </Button>
          </Link>
        </div>
      </Paper>
      <LogsArea appId={app.ID} />
    </div>
  );
};

type LogsSettingsStoreType = {
  refetchIntervalTime: number;
};

const logsSettingsStore = create<LogsSettingsStoreType>()(
  persist(
    immer((set) => {
      return {
        refetchIntervalTime: 5000,
      };
    }),
    {
      name: "logs-settings",
    }
  )
);

type LogsAreaType = {
  appId: number;
};

let refetchInterval: number | null = null;

const LogsArea = ({ appId }: LogsAreaType) => {
  const [logs, setLogs] = useState<string>("");
  const refechTime = logsSettingsStore((state) => state.refetchIntervalTime);

  return (
    <Paper className="h-min px-4 rounded-xl" elevation={4}>
      <Paper className="p-4 rounded-xl h-80 w-[45vw] mt-4 overflow-y-auto flex flex-col-reverse">
        {logs
          .split("\n")
          .reverse()
          .map((log, i) => {
            return <div key={i}>{log}</div>;
          })}
      </Paper>
      <div className="p-4 w-full flex justify-between my-4">
        <div className="flex gap-2">
          <TextField
            id="outlined-number"
            label="Refetch interval (ms)"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            className="w-40"
            defaultValue={refechTime}
            value={refechTime}
            size="small"
            onChange={(e) => {
              const v = Number(e.currentTarget.value);
              logsSettingsStore.setState((state) => {
                if (v - state.refetchIntervalTime > 0) {
                  state.refetchIntervalTime = state.refetchIntervalTime + 500;
                } else {
                  state.refetchIntervalTime = state.refetchIntervalTime - 500;
                }
                if (state.refetchIntervalTime < 0) {
                  state.refetchIntervalTime = 0;
                }
              });
            }}
          />
          <Button
            className="border-r border-black border"
            onClick={async () => {
              if (refetchInterval) {
                return;
              }
              refetchInterval = setInterval(async () => {
                const logs = await fetchLogs(appId);
                setLogs(logs.logs);
              }, refechTime);
            }}
          >
            Start interval
          </Button>
          <Button
            onClick={() => {
              if (refetchInterval) {
                clearInterval(refetchInterval);
                refetchInterval = null;
                toast("cleared interval");
              }
            }}
          >
            Clear interval
          </Button>
        </div>
        <div>
          <Button
            onClick={async () => {
              const logs = await fetchLogs(appId);
              setLogs(logs.logs);
            }}
          >
            Refetch logs
          </Button>
          <Button
            onClick={() => {
              onDownloadLogsClick();
            }}
          >
            Download logs
          </Button>
        </div>
      </div>
    </Paper>
  );
};

async function onDownloadLogsClick() {
  const logs = await fetchLogs(Number(getAppIdFromWindowLocation()));

  const link = document.createElement("a");
  link.download = "logs.txt";

  const blob = new Blob([logs.logs], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

const getAppIdFromWindowLocation = () => {
  return new URLSearchParams(window.location.search).get("appId");
};

export default AppPage;
