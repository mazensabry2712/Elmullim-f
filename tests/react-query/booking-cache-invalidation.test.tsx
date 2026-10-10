import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { expect, it, vi } from "vitest";
import { acceptBooking } from "@/services/booking";
import { bookingKeys, useAcceptBooking } from "@/lib/react-query/booking";

vi.mock("@/services/booking", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/booking")>();
  return {
    ...actual,
    acceptBooking: vi.fn(),
  };
});

it("invalidates teacher booking pages after accepting a booking", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  vi.mocked(acceptBooking).mockResolvedValue(
    {} as Awaited<ReturnType<typeof acceptBooking>>
  );

  const { result } = renderHook(() => useAcceptBooking(), { wrapper });

  await act(async () => {
    await result.current.mutateAsync({ token: "test-token", bookingId: 42 });
  });

  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: bookingKeys.teacher(),
  });
});
