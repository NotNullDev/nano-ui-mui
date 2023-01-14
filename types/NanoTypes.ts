export interface NanoContext {
  apps: App[];
  nanoConfig: NanoConfig;
  buildingAppId: number;
}

export interface App {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  appName: string;
  appStatus: string;
  envVal: string;
  envMountPath: string;
  buildVal: string;
  buildValMountPath: string;
  repoUrl: string;
  repoBranch: string;
}

export interface NanoConfig {
  globalEnvironment: string;
  token: string;
}

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
