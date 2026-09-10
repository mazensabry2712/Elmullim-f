import { Loader, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetCourseById } from "@/lib/react-query/courses/courses";
import EnrollFreeCourse from "@/components/courses/EnrollFreeCourse";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getCoursesCopy } from "./courseCopy";

function EnrollCourse() {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = cookieService.getToken() || undefined;
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);
  const validCourseId = Number.isInteger(numericCourseId) && numericCourseId > 0;

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

  useEffect(() => {
    document.title = `${copy.enrollmentTitle} | Elmullim`;
  }, [copy.enrollmentTitle]);

  if (!validCourseId) {
    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <p className="font-sora text-lg text-[#4D5756]">{copy.enrollmentError}</p>
          <Link to="/courses" className="inline-flex items-center gap-2 mt-5 bg-main text-white rounded-[5px] px-6 py-2">
            <ArrowLeft size={18} aria-hidden="true" />
            {copy.backToCourses}
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <div className="container py-24" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
          <span className="sr-only">{copy.loadingCourse}</span>
        </div>
      </main>
    );
  }

  if (isError || !course?.data) {
    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <p className="font-sora text-lg text-[#4D5756]">{copy.enrollmentError}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
            >
              {copy.retry}
            </button>
            <Link
              to="/courses"
              className="border border-main text-main hover:bg-main hover:text-white transition-all duration-200 rounded-[5px] font-sora text-sm px-6 py-2"
            >
              {copy.backToCourses}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const courseData = course.data;
  const isFree = Number(courseData.price) === 0;
  const canEnrollFree = isAuthenticated && cookieService.getRole() === "student" && !courseData.hasEnrolled;

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {copy.enrollmentTitle}
        </h1>
        <p
          className="font-sora font-light leading-[30px]"
          aria-label={copy.enrollmentBreadcrumb}
        >
          {copy.home} <span className="text-main">//</span> {copy.enrollmentTitle}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="enrollment-title"
      >
        <div className="container py-12 md:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <article className="rounded-[20px] shadow p-6 bg-[#F0FEFC]">
              <img
                src={courseData.image || "/images/placeholder-img.webp"}
                alt={courseData.title}
                className="w-full max-h-72 object-cover rounded-lg mb-5"
              />
              <h2 id="enrollment-title" className="text-3xl font-bold text-black-blue mb-3">
                {courseData.title}
              </h2>
              <p className="text-[#4D5756] leading-relaxed mb-5">{courseData.description}</p>
              <dl className="space-y-3 text-black-blue">
                <div className="flex justify-between gap-4"><dt className="font-semibold">{copy.coursePrice}</dt><dd>{courseData.price} L.E</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-semibold">{copy.trainerName}</dt><dd>{courseData.teacher?.name ?? "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-semibold">{copy.level}</dt><dd>{courseData.level}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-semibold">{copy.startDate}</dt><dd>{courseData.created_at ? new Date(courseData.created_at).toLocaleDateString(language) : "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-semibold">{copy.attendance}</dt><dd>{copy.online}</dd></div>
              </dl>
            </article>

            <section className="rounded-[20px] shadow p-8 bg-white" aria-live="polite">
              {courseData.hasEnrolled ? (
                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-bold text-black-blue">{copy.watch}</h3>
                  <Link
                    to={`/courses/${courseData.id}/view`}
                    className="inline-flex bg-main text-white rounded-[5px] px-6 py-3 font-sora"
                  >
                    {copy.watch}
                  </Link>
                </div>
              ) : isFree ? (
                <div className="space-y-5 text-center">
                  <h3 className="text-2xl font-bold text-black-blue">{copy.free}</h3>
                  <p className="text-[#4D5756]">{copy.freeEnrollmentPrompt}</p>
                  {canEnrollFree ? (
                    <EnrollFreeCourse courseId={courseData.id} copy={copy} />
                  ) : (
                    <Link
                      to="/sign-in"
                      className="inline-flex bg-main text-white rounded-[5px] px-6 py-3 font-sora"
                    >
                      {copy.enroll}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-5 text-center">
                  <h3 className="text-2xl font-bold text-black-blue">{copy.paymentUnavailable}</h3>
                  <p className="text-[#4D5756] leading-relaxed">{copy.paymentUnavailableDescription}</p>
                  <Link
                    to={`/courses/${courseData.id}`}
                    className="inline-flex bg-main text-white rounded-[5px] px-6 py-3 font-sora"
                  >
                    {copy.returnToCourse}
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default EnrollCourse;
