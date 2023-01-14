import { toast } from "react-toastify";
import { AuthStore } from "../stores/authStore";
import { AppLogsType, globalStore } from "../stores/global";
import { App, NanoContext } from "../types/NanoTypes";

export function showEnv() {
  toast("serverUrl: " + AuthStore.getState().serverUrl);
}

export async function fetchNanoContext(): Promise<NanoContext> {
  const res = await nanoFetch("/");
  const data = (await res?.json()) as NanoContext;

  data.nanoConfig.globalEnvironment = base64Decode(
    data.nanoConfig.globalEnvironment
  );

  data.apps.map((app) => {
    app.envVal = base64Decode(app.envVal);
    app.buildVal = base64Decode(app.buildVal);
  });

  data.apps.sort((a, b) => b.ID - a.ID);
  return data;
}

export async function resetToken(): Promise<string> {
  const res = await nanoFetch("/reset-token", {
    method: "POST",
  });
  let data = (await res?.text()) as string;

  // data comes in format "<token>", so we need to remove the quotes
  data = data.slice(1);
  data = data.slice(0, data.length - 2);

  return data;
}

export async function updateGlobalEnv(updatedEnv: string): Promise<string> {
  const res = await nanoFetch("/update-global-env", {
    method: "POST",
    headers: {
      "Content-Type": "application/text",
    },
    body: updatedEnv,
  });
  const data = (await res?.text()) as string;
  return base64Decode(data);
}

export async function createApp(name: string) {
  const res = await nanoFetch("/create-app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appName: name,
    }),
  });
  const data = (await res?.json()) as App;
  return data;
}

export async function updateApp(app: App) {
  const res = await nanoFetch("/update-app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(app),
  });
  const data = (await res?.json()) as App;
  return data;
}

export async function deleteApp(appId: number) {
  const res = await nanoFetch("/delete-app?id=" + appId, {
    method: "DELETE",
  });
  const data = (await res?.text()) as string;

  return Number(data);
}

// https://github.com/Azure/fetch-event-source
export async function runBuild(appName: string) {
  const res = await nanoFetch("/build?appName=" + appName, {
    method: "POST",
    headers: {
      Authorization: globalStore.getState().nanoConfig.token,
    },
  });

  const data = (await res?.text()) as string;
  return data;
}

export async function updateUser(
  username: string,
  password: string,
  repeatPassword: string
) {
  if (password !== repeatPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const res = await nanoFetch("/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = (await res?.text()) as string;
  return data;
}

export async function login(username: string, password: string) {
  const res = await nanoFetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res?.ok) {
    throw new Error("Login failed");
  }

  let data = (await res?.text()) as string;
  // data comes in format "<token>", so we need to remove the quotes
  data = data.slice(1);
  data = data.slice(0, data.length - 2);
  return data;
}

export async function logout() {
  AuthStore.setState((state) => {
    (state.isLoggedIn = false), (state.token = "");
  });
}

export async function resetGlobalBuildStatus() {
  const res = await nanoFetch("/reset-global-build-status", {});
  const data = (await res?.text()) as string;
  return data;
}

export async function fetchLogs(appId: number, limit: number = 1) {
  const res = await nanoFetch("/logs?appId=" + appId + "&limit=" + limit);
  const data = (await res?.json()) as AppLogsType;
  return data;
}

function base64Decode(str: string) {
  return Buffer.from(str, "base64").toString("ascii");
}

async function nanoFetch(path: string, options?: RequestInit) {
  if (options) {
    options.headers = {
      ...options.headers,
      "nano-token": AuthStore.getState().token,
    };
  } else {
    options = {
      headers: {
        "nano-token": AuthStore.getState().token,
      },
    };
  }

  const resp = await fetch(AuthStore.getState().serverUrl + path, options);

  if (
    (AuthStore.getState().isLoggedIn && resp.status === 401) ||
    resp.status === 403
  ) {
    AuthStore.setState((state) => {
      (state.isLoggedIn = false), (state.token = "");
    });
  }

  if (!resp.ok) {
    const errMessage = await resp.json();
    // toast.error(errMessage.error);
    return;
    // throw new Error(resp.statusText);
  }

  return resp;
}
