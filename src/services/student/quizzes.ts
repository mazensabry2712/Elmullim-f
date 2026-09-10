import axiosAPI from "@/config/axios.config";
import type {
  IStudentQuizAttemptResponse,
  IStudentQuizDetailsResponse,
  IStudentQuizSubmissionAnswer,
  IStudentQuizzesResponse,
} from "@/interfaces/quizzes/quizzes";

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getStudentQuizzes = async (
  token: string
): Promise<IStudentQuizzesResponse> => {
  const { data } = await axiosAPI.get("/student/quizzes", authHeaders(token));
  return data;
};

export const getStudentQuiz = async ({
  token,
  quizId,
}: {
  token: string;
  quizId: number;
}): Promise<IStudentQuizDetailsResponse> => {
  const { data } = await axiosAPI.get(
    `/student/quizzes/${quizId}`,
    authHeaders(token)
  );
  return data;
};

export const submitStudentQuiz = async ({
  token,
  quizId,
  answers,
}: {
  token: string;
  quizId: number;
  answers: IStudentQuizSubmissionAnswer[];
}): Promise<IStudentQuizAttemptResponse> => {
  const { data } = await axiosAPI.post(
    `/student/quizzes/${quizId}/submit`,
    { answers },
    authHeaders(token)
  );
  return data;
};

export const getStudentQuizResult = async ({
  token,
  quizId,
}: {
  token: string;
  quizId: number;
}): Promise<IStudentQuizAttemptResponse> => {
  const { data } = await axiosAPI.get(
    `/student/quizzes/${quizId}/result`,
    authHeaders(token)
  );
  return data;
};
