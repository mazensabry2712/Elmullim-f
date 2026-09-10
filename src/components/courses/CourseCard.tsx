import { Link, useNavigate } from "react-router-dom";
import { ICourse } from "@/interfaces/courses/courses";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import truncateTxt from "@/utils/truncateTxt";
import EnrollFreeCourse from "./EnrollFreeCourse";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  course: ICourse;
  copy: CoursesCopy;
}

const CourseCard = ({ course, copy }: IProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const role = cookieService.getRole();
  const navigate = useNavigate();

  return (
    <article className="h-full p-3 sm:p-5 shadow-[0px_0px_40px_0px_#0E2A4614] transition-all duration-300 hover:shadow-lg rounded-[5px] space-y-5 sm:max-w-[80%] md:max-w-full mx-auto bg-white">
      <div className="rounded-[5px] overflow-hidden relative max-h-80 sm:max-h-72 md:max-h-52">
        <span className="absolute top-4 left-4 bg-main text-white font-sora text-sm rounded-[5px] px-2 py-0.5 z-10">
          {course.sub_category?.category?.name ?? "—"}
        </span>
        <img
          src={course.image || "/images/placeholder-img.webp"}
          alt={`${course.title} ${copy.categoryImageAlt}`}
          className="object-cover object-center w-full"
          loading="lazy"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Link
            to={`/courses/${course.id}`}
            className="space-y-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 rounded"
            aria-label={`${copy.details}: ${course.title}`}
          >
            <h4 className="text-black-blue capitalize font-semibold text-[21px] leading-[30px]">
              {course.title}
            </h4>
            <p className="text-[#4D5756] font-sora">
              {truncateTxt(course.description ?? "", 50)}
            </p>
          </Link>

          <div className="my-3 flex justify-between items-center flex-wrap gap-1 pb-4 border-b-2 border-dashed border-[#4D5756] text-black-blue text-sm font-sora">
            <div className="flex items-center gap-x-1">
              <i className="fi fi-sr-list-check flex justify-center items-center" aria-hidden="true" />
              <p className="capitalize font-medium">
                <span className="sr-only">{copy.level}: </span>
                {course.level}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={course.teacher?.profile_image || "/images/profile-avatar.webp"}
            alt={`${course.teacher?.name ?? "Teacher"} - ${copy.teacherImageAlt}`}
            loading="lazy"
            className="w-9 h-9 rounded-full object-top object-cover"
          />
          <h5 className="font-sora text-black-blue text-base">
            {copy.by} <span className="text-main text-xl">{course.teacher?.name ?? "—"}</span>
          </h5>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            {Number(course.price) === 0 ? (
              <span className="text-xl">{copy.free}</span>
            ) : (
              <span className="text-main font-exo text-xl">${course.price}</span>
            )}
          </div>

          {isAuthenticated && role === "student" && !course.hasEnrolled && Number(course.price) === 0 && (
            <EnrollFreeCourse courseId={course.id} copy={copy} />
          )}

          {isAuthenticated && role === "student" && !course.hasEnrolled && Number(course.price) > 0 && (
            <button
              type="button"
              onClick={() => navigate(`/course/${course.id}/enroll`)}
              className="w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {copy.enroll}
            </button>
          )}

          {isAuthenticated && role === "student" && course.hasEnrolled && (
            <Link
              to={`/courses/${course.id}/view`}
              className="block w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {copy.watch}
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/sign-in"
              className="block w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {copy.enroll}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
