import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import TeacherSocial from "@/components/home/our teachers/TeacherSocial";
import { I18nProvider } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ul: ({ children, ...props }: { children?: React.ReactNode }) => <ul {...props}>{children}</ul>,
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe("Home teacher social links", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
  });

  it("does not render a social control when all links are unavailable", () => {
    render(
      <I18nProvider>
        <TeacherSocial
          teacher={{
            id: 1,
            img: "/images/teacher-img1.png",
            links: { facebook: "", linkedin: "", x: "" },
          }}
        />
      </I18nProvider>
    );

    expect(screen.queryByRole("button", { name: /toggle teacher social links/i })).not.toBeInTheDocument();
  });

  it("renders only configured external links with accessible labels", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <TeacherSocial
          teacher={{
            id: 1,
            img: "/images/teacher-img1.png",
            links: {
              facebook: "https://facebook.com/teacher",
              linkedin: "",
              x: "https://x.com/teacher",
            },
          }}
        />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: /toggle teacher social links/i }));

    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      "https://facebook.com/teacher"
    );
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /x profile/i })).toHaveAttribute(
      "href",
      "https://x.com/teacher"
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });
});
