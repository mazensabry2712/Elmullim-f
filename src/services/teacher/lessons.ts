import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  ICreateLessonContent,
  ILessonContentRes,
  ILessonContentsRes,
  IUpdateLessonContent,
} from "@/interfaces/lessons/content";
import {
  IGetLessonLecture,
  ILessonLectureRes,
  ILessonLecturesRes,
} from "@/interfaces/lessons/lecture";
import { ILessonRes, ILessonsRes } from "@/interfaces/lessons/lesson";
import {
  ICreateLesson,
  IDeleteLessonLecture,
  IUpdateLesson,
  IUploadLessonVideo,
} from "@/interfaces/teachers/teacherLessons";
import {
  ICreateLecture,
  IUpdateLecture,
} from "@/interfaces/teachers/teacherLectures";

// Lessons
export const getTeacherLessons = async (
  token: string
): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get("/teacher/lessons", {
    headers: { Authorization: `Bearer ${token}` },
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
  const { data } = await axiosAPI.get(`/teacher/lessons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
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

  if (lesson.meeting_url?.trim()) {
    formData.append("meeting_url", lesson.meeting_url.trim());
  }
  if (lesson.location?.trim()) {
    formData.append("location", lesson.location.trim());
  }
  if (lesson.offline_visit_type?.trim()) {
    formData.append("offline_visit_type", lesson.offline_visit_type.trim());
  }
  if (lesson.max_students !== undefined) {
    formData.append("max_students", lesson.max_students.toString());
  }

  const { data } = await axiosAPI.post("/teacher/lessons", formData, {
    headers: { Authorization: `Bearer ${token}` },
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

  if (lesson.logo) formData.append("logo", lesson.logo);
  if (lesson.meeting_url?.trim()) formData.append("meeting_url", lesson.meeting_url.trim());
  if (lesson.location?.trim()) formData.append("location", lesson.location.trim());
  if (lesson.offline_visit_type?.trim()) {
    formData.append("offline_visit_type", lesson.offline_visit_type.trim());
  }
  if (lesson.max_students !== undefined) {
    formData.append("max_students", lesson.max_students.toString());
  }

  formData.append("_method", "put");
  const { data } = await axiosAPI.post(
    `/teacher/lessons/${lesson.id}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
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
  const { data } = await axiosAPI.delete(`/teacher/lessons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ============= Lesson Contents ============== //
export const getTeacherLessonContents = async ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: string;
}): Promise<ILessonContentsRes> => {
  const { data } = await axiosAPI.get(`/teacher/lessons/${lessonId}/contents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getTeacherLessonContentById = async ({
  token,
  id,
  lessonId,
}: {
  token: string;
  id: string;
  lessonId: string;
}): Promise<ILessonContentRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/lessons/${lessonId}/contents/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const createTeacherLessonContent = async ({
  token,
  content,
}: {
  token: string;
  content: ICreateLessonContent;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/lessons/${content.lessonId}/contents`,
    {
      title: content.title,
      description: content.description,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const updateTeacherLessonContent = async ({
  token,
  content,
}: {
  token: string;
  content: IUpdateLessonContent;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/lessons/${content.lessonId}/contents/${content.id}`,
    {
      title: content.title,
      description: content.description,
      _method: "put",
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteTeacherLessonContent = async ({
  id,
  token,
  lessonId,
}: {
  token: string;
  id: string;
  lessonId: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete(
    `/teacher/lessons/${lessonId}/contents/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// ============= Lectures =========== //
export const getTeacherLessonLectures = async ({
  token,
  contentId,
  lessonId,
}: IGetLessonLecture): Promise<ILessonLecturesRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/lessons/${lessonId}/contents/${contentId}/lectures`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getTeacherLessonLectureById = async ({
  token,
  id,
  lessonId,
  contentId,
}: IGetLessonLecture): Promise<ILessonLectureRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/lessons/${lessonId}/contents/${contentId}/lectures/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const createTeacherLessonLecture = async ({
  token,
  lecture,
}: {
  token: string;
  lecture: ICreateLecture;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/lessons/${lecture.lessonId}/contents/${lecture.contentId}/lectures`,
    { title: lecture.title, description: lecture.description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const updateTeacherLessonLecture = async ({
  token,
  lecture,
}: {
  token: string;
  lecture: IUpdateLecture;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/lessons/${lecture.lessonId}/contents/${lecture.contentId}/lectures/${lecture.id}`,
    { title: lecture.title, description: lecture.description, _method: "put" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteTeacherLessonLecture = async ({
  token,
  id,
  contentId,
  lessonId,
}: IDeleteLessonLecture): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete(
    `/teacher/lessons/${lessonId}/contents/${contentId}/lectures/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const uploadLessonVideo = async ({
  token,
  video,
  onUploadProgress,
}: {
  token: string;
  video: IUploadLessonVideo;
  onUploadProgress?: (progress: number) => void;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("video", video.video);

  const { data } = await axiosAPI.post(
    `/teacher/lessons/${video.lessonId}/contents/${video.contentId}/lectures/${video.lectureId}/video-upload`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(percent);
        }
      },
    }
  );

  return data;
};
