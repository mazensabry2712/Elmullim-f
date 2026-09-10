import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CourseContent from "@/components/courses/CourseContent";
import EnrollFreeCourse from "@/components/courses/EnrollFreeCourse";
import RelatedCourses from "@/components/courses/RelatedCourses";
import Newsletter from "@/components/Newsletter";
import InstructorDetails from "@/components/shared/InstructorDetails";
import { useGetCourseById } from "@/lib/react-query/courses/courses";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { AxiosResErr } from "@/types";
import { useI18n } from "@/i18n";
import { getCoursesCopy } from "./courseCopy";

const CourseDetails = () => {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const role = cookieService.getRole();
  const token = cookieService.getToken() || undefined;
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const numericCourseId = Number(courseId);

  const {
    data: course,
    isLoading,
    isError,
    failureReason,
    refetch,
  } = useGetCourseById({
    courseId: numericCourseId,
    ...(token && { token }),
  });

  const courseFailure = failureReason as AxiosResErr | undefined;

  useEffect(() => {
    document.title = `${copy.detailTitle} | Elmullim`;
  }, [copy.detailTitle]);

  useEffect(() => {
    if (!courseId || !Number.isInteger(numericCourseId) || numericCourseId <= 0) {
      navigate("/courses", { replace: true });
    }
  }, [courseId, navigate, numericCourseId]);

  if (!courseId || !Number.isInteger(numericCourseId) || numericCourseId <= 0) {
    return null;
  }

  if (isLoading) {
    return (
      <main>
        <div className="container py-24" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
          <span className="sr-only">{copy.loading}</span>
        </div>
      </main>
    );
  }

  if (isError || !course?.data) {
    const message = courseFailure?.response?.data?.message;
    if (message) {
      toast.error(message);
    }

    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
            >
              {copy.retry}
            </button>
            <Link
              to="/courses"
              className="w-fit border border-main text-main hover:bg-main hover:text-white transition-all duration-200 rounded-[5px] font-sora text-sm px-6 py-2"
            >
              {copy.backToCourses}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const courseData = course.data;

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {copy.detailTitle}
        </h1>
        <p
          className="font-sora font-light leading-[30px]"
          aria-label={copy.detailBreadcrumb}
        >
          {copy.home} <span className="text-main">//</span> {copy.detailTitle}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="course-details-title"
      >
        <div className="bg-[#F0F1F1] py-12 md:py-24">
          <div className="container">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-7 order-2 h-fit">
                <div className="space-y-2 text-center lg:text-start mt-8 lg:mt-0">
                  <h2 id="course-details-title" className="text-black-blue font-bold text-3xl lg:text-5xl">
                    {courseData.title}
                  </h2>
                  <p className="font-sora text-[15px] text-[#4D5756] leading-relaxed px-4">
                    {courseData.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="font-sora text-lg font-medium flex items-center gap-2">
                      <img
                        src={courseData.teacher?.profile_image || "/images/profile-avatar.webp"}
                        alt={`${courseData.teacher?.name ?? "Teacher"} - ${copy.teacherImageAlt}`}
                        className="w-10 h-10 rounded-full bg-black-blue object-cover object-top shrink-0"
                      />
                      <h3>
                        {copy.by}{" "}
                        <span className="text-main">
                          {courseData.teacher?.name ?? "—"}
                        </span>
                      </h3>
                    </div>
                    <h3 className="capitalize font-sora text-black-blue font-medium flex items-center gap-2">
                      <Users size={18} aria-hidden="true" />
                      {courseData.level}
                    </h3>
                  </div>

                  <div>
                    {isAuthenticated &&
                      role === "student" &&
                      !courseData.hasEnrolled &&
                      Number(courseData.price) === 0 && (
                        <EnrollFreeCourse courseId={courseData.id} copy={copy} />
                      )}

                    {isAuthenticated && role === "student" && courseData.hasEnrolled && (
                      <Link
                        to={`/courses/${courseData.id}/view`}
                        className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                      >
                        {copy.watch}
                      </Link>
                    )}

                    {!isAuthenticated && (
                      <Link
                        to="/sign-in"
                        className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                      >
                        {copy.enroll}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 col-span-12 lg:col-span-5">
                <div className="max-h-96 overflow-hidden relative z-10 before:absolute before:w-full before:h-full before:top-3 lg:before:top-6 before:left-3 lg:before:left-6 before:bg-black-blue before:-z-10 before:rounded-lg before:shadow-lg">
                  <img
                    src={courseData.image || "/images/placeholder-img.webp"}
                    alt={courseData.title}
                    height="100%"
                    width="100%"
                    className="rounded-lg shadow-lg max-h-96 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="w-full lg:w-4/5 mx-auto py-10">
            <CourseContent
              courseId={courseData.id}
              hasEnrolled={courseData.hasEnrolled || false}
            />
          </div>
          <InstructorDetails instructor={courseData.teacher as ITeacher} />
          <RelatedCourses
            courseId={numericCourseId}
            subCategoryId={courseData.sub_category?.id as number}
          />
        </div>

        <Newsletter />
      </motion.section>
    </main>
  );
};

export default CourseDetails;
