import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionText: string;
  questionImage: File | null;
  answerType: "options" | "text";
  options: Option[];
  answerText: string;
  correctAnswerForCorrection: string;
}

interface QuestionFormProps {
  questionNumber: number;
  onQuestionChange: (question: Question) => void;
  onRemoveQuestion: (id: string) => void;
  initialQuestion?: Question;
}

const QuizQuestions: React.FC<QuestionFormProps> = ({
  questionNumber,
  onQuestionChange,
  onRemoveQuestion,
  initialQuestion,
}) => {
  const { language } = useI18n();
  const copy = language === "ar"
    ? {
        question: "السؤال",
        removeQuestion: "حذف السؤال",
        imageUploaded: "تم رفع الصورة",
        text: "إجابة نصية",
        optionsType: "اختيارات",
        options: "الاختيارات",
        addChoice: "أضف اختيارًا",
        correctAnswerHint: "اختر الإجابة الصحيحة للسؤال.",
        addOption: "إضافة اختيار",
        answerText: "نص الإجابة",
        correctAnswer: "اكتب الإجابة الصحيحة للسؤال للتصحيح.",
      }
    : {
        question: "Question",
        removeQuestion: "Remove Question",
        imageUploaded: "Image uploaded",
        text: "Text",
        optionsType: "Options",
        options: "Options",
        addChoice: "add the choose",
        correctAnswerHint: "If this is the correct answer to the question, choose it.",
        addOption: "Add Option",
        answerText: "Answer Text",
        correctAnswer: "Write the correct answer to the question for correction.",
      };

  const [question, setQuestion] = useState<Question>(
    initialQuestion || {
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
    }
  );

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestionText = e.target.value;
    setQuestion((prev) => {
      const updatedQ = { ...prev, questionText: newQuestionText };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleQuestionImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const newImage = e.target.files[0];
      setQuestion((prev) => {
        const updatedQ = { ...prev, questionImage: newImage };
        onQuestionChange(updatedQ);
        return updatedQ;
      });
    }
  };

  const handleAnswerTypeChange = (type: "options" | "text") => {
    setQuestion((prev) => {
      const updatedQ = { ...prev, answerType: type };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setQuestion((prev) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === id ? { ...opt, text } : opt
      );
      const updatedQ = { ...prev, options: updatedOptions };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleOptionCorrectChange = (id: string, isCorrect: boolean) => {
    setQuestion((prev) => {
      const updatedOptions = prev.options.map(
        (opt) =>
          opt.id === id ? { ...opt, isCorrect } : { ...opt, isCorrect: false }
      );
      const updatedQ = { ...prev, options: updatedOptions };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleAddOption = () => {
    setQuestion((prev) => {
      if (prev.options.length >= 4) return prev;
      const updatedOptions = [
        ...prev.options,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "",
          isCorrect: false,
        },
      ];
      const updatedQ = { ...prev, options: updatedOptions };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleRemoveOption = (id: string) => {
    setQuestion((prev) => {
      if (prev.options.length <= 2) return prev;
      const updatedOptions = prev.options.filter((opt) => opt.id !== id);
      const updatedQ = { ...prev, options: updatedOptions };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleAnswerTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newAnswerText = e.target.value;
    setQuestion((prev) => {
      const updatedQ = { ...prev, answerText: newAnswerText };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  const handleCorrectAnswerForCorrectionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newCorrectAnswer = e.target.value;
    setQuestion((prev) => {
      const updatedQ = {
        ...prev,
        correctAnswerForCorrection: newCorrectAnswer,
      };
      onQuestionChange(updatedQ);
      return updatedQ;
    });
  };

  return (
    <div className="px-6 bg-white mb-6 pt-8">
      <div className="mb-4 relative">
        <button
          type="button"
          onClick={() => onRemoveQuestion(question.id)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title={copy.removeQuestion}
          aria-label={copy.removeQuestion}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        <h3 className="text-base font-semibold mb-4 text-[#194D80] absolute -top-3 left-8 bg-white px-2">
          {copy.question} {questionNumber}
        </h3>
        <input
          type="text"
          value={question.questionText}
          onChange={handleQuestionTextChange}
          className="w-full p-2 border border-[#194D80] rounded-md focus:ring-blue-500 focus:border-blue-500"
          aria-label={`${copy.question} ${questionNumber}`}
        />
        <label
          htmlFor={`questionImage-${question.id}`}
          className="absolute top-2 -right-8 cursor-pointer"
          aria-label={language === "ar" ? "إضافة صورة للسؤال" : "Add question image"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 hover:text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.662 4h2.676a2 2 0 011.664.89l.808 1.212A2 2 0 0016.666 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <input
            id={`questionImage-${question.id}`}
            type="file"
            accept="image/*"
            onChange={handleQuestionImageUpload}
            className="hidden"
          />
        </label>
        {question.questionImage && (
          <p className="text-sm text-gray-500 mt-1">
            {copy.imageUploaded}: {question.questionImage.name}
          </p>
        )}
      </div>

      <div className="flex space-x-2 mb-4 justify-end">
        <button
          type="button"
          onClick={() => handleAnswerTypeChange("text")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            question.answerType === "text"
              ? "bg-[#DCEBF9] text-[#194D80]"
              : "bg-white text-[#194D80] border border-[#194D80] shadow-md"
          }`}
        >
          {copy.text}
        </button>
        <button
          type="button"
          onClick={() => handleAnswerTypeChange("options")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            question.answerType === "options"
              ? "bg-[#DCEBF9] text-[#194D80]"
              : "bg-white text-[#194D80] border border-[#194D80] shadow-md"
          }`}
        >
          {copy.optionsType}
        </button>
      </div>

      {question.answerType === "options" ? (
        <div className="mb-4">
          <p className="block text-base font-medium text-[#194D80] mb-2">
            {copy.options}
          </p>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 mb-5">
              <input
                type="radio"
                name={`correctOption-${question.id}`}
                checked={option.isCorrect}
                onChange={() => handleOptionCorrectChange(option.id, true)}
                className="form-radio text-blue-600"
                aria-label={copy.correctAnswerHint}
              />
              <input
                type="text"
                placeholder={copy.addChoice}
                value={option.text}
                onChange={(e) =>
                  handleOptionTextChange(option.id, e.target.value)
                }
                className="flex-1 p-2 border border-[#194D80] rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder:text-[#194D80] placeholder:text-center placeholder:capitalize"
              />
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) =>
                    handleOptionCorrectChange(option.id, e.target.checked)
                  }
                  className="form-checkbox h-4 w-4 text-blue-600 mr-1"
                />
                {copy.correctAnswerHint}
              </label>
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className="text-gray-400 hover:text-red-500"
                title="حذف الخيار"
                aria-label="حذف الخيار"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              onClick={handleAddOption}
              disabled={question.options.length >= 4}
              className="px-2 py-1 text-sm bg-[#DCEBF9] text-[#194D80] rounded-md flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus
                className="bg-[#194D80] rounded-full text-white"
                size={15}
              />
              <span>{copy.addOption}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <textarea
            id={`answerText-${question.id}`}
            placeholder={copy.answerText}
            value={question.answerText}
            onChange={handleAnswerTextChange}
            rows={3}
            className="w-full mb-5 p-5 border border-[#194D80] rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            id={`correctAnswerForCorrection-${question.id}`}
            placeholder={copy.correctAnswer}
            value={question.correctAnswerForCorrection}
            onChange={handleCorrectAnswerForCorrectionChange}
            rows={3}
            className="w-full p-5 border border-[#194D80] rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default QuizQuestions;
