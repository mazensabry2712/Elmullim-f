import React from "react";
import { QuizDetails } from "../../interfaces/quizzes/quiz";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import cookieService from "@/utils/cookieService";

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
  const token=cookieService.getToken()!
  const {data:teacherData}=useGetTeacherProfile(token)
 
  const subjectOptions = [
    { id: 1, name: "Arabic" },
    { id: 2, name: "English" },
    { id: 3, name: "Math" },
  ];
  const timeLimitOptions = ["15", "30", "45", "60"]; // Values in minutes
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];
  const years = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() + i)
  );

  return (
    <>
      {/* quiz details */}
      <div className="px-6 py-4 bg-[#F0FEFC] rounded-md  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Title */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="quizTitle"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              Quiz title
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

          {/* Academic Year */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="education_level_id"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              education system
            </label>
            <select
              id="education_level_id"
              name="education_level_id"
              value={quizDetails.education_level_id}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select System</option>
                <option key={teacherData?.data.education_level.education_system.id} value={teacherData?.data.education_level.education_system.id}>
                  {teacherData?.data.education_level.education_system.name}
                </option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="subject_id"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              Subject
            </label>
            <select
              id="subject_id"
              name="subject_id"
              value={quizDetails.subject_id}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Number Of Questions is managed automatically */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="academic_year"
              className="block text-base font-bold text-[#194D80] capitalize"
            >
              Education Level
            </label>
            <select
              id="academic_year"
              name="academic_year"
              value={quizDetails.academic_year}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Level</option>
              <option value={teacherData?.data.education_level.id}>{teacherData?.data.education_level.name}</option>
              
            </select>
          </div>

          {/* Quiz Start Time */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="start_time"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              Quiz start time
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

          {/* Quiz End Time */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="end_time"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              Quiz end time
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

          {/* Quiz Time Limit */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="time_limit"
              className="block text-base font-bold text-[#194D80]  capitalize"
            >
              Quiz Time limit
            </label>
            <select
              id="time_limit"
              name="time_limit"
              value={quizDetails.time_limit}
              onChange={handleChange}
              className="mt-1 text-center flex-shrink-0 block w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Limit</option>
              {timeLimitOptions.map((option) => (
                <option key={option} value={option}>
                  {option} min
                </option>
              ))}
            </select>
          </div>

          <br />
          {/* Quiz Date */}
          <div className="flex items-center gap-5">
            <label className="block text-base font-bold text-[#194D80]  capitalize">
              Quiz date
            </label>
            <div className="flex gap-5">
              <select
                id="quizDay"
                name="quizDay"
                value={quizDetails.quizDay}
                onChange={handleChange}
                className="mt-1 text-center flex-shrink-0 block w-[30%] md:w-[50%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Day</option>
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
                <option value="">Month</option>
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
                <option value="">Year</option>
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
