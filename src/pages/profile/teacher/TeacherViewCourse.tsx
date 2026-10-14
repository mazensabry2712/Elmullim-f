import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import DeleteTeacherCourseAction from "@/components/profiles/teacher/courses/DeleteTeacherCourseAction";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import { Button } from "@/components/ui/button";
import TeacherViewCourseContent from "@/components/profiles/teacher/courses/TeacherViewCourseContent";
import VideoPlayer from "@/components/shared/VideoPlayer";
import type { ILecture } from "@/interfaces/courses/lectures";
import type { CoursePublishingStatus } from "@/interfaces/courses/courses";
import {
  useGetTeacherCourseById,
  useGetTeacherCourseContents,
  useGetTeacherCourseLectures,
  useGetTeacherCourseReadinessLectures,
  useSubmitTeacherCourseForReview,
} from "@/lib/react-query/teacher/courses";
import type { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookPlus,
  CheckCircle2,
  CircleAlert,
  FileText,
  FolderPlus,
  GraduationCap,
  Layers3,
  Loader2,
  PencilLine,
  Send,
  Video,
  VideoOff,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { hasRepeatedTextPattern, isDisplayableProfileText } from "@/utils/textQuality";

const TeacherViewCourse = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const locale = isArabic ? "ar-EG" : "en-US";

  const text = isArabic
    ? {
        title: "إدارة الكورس",
        home: "الرئيسية",
        myCourses: "كورساتي",
        content: "محتوى الكورس",
        contentHint: "الوحدات والمحاضرات داخل هذا الكورس",
        noContents: "لم تتم إضافة محتوى للكورس بعد.",
        noContentsHint: "ابدأ بإنشاء أول وحدة، وبعدها أضف المحاضرات داخلها.",
        noLectureSelected: "اختر محاضرة من القائمة",
        noLectureSelectedHint: "ستظهر تفاصيل المحاضرة هنا عند اختيارها من محتوى الكورس.",
        noLectureVideo: "لا يوجد فيديو لهذه المحاضرة حتى الآن",
        noLectureVideoHint: "افتح المحاضرة من القائمة لعرض خيارات رفع الفيديو.",
        loadError: "تعذر تحميل بيانات الكورس.",
        untitledCourse: "كورس بدون عنوان",
        untitledLecture: "محاضرة بدون عنوان",
        draft: "مسودة",
        pending: "قيد المراجعة",
        published: "منشور",
        rejected: "مرفوض",
        addContent: "إضافة محتوى",
        addLecture: "إضافة محاضرة",
        editCourse: "تعديل الكورس",
        editPublishedDetails: "تعديل البيانات",
        submitForReview: "إرسال للمراجعة",
        resubmitForReview: "إعادة الإرسال للمراجعة",
        resubmitting: "جارٍ الإرسال...",
        adminNote: "ملاحظة الإدارة",
        overview: "ملخص الكورس",
        units: "وحدات المحتوى",
        level: "المستوى",
        price: "السعر",
        free: "مجاني",
        category: "التصنيف",
        subCategory: "القسم",
        description: "وصف الكورس",
        lectureDetails: "تفاصيل المحاضرة",
        lectureDescription: "وصف المحاضرة",
        readyTitle: "قبل إرسال الكورس للمراجعة",
        readyHint: "راجع العناصر التالية قبل الإرسال. بيانات المحتوى والفيديوهات تظهر لك بوضوح داخل القائمة.",
        checkTitle: "عنوان الكورس",
        checkDescription: "وصف الكورس",
        checkContent: "محتوى الكورس",
        checkVideos: "فيديوهات المحاضرات",
        valid: "سليم",
        needsReview: "مراجعة مطلوبة",
        titleGood: "العنوان واضح وغير مكرر.",
        descriptionGood: "الوصف مكتمل.",
        contentGood: "كل وحدة تحتوي على محاضرة واحدة على الأقل.",
        contentMissing: "أضف وحدة واحدة على الأقل.",
        contentNeedsLectures: "أضف محاضرة واحدة على الأقل داخل كل وحدة.",
        checkingContent: "جارٍ التحقق من المحاضرات داخل كل وحدة...",
        videosReady: "تم رفع فيديو لكل المحاضرات.",
        videosNeedUpload: "ارفع فيديو لكل محاضرة قبل إرسال الكورس للمراجعة.",
        videosNeedLectures: "أضف محاضرة لكل وحدة أولًا.",
        checkingVideos: "جارٍ التحقق من فيديوهات كل المحاضرات...",
        readinessError: "تعذر التحقق من المحتوى. أعد تحميل الصفحة وحاول مرة أخرى.",
        videosHint: "راجع حالة الفيديو داخل بطاقة كل محاضرة.",
        checkVideosHint: "راجع وجود فيديو داخل بطاقة كل محاضرة.",
        titleNeedsReview: "راجع عنوان الكورس؛ يجب أن يكون واضحًا وغير مكرر.",
        titleNeedsReviewHint: "راجع التنبيه بجوار عنوان الكورس.",
        descriptionNeedsReview: "أكمل وصف الكورس بجملة واضحة لا تقل عن 20 حرفًا و3 كلمات.",
        descriptionNeedsReviewHint: "راجع التنبيه أسفل وصف الكورس.",
        reviewList: "افحص القائمة",
        contentAdded: "تمت إضافة وحدات إلى الكورس",
        addFirstContent: "أضف أول وحدة للمحتوى",
        selectedLecture: "المحاضرة المعروضة",
        videoReady: "الفيديو جاهز",
        videoMissing: "الفيديو لم يُرفع",
        loading: "جارٍ تحميل بيانات الكورس...",
      }
    : {
        title: "Course management",
        home: "Home",
        myCourses: "My courses",
        content: "Course content",
        contentHint: "Units and lectures inside this course",
        noContents: "No course content has been added yet.",
        noContentsHint: "Create your first unit, then add lectures inside it.",
        noLectureSelected: "Choose a lecture from the list",
        noLectureSelectedHint: "The selected lecture details will appear here.",
        noLectureVideo: "No video has been uploaded for this lecture yet",
        noLectureVideoHint: "Open the lecture in the list to see its video upload options.",
        loadError: "Unable to load course details.",
        untitledCourse: "Untitled course",
        untitledLecture: "Untitled lecture",
        draft: "Draft",
        pending: "Pending review",
        published: "Published",
        rejected: "Rejected",
        addContent: "Add content",
        addLecture: "Add lecture",
        editCourse: "Edit course",
        editPublishedDetails: "Edit details",
        submitForReview: "Submit for review",
        resubmitForReview: "Resubmit for review",
        resubmitting: "Submitting...",
        adminNote: "Admin review note",
        overview: "Course overview",
        units: "Content units",
        level: "Level",
        price: "Price",
        free: "Free",
        category: "Category",
        subCategory: "Subcategory",
        description: "Course description",
        lectureDetails: "Lecture details",
        lectureDescription: "Lecture description",
        readyTitle: "Before submitting for review",
        readyHint: "Review the checklist before submitting. Content and video details are shown clearly in the course outline.",
        checkTitle: "Course title",
        checkDescription: "Course description",
        checkContent: "Course content",
        checkVideos: "Lecture videos",
        valid: "Looks good",
        needsReview: "Needs review",
        titleGood: "The title is clear and not repetitive.",
        descriptionGood: "The description is complete.",
        contentGood: "Every content unit has at least one lecture.",
        contentMissing: "Add at least one content unit.",
        contentNeedsLectures: "Add at least one lecture inside every content unit.",
        checkingContent: "Checking lectures in every content unit...",
        videosReady: "Every lecture has a video.",
        videosNeedUpload: "Upload a video for every lecture before submitting the course for review.",
        videosNeedLectures: "Add at least one lecture to every unit first.",
        checkingVideos: "Checking videos for every lecture...",
        readinessError: "Unable to verify the content. Reload the page and try again.",
        videosHint: "Review video status on each lecture card.",
        checkVideosHint: "Confirm that every lecture has a video in its card.",
        titleNeedsReview: "Review the course title and use clear, non-repeated wording.",
        titleNeedsReviewHint: "See the note next to the course title.",
        descriptionNeedsReview: "Add a clear course description with at least 20 characters and 3 words.",
        descriptionNeedsReviewHint: "See the note below the course description.",
        reviewList: "Review list",
        contentAdded: "Content units have been added",
        addFirstContent: "Add the first content unit",
        selectedLecture: "Selected lecture",
        videoReady: "Video ready",
        videoMissing: "Video not uploaded",
        loading: "Loading course details...",
      };

  const { courseId } = useParams();
  const isValidCourseId = !!courseId && Number.isSafeInteger(Number(courseId)) && Number(courseId) > 0;
  const queryCourseId = isValidCourseId ? String(Number(courseId)) : "";
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    failureReason,
  } = useGetTeacherCourseById({ token, id: queryCourseId, enabled: isValidCourseId });
  const courseFailure = failureReason as AxiosResErr | undefined;
  const { mutateAsync: submitForReview, isPending: isSubmittingForReview } =
    useSubmitTeacherCourseForReview();

  const { data: contents, isLoading: isLoadingContents } =
    useGetTeacherCourseContents({ token, courseId: queryCourseId });
  const contentUnits = contents?.data ?? [];
  const readinessLectureQueries = useGetTeacherCourseReadinessLectures({
    token,
    courseId: queryCourseId,
    contents: contentUnits,
    enabled: Boolean(token && queryCourseId),
  });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherCourseLectures({
      token,
      courseId: queryCourseId,
      contentId: contents?.data?.[0]?.id.toString() || "",
    });

  const location = useLocation();
  const selectedLecture = (location.state as { lecture?: ILecture } | null)?.lecture;
  const lecture = selectedLecture ?? lectures?.data?.[0] ?? null;
  const rawCourseTitle = course?.data?.title?.trim() || "";
  const rawCourseDescription = course?.data?.description?.trim() || "";
  const rawLectureTitle = lecture?.title?.trim() || "";
  const rawLectureDescription = lecture?.description?.trim() || "";

  const courseTitleIsValid =
    isDisplayableProfileText(rawCourseTitle) && !hasRepeatedTextPattern(rawCourseTitle);
  const courseDescriptionIsValid =
    rawCourseDescription.length >= 20 &&
    isDisplayableProfileText(rawCourseDescription, 3) &&
    !hasRepeatedTextPattern(rawCourseDescription);
  const lectureTitleIsValid =
    isDisplayableProfileText(rawLectureTitle) && !hasRepeatedTextPattern(rawLectureTitle);
  const lectureDescriptionIsValid =
    !rawLectureDescription ||
    (rawLectureDescription.length >= 20 &&
      isDisplayableProfileText(rawLectureDescription, 3) &&
      !hasRepeatedTextPattern(rawLectureDescription));

  const courseStatus: CoursePublishingStatus = course?.data?.publishing_status ?? "draft";
  const canEdit = courseStatus === "draft" || courseStatus === "rejected";
  const canEditDetails = canEdit || courseStatus === "published";
  const contentCount = contentUnits.length;
  const isCheckingReadiness = isLoadingContents || readinessLectureQueries.some((query) => query.isLoading);
  const hasReadinessError = readinessLectureQueries.some((query) => query.isError);
  const everyUnitHasLectures = contentCount > 0 && contentUnits.every(
    (_content, index) => (readinessLectureQueries[index]?.data?.data?.length ?? 0) > 0
  );
  const everyLectureHasVideo = everyUnitHasLectures && readinessLectureQueries.every(
    (query) => (query.data?.data ?? []).every((item) => item.hasVideo)
  );
  const canSubmitForReview =
    courseTitleIsValid &&
    courseDescriptionIsValid &&
    everyUnitHasLectures &&
    everyLectureHasVideo &&
    !isCheckingReadiness &&
    !hasReadinessError;

  const statusLabel =
    courseStatus === "published" ? text.published :
    courseStatus === "pending_approval" ? text.pending :
    courseStatus === "rejected" ? text.rejected : text.draft;
  const statusClass =
    courseStatus === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
    courseStatus === "pending_approval" ? "border-amber-200 bg-amber-50 text-amber-800" :
    courseStatus === "rejected" ? "border-rose-200 bg-rose-50 text-rose-700" :
    "border-slate-200 bg-slate-100 text-slate-700";

  const levelLabel = (() => {
    const level = course?.data?.level;
    if (level === "beginner") return isArabic ? "مبتدئ" : "Beginner";
    if (level === "intermediate") return isArabic ? "متوسط" : "Intermediate";
    if (level === "advanced") return isArabic ? "متقدم" : "Advanced";
    if (level === "expert") return isArabic ? "خبير" : "Expert";
    return level || (isArabic ? "غير محدد" : "Not specified");
  })();

  const priceNumber = Number(course?.data?.price);
  const priceLabel =
    Number.isFinite(priceNumber)
      ? priceNumber === 0
        ? text.free
        : isArabic
          ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(priceNumber) + " جنيه"
          : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(priceNumber) + " EGP"
      : isArabic ? "غير محدد" : "Not specified";

  const categoryName =
    course?.data?.sub_category?.category?.name ||
    (isArabic ? "غير محدد" : "Uncategorized");
  const subCategoryName =
    course?.data?.sub_category?.name ||
    (isArabic ? "غير محدد" : "Not specified");

  const handleSubmitForReview = async () => {
    if (!course?.data || isSubmittingForReview) return;

    try {
      const response = await submitForReview({
        token,
        id: course.data.id.toString(),
      });

      if (!response.status) {
        toast.error(
          response.message ||
            (isArabic ? "تعذر إرسال الكورس للمراجعة" : "Unable to submit the course for review")
        );
        return;
      }

      toast.success(
        isArabic ? "تم إرسال الكورس للمراجعة" : "Course submitted for review"
      );
    } catch (error: unknown) {
      const apiMessage = (error as AxiosResErr | undefined)?.response?.data?.message;
      const message = typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error ? error.message : undefined;
      toast.error(
        message ||
          (isArabic ? "تعذر إرسال الكورس للمراجعة" : "Unable to submit the course for review")
      );
    }
  };

  useEffect(() => {
    if (!isValidCourseId) {
      navigate("/profile", { replace: true, state: { myCourses: true } });
      return;
    }
    if (!isLoading && courseFailure) {
      const message = courseFailure.response?.data?.message;
      toast.error(typeof message === "string" ? message : text.loadError);
      navigate("/profile", { replace: true, state: { myCourses: true } });
    }
  }, [courseId, isValidCourseId, navigate, isLoading, courseFailure, text.loadError]);

  if (!isValidCourseId) return null;

  if (isLoading || isLoadingContents || isLoadingLectures) {
    return (
      <main className="min-h-[55vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 text-center text-slate-500" role="status" aria-live="polite">
          <Loader2 className="h-9 w-9 animate-spin text-main" />
          <p>{text.loading}</p>
        </div>
      </main>
    );
  }

  if (!course?.data) {
    return (
      <main className="min-h-[45vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white p-6 text-center text-rose-700" role="alert">
          {text.loadError}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111c31] px-4 pb-10 pt-10 text-white md:px-6 md:pb-12 md:pt-14"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold text-white/55">
            {text.home} <span className="mx-2 text-emerald-400">/</span> {text.myCourses} <span className="mx-2 text-emerald-400">/</span> {text.title}
          </p>
          <div className="mt-5">
            <p className="text-sm font-bold text-emerald-300">{text.overview}</p>
            <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">{text.title}</h1>
          </div>
        </div>
      </motion.header>

      <div className="mx-auto -mt-5 max-w-7xl space-y-6 px-4 md:px-6">
        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="grid min-w-0 gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="relative min-h-48 bg-slate-100 lg:min-h-full">
              <img
                src={course.data.image || "/images/placeholder-img.webp"}
                alt={rawCourseTitle || text.untitledCourse}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/placeholder-img.webp";
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute bottom-3 start-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 truncate rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-extrabold text-slate-800 shadow-sm backdrop-blur">
                <BookOpen className="h-4 w-4 shrink-0 text-emerald-700" />
                <span className="truncate">{categoryName}</span>
              </span>
            </div>

            <div className="min-w-0 p-5 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">{subCategoryName}</p>
                  <h2 className="mt-2 break-words text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                    {rawCourseTitle || text.untitledCourse}
                  </h2>
                  {!courseTitleIsValid ? (
                    <p className="mt-2 flex items-start gap-2 text-xs font-semibold leading-5 text-amber-800" role="status">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{text.titleNeedsReview}</span>
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className={"inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold " + statusClass}>
                    {statusLabel}
                  </span>
                  {canEditDetails ? (
                    <Link
                      to={"/profile/my-courses/" + course.data.id + "/update"}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      aria-label={courseStatus === "published" ? text.editPublishedDetails : text.editCourse}
                    >
                      <PencilLine className="h-4 w-4" aria-hidden="true" />
                      <span>{courseStatus === "published" ? text.editPublishedDetails : text.editCourse}</span>
                    </Link>
                  ) : null}
                  {canEdit ? (
                    <DeleteTeacherCourseAction
                      id={course.data.id.toString()}
                      courseTitle={rawCourseTitle || text.untitledCourse}
                      onDeleted={() => navigate("/profile", { replace: true, state: { myCourses: true } })}
                    />
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <Layers3 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{text.units}</p>
                    <p className="mt-0.5 truncate text-lg font-black text-slate-900">{new Intl.NumberFormat(locale).format(contentCount)}</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{text.level}</p>
                    <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900">{levelLabel}</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <Wallet className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{text.price}</p>
                    <p className="mt-0.5 truncate text-sm font-black text-slate-900">{priceLabel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                  <FileText className="h-4 w-4 text-emerald-700" />
                  {text.description}
                </h3>
                {rawCourseDescription ? (
                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-slate-600">{rawCourseDescription}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">{isArabic ? "لم يُكتب وصف للكورس بعد." : "No course description has been added yet."}</p>
                )}
                {!courseDescriptionIsValid ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-6 text-amber-900" role="status">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{text.descriptionNeedsReview}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {courseStatus === "published" ? (
          <section
            className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-emerald-900 sm:px-5"
            role="status"
          >
            {isArabic
              ? "الكورس منشور. يمكنك تعديل بياناته الأساسية، لكن السعر ومحتوى المحاضرات والفيديوهات يظلون محميين حفاظًا على تجربة الطلاب المسجلين."
              : "This course is published. You can update its basic details, while the price and lecture/video content remain locked to protect enrolled students."}
          </section>
        ) : null}

        {canEdit ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-base font-black text-slate-900">{text.readyTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text.readyHint}</p>
              </div>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto">
                <CreateCourseContent courseId={course.data.id}>
                  <Button type="button" className="min-h-12 w-full rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto">
                    <FolderPlus className="h-5 w-5" aria-hidden="true" />
                    {text.addContent}
                  </Button>
                </CreateCourseContent>
                <CreateCourseLecture courseId={course.data.id}>
                  <Button type="button" className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-800 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto">
                    <BookPlus className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    {text.addLecture}
                  </Button>
                </CreateCourseLecture>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={isArabic ? "قائمة الاستعداد للمراجعة" : "Review readiness checklist"}>
              {[
                {
                  key: "title",
                  label: text.checkTitle,
                  detail: courseTitleIsValid ? text.titleGood : text.titleNeedsReviewHint,
                  passed: courseTitleIsValid,
                  icon: FileText,
                },
                {
                  key: "description",
                  label: text.checkDescription,
                  detail: courseDescriptionIsValid ? text.descriptionGood : text.descriptionNeedsReviewHint,
                  passed: courseDescriptionIsValid,
                  icon: FileText,
                },
                {
                  key: "content",
                  label: text.checkContent,
                  detail: isCheckingReadiness
                    ? text.checkingContent
                    : hasReadinessError
                      ? text.readinessError
                      : everyUnitHasLectures
                        ? text.contentGood
                        : contentCount > 0 ? text.contentNeedsLectures : text.contentMissing,
                  passed: isCheckingReadiness || hasReadinessError ? null as boolean | null : everyUnitHasLectures,
                  icon: Layers3,
                },
                {
                  key: "videos",
                  label: text.checkVideos,
                  detail: isCheckingReadiness
                    ? text.checkingVideos
                    : hasReadinessError
                      ? text.readinessError
                      : everyLectureHasVideo
                        ? text.videosReady
                        : everyUnitHasLectures ? text.videosNeedUpload : text.videosNeedLectures,
                  passed: isCheckingReadiness || hasReadinessError ? null as boolean | null : everyLectureHasVideo,
                  icon: Video,
                },
              ].map((item) => {
                const Icon = item.icon;
                const complete = item.passed === true;
                const needsReview = item.passed === false;
                return (
                  <div
                    key={item.key}
                    className={
                      "rounded-xl border p-3.5 " +
                      (complete
                        ? "border-emerald-200 bg-emerald-50/70"
                        : needsReview
                          ? "border-amber-200 bg-amber-50/70"
                          : "border-slate-200 bg-slate-50")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={"h-4 w-4 shrink-0 " + (complete ? "text-emerald-700" : needsReview ? "text-amber-700" : "text-slate-500")} aria-hidden="true" />
                      <p className="text-xs font-extrabold text-slate-800">{item.label}</p>
                    </div>
                    <p className={"mt-2 text-xs leading-5 " + (complete ? "text-emerald-800" : needsReview ? "text-amber-900" : "text-slate-600")}>
                      {item.detail}
                    </p>
                    <p className={"mt-2 text-[10px] font-black " + (complete ? "text-emerald-700" : needsReview ? "text-amber-800" : "text-slate-500")}>
                      {complete ? text.valid : needsReview ? text.needsReview : text.reviewList}
                    </p>
                  </div>
                );
              })}
            </div>

            {courseStatus === "rejected" && course.data.publishing_note ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
                <p className="font-extrabold">{text.adminNote}</p>
                <p className="mt-1 whitespace-pre-line">{course.data.publishing_note}</p>
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                {contentCount > 0 ? text.contentAdded : text.addFirstContent}
              </p>
              <Button
                type="button"
                onClick={() => void handleSubmitForReview()}
                disabled={isSubmittingForReview || !canSubmitForReview}
                className="min-h-11 w-full rounded-xl bg-[#111c31] px-5 font-bold text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
              >
                {isSubmittingForReview ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                {isSubmittingForReview
                  ? text.resubmitting
                  : courseStatus === "rejected"
                    ? text.resubmitForReview
                    : text.submitForReview}
              </Button>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center">
            {courseStatus === "published" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <CircleAlert className="h-5 w-5 shrink-0 text-amber-600" />
            )}
            <p className="text-sm font-semibold text-slate-700">
              {courseStatus === "published"
                ? (isArabic ? "الكورس منشور." : "This course is published.")
                : (isArabic ? "الكورس قيد مراجعة الإدارة حاليًا." : "This course is currently under review.")}
            </p>
          </section>
        )}

        <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{lecture ? text.lectureDetails : text.selectedLecture}</h2>
                  <p className="mt-1 text-sm text-slate-500">{lecture ? (rawLectureTitle || text.untitledLecture) : text.noLectureSelected}</p>
                </div>
                {lecture ? (
                  <span className={"inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold " + (lecture.hasVideo ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")}>
                    {lecture.hasVideo ? <CheckCircle2 className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    {lecture.hasVideo ? text.videoReady : text.videoMissing}
                  </span>
                ) : null}
              </div>

              <div className="p-3 sm:p-5">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950">
                  {lecture?.videoUrl ? (
                    <VideoPlayer videoUrl={lecture.videoUrl} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-5 text-center text-white">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                        <Video className="h-7 w-7 text-emerald-300" />
                      </span>
                      <p className="mt-4 text-base font-extrabold">
                        {lecture ? text.noLectureVideo : text.noLectureSelected}
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                        {lecture ? text.noLectureVideoHint : text.noLectureSelectedHint}
                      </p>
                    </div>
                  )}
                </div>
                {lecture ? (
                  <div className="px-1 pb-1 pt-5">
                    <h3 className="break-words text-xl font-black text-slate-900 sm:text-2xl">
                      {rawLectureTitle || text.untitledLecture}
                    </h3>
                    {rawLectureDescription ? (
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-slate-600">{rawLectureDescription}</p>
                    ) : null}
                    {!lectureTitleIsValid ? (
                      <p className="mt-2 text-xs font-semibold text-amber-700" role="status">
                        {isArabic ? "راجع عنوان المحاضرة ليكون واضحًا." : "Review the lecture title to make it clear."}
                      </p>
                    ) : null}
                    {!lectureDescriptionIsValid ? (
                      <p className="mt-2 text-xs font-semibold text-amber-700" role="status">
                        {isArabic ? "وصف المحاضرة قصير أو يحتاج إلى كلمات واضحة." : "The lecture description is short or needs clearer wording."}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{text.content}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{text.contentHint}</p>
                </div>
                <span className="inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 text-sm font-black text-emerald-800">
                  <Layers3 className="h-4 w-4" />
                  {new Intl.NumberFormat(locale).format(contentCount)}
                </span>
              </div>
            </div>
            {contentCount === 0 ? (
              <div className="px-5 py-8 text-center sm:px-6">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <BookOpen className="h-6 w-6" />
                </span>
                <p className="mt-3 font-bold text-slate-800">{text.noContents}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text.noContentsHint}</p>
                {canEdit ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                    <FolderPlus className="h-4 w-4" />
                    {text.addFirstContent}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto p-3 sm:p-4">
                <TeacherViewCourseContent
                  courseId={Number(courseId)}
                  courseStatus={courseStatus}
                />
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

export default TeacherViewCourse;
