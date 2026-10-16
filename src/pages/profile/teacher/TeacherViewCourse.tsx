import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import { Button } from "@/components/ui/button";
import TeacherCourseActions from "@/components/profiles/teacher/courses/TeacherCourseActions";
import TeacherViewCourseContent from "@/components/profiles/teacher/courses/TeacherViewCourseContent";
import type { CoursePublishingStatus } from "@/interfaces/courses/courses";
import {
  useGetTeacherCourseById,
  useGetTeacherCourseContents,
  useSubmitTeacherCourseForReview,
} from "@/lib/react-query/teacher/courses";
import type { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import {
  CircleAlert,
  FileText,
  GraduationCap,
  Layers3,
  Loader2,
  Send,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { hasRepeatedTextPattern, isDisplayableProfileText } from "@/utils/textQuality";

const TeacherViewCourse = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const locale = isArabic ? "ar-EG" : "en-US";
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isValidCourseId =
    !!courseId && Number.isSafeInteger(Number(courseId)) && Number(courseId) > 0;
  const queryCourseId = isValidCourseId ? String(Number(courseId)) : "";

  const text = isArabic
    ? {
        title: "إدارة الكورس",
        home: "الرئيسية",
        myCourses: "كورساتي",
        overview: "بيانات الكورس",
        content: "محتوى الكورس",
        contentHint: "الوحدات والمحاضرات",
        noContents: "لم تتم إضافة محتوى للكورس بعد.",
        noContentsHint: "ابدأ بإضافة وحدة، ثم أضف المحاضرات داخلها.",
        loadError: "تعذر تحميل بيانات الكورس.",
        untitledCourse: "كورس بدون عنوان",
        draft: "مسودة",
        pending: "قيد المراجعة",
        published: "منشور",
        rejected: "مرفوض",
        addContent: "إضافة محتوى",
        addLecture: "إضافة محاضرة",
        submitForReview: "إرسال للمراجعة",
        resubmitForReview: "إعادة الإرسال للمراجعة",
        resubmitting: "جارٍ الإرسال...",
        adminNote: "ملاحظة الإدارة",
        level: "المستوى",
        price: "السعر",
        free: "مجاني",
        category: "التصنيف",
        subCategory: "القسم",
        description: "وصف الكورس",
        readyTitle: "جاهز للمراجعة",
        titleNeedsReview: "راجع عنوان الكورس.",
        descriptionNeedsReview: "أكمل وصف الكورس بجملة واضحة لا تقل عن 20 حرفًا و3 كلمات.",
        contentMissing: "أضف وحدة واحدة على الأقل.",
        contentIncomplete: "أضف محاضرة واحدة على الأقل لكل وحدة.",
        videosMissing: "ارفع فيديو لكل محاضرة قبل الإرسال للمراجعة.",
        pendingHint: "الكورس قيد مراجعة الإدارة؛ التعديل والحذف غير متاحين حتى تنتهي المراجعة.",
        loading: "جارٍ تحميل بيانات الكورس...",
      }
    : {
        title: "Course management",
        home: "Home",
        myCourses: "My courses",
        overview: "Course details",
        content: "Course content",
        contentHint: "Units and lectures",
        noContents: "No course content has been added yet.",
        noContentsHint: "Add a unit first, then add lectures inside it.",
        loadError: "Unable to load course details.",
        untitledCourse: "Untitled course",
        draft: "Draft",
        pending: "Pending review",
        published: "Published",
        rejected: "Rejected",
        addContent: "Add content",
        addLecture: "Add lecture",
        submitForReview: "Submit for review",
        resubmitForReview: "Resubmit for review",
        resubmitting: "Submitting...",
        adminNote: "Admin note",
        level: "Level",
        price: "Price",
        free: "Free",
        category: "Category",
        subCategory: "Subcategory",
        description: "Course description",
        readyTitle: "Ready for review",
        titleNeedsReview: "Review the course title.",
        descriptionNeedsReview: "Add a clear description with at least 20 characters and 3 words.",
        contentMissing: "Add at least one unit.",
        contentIncomplete: "Add at least one lecture to every unit.",
        videosMissing: "Upload a video for every lecture before submitting.",
        pendingHint: "This course is under admin review. Editing and deletion stay locked until the review is complete.",
        loading: "Loading course details...",
      };

  const {
    data: course,
    isLoading,
    failureReason,
  } = useGetTeacherCourseById({
    token,
    id: queryCourseId,
    enabled: isValidCourseId,
  });
  const courseFailure = failureReason as AxiosResErr | undefined;
  const { mutateAsync: submitForReview, isPending: isSubmittingForReview } =
    useSubmitTeacherCourseForReview();
  const { data: contents, isLoading: isLoadingContents } =
    useGetTeacherCourseContents({ token, courseId: queryCourseId });
  const rawCourseTitle = course?.data?.title?.trim() || "";
  const rawCourseDescription = course?.data?.description?.trim() || "";
  const courseTitleIsValid =
    isDisplayableProfileText(rawCourseTitle) && !hasRepeatedTextPattern(rawCourseTitle);
  const courseDescriptionIsValid =
    rawCourseDescription.length >= 20 &&
    isDisplayableProfileText(rawCourseDescription, 3) &&
    !hasRepeatedTextPattern(rawCourseDescription);

  const courseStatus: CoursePublishingStatus = course?.data?.publishing_status ?? "draft";
  const canEdit = courseStatus === "draft" || courseStatus === "rejected";
  const contentCount = contents?.data?.length ?? 0;
  const reviewReadiness = course?.data?.review_readiness;

  const statusLabel =
    courseStatus === "published"
      ? text.published
      : courseStatus === "pending_approval"
        ? text.pending
        : courseStatus === "rejected"
          ? text.rejected
          : text.draft;
  const statusClass =
    courseStatus === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : courseStatus === "pending_approval"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : courseStatus === "rejected"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-slate-100 text-slate-700";

  const levelLabel = (() => {
    const level = course?.data?.level;
    if (level === "beginner") return isArabic ? "مبتدئ" : "Beginner";
    if (level === "intermediate") return isArabic ? "متوسط" : "Intermediate";
    if (level === "advanced") return isArabic ? "متقدم" : "Advanced";
    if (level === "expert") return isArabic ? "خبير" : "Expert";
    return level || (isArabic ? "غير محدد" : "Not specified");
  })();
  const priceNumber = Number(course?.data?.price);
  const priceLabel = Number.isFinite(priceNumber)
    ? priceNumber === 0
      ? text.free
      : isArabic
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(priceNumber) + " جنيه"
        : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(priceNumber) + " EGP"
    : isArabic
      ? "غير محدد"
      : "Not specified";
  const categoryName =
    course?.data?.sub_category?.category?.name ||
    (isArabic ? "غير محدد" : "Uncategorized");
  const subCategoryName =
    course?.data?.sub_category?.name ||
    (isArabic ? "غير محدد" : "Not specified");

  const reviewHint = !courseTitleIsValid
    ? text.titleNeedsReview
    : !courseDescriptionIsValid
      ? text.descriptionNeedsReview
      : reviewReadiness && !reviewReadiness.content_valid
        ? reviewReadiness.content_count === 0
          ? text.contentMissing
          : text.contentIncomplete
        : reviewReadiness && !reviewReadiness.videos_valid
          ? text.videosMissing
          : null;

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
      toast.success(isArabic ? "تم إرسال الكورس للمراجعة" : "Course submitted for review");
    } catch (error: unknown) {
      const apiMessage = (error as AxiosResErr | undefined)?.response?.data?.message;
      const message =
        typeof apiMessage === "string"
          ? apiMessage
          : error instanceof Error
            ? error.message
            : undefined;
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

  if (isLoading || isLoadingContents) {
    return (
      <main className="flex min-h-[55vh] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="flex flex-col items-center gap-3 text-center text-slate-500" role="status" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-main" />
          <p className="text-sm">{text.loading}</p>
        </div>
      </main>
    );
  }

  if (!course?.data) {
    return (
      <main className="min-h-[45vh] bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-white p-5 text-center text-rose-700" role="alert">
          {text.loadError}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-10" dir={isArabic ? "rtl" : "ltr"}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500" aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}>
            <Link to="/" className="hover:text-main">{text.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/profile" state={{ myCourses: true }} className="hover:text-main">{text.myCourses}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800">{text.title}</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{text.title}</h1>
            <span className="text-sm text-slate-500">{text.overview}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <img
              src={course.data.image || "/images/placeholder-img.webp"}
              alt={rawCourseTitle || text.untitledCourse}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/placeholder-img.webp";
              }}
              className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold " + statusClass}>
                  {statusLabel}
                </span>
                <span className="inline-flex flex-wrap items-center gap-1 text-xs text-slate-500">
                  <span>{categoryName}</span>
                  <span aria-hidden="true">/</span>
                  <span>{subCategoryName}</span>
                </span>
              </div>
              <h2 className="mt-2 break-words text-xl font-extrabold leading-7 text-slate-900 sm:text-2xl">
                {rawCourseTitle || text.untitledCourse}
              </h2>
              {!courseTitleIsValid ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700" role="status">
                  <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                  {text.titleNeedsReview}
                </p>
              ) : null}
              <div className="mt-3">
                <TeacherCourseActions
                  courseId={course.data.id.toString()}
                  courseTitle={rawCourseTitle || text.untitledCourse}
                  status={courseStatus}
                  layout="detail"
                  onDeleted={() => navigate("/profile", { replace: true, state: { myCourses: true } })}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">{text.level}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                {levelLabel}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{text.price}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Wallet className="h-4 w-4 text-slate-400" />
                {priceLabel}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{isArabic ? "وحدات المحتوى" : "Content units"}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Layers3 className="h-4 w-4 text-slate-400" />
                {new Intl.NumberFormat(locale).format(contentCount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{isArabic ? "حالة النشر" : "Publishing status"}</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{statusLabel}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="h-4 w-4 text-slate-400" />
              {text.description}
            </h3>
            <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
              {rawCourseDescription || (isArabic ? "لم يُكتب وصف للكورس بعد." : "No course description has been added yet.")}
            </p>
          </div>
        </section>

        {canEdit ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{text.readyTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isArabic ? "أضف الوحدات والمحاضرات، ثم أرسل الكورس للمراجعة." : "Add units and lectures, then submit the course for review."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <CreateCourseContent courseId={course.data.id}>
                  <Button type="button" className="min-h-10 rounded-lg bg-main px-4 font-bold text-white hover:bg-main/90">
                    {text.addContent}
                  </Button>
                </CreateCourseContent>
                <CreateCourseLecture courseId={course.data.id}>
                  <Button type="button" variant="outline" className="min-h-10 rounded-lg border-slate-300 px-4 font-bold text-slate-800 hover:bg-slate-50">
                    {text.addLecture}
                  </Button>
                </CreateCourseLecture>
                <Button
                  type="button"
                  onClick={() => void handleSubmitForReview()}
                  disabled={isSubmittingForReview || reviewReadiness?.can_submit === false}
                  className="min-h-10 rounded-lg bg-slate-900 px-4 font-bold text-white hover:bg-slate-800"
                >
                  {isSubmittingForReview ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  {isSubmittingForReview
                    ? text.resubmitting
                    : courseStatus === "rejected"
                      ? text.resubmitForReview
                      : text.submitForReview}
                </Button>
              </div>
            </div>
            {reviewHint ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800" role="status">
                <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{reviewHint}</span>
              </p>
            ) : null}
            {courseStatus === "rejected" && course.data.publishing_note ? (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-5 text-rose-800">
                <p className="font-bold">{text.adminNote}</p>
                <p className="mt-1 whitespace-pre-line">{course.data.publishing_note}</p>
              </div>
            ) : null}
          </section>
        ) : courseStatus === "pending_approval" ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {text.pendingHint}
          </p>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{text.content}</h2>
              <p className="mt-1 text-sm text-slate-500">{text.contentHint}</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
              {new Intl.NumberFormat(locale).format(contentCount)}
            </span>
          </div>
          {contentCount === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="font-bold text-slate-800">{text.noContents}</p>
              <p className="mt-1 text-sm text-slate-500">{text.noContentsHint}</p>
            </div>
          ) : (
            <div className="p-3 sm:p-4">
              <TeacherViewCourseContent courseId={Number(courseId)} courseStatus={courseStatus} />
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default TeacherViewCourse;
