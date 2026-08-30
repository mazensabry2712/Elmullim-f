// src/lib/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import cookieService from "@/utils/cookieService";


declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;
const token = cookieService.getToken()!
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  wsPort: 80,
  wssPort: 443,
  forceTLS: import.meta.env.VITE_API.startsWith("https"),
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${import.meta.env.VITE_API}/api/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
  withCredentials:true,
});

export default echo;