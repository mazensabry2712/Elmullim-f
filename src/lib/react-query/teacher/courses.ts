import QueryKeys from "@/enums";
import {
  ICreateCourseContent,
  IUpdateCourseContent,
} from "@/interfaces/courses/contents";
import { IGetCourseLecture } from "@/interfaces/courses/lectures";
import {
  ICreateCourse,
  ICreateCourseQuiz,
  IDeleteCourseLecture,
  IDeleteCourseQuiz,
  IUpdateCourse,
  IUploadCourseVideo,
} from "@/interfaces/teachers/teacherCourses";
import {
  ICreateLecture,
  IUpdateLecture,
} from "@/interfaces/teachers/teacherLectures";
import {
  createTeacherCourseLecture,
  createTeacherCourse,
  createTeacherCourseContent,
  deleteTeacherCourseLecture,
  deleteTeacherCourse,
  deleteTeacherCourseContent,
  getTeacherCourseLectures,
  getTeacherCourses,
  getTeacherCourseLectureById,
  getTeacherCourseById,
  getTeacherCourseContentById,
  getTeacherCourseContents,
  updateTeacherCourseLecture,
  updateTeacherCourse,
  updateTeacherCourseContent,
  uploadCourseVideo,
  createTeacherCourseQuiz,
  deleteTeacherCourseQuiz,
  getTeacherCourseQuiz,
  updateTeacherCourseQuiz,
  submitTeacherCourseForReview,
} from "@/services/teacher/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherCourses = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSES],
    queryFn: () => getTeacherCourses(token),
    enabled: enabled && !!token,
  });

export const useGetTeacherCourseById = ({
  token,
  id,
  enabled = true,
}: {
  token: string;
  id: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSE, id],
    queryFn: () => getTeacherCourseById({ token, id }),
    enabled: enabled && !!id && !!token,
  });

export const useSubmitTeacherCourseForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      submitTeacherCourseForReview({ token, id }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE, variables.id],
      });
    },
  });
};

export const useCreateTeacherCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, course }: { token: string; course: ICreateCourse }) =>
      createTeacherCourse({ token, course }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSES],
      });
    },
  });
};

export const useUpdateTeacherCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, course }: { token: string; course: IUpdateCourse }) =>
      updateTeacherCourse({ token, course }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSES],
      });
    },
  });
};

export const useDeleteTeacherCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      deleteTeacherCourse({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSES],
      });
    },
  });
};

// ============= Contents ============== //
export const useGetTeacherCourseContents = ({
  token,
  courseId,
  enabled = true,
}: {
  token: string;
  courseId: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSE_CONTENTS, courseId],
    queryFn: () => getTeacherCourseContents({ token, courseId }),
    enabled: enabled && !!courseId && !!token,
  });

export const useGetTeacherCourseContentById = ({
  token,
  id,
  courseId,
  enabled = true,
}: {
  token: string;
  id: string;
  courseId: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSE_CONTENT, id, courseId],
    queryFn: () => getTeacherCourseContentById({ token, courseId, id }),
    enabled: enabled && !!id && !!courseId && !!token,
  });

export const useCreateTeacherCourseContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      content,
    }: {
      token: string;
      content: ICreateCourseContent;
    }) => createTeacherCourseContent({ token, content }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_CONTENTS],
      });
    },
  });
};

export const useUpdateTeacherCourseContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      content,
    }: {
      token: string;
      content: IUpdateCourseContent;
    }) => updateTeacherCourseContent({ token, content }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_CONTENTS],
      });
    },
  });
};

export const useDeleteTeacherCourseContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      token,
      courseId,
    }: {
      token: string;
      id: string;
      courseId: string;
    }) => deleteTeacherCourseContent({ token, id, courseId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_CONTENTS],
      });
    },
  });
};

// ============= Lectures =========== //
export const useGetTeacherCourseLectures = ({
  token,
  contentId,
  courseId,
  enabled = true,
}: IGetCourseLecture & { enabled?: boolean }) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSE_LECTURES, contentId, courseId],
    queryFn: () => getTeacherCourseLectures({ token, contentId, courseId }),
    enabled: enabled && !!contentId && !!courseId && !!token,
  });

export const useGetTeacherCourseLectureById = ({
  token,
  contentId,
  courseId,
  id,
  enabled = true,
}: IGetCourseLecture & { enabled?: boolean }) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_COURSE_LECTURES, id, contentId, courseId],
    queryFn: () =>
      getTeacherCourseLectureById({ token, contentId, courseId, id }),
    enabled: enabled && !!id && !!contentId && !!courseId && !!token,
  });

export const useCreateTeacherCourseLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      lecture,
    }: {
      token: string;
      lecture: ICreateLecture;
    }) => createTeacherCourseLecture({ token, lecture }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES],
      });
    },
  });
};

export const useUpdateTeacherCourseLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      lecture,
    }: {
      token: string;
      lecture: IUpdateLecture;
    }) => updateTeacherCourseLecture({ token, lecture }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES],
      });
    },
  });
};

export const useDeleteTeacherCourseLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id, contentId, courseId }: IDeleteCourseLecture) =>
      deleteTeacherCourseLecture({ token, id, contentId, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES],
      });
    },
  });
};

// ============= Lecture quizzes =========== //
export const useGetTeacherCourseQuiz = ({
  token,
  courseId,
  contentId,
  lectureId,
  enabled = true,
}: {
  token: string;
  courseId: string;
  contentId: string;
  lectureId: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [
      QueryKeys.TEACHER_COURSE_QUIZ,
      courseId,
      contentId,
      lectureId,
    ],
    queryFn: () =>
      getTeacherCourseQuiz({
        token,
        courseId,
        contentId,
        lectureId,
      }),
    enabled:
      enabled &&
      !!token &&
      !!courseId &&
      !!contentId &&
      !!lectureId,
  });

// ============= Lecture quizzes =========== //
export const useUpdateTeacherCourseQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      quiz,
    }: {
      token: string;
      quiz: ICreateCourseQuiz;
    }) => updateTeacherCourseQuiz({ token, quiz }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.TEACHER_COURSE_QUIZ,
          variables.quiz.courseId,
          variables.quiz.contentId,
          variables.quiz.lectureId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.TEACHER_COURSE_LECTURES,
          variables.quiz.contentId,
          variables.quiz.courseId,
        ],
      });
    },
  });
};

export const useCreateTeacherCourseQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      quiz,
    }: {
      token: string;
      quiz: ICreateCourseQuiz;
    }) => createTeacherCourseQuiz({ token, quiz }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES, variables.quiz.contentId, variables.quiz.courseId],
      });
    },
  });
};

export const useDeleteTeacherCourseQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      quiz,
    }: {
      token: string;
      quiz: IDeleteCourseQuiz;
    }) => deleteTeacherCourseQuiz({ token, quiz }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES],
      });
    },
  });
};

export const useUploadCourseVideo = (
  onUploadProgress: (progress: number) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      video,
    }: {
      token: string;
      video: IUploadCourseVideo;
    }) => uploadCourseVideo({ token, video, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_COURSE_LECTURE],
      });
    },
  });
};
