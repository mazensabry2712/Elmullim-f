import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TeacherWallet from "@/pages/profile/teacher/TeacherWallet";

const mocks = vi.hoisted(() => ({
  getWallet: vi.fn(),
  getPayouts: vi.fn(),
  createPayout: vi.fn(),
  pending: false,
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: vi.fn(() => "teacher-token") },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language: "ar" }),
}));

vi.mock("@/utils/dateTime", () => ({
  formatDateTime: () => "25/10/2026",
}));

vi.mock("@/lib/react-query/teacherWallet", () => ({
  useGetTeacherWallet: (...args: unknown[]) => mocks.getWallet(...args),
  useGetTeacherPayouts: (...args: unknown[]) => mocks.getPayouts(...args),
  useCreateTeacherPayout: () => ({
    mutateAsync: mocks.createPayout,
    isPending: mocks.pending,
  }),
}));

describe("TeacherWallet payout request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.pending = false;
    mocks.createPayout.mockResolvedValue({
      status: true,
      message: "success payout",
      data: {
        id: 42,
        amount: "125.00",
        status: "pending",
        payout_method: "bank_card",
        created_at: "2026-10-25T12:00:00Z",
        updated_at: "2026-10-25T12:00:00Z",
        transaction_id: "test-transaction",
        client_reference_id: "test-reference",
      },
    });
    mocks.getWallet.mockReturnValue({
      data: {
        data: {
          total: 1800,
          withdrawn: 100,
          reserved: 200,
          available_balance: 1500,
          lesson_enrollments: 4,
          course_enrollments: 6,
          payouts_enabled: true,
        },
      },
      isLoading: false,
      isError: false,
    });
    mocks.getPayouts.mockReturnValue({
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 25,
          total: 0,
          from: null,
          to: null,
          has_more_pages: false,
        },
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    });
  });

  it("opens the payout form inside the teacher wallet and displays available balance", () => {
    render(<TeacherWallet />);

    expect(screen.getByText("الرصيد المتاح للسحب")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "طلب سحب" }));

    expect(screen.getByRole("heading", { name: "طلب سحب الأرباح" })).toBeInTheDocument();
    expect(screen.getByLabelText("رقم المحفظة المستلمة")).toBeInTheDocument();
    expect(screen.getByLabelText("مبلغ السحب (جنيه)")).toBeInTheDocument();
  });

  it("submits a wallet payout request to the existing API contract", async () => {
    render(<TeacherWallet />);
    fireEvent.click(screen.getByRole("button", { name: "طلب سحب" }));
    fireEvent.change(screen.getByLabelText("رقم المحفظة المستلمة"), {
      target: { value: "01000000099" },
    });
    fireEvent.change(screen.getByLabelText("مبلغ السحب (جنيه)"), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "إرسال طلب السحب" }));

    await waitFor(() => expect(mocks.createPayout).toHaveBeenCalledWith({
      token: "teacher-token",
      payload: {
        amount: 25,
        payout_method: "wallet",
        wallet_issuer: "vodafone",
        wallet_number: "01000000099",
      },
    }));
    expect(await screen.findByRole("status")).toHaveTextContent("تم إرسال طلب السحب");
  });

  it("shows bank recipient fields and sends a bank payout using the backend field names", async () => {
    render(<TeacherWallet />);
    fireEvent.click(screen.getByRole("button", { name: "طلب سحب" }));
    fireEvent.change(screen.getByLabelText("طريقة استلام الأرباح"), {
      target: { value: "bank_card" },
    });
    fireEvent.change(screen.getByLabelText("الاسم الكامل للمستلم"), {
      target: { value: "Mazen Sabry" },
    });
    fireEvent.change(screen.getByLabelText("كود البنك"), {
      target: { value: "cib" },
    });
    fireEvent.change(screen.getByLabelText("رقم الحساب أو البطاقة حسب وسيلة التحويل"), {
      target: { value: "1234567890123456" },
    });
    fireEvent.change(screen.getByLabelText("مبلغ السحب (جنيه)"), {
      target: { value: "125" },
    });
    fireEvent.click(screen.getByRole("button", { name: "إرسال طلب السحب" }));

    await waitFor(() => expect(mocks.createPayout).toHaveBeenCalledWith({
      token: "teacher-token",
      payload: {
        amount: 125,
        payout_method: "bank_card",
        full_name: "Mazen Sabry",
        bank_code: "CIB",
        bank_card_number: "1234567890123456",
      },
    }));
  });

  it("rejects amounts above the available balance without calling the API", async () => {
    render(<TeacherWallet />);
    fireEvent.click(screen.getByRole("button", { name: "طلب سحب" }));
    fireEvent.change(screen.getByLabelText("رقم المحفظة المستلمة"), {
      target: { value: "01000000099" },
    });
    fireEvent.change(screen.getByLabelText("مبلغ السحب (جنيه)"), {
      target: { value: "1600" },
    });
    fireEvent.click(screen.getByRole("button", { name: "إرسال طلب السحب" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("المبلغ أكبر من رصيدك المتاح");
    expect(mocks.createPayout).not.toHaveBeenCalled();
  });

  it("disables payout requests when the backend reports that payout setup is unavailable", () => {
    mocks.getWallet.mockReturnValue({
      data: { data: { total: 100, withdrawn: 0, reserved: 0, available_balance: 100, payouts_enabled: false } },
      isLoading: false,
      isError: false,
    });
    render(<TeacherWallet />);

    expect(screen.getByRole("button", { name: "طلب سحب" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("إعدادات التحويلات لدى المنصة لم تكتمل");
  });
});
