import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import {
  getStudentProfile,
  updateStudentProfile,
} from "@/services/student/studentProfile";
import {
  getTeacherProfile,
  getTeacherRatings,
  getTeacherCv,
  updateTeacherProfile,
} from "@/services/teacher/teacherProfile";
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
        country_id: "1",
        education_system_id: "2",
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
    expect(body.get("address")).toBeNull();
    expect(body.get("country_id")).toBe("1");
    expect(body.get("education_system_id")).toBe("2");
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

  it("submits every editable teacher profile field to the update endpoint", async () => {
    const postMock = vi.mocked(axiosAPI.post);
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {},
      },
    });

    const profileImage = new File(["image"], "teacher.webp", {
      type: "image/webp",
    });
    const cv = new File(["%PDF-1.7"], "teacher-cv.pdf", {
      type: "application/pdf",
    });

    await updateTeacherProfile({
      token: "teacher-token",
      dataForm: {
        email: "teacher@example.com",
        name: "Demo Teacher",
        phone: "201001234567",
        address: "Cairo, Egypt",
        country_id: "1",
        education_system_id: "2",
        education_level_id: "12",
        gender: "male",
        description: "Experienced mathematics teacher",
        experince: 7,
        qualification: "Bachelor of Education",
        course_type: ["private", "online", "group"],
        subjects: ["3", "8"],
        profile_image: profileImage,
        cv,
      },
    });

    expect(postMock).toHaveBeenCalledTimes(1);

    const [url, body, config] = postMock.mock.calls[0];
    expect(url).toBe("/teacher/me");
    expect(config).toEqual({
      headers: { Authorization: "Bearer teacher-token" },
    });

    expect(body).toBeInstanceOf(FormData);
    expect(body.get("email")).toBe("teacher@example.com");
    expect(body.get("name")).toBe("Demo Teacher");
    expect(body.get("phone")).toBe("201001234567");
    expect(body.get("address")).toBe("Cairo, Egypt");
    expect(body.get("country_id")).toBe("1");
    expect(body.get("education_system_id")).toBe("2");
    expect(body.get("education_level_id")).toBe("12");
    expect(body.get("gender")).toBe("male");
    expect(body.get("description")).toBe("Experienced mathematics teacher");
    expect(body.get("experince")).toBe("7");
    expect(body.get("qualification")).toBe("Bachelor of Education");
    expect(body.get("profile_image")).toEqual(profileImage);
    expect(body.get("cv")).toEqual(cv);
    expect(body.get("subjects[0]")).toBe("3");
    expect(body.get("subjects[1]")).toBe("8");
    expect(body.get("course_type[0]")).toBe("private");
    expect(body.get("course_type[1]")).toBe("online");
    expect(body.get("course_type[2]")).toBe("group");
  });

  it("requests the protected teacher CV endpoint as a PDF blob", async () => {
    const cvBlob = new Blob(["%PDF-1.7"], { type: "application/pdf" });
    getMock.mockResolvedValueOnce({
      data: cvBlob,
    });

    await expect(getTeacherCv("teacher-token")).resolves.toBe(cvBlob);

    expect(getMock).toHaveBeenCalledWith("/teacher/me/cv", {
      responseType: "blob",
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
