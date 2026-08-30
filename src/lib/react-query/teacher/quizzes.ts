import { useMutation } from "@tanstack/react-query";
import { uploadQuiz } from "@/services/teacher/quizzes";
import { QuizDetails, Question } from "@/interfaces/quizzes/quiz";

interface UseUploadQuizOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface UploadQuizData {
  quizDetails: QuizDetails;
  questions: Question[];
  token: string;
}

export const useUploadQuiz = ({
  onSuccess,
  onError,
}: UseUploadQuizOptions = {}) => {
  return useMutation({
    mutationFn: ({ quizDetails, questions, token }: UploadQuizData) =>
      uploadQuiz({ quizDetails, questions }, token),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}; 