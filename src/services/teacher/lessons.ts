import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  IContentRes,
  IContentsRes,
  ICreateLessonContent,
  IUpdateLessonContent,
} from "@/interfaces/courses/contents";
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
import {
  IGetLessonLecture,
  ILessonRes,
  ILessonsRes,
} from "@/interfaces/courses/lessons";
import { ILectureRes, ILecturesRes } from "@/interfaces/courses/lectures";

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
  formData.append("title", lesson.title);
  formData.append("description", lesson.description);
  formData.append("price", lesson.price.toString());
  formData.append("logo", lesson.logo);

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
  formData.append("title", lesson.title);
  formData.append("description", lesson.description);
  formData.append("price", lesson.price.toString());
  if (lesson.logo) formData.append("logo", lesson.logo);

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
}): Promise<IContentsRes> => {
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
}): Promise<IContentRes> => {
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
}: IGetLessonLecture): Promise<ILecturesRes> => {
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
}: IGetLessonLecture): Promise<ILectureRes> => {
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
