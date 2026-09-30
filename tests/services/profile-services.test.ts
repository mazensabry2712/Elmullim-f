import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getStudentProfile } from "@/services/student/studentProfile";
import { getTeacherProfile, getTeacherRatings } from "@/services/teacher/teacherProfile";
import { getParentProfile } from "@/services/parent/parentProfile";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("profile service requests", () => {
  const getMock = vi.mocked(axiosAPI.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the student profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Student",
          email: "student@elmullim.test",
        },
      },
    });

    await expect(getStudentProfile("student-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Student",
        email: "student@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/student/me", {
      headers: { Authorization: "Bearer student-token" },
    });
  });



  it("submits every editable student profile field to the update endpoint", async () => {
    const postMock = vi.mocked(axiosAPI.post);
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {},
      },
    });

    const profileImage = new File(["image"], "profile.webp", {
      type: "image/webp",
    });

    await updateStudentProfile({
      token: "student-token",
      dataForm: {
        email: "student@example.com",
        name: "Demo Student",
        phone: "201001234567",
        address: "Cairo, Egypt",
        education_level_id: "12",
        gender: "male",
        description: "Profile description",
        profile_image: profileImage,
        favourite_subjects: ["3", "8"],
      },
    });

    expect(postMock).toHaveBeenCalledTimes(1);

    const [url, body, config] = postMock.mock.calls[0];
    expect(url).toBe("/student/me");
    expect(config).toEqual({
      headers: { Authorization: "Bearer student-token" },
    });

    expect(body).toBeInstanceOf(FormData);
    expect(body.get("email")).toBe("student@example.com");
    expect(body.get("name")).toBe("Demo Student");
    expect(body.get("phone")).toBe("201001234567");
    expect(body.get("address")).toBe("Cairo, Egypt");
    expect(body.get("education_level_id")).toBe("12");
    expect(body.get("gender")).toBe("male");
    expect(body.get("description")).toBe("Profile description");
    expect(body.get("profile_image")).toEqual(profileImage);
    expect(body.get("favourite_subjects[0]")).toBe("3");
    expect(body.get("favourite_subjects[1]")).toBe("8");
  });

  it("requests the teacher profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Teacher",
          email: "teacher@elmullim.test",
        },
      },
    });

    await expect(getTeacherProfile("teacher-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Teacher",
        email: "teacher@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/teacher/me", {
      headers: { Authorization: "Bearer teacher-token" },
    });
  });

  it("requests teacher ratings using the backend singular rating route", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: null,
        data: [],
      },
    });

    await getTeacherRatings("teacher-token");

    expect(getMock).toHaveBeenCalledWith("/teacher/rating/received-all", {
      headers: { Authorization: "Bearer teacher-token" },
    });
  });

  it("requests the parent profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Parent",
          email: "parent@elmullim.test",
        },
      },
    });

    await expect(getParentProfile("parent-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Parent",
        email: "parent@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/parent/me", {
      headers: { Authorization: "Bearer parent-token" },
    });
  });
});
