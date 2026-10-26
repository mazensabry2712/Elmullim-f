import axiosAPI from "@/config/axios.config";
import { getPublicSubjects, getPublicSubjectsForEducationLevel, getTeacherSubjects } from "@/services/main";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/axios.config", () => ({ default: { get: vi.fn() } }));

describe("getPublicSubjects", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests the default public catalog page", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: { status: true, message: null, data: { subjects: [], pagination: { current_page: 1, last_page: 1, per_page: 24, total: 0 } } },
    } as never);
    const result = await getPublicSubjects();
    expect(axiosAPI.get).toHaveBeenCalledWith("/main/subjects", { params: { page: 1, per_page: 24 } });
    expect(result.data.pagination.total).toBe(0);
  });

  it("passes trimmed search and pagination to the API", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: { status: true, message: null, data: { subjects: [], pagination: { current_page: 2, last_page: 2, per_page: 8, total: 9 } } },
    } as never);
    await getPublicSubjects(2, 8, "  physics  ");
    expect(axiosAPI.get).toHaveBeenCalledWith("/main/subjects", { params: { page: 2, per_page: 8, q: "physics" } });
  });
  it("requests student-visible subjects for an education level", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: { status: true, message: null, data: [] },
    } as never);

    await getPublicSubjectsForEducationLevel("3");

    expect(axiosAPI.get).toHaveBeenCalledWith("/main/3/subjects");
  });

  it("requests all configured subjects for teacher selection", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: { status: true, message: null, data: [] },
    } as never);

    await getTeacherSubjects("3");

    expect(axiosAPI.get).toHaveBeenCalledWith("/main/3/teacher-subjects");
  });
});
