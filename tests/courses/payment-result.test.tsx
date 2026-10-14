import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import PaymentResult from "@/pages/courses/PaymentResult";
import QueryKeys from "@/enums";

const mockGetPaymentStatus = vi.fn();

vi.mock("@/services/student/enrolling", () => ({
  getPaymentStatus: (...args: unknown[]) => mockGetPaymentStatus(...args),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderPage = (
  entry = "/payment/result?order=5001&sig=signed",
  queryClient = createQueryClient(),
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[entry]}>
        <I18nProvider>
          <Routes>
            <Route path="/payment/result" element={<PaymentResult />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Payment result", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("keeps Fawry payments pending while the provider confirms them", async () => {
    mockGetPaymentStatus.mockResolvedValue({
      status: true,
      data: {
        status: "pending",
        payment_method: "fawry",
        orderable_type: "courses",
        orderable_id: 7,
        course_id: 7,
        transaction_id: null,
      },
    });

    renderPage();

    await waitFor(() => expect(mockGetPaymentStatus).toHaveBeenCalledWith({
      orderId: 5001,
      signature: "signed",
    }));

    expect(
      screen.getByText(
        "Your Fawry payment is pending. Complete the payment from the checkout screen; confirmation can arrive after the cash payment is completed."
      )
    ).toBeInTheDocument();
  });

  it("refreshes course access data only after the API confirms paid-course success", async () => {
    mockGetPaymentStatus.mockResolvedValue({
      status: true,
      data: {
        status: "success",
        payment_method: "card",
        orderable_type: "courses",
        orderable_id: 7,
        course_id: 7,
        transaction_id: 555001,
      },
    });

    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderPage("/payment/result?order=5001&sig=signed", queryClient);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [QueryKeys.MY_COURSES],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [QueryKeys.COURSES],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [QueryKeys.SUB_CATEGORY_COURSES],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [QueryKeys.COURSE, 7],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [QueryKeys.COURSE_LECTURES, 7],
      });
    });
  });

  it("shows an invalid reference state without polling when the signed reference is missing", () => {
    renderPage("/payment/result");

    expect(screen.getByText("We could not verify this payment right now.")).toBeInTheDocument();
    expect(mockGetPaymentStatus).not.toHaveBeenCalled();
  });
});
