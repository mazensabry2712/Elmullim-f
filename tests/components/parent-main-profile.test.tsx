import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ParentMainProfile from "@/components/profiles/parent/ParentMainProfile";

const mocks = vi.hoisted(() => ({ navigate: vi.fn(), refetch: vi.fn() }));
let language = "en";

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "parent-token" },
}));

vi.mock("@/lib/react-query/parent/parentProfile", () => ({
  useGetParentProfile: () => ({
    isLoading: false,
    isError: false,
    refetch: mocks.refetch,
    data: {
      status: true,
      message: null,
      data: {
        id: 51,
        name: "Parent Example",
        email: "parent@example.test",
        phone: "201001234567",
        gender: "female",
        description: "Parent profile summary",
        profile_image: "",
        education_level: {
          id: 3,
          name: "Secondary",
          education_system: {
            id: 2,
            name: "Egyptian system",
            country: { id: 1, name: "Egypt", code: "+20" },
          },
        },
        students: [{
          id: 7,
          name: "Linked Student",
          profile_image: "",
          phone: "201009876543",
          address: "Cairo",
          latitude: 30.0444,
          longitude: 31.2357,
        }],
      },
    },
  }),
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/components/profiles/ProfileHeader", () => ({
  default: ({ profileImage }: { profileImage: string }) => (
    <div data-testid="profile-header" data-profile-image={profileImage} />
  ),
}));

vi.mock("@/components/profiles/parent/ParentStudentLinks", () => ({
  default: () => <div data-testid="parent-student-links" />,
}));

vi.mock("@/components/profiles/parent/ParentStudentLocation", () => ({
  default: ({ student }: { student: { name: string } }) => (
    <div data-testid="parent-student-location">{student.name} location controls</div>
  ),
}));

vi.mock("@/components/Loader", () => ({ default: () => <div data-testid="loader" /> }));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <button {...props}>{children}</button>
  ),
}));

describe("ParentMainProfile", () => {
  beforeEach(() => {
    language = "en";
    vi.clearAllMocks();
  });

  it("renders parent details and only the currently linked students", () => {
    render(<ParentMainProfile />);

    expect(screen.getByText("Parent Example")).toBeInTheDocument();
    expect(screen.getByText("parent@example.test")).toBeInTheDocument();
    expect(screen.getByText("201001234567")).toBeInTheDocument();
    expect(screen.getByText("Female")).toBeInTheDocument();
    expect(screen.getByText("Egypt")).toBeInTheDocument();
    expect(screen.getByText("Egyptian system")).toBeInTheDocument();
    expect(screen.getByText("Parent profile summary")).toBeInTheDocument();
    expect(screen.getByText("Linked Student")).toBeInTheDocument();
    expect(screen.getByTestId("parent-student-location")).toBeInTheDocument();
    expect(screen.getByTestId("parent-student-links")).toBeInTheDocument();
  });

  it("opens the existing profile edit route", () => {
    render(<ParentMainProfile />);
    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(mocks.navigate).toHaveBeenCalledWith("/profile/update");
  });

  it("localizes labels into Arabic", () => {
    language = "ar";
    render(<ParentMainProfile />);
    expect(screen.getByText("البيانات الشخصية")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تعديل الملف الشخصي" })).toBeInTheDocument();
  });
});
