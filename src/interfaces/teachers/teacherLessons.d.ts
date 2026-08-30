export interface ICreateLesson {
  title: string;
  description: string;
  price: number;
  logo: File;
}

export interface IUpdateLesson extends ICreateLesson {
  id: number;
  logo?: File;
}

export interface IDeleteLessonLecture {
  token: string;
  id: string;
  lessonId: string;
  contentId: string;
}

export interface IUploadLessonVideo {
  lectureId: string;
  lessonId: string;
  contentId: string;
  video: File;
}
