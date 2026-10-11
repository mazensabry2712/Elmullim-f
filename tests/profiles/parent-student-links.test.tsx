import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import ParentStudentLinks from "@/components/profiles/parent/ParentStudentLinks";
import StudentParentLinks from "@/components/profiles/student/StudentParentLinks";

const mocks = vi.hoisted(() => ({
  getParentRequests: vi.fn(),
  requestParentLink: vi.fn(),
  unlinkParentStudent: vi.fn(),
  getStudentLinks: vi.fn(),
  respondToParentLink: vi.fn(),
  unlinkStudentParent: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "test-token" },
}));

vi.mock("@/lib/react-query/parent/studentLinks", () => ({
  useGetParentStudentLinkRequests: (...args: unknown[]) => mocks.getParentRequests(...args),
  useRequestParentStudentLink: () => ({ mutateAsync: mocks.requestParentLink, isPending: false }),
  useUnlinkParentStudent: () => ({ mutateAsync: mocks.unlinkParentStudent, isPending: false }),
}));

vi.mock("@/lib/react-query/student/parentLinks", () => ({
  useGetStudentParentLinks: (...args: unknown[]) => mocks.getStudentLinks(...args),
  useRespondToStudentParentLink: () => ({ mutateAsync: mocks.respondToParentLink, isPending: false }),
  useUnlinkStudentParent: () => ({ mutateAsync: mocks.unlinkStudentParent, isPending: false }),
}));

describe("parent/student link consent flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mocks.getParentRequests.mockReturnValue({
      data: { status: true, data: { pending_count: 0, requests: [] } },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    mocks.getStudentLinks.mockReturnValue({
      data: { status: true, data: { links: [] } },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it("sends a parent link request without granting child access in the UI", async () => {
    mocks.requestParentLink.mockResolvedValue({
      status: true,
      message: "The student must approve.",
      data: { request_received: true },
    });

    render(
      <I18nProvider>
        <ParentStudentLinks students={[]} />
      </I18nProvider>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Student phone number" }), {
      target: { value: "01012345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send link request" }));

    await waitFor(() => {
      expect(mocks.requestParentLink).toHaveBeenCalledWith({
        token: "test-token",
        studentPhone: "01012345678",
      });
    });
  });

  it("lets the student decide on a pending parent request", async () => {
    mocks.getStudentLinks.mockReturnValue({
      data: {
        status: true,
        data: {
          links: [{
            id: 41,
            name: "Parent Requester",
            profile_image: "",
            status: "pending",
            requested_at: "2026-10-11T10:00:00Z",
          }],
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    mocks.respondToParentLink.mockResolvedValue({
      status: true,
      message: "Parent link accepted.",
      data: { status: "active" },
    });

    render(
      <I18nProvider>
        <StudentParentLinks />
      </I18nProvider>,
    );

    expect(screen.getByText("Parent Requester")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(mocks.respondToParentLink).toHaveBeenCalledWith({
        token: "test-token",
        familyId: 41,
        decision: "accept",
      });
    });
  });
});
