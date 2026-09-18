import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import { ICreateLesson, IUpdateLesson } from "@/interfaces/teachers/teacherLessons";
import { ILessonsRes, ILessonRes } from "@/interfaces/lessons/lesson";
import { ICreateLessonAvailabilitySlot } from "@/interfaces/lessons/availability";

const appendAvailability = (
  formData: FormData,
  availability: ICreateLessonAvailabilitySlot[]
) => {
  availability.forEach((slot, index) => {
    formData.append(
      "availability[" + index + "][day_of_week]",
      slot.day_of_week.toString()
    );
    formData.append(
      "availability[" + index + "][start_time]",
      slot.start_time.length === 5 ? slot.start_time + ":00" : slot.start_time
    );
    formData.append(
      "availability[" + index + "][end_time]",
      slot.end_time.length === 5 ? slot.end_time + ":00" : slot.end_time
    );
    formData.append("availability[" + index + "][timezone]", slot.timezone);
  });
};

export const getTeacherLessons = async (token: string): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get("/teacher/lessons", {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};

export const getTeacherLessonById = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<ILessonRes> => {
  const { data } = await axiosAPI.get("/teacher/lessons/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};

export const createTeacherLesson = async ({
  token,
  lesson,
}: {
  token: string;
  lesson: ICreateLesson;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("education_level_id", lesson.education_level_id.toString());
  formData.append("subject_id", lesson.subject_id.toString());
  formData.append("grade", lesson.grade);
  formData.append("delivery_mode", lesson.delivery_mode);
  formData.append("booking_type", lesson.booking_type);
  formData.append("title", lesson.title);
  formData.append("description", lesson.description);
  formData.append("duration_minutes", lesson.duration_minutes.toString());
  formData.append("price", lesson.price.toString());
  formData.append("sessions_count", lesson.sessions_count.toString());
  formData.append("logo", lesson.logo);

  appendAvailability(formData, lesson.availability);

  if (lesson.meeting_url?.trim()) formData.append("meeting_url", lesson.meeting_url.trim());
  if (lesson.location?.trim()) formData.append("location", lesson.location.trim());
  if (lesson.offline_visit_type?.trim()) formData.append("offline_visit_type", lesson.offline_visit_type.trim());
  if (lesson.max_students !== undefined) formData.append("max_students", lesson.max_students.toString());

  const { data } = await axiosAPI.post("/teacher/lessons", formData, {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};

export const updateTeacherLesson = async ({
  token,
  lesson,
}: {
  token: string;
  lesson: IUpdateLesson;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("education_level_id", lesson.education_level_id.toString());
  formData.append("subject_id", lesson.subject_id.toString());
  formData.append("grade", lesson.grade);
  formData.append("delivery_mode", lesson.delivery_mode);
  formData.append("booking_type", lesson.booking_type);
  formData.append("title", lesson.title);
  formData.append("description", lesson.description);
  formData.append("duration_minutes", lesson.duration_minutes.toString());
  formData.append("price", lesson.price.toString());
  formData.append("sessions_count", lesson.sessions_count.toString());

  appendAvailability(formData, lesson.availability);

  if (lesson.logo) formData.append("logo", lesson.logo);
  if (lesson.meeting_url?.trim()) formData.append("meeting_url", lesson.meeting_url.trim());
  if (lesson.location?.trim()) formData.append("location", lesson.location.trim());
  if (lesson.offline_visit_type?.trim()) formData.append("offline_visit_type", lesson.offline_visit_type.trim());
  if (lesson.max_students !== undefined) formData.append("max_students", lesson.max_students.toString());

  formData.append("_method", "put");

  const { data } = await axiosAPI.post(
    "/teacher/lessons/" + lesson.id,
    formData,
    { headers: { Authorization: "Bearer " + token } }
  );
  return data;
};

export const deleteTeacherLesson = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete("/teacher/lessons/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};
