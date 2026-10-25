import RelatedCourses from "@/components/courses/RelatedCourses";
import CourseTeacherRating from "@/components/ratings/CourseTeacherRating";
import ViewCourseContent from "@/components/courses/ViewCourseContent";
import InstructorDetails from "@/components/shared/InstructorDetails";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { ILecture } from "@/interfaces/courses/lectures";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import {
  useGetCourseById,
  useGetCourseContents,
  useGetCourseLectures,
} from "@/lib/react-query/courses/courses";
import { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { getCoursesCopy } from "./courseCopy";

const ViewCourse = () => {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const numericCourseId = Number(courseId);
  const validCourseId = Number.isInteger(numericCourseId) && numericCourseId > 0;
  const location = useLocation();

  const { data: course, isLoading, isFetching, isError, failureReason } = useGetCourseById({
    token,
    courseId: numericCourseId,
  });
  const courseFailure = failureReason as AxiosResErr | undefined;

  const { data: contents, isLoading: isLoadingContent } = useGetCourseContents(
    numericCourseId
  );
  const selectedLecture = (location.state as { lecture?: ILecture } | null)?.lecture;
  const firstContentId = contents?.data?.[0]?.id;
  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures({
    token,
    courseId: numericCourseId,
    contentId: firstContentId as number,
    enabled: !!course?.data?.hasEnrolled,
  });
  const lecture = selectedLecture ?? lectures?.data?.[0] ?? null;

  useEffect(() => {
    document.title = `${copy.watch} | Elmullim`;
  }, [copy.watch]);

  useEffect(() => {
    if (!validCourseId) {
      navigate("/courses", { replace: true });
      return;
    }

    if (!isFetching && courseFailure) {
      toast.error(courseFailure.response?.data?.message || copy.detailsError);
      navigate("/courses", { replace: true });
      return;
    }

    if (!isLoading && !isFetching && isError) {
      toast.error(copy.detailsError);
      navigate("/courses", { replace: true });
      return;
    }

    if (!isLoading && !isFetching && course?.data && !course.data.hasEnrolled) {
      navigate(`/courses/${numericCourseId}`, { replace: true });
    }
  }, [validCourseId, navigate, courseFailure, isError, isLoading, isFetching, course, numericCourseId, copy.detailsError]);

  if (!validCourseId) return null;

  if (isLoading || isFetching) {
    return (
      <main>
        <div className="container py-24" role="status" aria-live="polite">
          <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
          <span className="sr-only">{copy.loadingCourse}</span>
        </div>
      </main>
    );
  }

  if (isError || !course?.data || !course.data.hasEnrolled) {
    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p>
          <button
            type="button"
            onClick={() => navigate(`/courses/${numericCourseId}`)}
            className="mt-5 bg-main text-white rounded-[5px] px-6 py-2"
          >
            {copy.backToCourses}
          </button>
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
        className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {copy.watch}
        </h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.detailBreadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.watch}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="view-course-title"
      >
        <div className="py-12 md:py-24">
          {isLoadingContent || isLoadingLectures ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
              <span className="sr-only">{copy.loadingCourse}</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row px-2 md:px-6 xl:px-12">
                <div className="flex-1">
                  <h2 id="view-course-title" className="pl-6 xl:pl-16 text-2xl font-bold mb-4 text-black-blue">
                    {courseData.title}
                  </h2>
                  <div className="flex flex-col xl:flex-row text-black-blue">
                    <div className="flex-1 px-6 lg:pl-16">
                      <div className="aspect-video w-full rounded overflow-hidden mb-6">
                        <VideoPlayer videoUrl={lecture?.videoUrl || ""} />
                      </div>
                      {lecture ? (
                        <div className="my-4">
                          <h3 className="text-2xl font-bold">{lecture.title}</h3>
                          <p>{lecture.description}</p>
                        </div>
                      ) : (
                        <p className="my-4 text-center text-muted" role="status">{copy.noLectures}</p>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="w-full lg:w-[30%] xl:w-1/4 p-4" aria-label={copy.content}>
                  <h3 className="text-black-blue text-2xl font-bold mb-5">{copy.content}</h3>
                  <div className="max-h-screen overflow-y-auto">
                    <ViewCourseContent courseId={numericCourseId} copy={copy} />
                  </div>
                </aside>
              </div>

              <div className="container">
                {role === "student" && courseData.hasEnrolled && (
                  <CourseTeacherRating courseId={courseData.id} token={token} />
                )}
                <InstructorDetails instructor={courseData.teacher as ITeacher} />
                <RelatedCourses
                  courseId={courseData.id}
                  subCategoryId={courseData.sub_category?.id as number}
                  copy={copy}
                />
              </div>
            </>
          )}
        </div>
      </motion.section>
    </main>
  );
};

export default ViewCourse;
