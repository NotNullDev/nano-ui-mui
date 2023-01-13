import immer from "immer";
import { create } from "zustand";
import { App, NanoContext } from "../types/NanoTypes";

type GlobalStoreType = NanoContext;

export const globalStore = create<GlobalStoreType>()(
  immer((set, get, store) => {
    return {
      apps: [],
      nanoConfig: {
        globalEnvironment: "",
        token: "",
      },
      buildingAppId: 0, // 0 means no app is building
    };
  })
);

export type AppInfo = {
  appId: number;
  appName: string;
  appStatus: string;
  envVal: string;
  envMountPath: string;
  buildVal: string;
  buildValMountPath: string;
  repoUrl: string;
};

export type AppLogsType = {
  logs: string;
  appId: number;
  ID: number;
  startedAt: string;
  finishedAt: string;
  buildStatus: string;
};

type AppInfoStoreType = {
  resetStore: () => void;
  appLogs: AppLogsType;
} & App;

export const appInfoStore = create<AppInfoStoreType>()(
  immer((set, get, store) => {
    const resetStore = () => {
      set((state: AppInfoStoreType) => {
        state = {
          ...state,
          appName: "",
          appStatus: "enabled",
          envVal: "",
          envMountPath: "",
          buildVal: "",
          buildValMountPath: "",
          repoUrl: "",
          CreatedAt: "",
          DeletedAt: "",
          repoBranch: "",
          ID: 0,
          UpdatedAt: "",
          appLogs: {
            appId: 0,
            finishedAt: "",
            ID: 0,
            logs: "",
            startedAt: "",
            buildStatus: "",
          },
        };
        return state;
      });
    };

    return {
      appName: "",
      appStatus: "enabled",
      envVal: "",
      envMountPath: "",
      buildVal: "",
      buildValMountPath: "",
      repoUrl: "",
      CreatedAt: "",
      DeletedAt: "",
      repoBranch: "",
      ID: 0,
      UpdatedAt: "",
      appLogs: {
        appId: 0,
        finishedAt: "",
        ID: 0,
        logs: "",
        startedAt: "",
        buildStatus: "",
      },
      resetStore,
    };
  })
);
