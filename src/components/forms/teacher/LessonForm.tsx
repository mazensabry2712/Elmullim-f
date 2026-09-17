import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllEducationLevels, useGetAllSubjects } from "@/lib/react-query/main";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import { useCreateTeacherLesson, useUpdateTeacherLesson } from "@/lib/react-query/teacher/lessons";
import { ILesson } from "@/interfaces/lessons/lesson";
import { lessonSchema } from "@/validations/teacher/lessonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
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

const LessonForm = ({ action, lesson }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const { data: teacherProfile, isLoading: isLoadingTeacher } = useGetTeacherProfile(token);
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
      max_students: lesson?.max_students ?? "",
      availability: lessonAvailability,
    },
  });

  const { fields: availabilityFields, append, remove } = useFieldArray({ control: form.control, name: "availability" });
  const educationLevelId = form.watch("education_level_id");
  const deliveryMode = form.watch("delivery_mode");
  const bookingType = form.watch("booking_type");

  const { data: subjects, isLoading: isLoadingSubjects } = useGetAllSubjects(
    educationLevelId ? String(educationLevelId) : ""
  );

  const steps = useMemo(
    () => (isArabic
      ? ["المادة والمرحلة", "نوع الدرس", "نوع الحجز", "تفاصيل الدرس والمواعيد", "Online", "Offline", "السعة والنشر"]
      : ["Subject & Stage", "Delivery Mode", "Booking Type", "Lesson Details & Availability", "Online", "Offline", "Capacity & Publish"]),
    [isArabic]
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

  const error = (field: keyof LessonFormValues) => {
    const message = form.formState.errors[field]?.message;
    return message ? <p className="mt-1 text-sm text-red-600">{String(message)}</p> : null;
  };

  const goNext = async () => {
    const fields: Array<keyof LessonFormValues> =
      step === 0 ? ["education_level_id", "subject_id", "grade"] :
      step === 1 ? ["delivery_mode"] :
      step === 2 ? ["booking_type"] :
      step === 3 ? ["title", "description", "duration_minutes", "price", "sessions_count", "availability"] :
      step === 4 ? ["meeting_url"] :
      step === 5 ? ["location", "offline_visit_type"] : ["max_students"];

    const valid = await form.trigger(fields);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async (values: LessonFormValues) => {
    try {
      if (!file && action === "create") {
        return toast.error(label("Lesson image is required", "صورة الدرس مطلوبة"));
      }

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
        availability: values.availability.map((slot) => ({
          day_of_week: Number(slot.day_of_week),
          start_time: slot.start_time,
          end_time: slot.end_time,
          timezone: slot.timezone,
        })),
        ...(values.delivery_mode === "online"
          ? values.meeting_url ? { meeting_url: values.meeting_url } : {}
          : { location: values.location, offline_visit_type: values.offline_visit_type }),
        ...(values.booking_type === "group" && values.max_students !== ""
          ? { max_students: Number(values.max_students) } : {}),
      };

      const response = action === "create"
        ? await createMutation.mutateAsync({ token, lesson: { ...commonValues, logo: file as File } })
        : await updateMutation.mutateAsync({
            token,
            lesson: { id: lesson?.id as number, ...commonValues, ...(file ? { logo: file } : {}) },
          });

      if (!response.status) {
        return Swal.fire({ icon: "error", title: label("Error", "حدث خطأ"), text: response.message });
      }

      await Swal.fire({ icon: "success", title: label("Done", "تم بنجاح"), text: response.message });
      navigate("/profile", { state: { myLessons: true } });
    } catch (requestError) {
      handleResError(requestError);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <div className="rounded-lg bg-muted/30 p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {steps.map((stepTitle, index) => (
            <button key={stepTitle} type="button" disabled={isSubmitting || index > step} onClick={() => setStep(index)} className={`rounded-md px-2 py-3 text-xs font-semibold md:text-sm ${index === step ? "bg-main text-white" : index < step ? "bg-main/10 text-main" : "bg-white text-muted-foreground"}`}>
              <span className="block text-[10px]">{index + 1}</span>{stepTitle}
            </button>
          ))}
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
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">Online</h2>
          <p className="text-sm text-muted-foreground">{label("Provide the live meeting URL. Availability is configured in the previous step.", "أدخل رابط الاجتماع المباشر. المواعيد متاحة ومحددة في الخطوة السابقة.")}</p>
          <label className="block text-sm font-medium text-black-blue">Meeting URL<Input {...form.register("meeting_url")} placeholder="https://..." className={inputClassName} />{error("meeting_url")}</label>
        </section>
      )}

      {step === 5 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">Offline</h2>
          <p className="text-sm text-muted-foreground">{label("The current backend stores the lesson location and visit type. Service areas will be added through the Service Areas domain.", "الباك إند الحالي يخزن مكان الدرس ونوع الزيارة. سيتم إضافة مناطق الخدمة من خلال نطاق مناطق الخدمة.")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-black-blue">{label("Location", "المكان")}<Textarea {...form.register("location")} rows={4} className={inputClassName} />{error("location")}</label>
            <label className="text-sm font-medium text-black-blue">{label("Visit type", "نوع الزيارة")}<Input {...form.register("offline_visit_type")} placeholder={label("teacher_goes_to_student / student_goes_to_teacher", "المعلم يذهب للطالب / الطالب يذهب للمعلم")} className={inputClassName} />{error("offline_visit_type")}</label>
          </div>
        </section>
      )}

      {step === 6 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Capacity & Publish", "السعة والنشر")}</h2>
          {bookingType === "group" ? <label className="block text-sm font-medium text-black-blue">{label("Maximum students", "الحد الأقصى للطلاب")}<Input type="number" min={1} {...form.register("max_students")} className={inputClassName} />{error("max_students")}</label> : <p className="rounded-md bg-muted/40 p-4 text-sm text-muted-foreground">{label("Private lessons do not need group capacity.", "الدروس الخاصة لا تحتاج إلى سعة جماعية.")}</p>}
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || isSubmitting}>{label("Back", "رجوع")}</Button>
        {step < steps.length - 1 ? <Button type="button" onClick={goNext} disabled={isSubmitting}>{label("Next", "التالي")}</Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{action === "create" ? label("Create Lesson", "إنشاء الدرس") : label("Update Lesson", "تحديث الدرس")}</Button>}
      </div>
    </form>
  );
};

export default LessonForm;
