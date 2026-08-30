export interface QuizDetails {
  title: string;
  time_limit: string;
  education_level_id: number | "";
  subject_id: number | "";
  start_time: string;
  end_time: string;
  academic_year: number | "";
  quizDay: string;
  quizMonth: string;
  quizYear: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  questionImage: File | null;
  answerType: "options" | "text";
  options: Option[];
  answerText: string;
  correctAnswerForCorrection: string;
} 