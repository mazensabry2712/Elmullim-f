import axiosAPI from "@/config/axios.config";
import { QuizDetails, Question } from "@/interfaces/quizzes/quiz";

interface UploadQuizData {
  quizDetails: QuizDetails;
  questions: Question[];
}

export const uploadQuiz = async (data: UploadQuizData, token: string) => {
  const { quizDetails, questions } = data;

  const quizDetailsFormData = new FormData();
  quizDetailsFormData.append("title", quizDetails.title.trim());
  quizDetailsFormData.append("time_limit", quizDetails.time_limit);
  quizDetailsFormData.append("education_level_id", String(quizDetails.education_level_id));
  quizDetailsFormData.append("subject_id", String(quizDetails.subject_id));
  quizDetailsFormData.append("start_time", quizDetails.start_time);
  quizDetailsFormData.append("end_time", quizDetails.end_time);
  const dateValue = `${quizDetails.quizYear}-${quizDetails.quizMonth.padStart(2, "0")}-${quizDetails.quizDay.padStart(2, "0")}`;
  quizDetailsFormData.append("date", dateValue);
  quizDetailsFormData.append("academic_year", String(quizDetails.academic_year));

  const headers = { Authorization: `Bearer ${token}` };

  // Create the quiz first, then create its questions. If any question fails,
  // wait for all requests to settle and remove the incomplete quiz.
  const quizResponse = await axiosAPI.post("/teacher/quizzes", quizDetailsFormData, { headers });
  const quizId = quizResponse.data?.data?.id;

  if (!quizId) {
    throw new Error("The server created no usable quiz reference.");
  }

  const results = await Promise.allSettled(
    questions.map((question) => {
      const formData = new FormData();
      formData.append("title", question.questionText.trim());
      formData.append("score", "10");
      formData.append("answer_type", question.answerType);

      if (question.questionImage) {
        formData.append("image", question.questionImage);
      }

      if (question.answerType === "options") {
        question.options.forEach((option, index) => {
          formData.append(`options[${index}][title]`, option.text.trim());
          formData.append(`options[${index}][is_correct]`, option.isCorrect ? "1" : "0");
        });
      } else {
        formData.append("answer_text", question.answerText.trim());
        formData.append(
          "correct_answer_for_correction",
          question.correctAnswerForCorrection.trim(),
        );
      }

      return axiosAPI.post(`/teacher/quizzes/${quizId}/questions`, formData, { headers });
    }),
  );

  const failedQuestion = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failedQuestion) {
    try {
      await axiosAPI.delete(`/teacher/quizzes/${quizId}`, { headers });
    } catch (cleanupError) {
      console.error("Failed to remove an incomplete quiz after a question upload failed.", cleanupError);
    }

    throw failedQuestion.reason;
  }

  return quizResponse.data;
};
