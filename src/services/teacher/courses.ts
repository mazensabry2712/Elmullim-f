import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  IContentRes,
  IContentsRes,
  ICreateCourseContent,
  IUpdateCourseContent,
} from "@/interfaces/courses/contents";
import { ICourseRes, ICoursesRes } from "@/interfaces/courses/courses";
import {
  IGetCourseLecture,
  ILectureRes,
  ILecturesRes,
} from "@/interfaces/courses/lectures";
import {
  ICreateCourse,
  IDeleteCourseLecture,
  IUpdateCourse,
  IUploadCourseVideo,
} from "@/interfaces/teachers/teacherCourses";
import {
  ICreateLecture,
  IUpdateLecture,
} from "@/interfaces/teachers/teacherLectures";

// Courses
export const getTeacherCourses = async (
  token: string
): Promise<ICoursesRes> => {
  const { data } = await axiosAPI.get("/teacher/courses", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getTeacherCourseById = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<ICourseRes> => {
  const { data } = await axiosAPI.get(`/teacher/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createTeacherCourse = async ({
  token,
  course,
}: {
  token: string;
  course: ICreateCourse;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("title", course.title);
  formData.append("description", course.description);
  formData.append("level", course.level);
  formData.append("price", course.price.toString());
  formData.append("sub_category_id", course.sub_category_id);
  if (course.image) formData.append("image", course.image);

  const { data } = await axiosAPI.post("/teacher/courses", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateTeacherCourse = async ({
  token,
  course,
}: {
  token: string;
  course: IUpdateCourse;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("title", course.title);
  formData.append("description", course.description);
  formData.append("level", course.level);
  formData.append("price", course.price.toString());
  formData.append("sub_category_id", course.sub_category_id);
  if (course.image) formData.append("image", course.image);

  formData.append("_method", "put");
  const { data } = await axiosAPI.post(
    `/teacher/courses/${course.id}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data;
};

export const deleteTeacherCourse = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete(`/teacher/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ============= Course Contents ============== //
export const getTeacherCourseContents = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: string;
}): Promise<IContentsRes> => {
  const { data } = await axiosAPI.get(`/teacher/courses/${courseId}/contents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getTeacherCourseContentById = async ({
  token,
  id,
  courseId,
}: {
  token: string;
  id: string;
  courseId: string;
}): Promise<IContentRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/courses/${courseId}/contents/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const createTeacherCourseContent = async ({
  token,
  content,
}: {
  token: string;
  content: ICreateCourseContent;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/courses/${content.courseId}/contents`,
    {
      title: content.title,
      description: content.description,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const updateTeacherCourseContent = async ({
  token,
  content,
}: {
  token: string;
  content: IUpdateCourseContent;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/courses/${content.courseId}/contents/${content.id}`,
    {
      title: content.title,
      description: content.description,
      _method: "put",
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteTeacherCourseContent = async ({
  id,
  token,
  courseId,
}: {
  token: string;
  id: string;
  courseId: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete(
    `/teacher/courses/${courseId}/contents/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// ============= Lectures =========== //
export const getTeacherCourseLectures = async ({
  token,
  contentId,
  courseId,
}: IGetCourseLecture): Promise<ILecturesRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/courses/${courseId}/contents/${contentId}/lectures`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getTeacherCourseLectureById = async ({
  token,
  id,
  courseId,
  contentId,
}: IGetCourseLecture): Promise<ILectureRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/courses/${courseId}/contents/${contentId}/lectures/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const createTeacherCourseLecture = async ({
  token,
  lecture,
}: {
  token: string;
  lecture: ICreateLecture;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/courses/${lecture.courseId}/contents/${lecture.contentId}/lectures`,
    { title: lecture.title, description: lecture.description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const updateTeacherCourseLecture = async ({
  token,
  lecture,
}: {
  token: string;
  lecture: IUpdateLecture;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/teacher/courses/${lecture.courseId}/contents/${lecture.contentId}/lectures/${lecture.id}`,
    { title: lecture.title, description: lecture.description, _method: "put" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteTeacherCourseLecture = async ({
  token,
  id,
  contentId,
  courseId,
}: IDeleteCourseLecture): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.delete(
    `/teacher/courses/${courseId}/contents/${contentId}/lectures/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const uploadCourseVideo = async ({
  token,
  video,
  onUploadProgress,
}: {
  token: string;
  video: IUploadCourseVideo;
  onUploadProgress?: (progress: number) => void;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("video", video.video);

  const { data } = await axiosAPI.post(
    `/teacher/courses/${video.courseId}/contents/${video.contentId}/lectures/${video.lectureId}/video-upload`,
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
