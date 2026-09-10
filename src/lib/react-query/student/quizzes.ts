import QueryKeys from "@/enums";
import {
  getStudentQuiz,
  getStudentQuizResult,
  getStudentQuizzes,
  submitStudentQuiz,
} from "@/services/student/quizzes";
import type { IStudentQuizSubmissionAnswer } from "@/interfaces/quizzes/quizzes";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useSubmitStudentQuiz = () =>
  useMutation({
    mutationFn: ({
      token,
      quizId,
      answers,
    }: {
      token: string;
      quizId: number;
      answers: IStudentQuizSubmissionAnswer[];
    }) => submitStudentQuiz({ token, quizId, answers }),
  });

export const useGetStudentQuizResult = ({
  token,
  quizId,
  enabled = true,
}: {
  token?: string;
  quizId: number;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZ_RESULT, quizId],
    queryFn: () => getStudentQuizResult({ token: token as string, quizId }),
    enabled: enabled && !!token && Number.isInteger(quizId) && quizId > 0,
  });
