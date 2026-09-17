import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

const fieldClassName =
  "mt-2 border border-input bg-white text-black-blue focus-visible:ring-main";

const LessonForm = ({ action, lesson }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const { data: teacherProfile, isLoading: isLoadingTeacher } = useGetTeacherProfile(token);
  const educationSystemId =
    teacherProfile?.data?.education_level?.education_system?.id?.toString() || "";
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

  const selectedEducationLevel = form.watch("education_level_id");
  const selectedDeliveryMode = form.watch("delivery_mode");
  const selectedBookingType = form.watch("booking_type");

  const { data: subjects, isLoading: isLoadingSubjects } = useGetAllSubjects(
    selectedEducationLevel ? selectedEducationLevel.toString() : ""
  );

  const steps = useMemo(
    () =>
      isArabic
        ? [
            "المادة والمرحلة",
            "نوع الدرس",
            "نوع الحجز",
            "تفاصيل الدرس",
            "الرابط الإلكتروني",
            "تفاصيل الدرس الحضوري",
            "السعة",
          ]
        : [
            "Subject & Stage",
            "Delivery Mode",
            "Booking Type",
            "Lesson Details",
            "Online Meeting",
            "Offline Details",
            "Group Capacity",
          ],
    [isArabic]
  );

  useEffect(() => {
    const teacherLevelId = teacherProfile?.data?.education_level?.id;
    form.reset({
      education_level_id: lesson?.education_level_id ?? teacherLevelId,
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
  }, [lesson, teacherProfile, form]);

  useEffect(() => {
    const currentSubjectId = form.getValues("subject_id");
    if (
      currentSubjectId &&
      subjects?.data &&
      !subjects.data.some((subject) => subject.id === Number(currentSubjectId))
    ) {
      form.setValue("subject_id", undefined, { shouldValidate: true });
    }
  }, [subjects, form]);

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step]);
    if (valid && step < steps.length - 1) setStep((current) => current + 1);
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const onSubmit = async (data: LessonFormValues) => {
    if (step !== steps.length - 1) {
      await goNext();
      return;
    }

    const allValid = await form.trigger();
    if (!allValid) return;

    if (action === "create" && !file) {
      toast.error(isArabic ? "صورة الدرس مطلوبة" : "Lesson picture is required");
      return;
    }

    const lessonPayload = {
      education_level_id: Number(data.education_level_id),
      subject_id: Number(data.subject_id),
      grade: data.grade.trim(),
      delivery_mode: data.delivery_mode,
      booking_type: data.booking_type,
      title: data.title.trim(),
      description: data.description.trim(),
      duration_minutes: Number(data.duration_minutes),
      price: Number(data.price),
      sessions_count: Number(data.sessions_count),
      meeting_url: data.delivery_mode === "online" ? data.meeting_url.trim() : undefined,
      location: data.delivery_mode === "offline" ? data.location.trim() : undefined,
      offline_visit_type:
        data.delivery_mode === "offline" ? data.offline_visit_type.trim() : undefined,
      max_students:
        data.booking_type === "group" && data.max_students !== ""
          ? Number(data.max_students)
          : undefined,
    };

    try {
      const response =
        action === "create"
          ? await CreateLesson({
              token,
              lesson: { ...lessonPayload, logo: file as File },
            })
          : await UpdateLesson({
              token,
              lesson: { ...lessonPayload, id: lesson?.id as number, logo: file || undefined },
            });

      const { status, message } = response;
      if (!status) {
        await Swal.fire({
          icon: "error",
          title: isArabic ? "حدث خطأ" : "Oops...",
          text: message,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: isArabic ? "تم بنجاح" : "Done",
        text: message,
      });

      form.reset();
      setStep(0);
      setFile(null);
      navigate("/profile", { state: { myLessons: true } });
    } catch (error) {
      handleResError(error);
    }
  };

  const renderError = (field: keyof LessonFormValues) => {
    const message = form.formState.errors[field]?.message;
    if (!message) return null;
    return <p className="mt-1 text-sm text-red-600">{String(message)}</p>;
  };

  const label = (english: string, arabic: string) => (isArabic ? arabic : english);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {steps.map((name, index) => (
              <button
                key={name}
                type="button"
                onClick={() => index <= step && setStep(index)}
                className={`rounded-md px-2 py-3 text-xs font-semibold transition md:text-sm ${
                  index === step
                    ? "bg-main text-white"
                    : index < step
                      ? "bg-main/15 text-main"
                      : "bg-white text-muted-foreground"
                }`}
              >
                <span className="block text-[10px] opacity-70">{index + 1}</span>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          {step === 0 && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-black-blue">
                  {label("Subject, Stage & Grade", "المادة والمرحلة والصف")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {label(
                    "Choose the educational level and a subject assigned to your teacher profile.",
                    "اختر المرحلة التعليمية ثم مادة مرتبطة بملفك كمدرس."
                  )}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-black-blue">
                  {label("Stage", "المرحلة")}
                  <select
                    {...form.register("education_level_id", { valueAsNumber: true })}
                    className={`${fieldClassName} block h-11 w-full rounded-md px-3`}
                    disabled={isLoadingTeacher || isLoadingLevels}
                  >
                    <option value="">
                      {label("Select stage", "اختر المرحلة")}
                    </option>
                    {educationLevels?.data?.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                  {renderError("education_level_id")}
                </label>

                <label className="text-sm font-medium text-black-blue">
                  {label("Subject", "المادة")}
                  <select
                    {...form.register("subject_id", { valueAsNumber: true })}
                    className={`${fieldClassName} block h-11 w-full rounded-md px-3`}
                    disabled={!selectedEducationLevel || isLoadingSubjects}
                  >
                    <option value="">
                      {label("Select subject", "اختر المادة")}
                    </option>
                    {subjects?.data?.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {renderError("subject_id")}
                </label>
              </div>

              <label className="block text-sm font-medium text-black-blue">
                {label("Grade", "الصف")}
                <Input
                  {...form.register("grade")}
                  placeholder={label("e.g. Grade 10", "مثال: الصف الأول الثانوي")}
                  className={fieldClassName}
                />
                {renderError("grade")}
              </label>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Delivery Mode", "نوع الدرس")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {["online", "offline"].map((mode) => (
                  <label
                    key={mode}
                    className={`cursor-pointer rounded-lg border p-5 ${
                      selectedDeliveryMode === mode ? "border-main bg-main/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      value={mode}
                      {...form.register("delivery_mode")}
                      className="sr-only"
                    />
                    <span className="text-lg font-semibold text-black-blue">
                      {mode === "online" ? "Online" : "Offline"}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {mode === "online"
                        ? label("Live lesson through a meeting link.", "درس مباشر عبر رابط اجتماع.")
                        : label("In-person lesson with a physical location.", "درس حضوري في مكان محدد.")}
                    </span>
                  </label>
                ))}
              </div>
              {renderError("delivery_mode")}
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Booking Type", "نوع الحجز")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {["private", "group"].map((type) => (
                  <label
                    key={type}
                    className={`cursor-pointer rounded-lg border p-5 ${
                      selectedBookingType === type ? "border-main bg-main/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...form.register("booking_type")}
                      className="sr-only"
                    />
                    <span className="text-lg font-semibold text-black-blue">
                      {type === "private"
                        ? label("Private", "خصوصي")
                        : label("Group", "جماعي")}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {type === "private"
                        ? label("One teacher + one student.", "مدرس + طالب واحد.")
                        : label("Multiple students can book available seats.", "عدة طلاب يمكنهم حجز المقاعد المتاحة.")}
                    </span>
                  </label>
                ))}
              </div>
              {renderError("booking_type")}
            </section>
          )}

          {step === 3 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Lesson Details", "تفاصيل الدرس")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-black-blue md:col-span-2">
                  {label("Title", "عنوان الدرس")}
                  <Input {...form.register("title")} className={fieldClassName} />
                  {renderError("title")}
                </label>
                <label className="text-sm font-medium text-black-blue md:col-span-2">
                  {label("Description", "الوصف")}
                  <Textarea {...form.register("description")} className="mt-2 min-h-32" />
                  {renderError("description")}
                </label>
                <label className="text-sm font-medium text-black-blue">
                  {label("Duration (minutes)", "مدة الحصة بالدقائق")}
                  <Input type="number" min={1} {...form.register("duration_minutes", { valueAsNumber: true })} className={fieldClassName} />
                  {renderError("duration_minutes")}
                </label>
                <label className="text-sm font-medium text-black-blue">
                  {label("Price", "السعر")}
                  <Input type="number" min={0} step="0.01" {...form.register("price", { valueAsNumber: true })} className={fieldClassName} />
                  {renderError("price")}
                </label>
                <label className="text-sm font-medium text-black-blue">
                  {label("Sessions Count", "عدد الحصص")}
                  <Input type="number" min={1} {...form.register("sessions_count", { valueAsNumber: true })} className={fieldClassName} />
                  {renderError("sessions_count")}
                </label>
              </div>
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                {label(
                  "Recurring days and available times belong to the availability/calendar domain and are not submitted as fake Lesson fields.",
                  "الأيام المتكررة والمواعيد المتاحة تابعة لـ availability/calendar domain ولن يتم إرسالها كحقول وهمية داخل Lesson."
                )}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Online Meeting", "الرابط الإلكتروني")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {label(
                  "Add the meeting URL. Leave it empty when the platform will generate/provide the meeting link later.",
                  "أضف رابط الاجتماع، ويمكن تركه فارغًا إذا كان رابط المنصة سيتم توفيره لاحقًا."
                )}
              </p>
              <label className="text-sm font-medium text-black-blue">
                {label("Meeting URL", "رابط الاجتماع")}
                <Input
                  type="url"
                  {...form.register("meeting_url")}
                  disabled={selectedDeliveryMode !== "online"}
                  placeholder="https://..."
                  className={fieldClassName}
                />
                {renderError("meeting_url")}
              </label>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Offline Details", "تفاصيل الدرس الحضوري")}
              </h2>
              <label className="text-sm font-medium text-black-blue">
                {label("Lesson Location", "مكان الدرس")}
                <Input
                  {...form.register("location")}
                  disabled={selectedDeliveryMode !== "offline"}
                  placeholder={label("e.g. Learning Center, New Cairo", "مثال: مركز تعليمي، القاهرة الجديدة")}
                  className={fieldClassName}
                />
                {renderError("location")}
              </label>
              <label className="text-sm font-medium text-black-blue">
                {label("Visit Direction", "طريقة الحضور")}
                <select
                  {...form.register("offline_visit_type")}
                  disabled={selectedDeliveryMode !== "offline"}
                  className={`${fieldClassName} block h-11 w-full rounded-md px-3`}
                >
                  <option value="">
                    {label("Select option", "اختر طريقة الحضور")}
                  </option>
                  <option value="teacher_goes_to_student">
                    {label("Teacher goes to student", "المدرس يذهب للطالب")}
                  </option>
                  <option value="student_goes_to_teacher">
                    {label("Student goes to teacher", "الطالب يذهب للمدرس")}
                  </option>
                </select>
                {renderError("offline_visit_type")}
              </label>
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                {label(
                  "Service-area management is a separate location/availability capability; this form does not store uncontracted data.",
                  "إدارة مناطق الخدمة قدرة مستقلة ضمن location/availability، لذلك لن نخزن بيانات غير موجودة في الـ API الحالي."
                )}
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-black-blue">
                {label("Group Capacity", "سعة المجموعة")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {label(
                  "Available seats are calculated from maximum capacity minus active bookings; the teacher does not enter a separate seats number.",
                  "المقاعد المتاحة يتم حسابها من الحد الأقصى ناقص الحجوزات الفعالة، ولا يتم إدخال عدد مقاعد متاح بشكل مستقل."
                )}
              </p>
              <label className="text-sm font-medium text-black-blue">
                {label("Maximum Students", "الحد الأقصى للطلاب")}
                <Input
                  type="number"
                  min={1}
                  {...form.register("max_students", { valueAsNumber: false })}
                  disabled={selectedBookingType !== "group"}
                  className={fieldClassName}
                />
                {renderError("max_students")}
              </label>

              <div className="pt-2">
                <ImageUpload
                  file={file}
                  setFile={setFile}
                  title={
                    isArabic ? "اضغط لرفع صورة الدرس" : "Click to upload lesson picture"
                  }
                />
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 0 || isCreating || isUpdating}
          >
            {label("Back", "رجوع")}
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={goNext} className="bg-main hover:bg-main/90">
              {label("Next", "التالي")}
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-main hover:bg-main/90"
              disabled={isCreating || isUpdating}
            >
              {action === "update"
                ? label("Update Lesson", "تحديث الدرس")
                : label("Publish Lesson", "نشر الدرس")}
              {(isCreating || isUpdating) && <Loader2 className="ml-2 animate-spin" size={20} />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default LessonForm;
