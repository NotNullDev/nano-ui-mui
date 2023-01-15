import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { globalStore } from "../stores/global";
import { fetchNanoContext } from "./nanoContext";

export const UseNanoContext = () => {
  const router = useRouter();
  return useQuery(["nanoContext"], fetchNanoContext, {
    onSuccess: (data) => {
      globalStore.setState((state) => {
        return data;
      });
      console.dir(data);
    },
    refetchInterval: 1000 * 10,
    enabled: router.asPath !== "/login",
  });
};
