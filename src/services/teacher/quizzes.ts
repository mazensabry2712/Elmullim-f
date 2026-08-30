import axiosAPI from "@/config/axios.config";
import { QuizDetails, Question } from "@/interfaces/quizzes/quiz";

interface UploadQuizData {
  quizDetails: QuizDetails;
  questions: Question[];
}

export const uploadQuiz = async (data: UploadQuizData, token: string) => {
  const { quizDetails, questions } = data;

  const quizDetailsFormData = new FormData();
  quizDetailsFormData.append("title", quizDetails.title);
  quizDetailsFormData.append("time_limit", quizDetails.time_limit);
  quizDetailsFormData.append(
    "education_level_id",
    String(quizDetails.education_level_id)
  );
  quizDetailsFormData.append("subject_id", String(quizDetails.subject_id));
  quizDetailsFormData.append("start_time", quizDetails.start_time);
  quizDetailsFormData.append("end_time", quizDetails.end_time);
  const dateValue = `${quizDetails.quizYear}-${quizDetails.quizMonth}-${quizDetails.quizDay}`;
  quizDetailsFormData.append("date", dateValue);
  quizDetailsFormData.append(
    "academic_year",
    String(quizDetails.academic_year)
  );

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Step 1: Upload quiz details
  const quizResponse = await axiosAPI.post(
    "/teacher/quizzes",
    quizDetailsFormData,
    { headers }
  );
  const quizID = quizResponse.data.data.id;

  // Step 2: Upload each question
  const questionPromises = questions.map((question) => {
    const questionFormData = new FormData();
    questionFormData.append("title", question.questionText);
    questionFormData.append("score", "10");

    if (question.questionImage) {
      questionFormData.append("image", question.questionImage);
    }

    if (question.answerType === "options") {
      question.options.forEach((opt, index) => {
        questionFormData.append(`options[${index}][title]`, opt.text);
        questionFormData.append(
          `options[${index}][is_correct]`,
          opt.isCorrect ? "1" : "0"
        );
      });
    } else {
      questionFormData.append("answer", question.answerText);
      questionFormData.append(
        "correct_answer_for_correction",
        question.correctAnswerForCorrection
      );
    }

    return axiosAPI.post(
      `/teacher/quizzes/${quizID}/questions`,
      questionFormData,
      { headers }
    );
  });

  await Promise.all(questionPromises);

  return quizResponse.data;
}; 