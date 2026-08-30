import TeacherViewLessonContent from "@/components/profiles/teacher/lessons/TeacherViewLessonContent";
import InstructorDetails from "@/components/shared/InstructorDetails";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { ILecture } from "@/interfaces/courses/lectures";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import {
  useGetTeacherLessonById,
  useGetTeacherLessonContents,
  useGetTeacherLessonLectures,
} from "@/lib/react-query/teacher/lessons";
import { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherViewLesson = () => {
  const token = cookieService.getToken()!;
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const {
    data: lesson,
    isLoading,
    failureReason,
  } = useGetTeacherLessonById({ token, id: lessonId! });
  const lessonFailure = failureReason as AxiosResErr;
  const { data: contents, isLoading: isLoadingContent } =
    useGetTeacherLessonContents({ lessonId: lessonId!, token });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherLessonLectures({
      token,
      lessonId: lessonId!,
      contentId: contents?.data[0]?.id.toString() || "",
    });
  const { lecture } = (useLocation().state as { lecture: ILecture }) || {
    lecture: lectures?.data?.[0] ?? null,
  };
  useEffect(() => {
    if (!Number(lessonId)) navigate("/", { replace: true });
    if (lessonFailure) {
      toast.error(lessonFailure.response?.data.message);
      navigate(-1);
    }
  }, [lessonId, navigate, lesson, token, isLoading, lessonFailure, lecture]);

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
          View Lesson
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> view lesson
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="py-12 md:py-24">
          {isLoading || isLoadingContent || isLoadingLectures ? (
            <Loader size={40} className="mx-auto animate-spin" />
          ) : (
            <>
              <div className="flex flex-col lg:flex-row px-2 md:px-6 xl:px-12">
                <div className="flex-1">
                  <h1 className="pl-6 xl:pl-16 text-2xl font-bold mb-4 text-black-blue">
                    {lesson?.data?.title}
                  </h1>

                  {!contents?.data.length ? (
                    <p className="text-lg text-muted text-center">
                      No Contents
                    </p>
                  ) : (
                    <div className="flex flex-col xl:flex-row text-black-blue">
                      <div className="flex-1 px-6 lg:pl-16">
                        <div className="aspect-video w-full rounded overflow-hidden mb-6">
                          <VideoPlayer videoUrl={lecture?.videoUrl} />
                        </div>
                        <div className="my-4">
                          <h2 className="text-2xl font-bold">
                            {lecture?.title}
                          </h2>
                          <p>{lecture?.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="w-full lg:w-[30%] xl:w-1/4 p-4">
                  <h3 className="text-black-blue text-2xl capitalize font-bold mb-5">
                    Lesson Content
                  </h3>
                  <div className="max-h-screen overflow-y-auto">
                    <TeacherViewLessonContent lessonId={Number(lessonId)} />
                  </div>
                </aside>
              </div>
              <div className="container">
                <InstructorDetails
                  instructor={lesson?.data.teacher as ITeacher}
                />
              </div>
            </>
          )}
        </div>
      </motion.section>
    </main>
  );
};

export default TeacherViewLesson;
