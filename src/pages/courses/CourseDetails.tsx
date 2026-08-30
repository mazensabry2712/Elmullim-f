import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Users } from "lucide-react";
import CourseContent from "@/components/courses/CourseContent";
import InstructorDetails from "@/components/shared/InstructorDetails";
import RelatedCourses from "@/components/courses/RelatedCourses";
import Newsletter from "@/components/Newsletter";
import { useGetCourseById } from "@/lib/react-query/courses/courses";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AxiosResErr } from "@/types";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import EnrollFreeCourse from "@/components/courses/EnrollFreeCourse";

const CourseDetails = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const role = cookieService.getRole()!;
  const token = cookieService.getToken() || "";
  const { courseId } = useParams();
  const {
    data: course,
    isLoading,
    isError,
    failureReason,
  } = useGetCourseById({
    courseId: Number(courseId),
    ...(token && { token }),
  });
  const courseFailure = failureReason as AxiosResErr;
  const navigate = useNavigate();
  useEffect(() => {
    if (!Number(courseId)) navigate("/");
    if (isError || courseFailure) {
      navigate(-1);
      toast.error(courseFailure.response?.data.message || "please try again");
      return;
    }
  }, [isError, navigate, courseFailure, courseId]);
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
          Course Details
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> course details
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
              <div className="py-10">
                <Loader className="mx-auto animate-spin" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7 order-2 h-fit">
                  <div className="space-y-2 text-center lg:text-start mt-8 lg:mt-0">
                    <h2 className="text-black-blue font-bold text-3xl lg:text-5xl">
                      {course?.data.title}
                    </h2>
                    <p className="font-sora text-[15px] text-[#4D5756] leading-relaxed px-4">
                      {course?.data.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="font-sora text-lg font-medium flex items-center gap-2">
                        <img
                          src={
                            course?.data.teacher.profile_image ||
                            "/images/profile-avatar.webp"
                          }
                          alt={course?.data.teacher.name}
                          className="w-10 h-10 rounded-full bg-black-blue object-cover object-top shrink-0"
                        />
                        <h3>
                          By{" "}
                          <span className="text-main">
                            {course?.data.teacher.name}
                          </span>
                        </h3>
                      </div>
                      <h3 className="capitalize fon-sora text-black-blue font-medium flex items-center gap-2">
                        <Users size={18} />
                        {course?.data.level}
                      </h3>
                    </div>
                    <div>
                      {isAuthenticated &&
                        role === "student" &&
                        !course?.data.hasEnrolled &&
                        Number(course?.data.price) === 0 && (
                          <EnrollFreeCourse
                            courseId={course?.data.id as number}
                          />
                        )}

                      {isAuthenticated &&
                        role === "student" &&
                        course?.data.hasEnrolled && (
                          <Link
                            to={`/courses/${course?.data.id}/view`}
                            className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
                          >
                            Watch Now
                          </Link>
                        )}

                      {!isAuthenticated && (
                        <Link
                          to={"/login"}
                          className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
                        >
                          Enroll now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 col-span-12 lg:col-span-5">
                  <div className="max-h-96  overflow-hidden relative z-10 before:absolute before:w-full before:h-full before:top-3 lg:before:top-6 before:left-3 lg:before:left-6 before:bg-black-blue before:-z-10 before:rounded-lg before:shadow-lg">
                    <img
                      src={course?.data.image || "/images/placeholder-img.webp"}
                      alt={course?.data.title}
                      height={"100%"}
                      width={"100%"}
                      className="rounded-lg shadow-lg max-h-96"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="container py-5">
          {!isLoading && (
            <>
              <div className="w-full lg:w-4/5 mx-auto py-10">
                <CourseContent
                  courseId={course?.data.id as number}
                  hasEnrolled={course?.data.hasEnrolled || false}
                />
              </div>
              <InstructorDetails
                instructor={course?.data.teacher as ITeacher}
              />
            </>
          )}
          <RelatedCourses
            courseId={Number(courseId)}
            subCategoryId={course?.data.sub_category.id as number}
          />
        </div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default CourseDetails;
