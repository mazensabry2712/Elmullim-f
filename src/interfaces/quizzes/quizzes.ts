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

export interface IStudentQuizSubmissionAnswer {
  question_id: number;
  option_id: number;
}

export interface IStudentQuizAttemptAnswer {
  question_id: number;
  selected_option_id: number;
  is_correct: boolean;
  awarded_score: number;
}

export interface IStudentQuizAttempt {
  id: number;
  quiz_id: number;
  score: number;
  total_score: number;
  percentage: number;
  correct_answers: number;
  submitted_at: string | null;
  answers: IStudentQuizAttemptAnswer[];
}

export interface IStudentQuizAttemptResponse {
  status: boolean;
  message: string | null;
  data: IStudentQuizAttempt;
}
