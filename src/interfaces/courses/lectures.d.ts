export interface ICourseLectureQuiz {
  id: number;
  title: string | null;
  time_limit: number;
  total_score: number;
  questions_count: number;
  approval_status?: "approved" | "pending_approval" | "rejected";
  approval_note?: string | null;
}

export interface ILecture {
  id: number;
  title: string;
  description: string;
  duration: null | string;
  videoUrl: string;
  hasVideo: boolean;
  approval_status?: "approved" | "pending_approval" | "rejected";
  approval_note?: string | null;
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
