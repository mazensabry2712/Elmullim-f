export interface ICourseLectureQuiz {
  id: number;
  title: string | null;
  time_limit: number;
  total_score: number;
  questions_count: number;
}

export interface ILecture {
  id: number;
  title: string;
  description: string;
  duration: null | string;
  videoUrl: string;
  quiz?: ICourseLectureQuiz | null;
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
