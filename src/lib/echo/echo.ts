import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosAPI from "@/config/axios.config";
import cookieService from "@/utils/cookieService";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

type RuntimePusherConfig = {
  enabled: boolean;
  key: string | null;
  cluster: string | null;
  host: string | null;
  port: number | null;
  scheme: string | null;
};

let echoInstance: Echo<any> | null = null;
let echoToken: string | undefined;

const apiBaseUrl =
  import.meta.env.VITE_API ||
  (import.meta.env.DEV ? "http://Elmullim-b.test" : "https://api.elmullim.com");

const getRuntimePusherConfig = async (token: string): Promise<RuntimePusherConfig | null> => {
  try {
    const { data } = await axiosAPI.get("/realtime/config", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data?.data ?? null;
  } catch {
    const key = String(import.meta.env.VITE_PUSHER_APP_KEY || "").trim();

    if (!key) {
      return null;
    }

    return {
      enabled: true,
      key,
      cluster: String(import.meta.env.VITE_PUSHER_CLUSTER || "mt1"),
      host: null,
      port: 443,
      scheme: apiBaseUrl.startsWith("https") ? "https" : "http",
    };
  }
};

export const getEcho = async (): Promise<Echo<any> | null> => {
  const token = cookieService.getToken();

  if (!token) {
    return null;
  }

  const runtimeConfig = await getRuntimePusherConfig(token);

  if (
    !runtimeConfig?.enabled ||
    !runtimeConfig.key ||
    !runtimeConfig.cluster
  ) {
    return null;
  }

  if (echoInstance && echoToken === token) {
    return echoInstance;
  }

  if (echoInstance) {
    echoInstance.disconnect();
  }

  window.Pusher = Pusher;

  const hostOptions = runtimeConfig.host
    ? {
        wsHost: runtimeConfig.host,
        wsPort: runtimeConfig.port || 80,
        wssPort: runtimeConfig.port || 443,
        forceTLS: (runtimeConfig.scheme || "https") === "https",
      }
    : {
        cluster: runtimeConfig.cluster,
        forceTLS: true,
        wsPort: 80,
        wssPort: 443,
      };

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: runtimeConfig.key,
    cluster: runtimeConfig.cluster,
    ...hostOptions,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${apiBaseUrl.replace(/\/$/, "")}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    withCredentials: false,
  });

  echoToken = token;

  return echoInstance;
};

export default getEcho;
