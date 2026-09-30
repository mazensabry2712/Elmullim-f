import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EnrollCourse from "@/pages/courses/EnrollCourse";
import { I18nProvider } from "@/i18n";

const mockUseGetCourseById = vi.fn();
const mockUseInitiatePayment = vi.fn();
const mockUseValidatePromoCode = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseById: (...args: unknown[]) => mockUseGetCourseById(...args),
}));

vi.mock("@/lib/react-query/student/enrolling", () => ({
  useInitiatePayment: (...args: unknown[]) => mockUseInitiatePayment(...args),
  useValidatePromoCode: (...args: unknown[]) => mockUseValidatePromoCode(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
    getRole: vi.fn(() => "student"),
  },
}));

vi.mock("react-redux", () => ({
  useSelector: () => ({ isAuthenticated: true }),
}));

vi.mock("@/components/courses/EnrollFreeCourse", () => ({
  default: ({ courseId }: { courseId: number }) => (
    <button type="button">Enroll free course {courseId}</button>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    article: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, animate, transition, ...rest } = props;
      void initial;
      void animate;
      void transition;
      return <article {...rest}>{children}</article>;
    },
    section: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, animate, whileInView, viewport, transition, ...rest } = props;
      void initial;
      void animate;
      void whileInView;
      void viewport;
      void transition;
      return <section {...rest}>{children}</section>;
    },
  },
}));

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/course/7/enroll"]}>
        <I18nProvider>
          <Routes>
            <Route path="/course/:courseId/enroll" element={<EnrollCourse />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Course enrollment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mockUseInitiatePayment.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
    });
    mockUseValidatePromoCode.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      reset: vi.fn(),
    });
  });

  it("shows a real free-course enrollment action", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Physics Fundamentals",
          description: "Learn the fundamentals of physics.",
          price: 0,
          level: "Beginner",
          created_at: "2026-01-10T00:00:00.000Z",
          hasEnrolled: false,
          teacher: { name: "Teacher One" },
          image: "/course.jpg",
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByRole("heading", { name: /course enrollment/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Physics Fundamentals")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enroll free course 7/i })).toBeInTheDocument();
  });

  it("shows the unified Paymob checkout payment methods for paid courses", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 8,
          title: "Advanced Mathematics",
          description: "Advanced mathematics course.",
          price: 500,
          level: "Advanced",
          created_at: "2026-01-10T00:00:00.000Z",
          hasEnrolled: false,
          teacher: { name: "Teacher Two" },
          image: "/course.jpg",
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByRole("heading", { name: /choose how you want to pay/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText("Visa / Mastercard")).toBeInTheDocument();
    expect(screen.getByText("Fawry / Kiosk")).toBeInTheDocument();
    expect(screen.getByText("Egyptian mobile wallets")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to payment/i })).toBeInTheDocument();

    const startPayment = vi.fn().mockResolvedValue({
      data: { payment_required: true, redirect_url: "https://example.test/checkout" },
    });
    mockUseInitiatePayment.mockReturnValue({
      mutateAsync: startPayment,
      isPending: false,
      isError: false,
    });

    fireEvent.click(screen.getByRole("radio", { name: /mobile wallets/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue to payment/i }));

    await waitFor(() =>
      expect(startPayment).toHaveBeenCalledWith({
        token: "token",
        courseId: 8,
        paymentMethod: "wallet",
        promoCode: undefined,
      })
    );
  });

  it("applies a promo code and updates the checkout total", async () => {
    const applyPromo = vi.fn().mockResolvedValue({
      status: true,
      message: "promo code applied",
      data: {
        code: "SAVE20",
        discount_percent: 20,
        original_amount: 500,
        discount_amount: 100,
        final_amount: 400,
      },
    });

    mockUseValidatePromoCode.mockReturnValue({
      mutateAsync: applyPromo,
      isPending: false,
      reset: vi.fn(),
    });

    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 8,
          title: "Advanced Mathematics",
          description: "Advanced mathematics course.",
          price: 500,
          level: "Advanced",
          created_at: "2026-01-10T00:00:00.000Z",
          hasEnrolled: false,
          teacher: { name: "Teacher Two" },
          image: "/course.jpg",
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    fireEvent.change(screen.getByLabelText("Promo code"), {
      target: { value: "save20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() =>
      expect(applyPromo).toHaveBeenCalledWith({
        token: "token",
        courseId: 8,
        code: "SAVE20",
      })
    );

    expect(screen.getByText("SAVE20 · 20% off")).toBeInTheDocument();
    expect(screen.getAllByText("400.00 L.E").length).toBeGreaterThan(0);
    expect(screen.getByText("-100.00 L.E")).toBeInTheDocument();
  });

  it("renders a retryable error state when the course cannot be loaded", () => {
    const refetch = vi.fn();
    mockUseGetCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    renderPage();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
