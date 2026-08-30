import React, { useState } from "react";
import QuizDeatails from "./QuizDetails";
import QuizQuestions from "./QuizQuestions";
import { Plus } from "lucide-react";
import cookieService from "@/utils/cookieService";
import {
  QuizDetails,
  Question,
} from "../../interfaces/quizzes/quiz";
import { useUploadQuiz } from "@/lib/react-query/teacher/quizzes";
import { toast } from "react-toastify";

const Upload: React.FC = () => {
  const token = cookieService.getToken();

  const [quizDetails, setQuizDetails] = useState<QuizDetails>({
    title: "",
    time_limit: "15",
    education_level_id: "",
    subject_id: "",
    start_time: "",
    end_time: "",
    academic_year: "",
    quizDay: "",
    quizMonth: "",
    quizYear: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  const { mutate: uploadQuiz, isPending: isSubmitting } = useUploadQuiz({
    onSuccess: () => {
      toast.success("Quiz uploaded successfully");
      
    },
    onError: (error: any) => {
      console.error("Failed to submit quiz:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(`Failed to upload quiz: ${errorMessage}`);
    },
  });

  const handleQuizDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "education_level_id" ||
      name === "subject_id" ||
      name === "academic_year"
    ) {
      setQuizDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value ? Number(value) : "",
      }));
    } else {
      setQuizDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: Math.random().toString(36).substr(2, 9),
        questionText: "",
        questionImage: null,
        answerType: "options",
        options: [
          { id: "opt1", text: "", isCorrect: false },
          { id: "opt2", text: "", isCorrect: false },
        ],
        answerText: "",
        correctAnswerForCorrection: "",
      },
    ]);
  };

  const handleQuestionChange = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to upload a quiz.");
      return;
    }

    uploadQuiz({ quizDetails, questions, token });
  };

  return (
    <form onSubmit={handleSubmit} className="pb-5 bg-white rounded-md">
      <QuizDeatails
        quizDetails={quizDetails}
        handleChange={handleQuizDetailsChange}
      />
      <div className="bg-white px-6">
        {questions.length === 0 && (
          <p className="text-[#194D80] text-xl text-center my-4  font-bold font-sora">
            No question added yet.
          </p>
        )}
        {questions.map((question, index) => (
          <QuizQuestions
            key={question.id}
            questionNumber={index + 1}
            initialQuestion={question}
            onQuestionChange={handleQuestionChange}
            onRemoveQuestion={handleRemoveQuestion}
          />
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="px-2 py-1 text-sm bg-[#DCEBF9] text-[#194D80] rounded-md flex items-center space-x-2 mt-4"
        >
          <Plus className="bg-[#194D80] rounded-full text-white" size={15} />
          <span>Add Question</span>
        </button>
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#194D80] text-white rounded-md text-base font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Uploading..." : "Upload Quiz"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Upload;
