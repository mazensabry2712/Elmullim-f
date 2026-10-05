export interface ICreateCourse {
  title: string;
  description: string;
  price: number;
  image: File | null;
  sub_category_id: string;
  level: string;
}

export interface IUpdateCourse extends ICreateCourse {
  id: number;
  image?: File | null;
}

export interface IDeleteCourseLecture {
  token: string;
  id: string;
  courseId: string;
  contentId: string;
}

export interface IUploadCourseVideo {
  lectureId: string;
  courseId: string;
  contentId: string;
  video: File;
}

export interface ICourseQuizOptionInput {
  title: string;
  is_correct: boolean;
}

export interface ICourseQuizQuestionInput {
  title: string;
  score: number;
  options: ICourseQuizOptionInput[];
}

export interface ICreateCourseQuiz {
  courseId: string;
  contentId: string;
  lectureId: string;
  title: string;
  timeLimit: number;
  questions: ICourseQuizQuestionInput[];
}

export interface IDeleteCourseQuiz {
  courseId: string;
  contentId: string;
  lectureId: string;
}

export interface ITeacherCourseQuizOption {
  id: number;
  title: string | null;
  is_correct: boolean;
}

export interface ITeacherCourseQuizQuestion {
  id: number;
  title: string | null;
  score: number;
  options: ITeacherCourseQuizOption[];
}

export interface ITeacherCourseQuiz {
  id: number;
  title: string | null;
  time_limit: number;
  course_id: number | null;
  lecture_id: number | null;
  questions: ITeacherCourseQuizQuestion[];
}

export interface ITeacherCourseQuizResponse {
  status: boolean;
  message: string | null;
  data: ITeacherCourseQuiz;
}
