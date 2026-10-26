import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentProfile from "@/components/profiles/student/StudentProfile";

let language = "en";

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language }),
}));

vi.mock("@/components/profiles/student/StudentMainProfile", () => ({
  default: () => <div>Student overview content</div>,
}));

vi.mock("@/components/profiles/student/StudentCourses", () => ({
  default: () => <div>Student courses content</div>,
}));

vi.mock("@/components/chat/Chat", () => ({
  default: () => <div>Student chat content</div>,
}));

vi.mock("@/components/profiles/student/quizes/QuizSchedules", () => ({
  default: () => <div>Student quizzes content</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    section: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <section {...props}>{children}</section>
    ),
  },
}));

describe("StudentProfile tabs", () => {
  beforeEach(() => {
    language = "en";
  });

  const renderProfile = (state: Record<string, boolean> | null = null) =>
    render(
      <MemoryRouter initialEntries={[{ pathname: "/profile", state }]}>
        <StudentProfile />
      </MemoryRouter>,
    );

  it("renders profile content by default and keeps all student tabs usable", async () => {
    const user = userEvent.setup();
    renderProfile();

    expect(screen.getByRole("tab", { name: "Main" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Student overview content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "My Courses" }));
    expect(screen.getByRole("tab", { name: "My Courses" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Student courses content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Chat" }));
    expect(screen.getByRole("tab", { name: "Chat" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Student chat content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Quizzes" }));
    expect(screen.getByRole("tab", { name: "Quizzes" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Student quizzes content")).toBeInTheDocument();
  });

  it("opens the correct tab when navigation requests a student section", async () => {
    renderProfile({ myCourses: true });

    expect(screen.getByRole("tab", { name: "My Courses" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Student courses content")).toBeInTheDocument();
  });

  it("localizes the student tabs in Arabic", () => {
    language = "ar";
    renderProfile();

    expect(screen.getByRole("tab", { name: "الرئيسية" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "كورساتي" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "الدردشة" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "الاختبارات" })).toBeInTheDocument();
  });
});
