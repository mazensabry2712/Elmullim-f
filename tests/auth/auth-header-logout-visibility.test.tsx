import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthHeader from "@/components/auth/AuthHeader";
import { I18nProvider } from "@/i18n";

const { useSelectorMock } = vi.hoisted(() => ({
  useSelectorMock: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: unknown) => useSelectorMock(selector),
}));

vi.mock("@/components/auth/LogoutAuthButton", () => ({
  default: () => <button type="button">Logout</button>,
}));

describe("AuthHeader logout visibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectorMock.mockReturnValue({ isAuthenticated: true });
    localStorage.setItem("elmullim-language", "en");
  });

  const renderHeader = (showLogoutButton?: boolean) =>
    render(
      <MemoryRouter>
        <I18nProvider>
          <AuthHeader
            title="verification"
            description="Verification code"
            discover={false}
            {...(showLogoutButton === undefined ? {} : { showLogoutButton })}
          />
        </I18nProvider>
      </MemoryRouter>
    );

  it("hides logout on the verification screen for any authenticated role", () => {
    renderHeader(false);

    expect(screen.getByRole("heading", { name: "verification" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });

  it("keeps logout available on other authenticated auth screens by default", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });
});
