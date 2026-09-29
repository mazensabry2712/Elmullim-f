import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      enabled: typeof navigator !== "undefined" && navigator.onLine,
    },
  },
});

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const authCacheKey = isAuthenticated ? `user:${role ?? "unknown"}` : "guest";
  const previousAuthCacheKey = useRef(authCacheKey);

  useEffect(() => {
    if (previousAuthCacheKey.current === authCacheKey) return;
    queryClient.clear();
    previousAuthCacheKey.current = authCacheKey;
  }, [authCacheKey]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;