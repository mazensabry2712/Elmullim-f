import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import InstructorDetails from "@/components/shared/InstructorDetails";
import Newsletter from "@/components/Newsletter";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AxiosResErr } from "@/types";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import cookieService from "@/utils/cookieService";
import { useGetLessonById } from "@/lib/react-query/lessons/lessons";
import RelatedLessons from "@/components/lessons/RelatedLessons";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";
import { useI18n } from "@/i18n";
import { getLessonsCopy } from "./lessonCopy";

const LessonDetails = () => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const role = cookieService.getRole() || "";
  const token = cookieService.getToken() || "";
  const { lessonId } = useParams();
  const { data: lesson, isLoading, isError, failureReason } = useGetLessonById({
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
  const bookingEnabled = !!lessonData && (lessonData.booking_type === "private" || lessonData.booking_type === "group") && lessonData.publishing_status === "published";
  const canBook = role === "student" || role === "parent";

  const infoItems = [
    lessonData?.booking_type && { label: copy.bookingType, value: lessonData.booking_type === "private" ? copy.private : copy.group },
    lessonData?.delivery_mode && { label: copy.delivery, value: lessonData.delivery_mode === "offline" ? copy.offline : copy.online },
    lessonData?.grade && { label: copy.grade, value: lessonData.grade },
    lessonData?.duration_minutes && { label: copy.duration, value: `${lessonData.duration_minutes} ${copy.durationUnit}` },
    lessonData?.sessions_count && { label: copy.sessions, value: String(lessonData.sessions_count) },
    lessonData?.booking_type === "group" && lessonData.max_students && { label: copy.maximumStudents, value: String(lessonData.max_students) },
    lessonData?.delivery_mode === "offline" && lessonData.location && { label: copy.location, value: lessonData.location },
    lessonData?.delivery_mode === "offline" && lessonData.offline_visit_type && { label: copy.visitType, value: lessonData.offline_visit_type === "teacher_goes_to_student" ? copy.visitTeacherToStudent : copy.visitStudentToTeacher },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main>
      <motion.div initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24">
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{copy.detailTitle}</h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.detailBreadcrumb}>{copy.home} <span className="text-main">//</span> {copy.detailTitle}</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white">
        <div className="bg-[#F0F1F1] py-12 md:py-24">
          <div className="container">
            {isLoading ? (
              <div className="py-10" role="status" aria-live="polite"><Loader className="mx-auto animate-spin" size={40} aria-hidden="true" /><span className="sr-only">{copy.loading}</span></div>
            ) : !lessonData ? (
              <div className="py-10 text-center" role="alert"><p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p><Link to="/lessons" className="inline-block mt-4 bg-main hover:bg-main/90 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">{copy.backToLessons}</Link></div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7 order-2 h-fit">
                  <div className="space-y-3 text-center lg:text-start mt-8 lg:mt-0"><h2 className="text-black-blue font-bold text-3xl lg:text-5xl">{lessonData.title}</h2><p className="font-sora text-[15px] text-[#4D5756] leading-relaxed px-4">{lessonData.description}</p></div>
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                    <div className="font-sora text-lg font-medium flex items-center gap-2">
                      <img src={lessonData.teacher.profile_image || "/images/profile-avatar.webp"} alt={`${copy.teacherImageAlt}: ${lessonData.teacher.name}`} className="w-10 h-10 rounded-full bg-black-blue object-cover object-top shrink-0" />
                      <h3>{copy.by} <span className="text-main">{lessonData.teacher.name}</span></h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                      {bookingEnabled && canBook && (
                        <BookLessonDialog
                          lessonId={lessonData.id}
                          bookingType={lessonData.booking_type!}
                          deliveryMode={lessonData.delivery_mode}
                          offlineVisitType={lessonData.offline_visit_type}
                          price={lessonData.price}
                          durationMinutes={lessonData.duration_minutes ?? 60}
                          language={language}
                        />
                      )}
                      {bookingEnabled && !canBook && role !== "teacher" && (
                        <Link to="/login" className="block w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">{copy.loginToBook}</Link>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
                    {infoItems.map((item) => <div key={item.label} className="rounded-lg bg-white p-4 shadow-sm border border-gray-100"><span className="block text-sm font-semibold font-sora text-black-blue">{item.label}</span><div className="mt-1 font-sora text-[#4D5756]">{item.value}</div></div>)}
                    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100"><span className="block text-sm font-semibold font-sora text-black-blue">{copy.price}</span><div className="mt-1 font-sora text-main font-semibold">{Number(lessonData.price) === 0 ? copy.free : `${lessonData.price} ${copy.currency}`}</div></div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 col-span-12 lg:col-span-5"><div className="max-h-96 overflow-hidden relative z-10 before:absolute before:w-full before:h-full before:top-3 lg:before:top-6 before:left-3 lg:before:left-6 before:bg-black-blue before:-z-10 before:rounded-lg before:shadow-lg"><img src={lessonData.logo || "/images/placeholder-img.webp"} alt={`${copy.imageAlt}: ${lessonData.title}`} height="100%" width="100%" className="rounded-lg shadow-lg max-h-96 object-cover" /></div></div>
              </div>
            )}
          </div>
        </div>
        <div className="container py-5">{lessonData && <><InstructorDetails instructor={lessonData.teacher as ITeacher} /><RelatedLessons lessonId={Number(lessonId)} teacherId={lessonData.teacher.id} copy={copy} /></>}</div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default LessonDetails;
