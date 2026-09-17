import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllEducationLevels, useGetAllSubjects } from "@/lib/react-query/main";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import {
  useCreateTeacherLesson,
  useUpdateTeacherLesson,
} from "@/lib/react-query/teacher/lessons";
import { ILesson } from "@/interfaces/lessons/lesson";
import { lessonSchema } from "@/validations/teacher/lessonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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

const stepFields: Array<keyof LessonFormValues>[] = [
  ["education_level_id", "subject_id", "grade"],
  ["delivery_mode"],
  ["booking_type"],
  ["title", "description", "duration_minutes", "price", "sessions_count"],
  ["meeting_url"],
  ["location", "offline_visit_type"],
  ["max_students"],
];

const inputClassName = "mt-2 border border-input bg-white text-black-blue";

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
  const { data: educationLevels, isLoading: isLoadingLevels } =
    useGetAllEducationLevels(educationSystemId);

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
    },
  });

  const educationLevelId = form.watch("education_level_id");
  const deliveryMode = form.watch("delivery_mode");
  const bookingType = form.watch("booking_type");

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
            "تفاصيل الدرس",
            "Online",
            "Offline",
            "السعة والنشر",
          ]
        : [
            "Subject & Stage",
            "Delivery Mode",
            "Booking Type",
            "Lesson Details",
            "Online",
            "Offline",
            "Capacity & Publish",
          ],
    [isArabic]
  );

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
    });
  }, [form, lesson, teacherEducationLevel?.id]);

  useEffect(() => {
    const currentSubject = form.getValues("subject_id");
    if (
      currentSubject &&
      subjects?.data &&
      !subjects.data.some((subject) => subject.id === Number(currentSubject))
    ) {
      form.setValue("subject_id", undefined, { shouldValidate: true });
    }
  }, [form, subjects]);

  const label = (english: string, arabic: string) => (isArabic ? arabic : english);

  const error = (field: keyof LessonFormValues) => {
    const message = form.formState.errors[field]?.message;
    return message ? <p className="mt-1 text-sm text-red-600">{String(message)}</p> : null;
  };

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step]);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async (values: LessonFormValues) => {
    if (step < steps.length - 1) {
      await goNext();
      return;
    }

    const valid = await form.trigger();
    if (!valid) return;

    if (action === "create" && !file) {
      toast.error(label("Lesson picture is required", "صورة الدرس مطلوبة"));
      return;
    }

    const lessonPayload = {
      education_level_id: Number(values.education_level_id),
      subject_id: Number(values.subject_id),
      grade: values.grade.trim(),
      delivery_mode: values.delivery_mode,
      booking_type: values.booking_type,
      title: values.title.trim(),
      description: values.description.trim(),
      duration_minutes: Number(values.duration_minutes),
      price: Number(values.price),
      sessions_count: Number(values.sessions_count),
      meeting_url: values.delivery_mode === "online" ? values.meeting_url.trim() : undefined,
      location: values.delivery_mode === "offline" ? values.location.trim() : undefined,
      offline_visit_type:
        values.delivery_mode === "offline" ? values.offline_visit_type.trim() : undefined,
      max_students:
        values.booking_type === "group" && values.max_students !== ""
          ? Number(values.max_students)
          : undefined,
    };

    try {
      const response =
        action === "create"
          ? await createMutation.mutateAsync({
              token,
              lesson: { ...lessonPayload, logo: file as File },
            })
          : await updateMutation.mutateAsync({
              token,
              lesson: {
                ...lessonPayload,
                id: lesson?.id as number,
                logo: file || undefined,
              },
            });

      if (!response.status) {
        await Swal.fire({
          icon: "error",
          title: label("Oops...", "حدث خطأ"),
          text: response.message,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: label("Done", "تم بنجاح"),
        text: response.message,
      });

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
            <button
              key={stepTitle}
              type="button"
              disabled={isSubmitting || index > step}
              onClick={() => setStep(index)}
              className={`rounded-md px-2 py-3 text-xs font-semibold md:text-sm ${
                index === step
                  ? "bg-main text-white"
                  : index < step
                    ? "bg-main/10 text-main"
                    : "bg-white text-muted-foreground"
              }`}
            >
              <span className="block text-[10px]">{index + 1}</span>
              {stepTitle}
            </button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <div>
            <h2 className="text-xl font-bold text-black-blue">
              {label("Subject, Stage & Grade", "المادة والمرحلة والصف")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {label("Select a subject belonging to the chosen educational stage.", "اختر مادة مرتبطة بالمرحلة التعليمية المحددة.")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-black-blue">
              {label("Stage", "المرحلة")}
              <select
                {...form.register("education_level_id", { valueAsNumber: true })}
                disabled={isLoadingTeacher || isLoadingLevels}
                className={`${inputClassName} block h-11 w-full rounded-md px-3`}
              >
                <option value="">{label("Select stage", "اختر المرحلة")}</option>
                {educationLevels?.data?.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
              {error("education_level_id")}
            </label>

            <label className="text-sm font-medium text-black-blue">
              {label("Subject", "المادة")}
              <select
                {...form.register("subject_id", { valueAsNumber: true })}
                disabled={!educationLevelId || isLoadingSubjects}
                className={`${inputClassName} block h-11 w-full rounded-md px-3`}
              >
                <option value="">{label("Select subject", "اختر المادة")}</option>
                {subjects?.data?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {error("subject_id")}
            </label>
          </div>

          <label className="block text-sm font-medium text-black-blue">
            {label("Grade", "الصف")}
            <Input
              {...form.register("grade")}
              placeholder={label("e.g. Grade 10", "مثال: الصف الأول الثانوي")}
              className={inputClassName}
            />
            {error("grade")}
          </label>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Delivery Mode", "نوع الدرس")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["online", "offline"] as const).map((mode) => (
              <label
                key={mode}
                className={`cursor-pointer rounded-lg border p-5 ${deliveryMode === mode ? "border-main bg-main/5" : "border-border"}`}
              >
                <input type="radio" value={mode} {...form.register("delivery_mode")} className="sr-only" />
                <span className="font-semibold text-black-blue">{mode === "online" ? "Online" : "Offline"}</span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {mode === "online"
                    ? label("Live lesson through a meeting link.", "درس مباشر عبر رابط اجتماع.")
                    : label("In-person lesson at a physical location.", "درس حضوري في مكان محدد.")}
                </span>
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
              <label
                key={type}
                className={`cursor-pointer rounded-lg border p-5 ${bookingType === type ? "border-main bg-main/5" : "border-border"}`}
              >
                <input type="radio" value={type} {...form.register("booking_type")} className="sr-only" />
                <span className="font-semibold text-black-blue">
                  {type === "private" ? label("Private", "خصوصي") : label("Group", "جماعي")}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {type === "private"
                    ? label("One teacher + one student.", "مدرس + طالب واحد.")
                    : label("Multiple students can book available seats.", "عدة طلاب يمكنهم حجز المقاعد المتاحة.")}
                </span>
              </label>
            ))}
          </div>
          {error("booking_type")}
        </section>
      )}

      {step === 3 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Lesson Details", "تفاصيل الدرس")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-black-blue md:col-span-2">
              {label("Title", "العنوان")}
              <Input {...form.register("title")} className={inputClassName} />
              {error("title")}
            </label>
            <label className="text-sm font-medium text-black-blue md:col-span-2">
              {label("Description", "الوصف")}
              <Textarea {...form.register("description")} className="mt-2 min-h-32" />
              {error("description")}
            </label>
            <label className="text-sm font-medium text-black-blue">
              {label("Duration (minutes)", "مدة الحصة بالدقائق")}
              <Input type="number" min={1} {...form.register("duration_minutes", { valueAsNumber: true })} className={inputClassName} />
              {error("duration_minutes")}
            </label>
            <label className="text-sm font-medium text-black-blue">
              {label("Price", "السعر")}
              <Input type="number" min={0} step="0.01" {...form.register("price", { valueAsNumber: true })} className={inputClassName} />
              {error("price")}
            </label>
            <label className="text-sm font-medium text-black-blue">
              {label("Sessions Count", "عدد الحصص")}
              <Input type="number" min={1} {...form.register("sessions_count", { valueAsNumber: true })} className={inputClassName} />
              {error("sessions_count")}
            </label>
          </div>
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            {label(
              "Days and available times need the separate availability/calendar domain; they are not stored as fake Lesson fields.",
              "الأيام والمواعيد المتاحة تحتاج Availability/Calendar domain مستقل، ولن يتم تخزينها كحقول وهمية داخل Lesson."
            )}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Online Meeting", "الرابط الإلكتروني")}</h2>
          <p className="text-sm text-muted-foreground">
            {label("Add the meeting link, or leave it empty when the platform will provide it later.", "أضف رابط الاجتماع، أو اتركه فارغًا إذا كانت المنصة ستوفره لاحقًا.")}
          </p>
          <label className="text-sm font-medium text-black-blue">
            {label("Meeting URL", "رابط الاجتماع")}
            <Input type="url" {...form.register("meeting_url")} disabled={deliveryMode !== "online"} placeholder="https://..." className={inputClassName} />
            {error("meeting_url")}
          </label>
        </section>
      )}

      {step === 5 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Offline Details", "تفاصيل الدرس الحضوري")}</h2>
          <label className="text-sm font-medium text-black-blue">
            {label("Location", "مكان الدرس")}
            <Input {...form.register("location")} disabled={deliveryMode !== "offline"} className={inputClassName} />
            {error("location")}
          </label>
          <label className="text-sm font-medium text-black-blue">
            {label("Visit Direction", "طريقة الحضور")}
            <select {...form.register("offline_visit_type")} disabled={deliveryMode !== "offline"} className={`${inputClassName} block h-11 w-full rounded-md px-3`}>
              <option value="">{label("Select option", "اختر طريقة الحضور")}</option>
              <option value="teacher_goes_to_student">{label("Teacher goes to student", "المدرس يذهب للطالب")}</option>
              <option value="student_goes_to_teacher">{label("Student goes to teacher", "الطالب يذهب للمدرس")}</option>
            </select>
            {error("offline_visit_type")}
          </label>
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            {label(
              "Service areas require a dedicated location/availability contract; this form does not send unsupported fields.",
              "مناطق الخدمة تحتاج Location/Availability contract مستقل؛ لذلك لن نرسل حقولًا غير مدعومة حاليًا."
            )}
          </div>
        </section>
      )}

      {step === 6 && (
        <section className="space-y-5 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold text-black-blue">{label("Capacity & Publish", "السعة والنشر")}</h2>
          {bookingType === "group" ? (
            <label className="text-sm font-medium text-black-blue">
              {label("Maximum Students", "الحد الأقصى للطلاب")}
              <Input type="number" min={1} {...form.register("max_students")} className={inputClassName} />
              {error("max_students")}
              <span className="mt-1 block text-xs text-muted-foreground">
                {label("Available seats are calculated from capacity minus active bookings.", "المقاعد المتاحة تُحسب من السعة ناقص الحجوزات الفعالة.")}
              </span>
            </label>
          ) : (
            <div className="rounded-md bg-muted/40 p-4 text-sm text-muted-foreground">
              {label("Private lessons have one student per booking, so group capacity is not required.", "الدرس الخصوصي يكون لطالب واحد لكل حجز، لذلك لا يحتاج سعة مجموعة.")}
            </div>
          )}

          <ImageUpload
            file={file}
            setFile={setFile}
            title={label("Lesson picture", "صورة الدرس")}
          />
        </section>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || isSubmitting}>
          {label("Back", "رجوع")}
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={goNext} disabled={isSubmitting} className="bg-main hover:bg-main/90">
            {label("Next", "التالي")}
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="bg-main hover:bg-main/90">
            {action === "update" ? label("Update Lesson", "تحديث الدرس") : label("Publish Lesson", "نشر الدرس")}
            {isSubmitting && <Loader2 className="ml-2 animate-spin" size={18} />}
          </Button>
        )}
      </div>
    </form>
  );
};

export default LessonForm;
