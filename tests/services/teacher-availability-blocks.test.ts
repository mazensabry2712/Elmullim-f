import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import {
  createTeacherAvailabilityBlock,
  deleteTeacherAvailabilityBlock,
  getTeacherAvailabilityBlocks,
} from "@/services/teacher/availabilityBlocks";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("teacher availability block API clients", () => {
  const getMock = vi.mocked(axiosAPI.get);
  const postMock = vi.mocked(axiosAPI.post);
  const deleteMock = vi.mocked(axiosAPI.delete);
  const token = "teacher-test-token";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads availability blocks", async () => {
    getMock.mockResolvedValueOnce({
      data: { status: true, message: null, data: [] },
    });

    await getTeacherAvailabilityBlocks(token);

    expect(getMock).toHaveBeenCalledWith(
      "/teacher/availability-blocks",
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it("creates an availability block and trims the optional reason", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: null,
        data: {
          id: 3,
          teacher_id: 8,
          starts_at: "2099-01-10T16:00:00.000Z",
          ends_at: "2099-01-10T17:00:00.000Z",
          reason: "Vacation",
        },
      },
    });

    await createTeacherAvailabilityBlock({
      token,
      startsAt: "2099-01-10T16:00:00.000Z",
      endsAt: "2099-01-10T17:00:00.000Z",
      reason: " Vacation ",
    });

    expect(postMock).toHaveBeenCalledWith(
      "/teacher/availability-blocks",
      {
        starts_at: "2099-01-10T16:00:00.000Z",
        ends_at: "2099-01-10T17:00:00.000Z",
        reason: "Vacation",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it("deletes an availability block", async () => {
    deleteMock.mockResolvedValueOnce({
      data: { status: true, message: null },
    });

    await deleteTeacherAvailabilityBlock({ token, id: 3 });

    expect(deleteMock).toHaveBeenCalledWith(
      "/teacher/availability-blocks/3",
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });
});
