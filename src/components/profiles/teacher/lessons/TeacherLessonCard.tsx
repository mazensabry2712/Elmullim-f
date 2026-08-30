import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ILesson } from "@/interfaces/courses/lessons";
import DeleteLesson from "./DeleteLesson";
import { Pen } from "lucide-react";

interface IProps {
  lesson: ILesson;
}

const TeacherLessonCard = ({ lesson }: IProps) => {
  return (
    <div className="h-full p-3 sm:p-5 shadow-[0px_0px_40px_0px_#0E2A4614] transition-all duration-300 hover:shadow-lg rounded-[5px] space-y-5 sm:max-w-[80%] md:max-w-full mx-auto bg-white">
      {/* Image */}
      <div className="rounded-[5px] overflow-hidden relative max-h-80 sm:max-h-72 md:max-h-52">
        <h4 className="absolute top-4 left-4 bg-main text-white font-sora text-sm rounded-[5px] px-2 py-0.5">
          Lesson
        </h4>
        <img
          src={lesson.logo || "/images/placeholder-img.webp"}
          alt="course"
          className="object-cover object-center"
        />
      </div>
      <div className="space-y-4">
        {/* Info */}
        <div>
          <Link
            to={`/profile/my-lessons/${lesson.id}/view`}
            className="space-y-2"
          >
            <h4 className="text-black-blue capitalize font-semibold text-[21px] leading-[30px]">
              {lesson.title}
            </h4>
            <p className="text-[#4D5756] font-sora">
              {truncateTxt(lesson.description, 50)}
            </p>
          </Link>
          <div className="my-3 flex justify-between items-center flex-wrap gap-1 pb-4 border-b-2 border-dashed border-[#4D5756] text-black-blue text-sm font-sora"></div>
        </div>
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <img
            src={lesson.teacher.profile_image || "/images/profile-avatar.webp"}
            alt="teacher"
            loading="lazy"
            className="w-9 h-9 rounded-full object-top object-cover"
          />
          <h5 className="font-sora text-black-blue text-base">
            By <span className="text-main text-xl">{lesson.teacher.name}</span>
          </h5>
        </div>
        {/* Purchase */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Price */}
          <div className="flex items-center gap-2">
            {Number(lesson.price) === 0 ? (
              <span className="text-xl">Free</span>
            ) : (
              <span className="text-main font-exo text-xl">
                ${lesson.price}
              </span>
            )}
          </div>
          <div className="flex justify-center gap-2 w-full">
            <Link
              to={`/profile/my-lessons/${lesson.id}/view`}
              className="text-center w-full sm:w-fit block bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-4 py-2"
            >
              Watch
            </Link>
            <div className="flex gap-2">
              <Link
                to={`/profile/my-lessons/${lesson.id}/update`}
                className="text-center bg-blue-600 hover:bg-blue-600/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm h-9 w-9 flex justify-center items-center"
              >
                <Pen className="w-4 h-4" />
              </Link>
              <DeleteLesson id={lesson.id.toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLessonCard;
