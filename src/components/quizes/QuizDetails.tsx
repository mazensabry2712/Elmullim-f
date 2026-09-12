import React from "react";
import { QuizDetails } from "../../interfaces/quizzes/quiz";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";

interface QuizDetailsProps {
  quizDetails: QuizDetails;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const QuizDeatails: React.FC<QuizDetailsProps> = ({
  quizDetails,
  handleChange,
}) => {
  const token = cookieService.getToken()!;
  const { data: teacherData } = useGetTeacherProfile(token);
  const { language } = useI18n();

  const copy = language === "ar"
    ? {
        quizTitle: "عنوان الاختبار",
        educationSystem: "النظام التعليمي",
        selectSystem: "اختر النظام",
        subject: "المادة",
        selectSubject: "اختر المادة",
        arabic: "العربية",
        english: "الإنجليزية",
        math: "الرياضيات",
        educationLevel: "المرحلة التعليمية",
        selectLevel: "اختر المرحلة",
        startTime: "وقت بدء الاختبار",
        endTime: "وقت انتهاء الاختبار",
        timeLimit: "مدة الاختبار",
        selectLimit: "اختر المدة",
        minutes: "دقيقة",
        quizDate: "تاريخ الاختبار",
        day: "اليوم",
        month: "الشهر",
        year: "السنة",
        months: [
          "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
          "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
        ],
      }
    : {
        quizTitle: "Quiz title",
        educationSystem: "Education system",
        selectSystem: "Select System",
        subject: "Subject",
        selectSubject: "Select Subject",
        arabic: "Arabic",
        english: "English",
        math: "Math",
        educationLevel: "Education Level",
        selectLevel: "Select Level",
        startTime: "Quiz start time",
        endTime: "Quiz end time",
        timeLimit: "Quiz Time limit",
        selectLimit: "Select Limit",
        minutes: "min",
        quizDate: "Quiz date",
        day: "Day",
        month: "Month",
        year: "Year",
        months: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ],
      };

  const subjectOptions = [
    { id: 1, name: copy.arabic },
    { id: 2, name: copy.english },
    { id: 3, name: copy.math },
  ];

  const timeLimitOptions = ["15", "30", "45", "60"];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = copy.months.map((name, index) => ({
    value: String(index + 1).padStart(2, "0"),
    name,
  }));
  const years = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() + i)
  );

  return (
    <>
      <div className="px-6 py-4 bg-[#F0FEFC] rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-5">
            <label
              htmlFor="quizTitle"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.quizTitle}
            </label>
            <input
              type="text"
              id="quizTitle"
              name="title"
              value={quizDetails.title}
              onChange={handleChange}
              className="mt-1 flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="education_level_id"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.educationSystem}
            </label>
            <select
              id="education_level_id"
              name="education_level_id"
              value={quizDetails.education_level_id}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">{copy.selectSystem}</option>
              <option
                key={teacherData?.data.education_level.education_system.id}
                value={teacherData?.data.education_level.education_system.id}
              >
                {teacherData?.data.education_level.education_system.name}
              </option>
            </select>
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="subject_id"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.subject}
            </label>
            <select
              id="subject_id"
              name="subject_id"
              value={quizDetails.subject_id}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">{copy.selectSubject}</option>
              {subjectOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="academic_year"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.educationLevel}
            </label>
            <select
              id="academic_year"
              name="academic_year"
              value={quizDetails.academic_year}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">{copy.selectLevel}</option>
              <option value={teacherData?.data.education_level.id}>
                {teacherData?.data.education_level.name}
              </option>
            </select>
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="start_time"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.startTime}
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={quizDetails.start_time}
              onChange={handleChange}
              className="mt-1 flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="end_time"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.endTime}
            </label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={quizDetails.end_time}
              onChange={handleChange}
              className="mt-1 flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-5">
            <label
              htmlFor="time_limit"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              {copy.timeLimit}
            </label>
            <select
              id="time_limit"
              name="time_limit"
              value={quizDetails.time_limit}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">{copy.selectLimit}</option>
              {timeLimitOptions.map((option) => (
                <option key={option} value={option}>
                  {option} {copy.minutes}
                </option>
              ))}
            </select>
          </div>

          <br />
          <div className="flex items-center gap-5">
            <label className="block text-base font-bold text-[#194D80] capitalize">
              {copy.quizDate}
            </label>
            <div className="flex gap-5">
              <select
                id="quizDay"
                name="quizDay"
                value={quizDetails.quizDay}
                onChange={handleChange}
                className="mt-1 text-center flex-shrink-0 block w-[30%] md:w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">{copy.day}</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                id="quizMonth"
                name="quizMonth"
                value={quizDetails.quizMonth}
                onChange={handleChange}
                className="mt-1 text-center flex-shrink-0 block w-[30%] md:w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">{copy.month}</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
              <select
                id="quizYear"
                name="quizYear"
                value={quizDetails.quizYear}
                onChange={handleChange}
                className="mt-1 text-center flex-shrink-0 block w-[30%] md:w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">{copy.year}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizDeatails;
