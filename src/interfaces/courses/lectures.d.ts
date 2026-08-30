export interface ILecture {
  id: number;
  title: string;
  description: string;
  duration: null | string;
  videoUrl: string;
}

export interface ILectureRes {
  status: boolean;
  message: null | string;
  data: ILecture;
}

export interface ILecturesRes {
  status: boolean;
  message: null | string;
  data: ILecture[];
}

export interface IGetCourseLecture {
  id?: string;
  token: string;
  contentId: string;
  courseId: string;
}
