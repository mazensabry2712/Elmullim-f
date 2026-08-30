import RelatedCourses from "@/components/courses/RelatedCourses";
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

const ViewCourse = () => {
  const token = cookieService.getToken()!;
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading,
    failureReason,
  } = useGetCourseById({
    token,
    courseId: Number(courseId),
  });
  const courseFailure = failureReason as AxiosResErr;
  const { data: contents, isLoading: isLoadingContent } = useGetCourseContents(
    Number(courseId)
  );
  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures(
    {
      token,
      courseId: Number(courseId),
      contentId: contents?.data[0].id as number,
    }
  );
  const { lecture } = (useLocation().state as { lecture: ILecture }) || {
    lecture: lectures?.data?.[0] ?? null,
  };
  useEffect(() => {
    if (!Number(courseId)) navigate("/", { replace: true });
    if (!course?.data.hasEnrolled && !isLoading) navigate(-1);
    if (courseFailure) {
      toast.error(courseFailure.response?.data.message);
      navigate(-1);
    }
  }, [courseId, navigate, course, token, isLoading, courseFailure, lecture]);

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
          View Course
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> view course
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
                    {course?.data.title}
                  </h1>

                  <div className="flex flex-col xl:flex-row text-black-blue">
                    <div className="flex-1 px-6 lg:pl-16">
                      <div className="aspect-video w-full rounded overflow-hidden mb-6">
                        <VideoPlayer videoUrl={lecture?.videoUrl} />
                      </div>
                      <div className="my-4">
                        <h2 className="text-2xl font-bold">{lecture.title}</h2>
                        <p>{lecture.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="w-full lg:w-[30%] xl:w-1/4 p-4">
                  <h3 className="text-black-blue text-2xl capitalize font-bold mb-5">
                    Course Content
                  </h3>
                  <div className="max-h-screen overflow-y-auto">
                    <ViewCourseContent courseId={Number(courseId)} />
                  </div>
                </aside>
              </div>
              <div className="container">
                <InstructorDetails
                  instructor={course?.data.teacher as ITeacher}
                />
                <RelatedCourses
                  courseId={course?.data.id as number}
                  subCategoryId={course?.data.sub_category.id as number}
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
