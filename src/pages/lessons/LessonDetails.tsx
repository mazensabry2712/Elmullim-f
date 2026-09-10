import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import InstructorDetails from "@/components/shared/InstructorDetails";
import Newsletter from "@/components/Newsletter";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AxiosResErr } from "@/types";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { useGetLessonById } from "@/lib/react-query/lessons/lessons";
import LessonContent from "@/components/lessons/LessonContent";
import RelatedLessons from "@/components/lessons/RelatedLessons";
import EnrollFreeLesson from "@/components/lessons/EnrollFreeLesson";
import { useI18n } from "@/i18n";
import { getLessonsCopy } from "./lessonCopy";

const LessonDetails = () => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const role = cookieService.getRole() || "";
  const token = cookieService.getToken() || "";
  const { lessonId } = useParams();
  const {
    data: lesson,
    isLoading,
    isError,
    failureReason,
  } = useGetLessonById({
    lessonId: Number(lessonId),
    ...(token && { token }),
  });
  const lessonFailure = failureReason as AxiosResErr;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${copy.detailTitle} | Elmullim`;

    if (!Number(lessonId)) {
      navigate("/lessons", { replace: true });
      return;
    }

    if (isError || lessonFailure) {
      toast.error(lessonFailure?.response?.data?.message || copy.detailsError);
      navigate("/lessons", { replace: true });
    }
  }, [copy.detailTitle, copy.detailsError, navigate, lessonFailure, isError, lessonId]);

  const lessonData = lesson?.data;

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{copy.detailTitle}</h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.detailBreadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.detailTitle}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="bg-[#F0F1F1] py-12 md:py-24">
          <div className="container">
            {isLoading ? (
              <div className="py-10" role="status" aria-live="polite">
                <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
                <span className="sr-only">{copy.loading}</span>
              </div>
            ) : !lessonData ? (
              <div className="py-10 text-center" role="alert">
                <p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p>
                <Link
                  to="/lessons"
                  className="inline-block mt-4 bg-main hover:bg-main/90 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                >
                  {copy.backToLessons}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7 order-2 h-fit">
                  <div className="space-y-2 text-center lg:text-start mt-8 lg:mt-0">
                    <h2 className="text-black-blue font-bold text-3xl lg:text-5xl">{lessonData.title}</h2>
                    <p className="font-sora text-[15px] text-[#4D5756] leading-relaxed px-4">{lessonData.description}</p>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                    <div className="font-sora text-lg font-medium flex items-center gap-2">
                      <img
                        src={lessonData.teacher.profile_image || "/images/profile-avatar.webp"}
                        alt={`${copy.teacherImageAlt}: ${lessonData.teacher.name}`}
                        className="w-10 h-10 rounded-full bg-black-blue object-cover object-top shrink-0"
                      />
                      <h3>
                        {copy.by} <span className="text-main">{lessonData.teacher.name}</span>
                      </h3>
                    </div>

                    <div>
                      {isAuthenticated && role === "student" && !lessonData.hasEnrolled && Number(lessonData.price) === 0 && (
                        <EnrollFreeLesson lessonId={lessonData.id} copy={copy} />
                      )}

                      {isAuthenticated && role === "student" && lessonData.hasEnrolled && (
                        <Link
                          to={`/lessons/${lessonData.id}/view`}
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
                      src={lessonData.logo || "/images/placeholder-img.webp"}
                      alt={`${copy.imageAlt}: ${lessonData.title}`}
                      height="100%"
                      width="100%"
                      className="rounded-lg shadow-lg max-h-96 object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container py-5">
          {lessonData && (
            <>
              <div className="w-full lg:w-4/5 mx-auto py-10">
                <LessonContent lessonId={lessonData.id} hasEnrolled={lessonData.hasEnrolled || false} />
              </div>
              <InstructorDetails instructor={lessonData.teacher as ITeacher} />
              <RelatedLessons lessonId={Number(lessonId)} teacherId={lessonData.teacher.id} />
            </>
          )}
        </div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default LessonDetails;
