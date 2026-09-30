import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentMainProfile from "@/components/profiles/student/StudentMainProfile";

let language = "en";

vi.mock("@/lib/react-query/student/studentProfile", () => ({
  useGetStudentProfile: () => ({
    isLoading: false,
    data: {
      status: true,
      message: null,
      data: {
        id: 7,
        name: "Ahmed Student",
        phone: "201001234567",
        address: "Cairo, Egypt",
        email: "ahmed@example.com",
        gender: "male",
        profile_image: "",
        description: "Student profile description",
        education_level: {
          id: 3,
          name: "Secondary",
          description: "Secondary level",
          education_system: {
            id: 2,
            name: "Egyptian Education",
            country: {
              id: 1,
              name: "Egypt",
              code: "+20",
            },
          },
        },
        favourite_subjects: [
          {
            id: 10,
            name: "Mathematics",
            education_level: {
              id: 3,
              name: "Secondary",
              description: "Secondary level",
              education_system: {
                id: 2,
                name: "Egyptian Education",
                country: {
                  id: 1,
                  name: "Egypt",
                  code: "+20",
                },
              },
            },
          },
        ],
      },
    },
  }),
  useGetStudentRatings: () => ({
    data: {
      data: [],
    },
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "student-token",
  },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    language,
  }),
}));

vi.mock("@/components/profiles/ProfileHeader", () => ({
  default: ({ profileImage }: { profileImage: string }) => (
    <div data-testid="profile-header" data-profile-image={profileImage} />
  ),
}));

vi.mock("@/components/profiles/student/StudentLocation", () => ({
  default: () => <div data-testid="student-location" />,
}));

vi.mock("@/components/profiles/student/StudentRating", () => ({
  default: () => <div data-testid="student-rating" />,
}));

vi.mock("@/components/Loader", () => ({
  default: () => <div data-testid="loader" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("StudentMainProfile", () => {
  beforeEach(() => {
    language = "en";
  });

  it("renders every meaningful student profile field", () => {
    render(<StudentMainProfile />);

    expect(screen.getByText("Ahmed Student")).toBeInTheDocument();
    expect(screen.getByText("ahmed@example.com")).toBeInTheDocument();
    expect(screen.getByText("201001234567")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Cairo, Egypt")).toBeInTheDocument();
    expect(screen.getByText("Egypt")).toBeInTheDocument();
    expect(screen.getByText("Egyptian Education")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
    expect(screen.getByText("Student profile description")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByTestId("profile-header")).toHaveAttribute(
      "data-profile-image",
      ""
    );
    expect(screen.getByTestId("student-location")).toBeInTheDocument();
  });

  it("localizes the gender value in Arabic", () => {
    language = "ar";

    render(<StudentMainProfile />);

    expect(screen.getByText("ذكر")).toBeInTheDocument();
    expect(screen.getByText("البيانات الشخصية")).toBeInTheDocument();
    expect(screen.getByText("تعديل الملف الشخصي")).toBeInTheDocument();
  });
});
