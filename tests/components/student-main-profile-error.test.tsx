import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentMainProfile from "@/components/profiles/student/StudentMainProfile";

const mocks = vi.hoisted(() => ({
  refetch: vi.fn(),
}));

vi.mock("@/lib/react-query/student/studentProfile", () => ({
  useGetStudentProfile: () => ({
    data: undefined,
    isLoading: false,
    isError: true,
    refetch: mocks.refetch,
  }),
  useGetStudentRatings: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "student-token" },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language: "ar" }),
}));

vi.mock("@/components/profiles/ProfileHeader", () => ({
  default: () => <div data-testid="profile-header" />,
}));

vi.mock("@/components/profiles/student/StudentLocation", () => ({
  default: () => <div data-testid="student-location" />,
}));

vi.mock("@/components/profiles/student/StudentParentLinks", () => ({
  default: () => <div data-testid="student-parent-links" />,
}));

vi.mock("@/components/profiles/student/StudentRating", () => ({
  default: () => <div data-testid="student-rating" />,
}));

vi.mock("@/components/Loader", () => ({
  default: () => <div data-testid="loader" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("StudentMainProfile load failure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a visible retry action instead of an empty profile when the API fails", () => {
    render(<StudentMainProfile />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "تعذر الاتصال بالخادم لتحميل بيانات الملف الشخصي.",
    );

    fireEvent.click(screen.getByRole("button", { name: "حاول مرة أخرى" }));
    expect(mocks.refetch).toHaveBeenCalledTimes(1);
  });
});
