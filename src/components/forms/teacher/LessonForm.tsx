import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllEducationLevels, useGetAllSubjects } from "@/lib/react-query/main";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import { useGetTeacherServiceAreas } from "@/lib/react-query/teacher/serviceAreas";
import { useCreateTeacherLesson, useUpdateTeacherLesson } from "@/lib/react-query/teacher/lessons";
import { ILesson } from "@/interfaces/lessons/lesson";
import { lessonSchema } from "@/validations/teacher/lessonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  UsersRound,
  Loader2,
  MapPin,
  Video,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { z } from "zod";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useI18n } from "@/i18n";

interface IProps {
  action: "create" | "update";
  lesson?: ILesson;
}

type LessonFormValues = z.infer<typeof lessonSchema>;

const inputClassName = "mt-2 border border-input bg-white text-black-blue";
const defaultTimezone = "Africa/Cairo";
const defaultAvailability = [{ day_of_week: 6, start_time: "18:00", end_time: "19:00", timezone: defaultTimezone }];

const UsersRoundIcon = () => <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-main" />;
const VideoIcon = () => <Video className="h-4 w-4" />;

const LessonForm = ({ action, lesson }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const { data: teacherProfile, isLoading: isLoadingTeacher } = useGetTeacherProfile(token);
  const { data: serviceAreas, isLoading: isLoadingServiceAreas } = useGetTeacherServiceAreas(token);
  const createMutation = useCreateTeacherLesson();
  const updateMutation = useUpdateTeacherLesson();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const teacherEducationLevel = teacherProfile?.data?.education_level;
  const educationSystemId = teacherEducationLevel?.education_system?.id?.toString() || "";
  const { data: educationLevels, isLoading: isLoadingLevels } = useGetAllEducationLevels(educationSystemId);

  const lessonAvailability = lesson?.availability?.length
    ? lesson.availability.map((slot) => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        timezone: slot.timezone || defaultTimezone,
      }))
    : defaultAvailability;

  const initialServiceAreaIds = lesson?.service_areas
    ?.filter((area) => area.is_active !== false)
    .map((area) => area.id) || [];

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    mode: "onTouched",
    defaultValues: {
      education_level_id: lesson?.education_level_id ?? undefined,
      subject_id: lesson?.subject_id ?? undefined,
      grade: lesson?.grade ?? "",
      delivery_mode: lesson?.delivery_mode ?? "online",
      booking_type: lesson?.booking_type ?? "private",
      title: lesson?.title ?? "",
      description: lesson?.description ?? "",
      duration_minutes: lesson?.duration_minutes ?? 60,
      price: Number(lesson?.price) || 0,
      sessions_count: lesson?.sessions_count ?? 1,
      meeting_url: lesson?.meeting_url ?? "",
      location: lesson?.location ?? "",
      offline_visit_type: lesson?.offline_visit_type ?? "",
      service_area_ids: initialServiceAreaIds,
      max_students: lesson?.max_students ?? "",
      availability: lessonAvailability,
    },
  });

  const { fields: availabilityFields, append, remove } = useFieldArray({ control: form.control, name: "availability" });
  const educationLevelId = form.watch("education_level_id");
  const deliveryMode = form.watch("delivery_mode");
  const bookingType = form.watch("booking_type");
  const offlineVisitType = form.watch("offline_visit_type");
  const selectedServiceAreaIds = form.watch("service_area_ids") || [];
  const watchedSubjectId = form.watch("subject_id");
  const grade = form.watch("grade");
  const title = form.watch("title");
  const description = form.watch("description");
  const price = form.watch("price");
  const meetingUrl = form.watch("meeting_url");
  const maxStudents = form.watch("max_students");
  const availabilityValues = form.watch("availability") || [];
  const location = form.watch("location");
  const profileAddress = teacherProfile?.data?.address || "";
  const profileLatitude = teacherProfile?.data?.latitude;
  const profileLongitude = teacherProfile?.data?.longitude;

  const readiness = useMemo(() => {
    const checks = [
      {
        key: "basics",
        label: label("Lesson basics", "بيانات الدرس الأساسية"),
        done: Boolean(educationLevelId && watchedSubjectId && grade?.trim()),
      },
      {
        key: "details",
        label: label("Details & price", "التفاصيل والسعر"),
        done: Boolean(title?.trim() && description?.trim() && Number(price) >= 0),
      },
      {
        key: "availability",
        label: label("Weekly availability", "المواعيد الأسبوعية"),
        done: availabilityValues.length > 0 && availabilityValues.every(
          (slot) => slot.start_time < slot.end_time
        ),
      },
      {
        key: "delivery",
        label: label("Delivery setup", "إعداد نوع الدرس"),
        done:
          deliveryMode === "online"
            ? Boolean(meetingUrl?.trim())
            : Boolean(offlineVisitType) &&
              Boolean(location?.trim()) &&
              (offlineVisitType === "student_to_teacher" || selectedServiceAreaIds.length > 0),
      },
      {
        key: "capacity",
        label: label("Capacity", "السعة"),
        done: bookingType !== "group" || Number(maxStudents) >= 1,
      },
      {
        key: "image",
        label: label("Lesson image", "صورة الدرس"),
        done: action === "update" || Boolean(file),
      },
    ];

    return checks;
  }, [
    action,
    availabilityValues,
    description,
    bookingType,
    deliveryMode,
    educationLevelId,
    file,
    location,
    maxStudents,
    meetingUrl,
    offlineVisitType,
    price,
    grade,
    title,
    watchedSubjectId,
    selectedServiceAreaIds.length,
  ]);

  const readinessCount = readiness.filter((item) => item.done).length;
  const isReady = readinessCount === readiness.length;

  const activeServiceAreas = useMemo(
    () => serviceAreas?.data?.filter((area) => area.is_active) || [],
    [serviceAreas]
  );

  const { data: subjects, isLoading: isLoadingSubjects } = useGetAllSubjects(
    educationLevelId ? String(educationLevelId) : ""
  );

  const steps = useMemo(
    () =>
      isArabic
        ? [
            "المادة والمرحلة",
            "نوع الدرس",
            "نوع الحجز",
            "تفاصيل الدرس والمواعيد",
            deliveryMode === "online" ? "أونلاين" : "حضوري",
            "السعة والإرسال",
          ]
        : [
            "Subject & Stage",
            "Delivery Mode",
            "Booking Type",
            "Lesson Details & Availability",
            deliveryMode === "online" ? "Online" : "Offline",
            "Capacity & Submit",
          ],
    [deliveryMode, isArabic]
  );

  function label(english: string, arabic: string) {
    return isArabic ? arabic : english;
  }

  const dayOptions = [
    [1, label("Monday", "الاثنين")],
    [2, label("Tuesday", "الثلاثاء")],
    [3, label("Wednesday", "الأربعاء")],
    [4, label("Thursday", "الخميس")],
    [5, label("Friday", "الجمعة")],
    [6, label("Saturday", "السبت")],
    [7, label("Sunday", "الأحد")],
  ] as const;

  useEffect(() => {
    form.reset({
      education_level_id: lesson?.education_level_id ?? teacherEducationLevel?.id,
      subject_id: lesson?.subject_id ?? undefined,
      grade: lesson?.grade ?? "",
      delivery_mode: lesson?.delivery_mode ?? "online",
      booking_type: lesson?.booking_type ?? "private",
      title: lesson?.title ?? "",
      description: lesson?.description ?? "",
      duration_minutes: lesson?.duration_minutes ?? 60,
      price: Number(lesson?.price) || 0,
      sessions_count: lesson?.sessions_count ?? 1,
      meeting_url: lesson?.meeting_url ?? "",
      location: lesson?.location ?? "",
      offline_visit_type: lesson?.offline_visit_type ?? "",
      service_area_ids: lesson?.service_areas?.filter((area) => area.is_active !== false).map((area) => area.id) || [],
      max_students: lesson?.max_students ?? "",
      availability: lesson?.availability?.length
        ? lesson.availability.map((slot) => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time.slice(0, 5),
            end_time: slot.end_time.slice(0, 5),
            timezone: slot.timezone || defaultTimezone,
          }))
        : defaultAvailability,
    });
  }, [form, lesson, teacherEducationLevel?.id]);

  useEffect(() => {
    const currentSubject = form.getValues("subject_id");
    if (currentSubject && subjects?.data && !subjects.data.some((subject) => subject.id === Number(currentSubject))) {
      form.setValue("subject_id", 0, { shouldValidate: true });
    }
  }, [form, subjects]);

  useEffect(() => {
    if (deliveryMode !== "offline" || offlineVisitType !== "teacher_to_student") {
      form.setValue("service_area_ids", [], { shouldValidate: false });
    }
  }, [deliveryMode, offlineVisitType, form]);

  useEffect(() => {
    if (
      deliveryMode === "offline" &&
      offlineVisitType === "student_to_teacher" &&
      !form.getValues("location")?.trim() &&
      profileAddress
    ) {
      form.setValue("location", profileAddress, { shouldDirty: true, shouldValidate: true });
    }
  }, [deliveryMode, offlineVisitType, profileAddress, form]);

  const error = (field: keyof LessonFormValues) => {
    const message = form.formState.errors[field]?.message;
    return message ? <p className="mt-1 text-sm text-red-600">{String(message)}</p> : null;
  };

  const toggleServiceArea = (id: number) => {
    const next = selectedServiceAreaIds.includes(id)
      ? selectedServiceAreaIds.filter((selectedId) => selectedId !== id)
      : [...selectedServiceAreaIds, id];
    form.setValue("service_area_ids", next, { shouldDirty: true, shouldValidate: true });
  };

  const goNext = async () => {
    const fields: Array<keyof LessonFormValues> =
      step === 0 ? ["education_level_id", "subject_id", "grade"] :
      step === 1 ? ["delivery_mode"] :
      step === 2 ? ["booking_type"] :
      step === 3 ? ["title", "description", "duration_minutes", "price", "sessions_count", "availability"] :
      step === 4
        ? deliveryMode === "online"
          ? ["meeting_url"]
          : ["location", "offline_visit_type", "service_area_ids"]
        : [];

    const valid = await form.trigger(fields);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async (values: LessonFormValues) => {
    try {
      if (!file && action === "create") {
        return toast.error(label("Lesson image is required", "صورة الدرس مطلوبة"));
      }

      const availabilityValues = values.availability.map((slot) => ({
        day_of_week: Number(slot.day_of_week),
        start_time: slot.start_time,
        end_time: slot.end_time,
        timezone: slot.timezone,
      }));

      const serviceAreaIds =
        values.delivery_mode === "offline" && values.offline_visit_type === "teacher_to_student"
          ? values.service_area_ids
          : [];

      const commonValues = {
        education_level_id: Number(values.education_level_id),
        subject_id: Number(values.subject_id),
        grade: values.grade,
        delivery_mode: values.delivery_mode,
        booking_type: values.booking_type,
        title: values.title,
        description: values.description,
        duration_minutes: Number(values.duration_minutes),
        price: Number(values.price),
        sessions_count: Number(values.sessions_count),
        ...(action === "create" || form.formState.dirtyFields.availability
          ? { availability: availabilityValues }
          : {}),
        ...(action === "create" || form.formState.dirtyFields.service_area_ids
          ? { service_area_ids: serviceAreaIds }
          : {}),
        ...(values.delivery_mode === "online"
          ? values.meeting_url ? { meeting_url: values.meeting_url } : {}
          : { location: values.location, offline_visit_type: values.offline_visit_type }),
        ...(values.booking_type === "group" && values.max_students !== ""
          ? { max_students: Number(values.max_students) }
          : {}),
      };

      const response = action === "create"
        ? await createMutation.mutateAsync({
            token,
            lesson: {
              ...commonValues,
              availability: availabilityValues,
              service_area_ids: serviceAreaIds,
              logo: file as File,
            },
          })
        : await updateMutation.mutateAsync({
            token,
            lesson: {
              id: lesson?.id as number,
              ...commonValues,
              ...(file ? { logo: file } : {}),
            },
          });

      if (!response.status) {
        return Swal.fire({ icon: "error", title: label("Error", "حدث خطأ"), text: response.message });
      }

      await Swal.fire({ icon: "success", title: label("Done", "تم بنجاح"), text: response.message });
      navigate("/profile");
    } catch (requestError) {
      handleResError(requestError);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <div className="sticky top-4 z-20 overflow-hidden rounded-2xl border border-black-blue/[0.07] bg-white/95 p-3 shadow-[0_12px_34px_rgba(33,55,75,0.07)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-main/10 text-main">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-main">
                  {isArabic ? "منشئ الدروس" : "Lesson builder"}
                </p>
                <p className="truncate text-sm font-black text-black-blue">
                  {steps[step]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:min-w-[220px] sm:justify-end">
            <div className="min-w-0 flex-1 sm:max-w-[150px]">
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-black-blue/45">
                <span>{isArabic ? "التقدم" : "Progress"}</span>
                <span dir="ltr">{step + 1}/{steps.length}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-main transition-all duration-300"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {steps.map((stepTitle, index) => (
              <button
                key={stepTitle}
                type="button"
                disabled={isSubmitting || index > step}
                onClick={() => setStep(index)}
                className={`inline-flex min-h-9 items-center gap-2 rounded-xl px-3 text-xs font-extrabold transition ${index === step ? "bg-main text-white shadow-sm" : index < step ? "bg-main/10 text-main" : "bg-slate-50 text-muted-foreground"}`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] text-black-blue">
                  {index + 1}
                </span>
                {stepTitle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {step === 0 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <div>
            <h2 className="text-xl font-bold text-black-blue">{label("Subject, Stage & Grade", "المادة والمرحلة والصف")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{label("Select a subject belonging to the chosen educational stage.", "اختر مادة مرتبطة بالمرحلة التعليمية المحددة.")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-black-blue">
              {label("Stage", "المرحلة")}
              <select {...form.register("education_level_id", { valueAsNumber: true })} disabled={isLoadingTeacher || isLoadingLevels} className={`${inputClassName} block h-11 w-full rounded-md px-3`}>
                <option value="">{label("Select stage", "اختر المرحلة")}</option>
                {educationLevels?.data?.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}
              </select>
              {error("education_level_id")}
            </label>
            <label className="text-sm font-medium text-black-blue">
              {label("Subject", "المادة")}
              <select {...form.register("subject_id", { valueAsNumber: true })} disabled={!educationLevelId || isLoadingSubjects} className={`${inputClassName} block h-11 w-full rounded-md px-3`}>
                <option value="">{label("Select subject", "اختر المادة")}</option>
                {subjects?.data?.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
              {error("subject_id")}
            </label>
          </div>
          <label className="block text-sm font-medium text-black-blue">
            {label("Grade", "الصف")}
            <Input {...form.register("grade")} placeholder={label("e.g. Grade 10", "مثال: الصف الأول الثانوي")} className={inputClassName} />
            {error("grade")}
          </label>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Delivery Mode", "نوع الدرس")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["online", "offline"] as const).map((mode) => (
              <label key={mode} className={`cursor-pointer rounded-lg border p-5 ${deliveryMode === mode ? "border-main bg-main/5" : "border-border"}`}>
                <input type="radio" value={mode} {...form.register("delivery_mode")} className="sr-only" />
                <span className="font-semibold text-black-blue">{mode === "online" ? "Online" : "Offline"}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{mode === "online" ? label("Live lesson through a meeting link.", "درس مباشر عبر رابط اجتماع.") : label("In-person lesson at a physical location.", "درس حضوري في مكان محدد.")}</span>
              </label>
            ))}
          </div>
          {error("delivery_mode")}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Booking Type", "نوع الحجز")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["private", "group"] as const).map((type) => (
              <label key={type} className={`cursor-pointer rounded-lg border p-5 ${bookingType === type ? "border-main bg-main/5" : "border-border"}`}>
                <input type="radio" value={type} {...form.register("booking_type")} className="sr-only" />
                <span className="font-semibold text-black-blue">{type === "private" ? label("Private", "خاص") : label("Group", "جماعي")}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{type === "private" ? label("One student per booking.", "طالب واحد لكل حجز.") : label("Multiple students can join the lesson.", "يمكن لعدة طلاب الانضمام إلى الدرس.")}</span>
              </label>
            ))}
          </div>
          {error("booking_type")}
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6 rounded-lg border bg-white p-5">
          <div>
            <h2 className="text-xl font-bold text-black-blue">{label("Lesson Details & Availability", "تفاصيل الدرس والمواعيد")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{label("Add the weekly days and time ranges when students can request this lesson.", "أضف أيام الأسبوع والفترات الزمنية التي يمكن للطلاب طلب هذا الدرس خلالها.")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-black-blue">{label("Title", "العنوان")}<Input {...form.register("title")} className={inputClassName} />{error("title")}</label>
            <label className="text-sm font-medium text-black-blue">{label("Duration (minutes)", "المدة بالدقائق")}<Input type="number" min={1} {...form.register("duration_minutes", { valueAsNumber: true })} className={inputClassName} />{error("duration_minutes")}</label>
            <label className="text-sm font-medium text-black-blue">{label("Price", "السعر")}<Input type="number" min={0} step="0.01" {...form.register("price", { valueAsNumber: true })} className={inputClassName} />{error("price")}</label>
            <label className="text-sm font-medium text-black-blue">{label("Sessions count", "عدد الحصص")}<Input type="number" min={1} {...form.register("sessions_count", { valueAsNumber: true })} className={inputClassName} />{error("sessions_count")}</label>
          </div>

          <label className="block text-sm font-medium text-black-blue">{label("Description", "الوصف")}<Textarea {...form.register("description")} rows={5} className={inputClassName} />{error("description")}</label>
          <ImageUpload title={label("Lesson image", "صورة الدرس")} file={file} setFile={setFile} />

          <div className="space-y-4 rounded-lg border border-dashed border-main/40 bg-main/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-black-blue">{label("Weekly availability", "المواعيد الأسبوعية المتاحة")}</h3>
                <p className="text-xs text-muted-foreground">{label("Times use Africa/Cairo for the current Egyptian setup.", "الأوقات تستخدم Africa/Cairo للإعداد الحالي في مصر.")}</p>
              </div>
              <button type="button" onClick={() => append({ day_of_week: 6, start_time: "18:00", end_time: "19:00", timezone: defaultTimezone })} className="inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />{label("Add slot", "إضافة موعد")}</button>
            </div>

            <div className="space-y-3">
              {availabilityFields.map((field, index) => (
                <div key={field.id} className="grid gap-3 rounded-md bg-white p-3 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
                  <label className="text-sm font-medium text-black-blue">{label("Day", "اليوم")}<select {...form.register(`availability.${index}.day_of_week`, { valueAsNumber: true })} className="mt-2 block h-11 w-full rounded-md border border-input bg-white px-3">{dayOptions.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
                  <label className="text-sm font-medium text-black-blue">{label("Start", "من")}<Input type="time" {...form.register(`availability.${index}.start_time`)} className={inputClassName} />{form.formState.errors.availability?.[index]?.start_time?.message && <p className="mt-1 text-sm text-red-600">{String(form.formState.errors.availability[index]?.start_time?.message)}</p>}</label>
                  <label className="text-sm font-medium text-black-blue">{label("End", "إلى")}<Input type="time" {...form.register(`availability.${index}.end_time`)} className={inputClassName} />{form.formState.errors.availability?.[index]?.end_time?.message && <p className="mt-1 text-sm text-red-600">{String(form.formState.errors.availability[index]?.end_time?.message)}</p>}</label>
                  <button type="button" onClick={() => remove(index)} disabled={availabilityFields.length === 1} aria-label={label("Remove slot", "حذف الموعد")} title={label("Remove slot", "حذف الموعد")} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-red-200 text-red-600 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            {error("availability")}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6 rounded-2xl border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
          {deliveryMode === "online" ? (
            <>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-extrabold text-main">
                  <VideoIcon />
                  {label("Online", "أونلاين")}
                </div>
                <h2 className="text-xl font-bold text-black-blue">
                  {label("Meeting setup", "إعداد الاجتماع")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {label(
                    "Add the live meeting URL now or later from your teaching schedule.",
                    "أدخل رابط الاجتماع الآن أو أضفه لاحقًا من جدول التدريس."
                  )}
                </p>
              </div>
              <label className="block text-sm font-medium text-black-blue">
                {label("Meeting URL", "رابط الاجتماع")}
                <Input
                  {...form.register("meeting_url")}
                  placeholder="https://..."
                  className={inputClassName}
                />
                {error("meeting_url")}
              </label>
            </>
          ) : (
            <>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-extrabold text-main">
                  <MapPin className="h-4 w-4" />
                  {label("Offline", "حضوري")}
                </div>
                <h2 className="text-xl font-bold text-black-blue">
                  {label("Location & service", "المكان ومناطق الخدمة")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {label(
                    "Choose where the lesson happens and how the visit works.",
                    "حدد مكان الدرس وطريقة الزيارة."
                  )}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-black-blue">
                    {label("Location", "المكان")}
                    <Textarea
                      {...form.register("location")}
                      rows={4}
                      className={inputClassName}
                    />
                    {error("location")}
                  </label>

                  {offlineVisitType === "student_to_teacher" && profileAddress ? (
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue("location", profileAddress, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="flex w-full items-start gap-3 rounded-2xl border border-main/15 bg-main/[0.045] p-3 text-start transition hover:border-main/30 hover:bg-main/[0.07]"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-main" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-extrabold text-main">
                          {isArabic
                            ? "استخدم موقع ملفي الشخصي"
                            : "Use my profile location"}
                        </span>
                        <span className="mt-1 block truncate text-xs text-black-blue/55">
                          {profileAddress}
                        </span>
                        {profileLatitude != null && profileLongitude != null ? (
                          <span
                            className="mt-1 block text-[10px] font-semibold text-black-blue/35"
                            dir="ltr"
                          >
                            {profileLatitude}, {profileLongitude}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ) : null}
                </div>

                <label className="block text-sm font-medium text-black-blue">
                  {label("Visit type", "طريقة الزيارة")}
                  <select
                    {...form.register("offline_visit_type")}
                    className={inputClassName + " block h-11 w-full rounded-md px-3"}
                  >
                    <option value="">
                      {label("Select visit type", "اختر طريقة الزيارة")}
                    </option>
                    <option value="teacher_to_student">
                      {label(
                        "Teacher goes to student",
                        "المعلم يذهب إلى الطالب"
                      )}
                    </option>
                    <option value="student_to_teacher">
                      {label(
                        "Student goes to teacher",
                        "الطالب يذهب إلى المعلم"
                      )}
                    </option>
                  </select>
                  {error("offline_visit_type")}
                </label>
              </div>

              {offlineVisitType === "teacher_to_student" && (
                <div className="space-y-4 rounded-2xl border border-main/20 bg-main/[0.035] p-4">
                  <div>
                    <h3 className="font-semibold text-black-blue">
                      {label("Service areas", "مناطق الخدمة")}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {label(
                        "Only students inside one of these active areas can request this lesson.",
                        "يمكن للطلاب الموجودين داخل إحدى مناطق الخدمة النشطة طلب هذا الدرس."
                      )}
                    </p>
                  </div>

                  {isLoadingServiceAreas ? (
                    <div className="rounded-xl bg-white p-4 text-sm text-muted-foreground">
                      {label(
                        "Loading service areas...",
                        "جاري تحميل مناطق الخدمة..."
                      )}
                    </div>
                  ) : activeServiceAreas.length === 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                      {label(
                        "No active service areas found. Add one from your profile first.",
                        "لا توجد مناطق خدمة نشطة. أضف منطقة خدمة من ملفك الشخصي أولًا."
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {activeServiceAreas.map((area) => {
                        const checked = selectedServiceAreaIds.includes(area.id);
                        return (
                          <label
                            key={area.id}
                            className={
                              "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 " +
                              (checked
                                ? "border-main ring-1 ring-main/30"
                                : "border-black-blue/[0.08]")
                            }
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleServiceArea(area.id)}
                              className="mt-1 h-4 w-4 accent-main"
                            />
                            <span className="min-w-0">
                              <span className="block break-words font-semibold text-black-blue">
                                {area.name}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {label("Radius", "نطاق")}: {area.radius_km} km
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {error("service_area_ids")}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {step === 5 && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-main/15 bg-gradient-to-br from-main/[0.06] via-white to-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-black-blue">
                    {label("Ready to submit?", "هل الدرس جاهز للإرسال؟")}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-black-blue/55">
                    {label(
                      "We check the lesson before sending it for approval, so you can fix missing details now.",
                      "نراجع الدرس قبل إرساله للمراجعة حتى تعرف أي بيانات ناقصة قبل الإرسال."
                    )}
                  </p>
                </div>
              </div>
              <div className={`shrink-0 rounded-2xl px-4 py-3 ${isReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <p className="text-[10px] font-extrabold uppercase tracking-wide opacity-70">
                  {label("Readiness", "الجاهزية")}
                </p>
                <p className="mt-1 text-2xl font-black" dir="ltr">
                  {readinessCount}/{readiness.length}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {readiness.map((item) => (
                <div key={item.key} className="flex min-w-0 items-start gap-3 rounded-xl border border-black-blue/[0.06] bg-white px-3 py-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  )}
                  <span className={item.done ? "text-xs font-bold text-black-blue/65" : "text-xs font-bold text-black-blue"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {bookingType === "group" ? (
            <label className="block rounded-2xl border border-black-blue/[0.07] bg-white p-5 text-sm font-bold text-black-blue">
              {label("Maximum students", "الحد الأقصى للطلاب")}
              <Input type="number" min={1} {...form.register("max_students")} className={inputClassName} />
              {error("max_students")}
            </label>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-black-blue/[0.07] bg-[#FBFDFC] p-5 text-sm text-black-blue/60">
              <UsersRoundIcon />
              <span>{label("Private lessons do not need group capacity.", "الدروس الخاصة لا تحتاج إلى سعة جماعية.")}</span>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || isSubmitting}>{label("Back", "رجوع")}</Button>
        {step < steps.length - 1 ? <Button type="button" onClick={goNext} disabled={isSubmitting}>{label("Next", "التالي")}</Button> : <Button type="submit" disabled={isSubmitting || !isReady}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{action === "create" ? label("Create Lesson", "إنشاء الدرس") : label("Update Lesson", "تحديث الدرس")}</Button>}
      </div>
    </form>
  );
};

export default LessonForm;
