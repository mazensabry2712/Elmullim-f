export interface ILessonLecture {
  id: number;
  title: string;
  description: string;
  duration: null | string;
  videoUrl: string;
}

export interface ILessonLectureRes {
  status: boolean;
  message: null | string;
  data: ILessonLecture;
}

export interface ILessonLecturesRes {
  status: boolean;
  message: null | string;
  data: ILessonLecture[];
}

export interface IGetLessonLecture {
  id?: string;
  token: string;
  contentId: string;
  lessonId: string;
}
