export interface IQuizSubject {
  id: number;
  name: string;
}

export interface IQuizEducationLevel {
  id: number;
  name: string;
}

export interface IQuizTeacher {
  id?: number;
  name?: string;
}

export interface IStudentQuiz {
  id: number;
  title: string;
  academic_year: string | null;
  start_time: string | null;
  end_time: string | null;
  time_limit: number;
  date: string | null;
  total_score: number;
  subject?: IQuizSubject | null;
  education_level?: IQuizEducationLevel | null;
  teacher?: IQuizTeacher | null;
}

export interface IStudentQuizOption {
  id: number;
  title: string | null;
}

export interface IStudentQuizQuestion {
  id: number;
  title: string | null;
  score: number;
  options: IStudentQuizOption[];
}

export interface IStudentQuizzesResponse {
  status: boolean;
  message: string | null;
  data: IStudentQuiz[];
}

export interface IStudentQuizDetailsResponse {
  status: boolean;
  message: string | null;
  data: {
    quiz: IStudentQuiz;
    questions: IStudentQuizQuestion[];
  };
}
