import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import {
  createTeacherServiceArea,
  deleteTeacherServiceArea,
  getTeacherLessonServiceAreas,
  getTeacherServiceAreas,
  replaceTeacherLessonServiceAreas,
  updateTeacherServiceArea,
} from "@/services/teacher/serviceAreas";
import { updateStudentLocation } from "@/services/student/location";
import { updateParentStudentLocation } from "@/services/parent/studentLocation";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("offline service area API clients", () => {
  const getMock = vi.mocked(axiosAPI.get);
  const postMock = vi.mocked(axiosAPI.post);
  const putMock = vi.mocked(axiosAPI.put);
  const deleteMock = vi.mocked(axiosAPI.delete);
  const token = "teacher-test-token";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads and manages teacher service areas", async () => {
    getMock.mockResolvedValueOnce({ data: { status: true, message: null, data: [] } });
    await getTeacherServiceAreas(token);
    expect(getMock).toHaveBeenCalledWith("/teacher/service-areas", { headers: { Authorization: `Bearer ${token}` } });

    postMock.mockResolvedValueOnce({ data: { status: true, message: null, data: { id: 10 } } });
    await createTeacherServiceArea({ token, payload: { name: "Damanhur", latitude: 31.0341, longitude: 30.4682, radius_km: 10, is_active: true } });
    expect(postMock).toHaveBeenCalledWith("/teacher/service-areas", { name: "Damanhur", latitude: 31.0341, longitude: 30.4682, radius_km: 10, is_active: true }, { headers: { Authorization: `Bearer ${token}` } });

    putMock.mockResolvedValueOnce({ data: { status: true, message: null, data: { id: 10 } } });
    await updateTeacherServiceArea({ token, id: 10, payload: { name: "Damanhur Center", radius_km: 12 } });
    expect(putMock).toHaveBeenCalledWith("/teacher/service-areas/10", { name: "Damanhur Center", radius_km: 12 }, { headers: { Authorization: `Bearer ${token}` } });

    deleteMock.mockResolvedValueOnce({ data: { status: true, message: null } });
    await deleteTeacherServiceArea({ token, id: 10 });
    expect(deleteMock).toHaveBeenCalledWith("/teacher/service-areas/10", { headers: { Authorization: `Bearer ${token}` } });
  });

  it("reads and replaces lesson service areas", async () => {
    getMock.mockResolvedValueOnce({ data: { status: true, message: null, data: [] } });
    await getTeacherLessonServiceAreas({ token, lessonId: 4 });
    expect(getMock).toHaveBeenCalledWith("/teacher/lessons/4/service-areas", { headers: { Authorization: `Bearer ${token}` } });

    putMock.mockResolvedValueOnce({ data: { status: true, message: null, data: [] } });
    await replaceTeacherLessonServiceAreas({ token, lessonId: 4, serviceAreaIds: [10, 11] });
    expect(putMock).toHaveBeenCalledWith("/teacher/lessons/4/service-areas", { service_area_ids: [10, 11] }, { headers: { Authorization: `Bearer ${token}` } });
  });

  it("updates student location as self and as linked parent", async () => {
    putMock.mockResolvedValueOnce({ data: { status: true, message: null, data: { id: 5 } } });
    await updateStudentLocation({ token, payload: { address: "Damanhur", latitude: 31.0341, longitude: 30.4682 } });
    expect(putMock).toHaveBeenCalledWith("/student/location", { address: "Damanhur", latitude: 31.0341, longitude: 30.4682 }, { headers: { Authorization: `Bearer ${token}` } });

    putMock.mockResolvedValueOnce({ data: { status: true, message: null, data: { id: 5 } } });
    await updateParentStudentLocation({ token, studentId: 5, payload: { address: "Damanhur", latitude: 31.0341, longitude: 30.4682 } });
    expect(putMock).toHaveBeenCalledWith("/parent/students/5/location", { address: "Damanhur", latitude: 31.0341, longitude: 30.4682 }, { headers: { Authorization: `Bearer ${token}` } });
  });
});
