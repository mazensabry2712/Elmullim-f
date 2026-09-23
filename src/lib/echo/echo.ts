import Echo from "laravel-echo";
import Pusher from "pusher-js";
import cookieService from "@/utils/cookieService";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoInstance: Echo<any> | null = null;
let echoToken: string | undefined;

const apiBaseUrl =
  import.meta.env.VITE_API ||
  (import.meta.env.DEV ? "http://Elmullim-b.test" : "https://api.elmullim.com");

export const getEcho = (): Echo<any> | null => {
  const token = cookieService.getToken();

  if (!token || !import.meta.env.VITE_PUSHER_APP_KEY) {
    return null;
  }

  if (echoInstance && echoToken === token) {
    return echoInstance;
  }

  if (echoInstance) {
    echoInstance.disconnect();
  }

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_CLUSTER || "mt1",
    wsPort: 80,
    wssPort: 443,
    forceTLS: apiBaseUrl.startsWith("https"),
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
