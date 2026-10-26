import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Globe2,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/i18n";
import {
  getPublicTeacherCourses,
  getPublicTeacherLessons,
  getTeacherDetails,
  IPublicTeacherCourse,
} from "@/services/main";
import LessonCard from "@/components/lessons/LessonCard";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { isDisplayableProfileText } from "@/utils/textQuality";

const TeacherDetails = () => {
  const { teacherId: teacherIdParam } = useParams<{ teacherId: string }>();
  const teacherId = Number(teacherIdParam);
  const isValidTeacherId = Number.isSafeInteger(teacherId) && teacherId > 0;
  const { language } = useI18n();
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const lessonCopy = getLessonsCopy(language);

  const text = isArabic
    ? {
        title: "ملف المعلم",
        home: "الرئيسية",
        teachers: "المعلمون",
        loading: "جاري تحميل بيانات المعلم...",
        unavailable: "تعذر تحميل ملف المعلم حاليًا.",
        retry: "حاول مرة أخرى",
        back: "العودة إلى المعلمين",
        about: "نبذة عن المعلم",
        qualifications: "المؤهلات والخلفية التعليمية",
        qualification: "المؤهل",
        level: "المرحلة التعليمية",
        system: "نظام التعليم",
        country: "الدولة",
        experience: "سنوات الخبرة",
        rating: "تقييم المعلم",
        noRating: "لا توجد تقييمات بعد",
        courses: "الكورسات المنشورة",
        lessons: "الدروس المتاحة",
        noCourses: "لا توجد كورسات منشورة لهذا المعلم حاليًا.",
        noLessons: "لا توجد دروس منشورة لهذا المعلم حاليًا.",
        offeringsError: "تعذر تحميل هذا القسم. حاول مرة أخرى.",
        subjects: "التخصصات",
        teachingOptions: "طرق التدريس",
        online: "أونلاين",
        offline: "حضوري",
        private: "فردي",
        group: "جماعي",
        unknown: "غير محدد",
        years: "سنوات",
        courseCount: "كورسات",
        lessonCount: "دروس",
        ratingCount: "تقييم",
        free: "مجاني",
        price: "السعر",
        courseDetails: "تفاصيل الكورس",
        details: "عرض التفاصيل",
        begin: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم",
        expert: "متخصص",
        teachingProfile: "المعلومات العامة والتخصصات والخدمات التعليمية للمعلم",
        publicInfo: "المعلومات المعروضة هنا هي البيانات العامة التي أتاحها المعلم على المنصة.",
      }
    : {
        title: "Teacher profile",
        home: "Home",
        teachers: "Teachers",
        loading: "Loading teacher profile...",
        unavailable: "This teacher profile is unavailable right now.",
        retry: "Try again",
        back: "Back to teachers",
        about: "About the teacher",
        qualifications: "Qualifications & education",
        qualification: "Qualification",
        level: "Education level",
        system: "Education system",
        country: "Country",
        experience: "Years of experience",
        rating: "Teacher rating",
        noRating: "No ratings yet",
        courses: "Published courses",
        lessons: "Available lessons",
        noCourses: "This teacher has no published courses right now.",
        noLessons: "This teacher has no published lessons right now.",
        offeringsError: "We couldn't load this section. Please try again.",
        subjects: "Specialties",
        teachingOptions: "Teaching options",
        online: "Online",
        offline: "In person",
        private: "Private",
        group: "Group",
        unknown: "Not specified",
        years: "years",
        courseCount: "courses",
        lessonCount: "lessons",
        ratingCount: "ratings",
        free: "Free",
        price: "Price",
        courseDetails: "Course details",
        details: "View details",
        begin: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        expert: "Expert",
        teachingProfile: "Public profile, specialties and available learning options",
        publicInfo: "Only information the teacher has made public on the platform is shown here.",
      };

  const teacherQuery = useQuery({
    queryKey: ["public-teacher", "details", teacherId],
    queryFn: () => getTeacherDetails(teacherId),
    enabled: isValidTeacherId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const coursesQuery = useQuery({
    queryKey: ["public-teacher", "courses", teacherId],
    queryFn: () => getPublicTeacherCourses(teacherId),
    enabled: isValidTeacherId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const lessonsQuery = useQuery({
    queryKey: ["public-teacher", "lessons", teacherId],
    queryFn: () => getPublicTeacherLessons(teacherId),
    enabled: isValidTeacherId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const teacher = teacherQuery.data?.data;
  const courses = coursesQuery.data?.data ?? [];
  const lessons = lessonsQuery.data?.data ?? [];

  useEffect(() => {
    if (!isValidTeacherId) {
      navigate("/teachers", { replace: true });
      return;
    }
    document.title = teacher?.name
      ? `${teacher.name} | Elmullim`
      : `${text.title} | Elmullim`;
  }, [isValidTeacherId, navigate, teacher?.name, text.title]);

  if (!isValidTeacherId) return null;

  if (teacherQuery.isPending) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center" role="status" aria-live="polite">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-main/20 border-t-main" aria-hidden="true" />
          <p className="font-semibold text-black-blue/70">{text.loading}</p>
        </div>
      </main>
    );
  }

  if (teacherQuery.isError || !teacher) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="container flex flex-col items-center justify-center py-24 text-center" role="alert">
          <UserRound className="h-12 w-12 text-main/60" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-black text-black-blue">{text.unavailable}</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void teacherQuery.refetch()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-main px-5 py-2.5 font-bold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {text.retry}
            </button>
            <Link
              to="/teachers"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-main/30 px-5 py-2.5 font-bold text-main transition hover:bg-main/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {text.back}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const educationLevel = teacher.education_level;
  const educationSystem = educationLevel?.education_system;
  const country = educationSystem?.country;
  const experience = Number(teacher.experince ?? 0);
  const rating = Number(teacher.rating ?? 0);
  const hasRating = Number(teacher.rating_count ?? 0) > 0;
  const descriptionIsDisplayable = isDisplayableProfileText(teacher.description, 3);
  const qualificationIsDisplayable = isDisplayableProfileText(teacher.qualification);
  const courseTypes = Array.isArray(teacher.course_types)
    ? teacher.course_types
    : typeof teacher.course_types === "string"
      ? [teacher.course_types]
      : [];
  const subjectIds = new Set(teacher.subjects?.map((subject) => subject.id) ?? []);

  const formatCourseType = (type: string) => {
    const normalized = type.toLowerCase();
    if (normalized === "online") return text.online;
    if (normalized === "offline") return text.offline;
    if (normalized === "private") return text.private;
    if (normalized === "group") return text.group;
    return type;
  };

  const formatLevel = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized === "beginner") return text.begin;
    if (normalized === "intermediate") return text.intermediate;
    if (normalized === "advanced") return text.advanced;
    if (normalized === "expert") return text.expert;
    return level;
  };

  const handleRetryCourses = () => void coursesQuery.refetch();
  const handleRetryLessons = () => void lessonsQuery.refetch();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#21374B] pb-16 pt-10 text-white md:pb-20 md:pt-14">
        <div className="container">
          <nav aria-label={isArabic ? "مسار صفحة المعلم" : "Teacher profile breadcrumb"} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link to="/" className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">{text.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/teachers" className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">{text.teachers}</Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#FBDC0F]">{teacher.name}</span>
          </nav>

          <div className="grid items-center gap-7 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-xl md:max-w-none">
              <img
                src={teacher.profile_image || "/images/profile-avatar.webp"}
                alt={teacher.name}
                onError={(event) => { event.currentTarget.src = "/images/profile-avatar.webp"; }}
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 text-center md:text-start">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#FBDC0F]">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {text.title}
              </p>
              <h1 className="mt-4 break-words text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{teacher.name}</h1>
              {qualificationIsDisplayable ? (
                <p className="mt-3 flex items-center justify-center gap-2 text-base font-semibold text-white/80 md:justify-start">
                  <GraduationCap className="h-5 w-5 shrink-0 text-[#FBDC0F]" aria-hidden="true" />
                  {teacher.qualification}
                </p>
              ) : null}
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">{text.teachingProfile}</p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {teacher.subjects?.map((subject) => (
                  <Link
                    key={subject.id}
                    to={`/teachers?subject_id=${subject.id}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-bold text-white transition hover:border-[#FBDC0F] hover:text-[#FBDC0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDC0F]"
                  >
                    {subject.name}
                  </Link>
                ))}
              </div>
              <p className="mt-5 flex items-start justify-center gap-2 text-xs leading-6 text-white/55 md:justify-start">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                {text.publicInfo}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-8 pb-12 md:pb-16">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-black-blue/[0.07] bg-white p-4 shadow-[0_12px_34px_rgba(33,55,75,0.07)] sm:p-5">
            <div className="flex items-center gap-2 text-main">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              <span className="text-xs font-bold sm:text-sm">{text.rating}</span>
            </div>
            <p className="mt-2 text-xl font-black text-black-blue sm:text-2xl">
              {hasRating ? rating.toFixed(1) : "—"}
            </p>
            <p className="mt-1 text-xs text-black-blue/50">
              {hasRating ? `${teacher.rating_count} ${text.ratingCount}` : text.noRating}
            </p>
          </div>

          <div className="rounded-2xl border border-black-blue/[0.07] bg-white p-4 shadow-[0_12px_34px_rgba(33,55,75,0.07)] sm:p-5">
            <div className="flex items-center gap-2 text-main">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold sm:text-sm">{text.courses}</span>
            </div>
            <p className="mt-2 text-xl font-black text-black-blue sm:text-2xl">{teacher.courses_count ?? courses.length}</p>
            <p className="mt-1 text-xs text-black-blue/50">{text.courseCount}</p>
          </div>

          <div className="rounded-2xl border border-black-blue/[0.07] bg-white p-4 shadow-[0_12px_34px_rgba(33,55,75,0.07)] sm:p-5">
            <div className="flex items-center gap-2 text-main">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold sm:text-sm">{text.lessons}</span>
            </div>
            <p className="mt-2 text-xl font-black text-black-blue sm:text-2xl">{teacher.lessons_count ?? lessons.length}</p>
            <p className="mt-1 text-xs text-black-blue/50">{text.lessonCount}</p>
          </div>

          <div className="rounded-2xl border border-black-blue/[0.07] bg-white p-4 shadow-[0_12px_34px_rgba(33,55,75,0.07)] sm:p-5">
            <div className="flex items-center gap-2 text-main">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold sm:text-sm">{text.experience}</span>
            </div>
            <p className="mt-2 text-xl font-black text-black-blue sm:text-2xl">
              {Number.isFinite(experience) && experience > 0 ? experience : "—"}
            </p>
            <p className="mt-1 text-xs text-black-blue/50">{Number.isFinite(experience) && experience > 0 ? text.years : text.unknown}</p>
          </div>
        </div>
      </section>

      <div className="container space-y-12 pb-16 md:space-y-16">
        {descriptionIsDisplayable ? (
          <section aria-labelledby="teacher-about-title">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 id="teacher-about-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.about}</h2>
            </div>
            <p className="max-w-4xl whitespace-pre-line break-words rounded-2xl border border-black-blue/[0.07] bg-[#F8FAFA] p-5 text-sm leading-8 text-[#4D5756] sm:p-7 md:text-base">{teacher.description}</p>
          </section>
        ) : null}

        <section aria-labelledby="teacher-education-title">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="teacher-education-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.qualifications}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={GraduationCap} label={text.qualification} value={qualificationIsDisplayable ? teacher.qualification! : text.unknown} />
            <InfoCard icon={BookOpen} label={text.level} value={educationLevel?.name || text.unknown} />
            <InfoCard icon={Globe2} label={text.system} value={educationSystem?.name || text.unknown} />
            <InfoCard icon={MapPin} label={text.country} value={country?.name || text.unknown} />
          </div>
        </section>

        <section aria-labelledby="teacher-specialties-title">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="teacher-specialties-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.subjects}</h2>
          </div>
          {teacher.subjects?.length ? (
            <div className="flex flex-wrap gap-2.5">
              {teacher.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={`/teachers?subject_id=${subject.id}`}
                  className="inline-flex min-h-10 items-center rounded-xl border border-main/20 bg-main/[0.04] px-4 py-2 font-bold text-black-blue transition hover:border-main hover:bg-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                >
                  {subject.name}
                  <ArrowUpRight className="ms-2 h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-black-blue/55">{text.unknown}</p>
          )}
        </section>

        <section aria-labelledby="teacher-options-title">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
              <Globe2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="teacher-options-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.teachingOptions}</h2>
          </div>
          {courseTypes.length ? (
            <div className="flex flex-wrap gap-2.5">
              {courseTypes.map((type) => (
                <span key={type} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-black-blue/10 bg-white px-4 py-2 font-bold text-black-blue">
                  <CheckCircle2 className="h-4 w-4 text-main" aria-hidden="true" />
                  {formatCourseType(type)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-black-blue/55">{text.unknown}</p>
          )}
        </section>

        <section aria-labelledby="teacher-courses-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="teacher-courses-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.courses}</h2>
              <p className="mt-1 text-sm text-black-blue/55">{isArabic ? "تصفح الكورسات التي نشرها هذا المعلم" : "Explore courses published by this teacher"}</p>
            </div>
            <Link to="/courses" className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 font-bold text-main hover:bg-main/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">
              {isArabic ? "كل الكورسات" : "All courses"}
              {isArabic ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Link>
          </div>
          {coursesQuery.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label={text.courses}>
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : coursesQuery.isError ? (
            <OfferingError text={text.offeringsError} retry={handleRetryCourses} retryLabel={text.retry} />
          ) : courses.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black-blue/15 bg-[#F8FAFA] p-8 text-center text-sm text-black-blue/60" role="status">{text.noCourses}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <TeacherCourseCard
                  key={course.id}
                  course={course}
                  text={text}
                  isArabic={isArabic}
                  formatLevel={formatLevel}
                />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="teacher-lessons-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="teacher-lessons-title" className="text-2xl font-black text-black-blue md:text-3xl">{text.lessons}</h2>
              <p className="mt-1 text-sm text-black-blue/55">{isArabic ? "اكتشف الدروس المتاحة للحجز" : "Explore lessons available for booking"}</p>
            </div>
            <Link to="/lessons" className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 font-bold text-main hover:bg-main/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">
              {isArabic ? "كل الدروس" : "All lessons"}
              {isArabic ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Link>
          </div>
          {lessonsQuery.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label={text.lessons}>
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : lessonsQuery.isError ? (
            <OfferingError text={text.offeringsError} retry={handleRetryLessons} retryLabel={text.retry} />
          ) : lessons.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black-blue/15 bg-[#F8FAFA] p-8 text-center text-sm text-black-blue/60" role="status">{text.noLessons}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} copy={lessonCopy} />)}
            </div>
          )}
        </section>

        <div className="border-t border-black-blue/[0.08] pt-6">
          <Link
            to="/teachers"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-main/25 px-5 py-2.5 font-bold text-main transition hover:bg-main/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            {isArabic ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
            {text.back}
          </Link>
        </div>
      </div>
    </main>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) => (
  <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-black-blue/[0.07] bg-[#F8FAFA] p-4 sm:p-5">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-main shadow-sm">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-bold text-black-blue/50">{label}</p>
      <p className="mt-1 break-words font-bold leading-6 text-black-blue">{value}</p>
    </div>
  </div>
);

const OfferingError = ({
  text,
  retry,
  retryLabel,
}: {
  text: string;
  retry: () => void;
  retryLabel: string;
}) => (
  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center" role="alert">
    <p className="text-sm font-semibold text-black-blue">{text}</p>
    <button
      type="button"
      onClick={retry}
      className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-main px-4 py-2 font-bold text-white hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
    >
      {retryLabel}
    </button>
  </div>
);

const TeacherCourseCard = ({
  course,
  text,
  isArabic,
  formatLevel,
}: {
  course: IPublicTeacherCourse;
  text: {
    price: string;
    free: string;
    courseDetails: string;
  };
  isArabic: boolean;
  formatLevel: (level: string) => string;
}) => {
  const displayTitle = isDisplayableProfileText(course.title)
    ? course.title.trim()
    : isArabic
      ? "كورس قيد المراجعة"
      : "Course title under review";
  const displayDescription = isDisplayableProfileText(course.description, 3)
    ? course.description!.trim()
    : "";

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black-blue/[0.07] bg-white shadow-[0_12px_34px_rgba(33,55,75,0.07)] transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/courses/${course.id}`} aria-label={`${text.courseDetails}: ${displayTitle}`} className="block overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={course.image || "/images/placeholder-img.webp"}
            alt={displayTitle}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-bold text-main">{course.sub_category?.name || (isArabic ? "كورس تعليمي" : "Learning course")}</p>
        <Link to={`/courses/${course.id}`} className="mt-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">
          <h3 className="line-clamp-2 text-lg font-black leading-7 text-black-blue transition-colors group-hover:text-main">{displayTitle}</h3>
        </Link>
        {displayDescription ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4D5756]">{displayDescription}</p> : null}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-black-blue/10 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-black-blue/40">{text.price}</p>
            <p className="mt-1 truncate text-lg font-black text-main">
              {Number(course.price) === 0 ? text.free : `${course.price} ${isArabic ? "ج.م" : "EGP"}`}
            </p>
            <p className="mt-1 text-xs font-semibold text-black-blue/50">{formatLevel(course.level)}</p>
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg bg-main px-3 py-2 text-xs font-bold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            {text.details}
            {isArabic ? <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TeacherDetails;
