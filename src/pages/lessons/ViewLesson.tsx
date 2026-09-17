import RelatedLessons from "@/components/lessons/RelatedLessons";
import ViewLessonContent from "@/components/lessons/ViewLessonContent";
import InstructorDetails from "@/components/shared/InstructorDetails";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { ILecture } from "@/interfaces/courses/lectures";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import {
  useGetLessonById,
  useGetLessonContents,
  useGetLessonLectures,
} from "@/lib/react-query/lessons/lessons";
import { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useI18n } from "@/i18n";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getLessonsCopy } from "./lessonCopy";

const ViewLesson = () => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const token = cookieService.getToken() || "";
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const numericLessonId = Number(lessonId);
  const validLessonId = Number.isInteger(numericLessonId) && numericLessonId > 0;
  const location = useLocation();

  const { data: lesson, isLoading, isError, failureReason } = useGetLessonById({
    token,
    lessonId: numericLessonId,
  });
  const lessonFailure = failureReason as AxiosResErr | undefined;

  const { data: contents, isLoading: isLoadingContent } = useGetLessonContents(
    numericLessonId
  );
  const selectedLecture = (location.state as { lecture?: ILecture } | null)?.lecture;
  const firstContentId = contents?.data?.[0]?.id;
  const { data: lectures, isLoading: isLoadingLectures } = useGetLessonLectures({
    token,
    lessonId: numericLessonId,
    contentId: firstContentId as number,
  });
  const lecture = selectedLecture ?? lectures?.data?.[0] ?? null;

  useEffect(() => {
    document.title = `${copy.viewTitle} | Elmullim`;
  }, [copy.viewTitle]);

  useEffect(() => {
    if (!validLessonId) {
      navigate("/lessons", { replace: true });
      return;
    }

    if (lessonFailure) {
      toast.error(lessonFailure.response?.data?.message || copy.detailsError);
      navigate("/lessons", { replace: true });
      return;
    }

    if (!isLoading && isError) {
      toast.error(copy.detailsError);
      navigate("/lessons", { replace: true });
    }
  }, [validLessonId, navigate, lessonFailure, isError, isLoading, numericLessonId, copy.detailsError]);

  if (!validLessonId) return null;

  if (isLoading) {
    return (
      <main>
        <div className="container py-24" role="status" aria-live="polite">
          <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
          <span className="sr-only">{copy.loadingLesson}</span>
        </div>
      </main>
    );
  }

  if (isError || !lesson?.data) {
    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p>
          <button
            type="button"
            onClick={() => navigate(`/lessons/${numericLessonId}`)}
            className="mt-5 bg-main text-white rounded-[5px] px-6 py-2"
          >
            {copy.backToLessons}
          </button>
        </div>
      </main>
    );
  }

  const lessonData = lesson.data;

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
          {copy.viewTitle}
        </h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.viewBreadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.viewTitle}
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="view-lesson-title"
      >
        <div className="py-12 md:py-24">
          {isLoadingContent || isLoadingLectures ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
              <span className="sr-only">{copy.loadingLesson}</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row px-2 md:px-6 xl:px-12">
                <div className="flex-1">
                  <h2 id="view-lesson-title" className="pl-6 xl:pl-16 text-2xl font-bold mb-4 text-black-blue">
                    {lessonData.title}
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
                    <ViewLessonContent lessonId={numericLessonId} copy={copy} />
                  </div>
                </aside>
              </div>

              <div className="container">
                <InstructorDetails instructor={lessonData.teacher as ITeacher} />
                <RelatedLessons
                  lessonId={lessonData.id}
                  teacherId={lessonData.teacher.id}
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

export default ViewLesson;
