import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import {
  updateTeacherCourseContent,
  updateTeacherCourseLecture,
} from "@/services/teacher/courses";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("teacher course content and lecture update API clients", () => {
  const postMock = vi.mocked(axiosAPI.post);
  const token = "teacher-test-token";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates course content using the supported POST route without method spoofing", async () => {
    postMock.mockResolvedValueOnce({
      data: { status: true, message: "updated" },
    });

    await updateTeacherCourseContent({
      token,
      content: {
        id: "26",
        courseId: "10",
        title: "Updated content title",
        description: "Updated content description with enough meaningful words.",
      },
    });

    expect(postMock).toHaveBeenCalledWith(
      "/teacher/courses/10/contents/26",
      {
        title: "Updated content title",
        description: "Updated content description with enough meaningful words.",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it("updates a lecture using the supported POST route without method spoofing", async () => {
    postMock.mockResolvedValueOnce({
      data: { status: true, message: "updated" },
    });

    await updateTeacherCourseLecture({
      token,
      lecture: {
        id: "94",
        courseId: "10",
        contentId: "26",
        title: "Updated lecture title",
        description: "Updated lecture description with enough meaningful words.",
      },
    });

    expect(postMock).toHaveBeenCalledWith(
      "/teacher/courses/10/contents/26/lectures/94",
      {
        title: "Updated lecture title",
        description: "Updated lecture description with enough meaningful words.",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });
});
