import QueryKeys from "@/enums";
import {
  getStudentQuiz,
  getStudentQuizResult,
  getStudentQuizzes,
  startStudentQuiz,
  submitStudentQuiz,
} from "@/services/student/quizzes";
import type { IStudentQuizSubmissionAnswer } from "@/interfaces/quizzes/quizzes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useStudentSessionScope = () =>
  useSelector((state: RootState) =>
    `${state.auth.sessionVersion}:${state.auth.isAuthenticated ? state.auth.role ?? "authenticated" : "guest"}`
  );

export const useGetStudentQuizzes = (token?: string) => {
  const sessionScope = useStudentSessionScope();

  return useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZZES, sessionScope],
    queryFn: () => getStudentQuizzes(token as string),
    enabled: !!token,
  });
};

export const useGetStudentQuiz = ({
  token,
  quizId,
}: {
  token?: string;
  quizId: number;
}) => {
  const sessionScope = useStudentSessionScope();

  return useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZ, quizId, sessionScope],
    queryFn: () => getStudentQuiz({ token: token as string, quizId }),
    enabled: !!token && Number.isInteger(quizId) && quizId > 0,
  });
};

export const useStartStudentQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, quizId }: { token: string; quizId: number }) =>
      startStudentQuiz({ token, quizId }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENT_QUIZZES],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENT_QUIZ_RESULT, variables.quizId],
      });
    },
  });
};

export const useSubmitStudentQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      quizId,
      answers,
    }: {
      token: string;
      quizId: number;
      answers: IStudentQuizSubmissionAnswer[];
    }) => submitStudentQuiz({ token, quizId, answers }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENT_QUIZZES],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENT_QUIZ, variables.quizId],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENT_QUIZ_RESULT, variables.quizId],
      });
    },
  });
};

export const useGetStudentQuizResult = ({
  token,
  quizId,
  enabled = true,
}: {
  token?: string;
  quizId: number;
  enabled?: boolean;
}) => {
  const sessionScope = useStudentSessionScope();

  return useQuery({
    queryKey: [QueryKeys.STUDENT_QUIZ_RESULT, quizId, sessionScope],
    queryFn: () => getStudentQuizResult({ token: token as string, quizId }),
    enabled: enabled && !!token && Number.isInteger(quizId) && quizId > 0,
  });
};
