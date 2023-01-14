import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AuthStoreType = {
  isLoggedIn: boolean;
  token: string;
  serverUrl: string;
};

export const AuthStore = create<AuthStoreType>()(
  persist(
    immer((get, set, store) => {
      return {
        token: "",
        isLoggedIn: false,
        serverUrl:
          process.env.NEXT_PUBLIC_NANO_SERVER_URL ?? "http://localhost:8080",
      };
    }),
    {
      name: "nano-auth",
    }
  )
);
