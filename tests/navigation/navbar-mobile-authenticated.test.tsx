import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";

const useSelectorMock = vi.fn();

vi.mock("react-redux", () => ({
  useSelector: (selector: unknown) => useSelectorMock(selector),
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    language: "en",
    t: (key: string) =>
      ({
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.courses": "Courses",
        "nav.lessons": "Lessons",
        "nav.contactUs": "Contact Us",
        "nav.faqs": "FAQs",
        "nav.login": "Login",
        "nav.studentLogin": "Student Login",
        "nav.parentLogin": "Parent Login",
        "nav.teacherLogin": "Teacher Login",
        "nav.signInAs": "Sign in as",
        "nav.toggleMenu": "Toggle Menu",
        "language.arabic": "العربية",
        "language.english": "English",
      }[key] ?? key),
    toggleLanguage: vi.fn(),
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "token",
    getRole: () => "student",
  },
}));

vi.mock("@/lib/react-query/notifications", () => ({
  useGetNotifications: () => ({
    data: { data: { unread_count: 2 } },
  }),
}));

vi.mock("@/components/profiles/ProfileMenu", () => ({
  default: () => <button type="button">Profile</button>,
}));

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, property) =>
        ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
          const Tag = typeof property === "string" ? property : "div";
          const safeProps = Object.fromEntries(
            Object.entries(props).filter(([key]) =>
              ["className", "id", "role", "aria-label", "aria-expanded", "aria-controls", "onClick", "to"].includes(key)
            )
          );
          return <Tag {...safeProps}>{children}</Tag>;
        },
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

describe("Navbar mobile authenticated actions", () => {
  beforeEach(() => {
    useSelectorMock.mockReturnValue({ isAuthenticated: true });
  });

  it("exposes notifications and profile actions from the mobile menu", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole("button", { name: "Toggle Menu" });
    expect(screen.queryByRole("link", { name: "Notifications" })).not.toBeInTheDocument();

    menuButton.click();

    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute("href", "/notifications");
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });
});
