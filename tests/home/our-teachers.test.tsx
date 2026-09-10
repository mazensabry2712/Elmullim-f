import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import OurTeachers from "@/components/home/our teachers/OurTeachers";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/home/our teachers/TeacherCard", () => ({
  default: ({ teacher }: { teacher: { id: number; img: string } }) => (
    <article data-testid="teacher-card">
      <img src={teacher.img} alt={"teacher"} />
    </article>
  ),
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

describe("Home Our Teachers", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the teachers section in English", () => {
    render(
      <I18nProvider>
        <OurTeachers />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { name: "Our Teachers" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Our Teachers" })).toHaveAttribute(
      "id",
      "our-teachers"
    );
    expect(screen.getAllByTestId("teacher-card")).toHaveLength(4);
  });

  it("switches the section to Arabic and RTL", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <OurTeachers />
        <LanguageToggle />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: "معلمونا" })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
