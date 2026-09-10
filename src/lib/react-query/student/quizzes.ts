import QueryKeys from "@/enums";
import {
  getStudentQuiz,
  getStudentQuizzes,
} from "@/services/student/quizzes";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentQuizzes = (token?: string) =>
  useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZZES],
    queryFn: () => getStudentQuizzes(token as string),
    enabled: !!token,
  });

export const useGetStudentQuiz = ({ token, quizId }: { token?: string; quizId: number }) =>
  useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZ, quizId],
    queryFn: () => getStudentQuiz({ token: token as string, quizId }),
    enabled: !!token && Number.isInteger(quizId) && quizId > 0,
  });
