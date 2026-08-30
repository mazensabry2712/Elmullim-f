import QueryKeys from "@/enums";
import {
  ICreateLessonContent,
  IUpdateLessonContent,
} from "@/interfaces/courses/contents";
import { IGetLessonLecture } from "@/interfaces/courses/lessons";
import {
  ICreateLecture,
  IUpdateLecture,
} from "@/interfaces/teachers/teacherLectures";
import {
  ICreateLesson,
  IDeleteLessonLecture,
  IUpdateLesson,
  IUploadLessonVideo,
} from "@/interfaces/teachers/teacherLessons";
import {
  createTeacherLesson,
  createTeacherLessonContent,
  createTeacherLessonLecture,
  deleteTeacherLesson,
  deleteTeacherLessonContent,
  deleteTeacherLessonLecture,
  getTeacherLessonLectures,
  getTeacherLessons,
  getTeacherLessonById,
  getTeacherLessonContentById,
  getTeacherLessonContents,
  getTeacherLessonLectureById,
  updateTeacherLesson,
  updateTeacherLessonContent,
  updateTeacherLessonLecture,
  uploadLessonVideo,
} from "@/services/teacher/lessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherLessons = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSONS],
    queryFn: () => getTeacherLessons(token),
  });

export const useGetTeacherLessonById = ({
  token,
  id,
}: {
  token: string;
  id: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON, id],
    queryFn: () => getTeacherLessonById({ token, id }),
    enabled: !!id,
  });

export const useCreateTeacherLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, lesson }: { token: string; lesson: ICreateLesson }) =>
      createTeacherLesson({ token, lesson }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSONS],
      });
    },
  });
};

export const useUpdateTeacherLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, lesson }: { token: string; lesson: IUpdateLesson }) =>
      updateTeacherLesson({ token, lesson }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSONS],
      });
    },
  });
};

export const useDeleteTeacherLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      deleteTeacherLesson({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSONS],
      });
    },
  });
};

// ============= Contents ============== //
export const useGetTeacherLessonContents = ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON_CONTENTS, lessonId],
    queryFn: () => getTeacherLessonContents({ token, lessonId }),
    enabled: !!lessonId,
  });

export const useGetTeacherLessonContentById = ({
  token,
  id,
  lessonId,
}: {
  token: string;
  id: string;
  lessonId: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON_CONTENT, id, lessonId],
    queryFn: () => getTeacherLessonContentById({ token, lessonId, id }),
    enabled: !!id && !!lessonId,
  });

export const useCreateTeacherLessonContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      content,
    }: {
      token: string;
      content: ICreateLessonContent;
    }) => createTeacherLessonContent({ token, content }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_CONTENTS],
      });
    },
  });
};

export const useUpdateTeacherLessonContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      content,
    }: {
      token: string;
      content: IUpdateLessonContent;
    }) => updateTeacherLessonContent({ token, content }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_CONTENTS],
      });
    },
  });
};

export const useDeleteTeacherLessonContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      token,
      lessonId,
    }: {
      token: string;
      id: string;
      lessonId: string;
    }) => deleteTeacherLessonContent({ token, id, lessonId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_CONTENTS],
      });
    },
  });
};

// ============= Lectures =========== //
export const useGetTeacherLessonLectures = ({
  token,
  contentId,
  lessonId,
}: IGetLessonLecture) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON_LECTURE, contentId, lessonId],
    queryFn: () => getTeacherLessonLectures({ token, contentId, lessonId }),
    enabled: !!contentId && !!lessonId,
  });

export const useGetTeacherLessonLectureById = ({
  token,
  contentId,
  lessonId,
  id,
}: IGetLessonLecture) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON_LECTURE, id, contentId, lessonId],
    queryFn: () =>
      getTeacherLessonLectureById({ token, contentId, lessonId, id }),
    enabled: !!id && !!contentId && !!lessonId,
  });

export const useCreateTeacherLessonLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      lecture,
    }: {
      token: string;
      lecture: ICreateLecture;
    }) => createTeacherLessonLecture({ token, lecture }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_LECTURES],
      });
    },
  });
};

export const useUpdateTeacherLessonLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      lecture,
    }: {
      token: string;
      lecture: IUpdateLecture;
    }) => updateTeacherLessonLecture({ token, lecture }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_LECTURES],
      });
    },
  });
};

export const useDeleteTeacherLessonLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id, contentId, lessonId }: IDeleteLessonLecture) =>
      deleteTeacherLessonLecture({ token, id, contentId, lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_LECTURES],
      });
    },
  });
};

export const useUploadLessonVideo = (
  onUploadProgress: (progress: number) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      video,
    }: {
      token: string;
      video: IUploadLessonVideo;
    }) => uploadLessonVideo({ token, video, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_LECTURES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON_LECTURE],
      });
    },
  });
};
