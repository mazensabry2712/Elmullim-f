import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAllEducationLevels,
  useGetAllSubjects,
} from "@/lib/react-query/main";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import { useGetTeacherServiceAreas } from "@/lib/react-query/teacher/serviceAreas";
import {
  useCreateTeacherLesson,
  useUpdateTeacherLesson,
} from "@/lib/react-query/teacher/lessons";
import { ILesson } from "@/interfaces/lessons/lesson";
import { lessonSchema } from "@/validations/teacher/lessonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Globe2,
  Image as ImageIcon,
  Info,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  UsersRound,
  Video,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
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

type LessonFormInput = z.input<typeof lessonSchema>;
type LessonFormValues = z.output<typeof lessonSchema>;

const availabilityField = (index: number, field: "available_on" | "day_of_week" | "start_time" | "end_time" | "timezone" | "meeting_url"): FieldPath<LessonFormValues> =>
  (`availability.${index}.${field}`) as FieldPath<LessonFormValues>;

interface WeeklyScheduleRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  meeting_url: string;
}

const defaultTimezone = "Africa/Cairo";

const getInputDateForWeekday = (dayOfWeek: number) => {
  const now = new Date();
  const currentDay = ((now.getUTCDay() + 6) % 7) + 1;
  let daysAhead = (dayOfWeek - currentDay + 7) % 7;
  if (daysAhead === 0) daysAhead = 7;

  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysAhead)
  );

  return date.toISOString().slice(0, 10);
};

const commonInput =
  "mt-2 border-black-blue/[0.10] bg-white text-black-blue shadow-none focus-visible:border-main focus-visible:ring-main/15";

const makeSlot = (
  day_of_week = 6,
  start_time = "18:00",
  end_time = "19:00",
  meeting_url = "",
  available_on = ""
) => ({
  available_on,
  day_of_week,
  start_time,
  end_time,
  timezone: defaultTimezone,
  meeting_url,
});

const days = [
  { value: 1, en: "Mon", ar: "الإثنين" },
  { value: 2, en: "Tue", ar: "الثلاثاء" },
  { value: 3, en: "Wed", ar: "الأربعاء" },
  { value: 4, en: "Thu", ar: "الخميس" },
  { value: 5, en: "Fri", ar: "الجمعة" },
  { value: 6, en: "Sat", ar: "السبت" },
  { value: 7, en: "Sun", ar: "الأحد" },
] as const;

const timezones = [
  { value: "Africa/Cairo", label: "Cairo (Africa/Cairo)" },
  { value: "Asia/Riyadh", label: "Riyadh (Asia/Riyadh)" },
  { value: "Asia/Dubai", label: "Dubai (Asia/Dubai)" },
  { value: "Europe/London", label: "London (Europe/London)" },
  { value: "Europe/Paris", label: "Paris (Europe/Paris)" },
] as const;

const minutesBetween = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return 0;
  return (eh * 60 + em) - (sh * 60 + sm);
};

const SmartLessonForm = ({ action, lesson }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [weeklyRows, setWeeklyRows] = useState<WeeklyScheduleRow[]>(() => {
    const recurringSlots =
      lesson?.availability?.filter((slot) => !slot.available_on) || [];

    if (recurringSlots.length) {
      return recurringSlots.map((slot) => ({
        day_of_week: Number(slot.day_of_week),
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        timezone: slot.timezone || defaultTimezone,
        meeting_url: slot.meeting_url || "",
      }));
    }

    if (action === "create" || !lesson) {
      return [
        {
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: defaultTimezone,
          meeting_url: "",
        },
      ];
    }

    return [];
  });

  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const label = (english: string, arabic: string) =>
    isArabic ? arabic : english;

  const {
    data: teacherProfile,
    isLoading: isLoadingTeacher,
  } = useGetTeacherProfile(token);
  const {
    data: serviceAreas,
    isLoading: isLoadingServiceAreas,
  } = useGetTeacherServiceAreas(token);
  const createMutation = useCreateTeacherLesson();
  const updateMutation = useUpdateTeacherLesson();
  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  const teacherEducationLevel = teacherProfile?.data?.education_level;
  const educationSystemId =
    teacherEducationLevel?.education_system?.id?.toString() || "";

  const { data: educationLevels, isLoading: isLoadingLevels } =
    useGetAllEducationLevels(educationSystemId);

  const initialAvailability = useMemo(
    () =>
      lesson?.availability?.length
        ? lesson.availability.map((slot) =>
            makeSlot(
              slot.day_of_week,
              slot.start_time.slice(0, 5),
              slot.end_time.slice(0, 5),
              slot.meeting_url || "",
              slot.available_on || ""
            )
          )
        : [makeSlot()],
    [lesson?.availability]
  );

  const form = useForm<LessonFormInput, any, LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    mode: "onTouched",
    shouldFocusError: true,
    defaultValues: {
      education_level_id:
        lesson?.education_level_id ?? teacherEducationLevel?.id,
      subject_id: lesson?.subject_id ?? undefined,
      grade: lesson?.grade ?? "",
      delivery_mode: lesson?.delivery_mode ?? "online",
      booking_type: lesson?.booking_type ?? "private",
      title: lesson?.title ?? "",
      description: lesson?.description ?? "",
      duration_minutes: lesson?.duration_minutes ?? 60,
      price: Number(lesson?.price) || 0,
      sessions_count: lesson?.sessions_count ?? 1,
      offline_visit_type: lesson?.offline_visit_type ?? "",
      service_area_ids:
        lesson?.service_areas
          ?.filter((area) => area.is_active !== false)
          .map((area) => area.id) || [],
      max_students: lesson?.max_students ?? "",
      booking_opens_at: lesson?.booking_opens_at?.slice(0, 16) ?? "",
      booking_closes_at: lesson?.booking_closes_at?.slice(0, 16) ?? "",
      ends_at: lesson?.ends_at?.slice(0, 16) ?? "",
      availability: initialAvailability,
    },
  });

  const {
    fields: availabilityFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "availability",
  });

  const educationLevelId = form.watch("education_level_id");
  const deliveryMode = form.watch("delivery_mode");
  const bookingType = form.watch("booking_type");
  const offlineVisitType = form.watch("offline_visit_type");
  const selectedServiceAreaIds = form.watch("service_area_ids") || [];
  const watchedSubjectId = form.watch("subject_id");
  const grade = form.watch("grade");
  const title = form.watch("title");
  const description = form.watch("description");
  const durationValue = form.watch("duration_minutes");
  const duration = Number(durationValue || 0);
  const priceValue = form.watch("price");
  const price = Number(priceValue || 0);
  const sessionsCountValue = form.watch("sessions_count");
  const sessionsCount = Number(sessionsCountValue || 0);
  const maxStudents = form.watch("max_students");
  const watchedAvailability = useWatch({
    control: form.control,
    name: "availability",
  });
  const availabilityValues = useMemo(
    () => watchedAvailability ?? [],
    [watchedAvailability]
  );

  const customAvailabilityEntries = useMemo(
    () =>
      availabilityValues
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot }) => Boolean(slot.available_on)),
    [availabilityValues]
  );

  const profileAddress = teacherProfile?.data?.address || "";
  const profileLatitude = teacherProfile?.data?.latitude;
  const profileLongitude = teacherProfile?.data?.longitude;

  const { data: subjects, isLoading: isLoadingSubjects } =
    useGetAllSubjects(
      educationLevelId ? String(educationLevelId) : ""
    );

  const activeServiceAreas = useMemo(
    () =>
      serviceAreas?.data?.filter((area) => area.is_active) || [],
    [serviceAreas]
  );

  const teacherSubjectIds = useMemo(
    () =>
      new Set(
        (teacherProfile?.data?.subjects || []).map((subject) =>
          Number(subject.id)
        )
      ),
    [teacherProfile?.data?.subjects]
  );

  const availableSubjects = useMemo(
    () =>
      (subjects?.data || []).filter((subject) =>
        teacherSubjectIds.has(Number(subject.id))
      ),
    [subjects?.data, teacherSubjectIds]
  );

  const selectedSubject = useMemo(
    () =>
      availableSubjects.find(
        (subject) => subject.id === Number(watchedSubjectId)
      ),
    [availableSubjects, watchedSubjectId]
  );

  const locationReadyForTeacher = Boolean(
    profileAddress.trim() &&
      profileLatitude != null &&
      profileLongitude != null
  );

  const scheduleProblems = useMemo(
    () =>
      availabilityValues.filter(
        (slot) =>
          minutesBetween(slot.start_time, slot.end_time) < duration
      ).length,
    [availabilityValues, duration]
  );

  const hasScheduleOverlap = useMemo(
    () =>
      availabilityValues.some((slot, index) =>
        availabilityValues.slice(index + 1).some((other) => {
          const sameCalendarDate =
            slot.available_on && other.available_on
              ? slot.available_on === other.available_on
              : Number(slot.day_of_week) === Number(other.day_of_week);

          return (
            sameCalendarDate &&
            slot.timezone === other.timezone &&
            slot.start_time < other.end_time &&
            other.start_time < slot.end_time
          );
        })
      ),
    [availabilityValues]
  );

  const onlineLinksReady =
    deliveryMode !== "online" ||
    (availabilityValues.length > 0 &&
      availabilityValues.every((slot) => Boolean(slot.meeting_url?.trim())));

  const offlineReady =
    deliveryMode !== "offline"
      ? true
      : offlineVisitType === "teacher_to_student"
        ? selectedServiceAreaIds.length > 0 && activeServiceAreas.length > 0
        : offlineVisitType === "student_to_teacher"
          ? locationReadyForTeacher
          : false;

  const isCapacityReady =
    bookingType !== "group" ||
    (maxStudents !== "" &&
      Number.isInteger(Number(maxStudents)) &&
      Number.isFinite(Number(maxStudents)) &&
      Number(maxStudents) >= 1);

  const isBasicsReady = Boolean(
    educationLevelId && watchedSubjectId && grade?.trim()
  );

  const hasInputValue = (value: unknown) =>
    value !== "" && value !== null && value !== undefined;

  const isDetailsReady = Boolean(
    title?.trim() &&
      description?.trim() &&
      hasInputValue(durationValue) &&
      Number.isInteger(duration) &&
      duration >= 1 &&
      hasInputValue(priceValue) &&
      Number.isFinite(price) &&
      price >= 0 &&
      hasInputValue(sessionsCountValue) &&
      Number.isInteger(sessionsCount) &&
      sessionsCount >= 1
  );

  const isScheduleReady = Boolean(
    availabilityValues.length > 0 &&
      availabilityValues.every(
        (slot) =>
          slot.start_time < slot.end_time &&
          minutesBetween(slot.start_time, slot.end_time) >= duration
      ) &&
      scheduleProblems === 0 &&
      !hasScheduleOverlap &&
      onlineLinksReady
  );

  const isImageReady = action === "update" || Boolean(file);
  const hasChanges =
    action === "create" || form.formState.isDirty || Boolean(file);

  const readiness = [
    {
      key: "basics",
      label: label("Teaching target", "بيانات المادة والمرحلة"),
      done: isBasicsReady,
    },
    {
      key: "details",
      label: label("Lesson offer", "تفاصيل الدرس"),
      done: isDetailsReady,
    },
    {
      key: "schedule",
      label: label("Schedule", "الجدول والمواعيد"),
      done: isScheduleReady,
    },
    {
      key: "delivery",
      label: label("Attendance setup", "طريقة الحضور"),
      done: offlineReady,
    },
    {
      key: "capacity",
      label: label("Capacity", "السعة"),
      done: isCapacityReady,
    },
    {
      key: "image",
      label: label("Cover image", "صورة الدرس"),
      done: isImageReady,
    },
  ];

  const readyCount = readiness.filter((item) => item.done).length;
  const isReady = readyCount === readiness.length;

  useEffect(() => {
    if (
      action === "create" &&
      !form.getValues("education_level_id") &&
      teacherEducationLevel?.id
    ) {
      form.setValue("education_level_id", teacherEducationLevel.id, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [action, form, teacherEducationLevel?.id]);

  useEffect(() => {
    const currentSubject = Number(form.getValues("subject_id") || 0);

    if (
      currentSubject > 0 &&
      subjects?.data &&
      !availableSubjects.some((subject) => subject.id === currentSubject)
    ) {
      form.setValue("subject_id", 0, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [form, subjects, availableSubjects]);

  useEffect(() => {
    if (deliveryMode !== "offline") {
      form.setValue("offline_visit_type", "", {
        shouldValidate: false,
      });
      form.setValue("service_area_ids", [], {
        shouldValidate: false,
      });
    }
  }, [deliveryMode, form]);

  useEffect(() => {
    if (deliveryMode === "offline" && offlineVisitType !== "teacher_to_student") {
      form.setValue("service_area_ids", [], {
        shouldValidate: false,
      });
    }
  }, [deliveryMode, offlineVisitType, form]);

  useEffect(() => {
    if (bookingType !== "group") {
      form.setValue("max_students", "", {
        shouldValidate: false,
      });
    }
  }, [bookingType, form]);

  const error = (field: keyof LessonFormValues) => {
    const message = form.formState.errors[field]?.message;
    return message ? (
      <p className="mt-1 text-xs font-semibold text-red-600">
        {String(message)}
      </p>
    ) : null;
  };

  const availabilityError = (
    index: number,
    field:
      | "available_on"
      | "start_time"
      | "end_time"
      | "meeting_url"
      | "timezone"
  ) => {
    const message =
      form.formState.errors.availability?.[index]?.[field]?.message;

    return message ? (
      <p className="mt-1 text-xs font-semibold text-red-600">
        {String(message)}
      </p>
    ) : null;
  };

  const syncWeeklyRows = (nextRows: WeeklyScheduleRow[]) => {
    setWeeklyRows(nextRows);

    const customSlots = (form.getValues("availability") || []).filter(
      (slot) => Boolean(slot.available_on)
    );

    const recurringSlots = nextRows.map((row) => ({
      ...makeSlot(
        row.day_of_week,
        row.start_time,
        row.end_time,
        deliveryMode === "online" ? row.meeting_url.trim() : "",
        ""
      ),
      timezone: row.timezone,
    }));

    replace([...recurringSlots, ...customSlots]);
    void form.trigger("availability");
  };

  const toggleWeeklyDay = (day: number) => {
    const existing = weeklyRows.find((row) => row.day_of_week === day);

    if (existing) {
      syncWeeklyRows(
        weeklyRows.filter((row) => row.day_of_week !== day)
      );
      return;
    }

    const fallback = weeklyRows[0];
    const existingFormSlots = form.getValues("availability") || [];
    const fallbackMeetingUrl =
      existingFormSlots.find((slot) => slot.meeting_url?.trim())?.meeting_url ||
      "";

    syncWeeklyRows(
      [...weeklyRows, {
        day_of_week: day,
        start_time: fallback?.start_time || "18:00",
        end_time: fallback?.end_time || "19:00",
        timezone: fallback?.timezone || defaultTimezone,
        meeting_url:
          deliveryMode === "online"
            ? fallback?.meeting_url?.trim() || fallbackMeetingUrl
            : "",
      }].sort((a, b) => a.day_of_week - b.day_of_week)
    );
  };

  const updateWeeklyRow = (
    index: number,
    field: keyof WeeklyScheduleRow,
    value: string | number
  ) => {
    syncWeeklyRows(
      weeklyRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const addCustomSlot = () => {
    const current = form.getValues("availability") || [];
    const usedDates = new Set(
      current
        .filter((slot) => Boolean(slot.available_on))
        .map((slot) => slot.available_on)
    );
    const nextDay = days.find((day) => {
      const candidate = getInputDateForWeekday(day.value);
      return !usedDates.has(candidate);
    })?.value || 1;
    const weeklyFallback =
      weeklyRows.find((row) => row.day_of_week === nextDay) || weeklyRows[0];

    append(
      makeSlot(
        nextDay,
        weeklyFallback?.start_time || "18:00",
        weeklyFallback?.end_time || "19:00",
        deliveryMode === "online"
          ? weeklyFallback?.meeting_url ||
              current.find((slot) => slot.meeting_url?.trim())?.meeting_url ||
              ""
          : "",
        getInputDateForWeekday(nextDay)
      )
    );
  };

  const copyMeetingLinkToAll = (sourceIndex: number) => {
    const source = availabilityValues[sourceIndex]?.meeting_url;

    if (!source?.trim()) {
      toast.error(
        label(
          "Enter a valid meeting link first.",
          "أدخل رابط اجتماع أولًا."
        )
      );
      return;
    }

    customAvailabilityEntries.forEach(({ index }) => {
      form.setValue(
        availabilityField(index, "meeting_url"),
        source.trim(),
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
    });

    toast.success(
      label(
        "Meeting link copied to every one-off date.",
        "تم نسخ رابط الاجتماع إلى كل المواعيد الاستثنائية."
      )
    );
  };

  const suggestContent = () => {
    const subjectName = selectedSubject?.name?.trim() || "";
    const gradeName = grade?.trim() || "";
    const mode = deliveryMode === "online"
      ? label("live online", "مباشر أونلاين")
      : label("in-person", "حضوري");
    const booking = bookingType === "group"
      ? label("group", "جماعي")
      : label("private", "خاص");

    if (!title.trim()) {
      form.setValue(
        "title",
        [subjectName, gradeName, mode]
          .filter(Boolean)
          .join(" — ") || label("New lesson", "درس جديد"),
        { shouldDirty: true, shouldTouch: true }
      );
    }

    if (!description.trim()) {
      form.setValue(
        "description",
        label(
          `A ${mode} ${booking} lesson focused on ${subjectName || "the selected subject"} for ${gradeName || "the selected grade"}.`,
          `حصة ${mode} ${booking} تركز على ${subjectName || "المادة المحددة"} لطلاب ${gradeName || "الصف المحدد"}.`
        ),
        { shouldDirty: true, shouldTouch: true }
      );
    }

    toast.success(
      label(
        "Smart draft inserted. Edit it to match your teaching style.",
        "تم إنشاء مسودة ذكية. عدّلها لتناسب أسلوبك في التدريس."
      )
    );
  };

  const handleInvalidSubmit = (errors: FieldErrors<LessonFormInput>) => {
    console.error("Lesson publish blocked by client validation:", errors);

    const findFirstMessage = (value: unknown): string | null => {
      if (!value || typeof value !== "object") return null;

      const record = value as Record<string, unknown>;
      if (typeof record.message === "string" && record.message.trim()) {
        return record.message;
      }

      for (const nested of Object.values(record)) {
        const message = findFirstMessage(nested);
        if (message) return message;
      }

      return null;
    };

    toast.error(
      findFirstMessage(errors) ||
        label(
          "Complete the highlighted fields before submitting the lesson for review.",
          "أكمل الحقول الموضحة قبل نشر الدرس."
        ),
      { autoClose: 6000 }
    );
  };

  const submit = async (values: LessonFormValues) => {
    try {
      if (!file && action === "create") {
        toast.error(
          label("Lesson cover image is required.", "صورة غلاف الدرس مطلوبة.")
        );
        return;
      }

      if (!isReady) {
        const missingItems = readiness
          .filter((item) => !item.done)
          .map((item) => item.label)
          .join(isArabic ? "، " : ", ");

        toast.error(
          label(
            `Complete these items before publishing: ${missingItems}.`,
            `أكمل العناصر التالية قبل نشر الدرس: ${missingItems}.`
          ),
          { autoClose: 7000 }
        );
        return;
      }

      if (
        !availableSubjects.some(
          (subject) => subject.id === Number(values.subject_id)
        )
      ) {
        toast.error(
          label(
            "Choose a subject assigned to your teacher profile.",
            "اختر مادة مسجلة في ملف المعلم أولًا."
          )
        );
        return;
      }

      const availability = values.availability.map((slot) => ({
        available_on: slot.available_on,
        day_of_week: Number(slot.day_of_week),
        start_time: slot.start_time,
        end_time: slot.end_time,
        timezone: slot.timezone,
        meeting_url:
          values.delivery_mode === "online"
            ? slot.meeting_url.trim()
            : "",
      }));

      const serviceAreaIds =
        values.delivery_mode === "offline" &&
        values.offline_visit_type === "teacher_to_student"
          ? values.service_area_ids
          : [];

      const commonValues = {
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
        availability,
        service_area_ids: serviceAreaIds,
        ...(values.delivery_mode === "offline"
          ? { offline_visit_type: values.offline_visit_type }
          : {}),
        ...(values.booking_type === "group" &&
        values.max_students !== ""
          ? { max_students: Number(values.max_students) }
          : {}),
        ...(values.booking_opens_at ? { booking_opens_at: values.booking_opens_at } : {}),
        ...(values.booking_closes_at ? { booking_closes_at: values.booking_closes_at } : {}),
        ...(values.ends_at ? { ends_at: values.ends_at } : {}),
      };

      const response =
        action === "create"
          ? await createMutation.mutateAsync({
              token,
              lesson: {
                ...commonValues,
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
        await Swal.fire({
          icon: "error",
          title: label("Something went wrong", "حدث خطأ"),
          text: response.message,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: action === "create"
          ? label("Lesson submitted", "تم إرسال الدرس")
          : label("Lesson saved", "تم حفظ الدرس"),
        text: action === "create"
          ? label(
              "Your lesson was submitted for admin review. It will become available to students after approval.",
              "تم إرسال الدرس للمراجعة من الإدارة، وسيصبح متاحًا للطلاب بعد اعتماده."
            )
          : response.message,
      });

      navigate("/profile");
    } catch (requestError) {
      handleResError(requestError);
    }
  };

  const statusText = isReady
    ? label("Ready to submit for review", "جاهز للإرسال للمراجعة")
    : label("Needs attention", "يحتاج استكمال");

  return (
    <form
      onSubmit={form.handleSubmit(submit, handleInvalidSubmit)}
      className="space-y-6"
      noValidate
    >
      <section className="overflow-hidden rounded-[28px] border border-black-blue/[0.07] bg-[#F7FAF9] shadow-[0_18px_55px_rgba(33,55,75,0.07)]">
        <div className="relative overflow-hidden bg-black-blue px-5 py-7 text-white sm:px-7 lg:px-9 lg:py-8">
          <div className="absolute -end-16 -top-20 h-52 w-52 rounded-full bg-main/15 blur-3xl" />
          <div className="absolute -start-16 -bottom-24 h-56 w-56 rounded-full bg-main/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-extrabold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-main" />
                {label("Smart lesson builder", "منشئ الدرس الذكي")}
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                {label(
                  action === "create"
                    ? "Build a lesson that is ready for real bookings."
                    : "Fine-tune your lesson without touching unrelated settings.",
                  action === "create"
                    ? "ابنِ درسًا جاهزًا للحجز الفعلي من أول مرة."
                    : "عدّل درسك بدون ما تدخل في إعدادات مالهاش علاقة بالتعديل."
                )}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                {label(
                  "The form adapts to your choices. Online lessons get one meeting link per slot; offline lessons resolve location from the correct source automatically.",
                  "الواجهة تتكيف مع اختياراتك. الدرس الأونلاين له رابط مستقل لكل موعد، والدرس الحضوري يحدد المكان تلقائيًا من المصدر الصحيح."
                )}
              </p>
            </div>

            <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[250px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-white/65">
                  {label("Readiness", "الجاهزية")}
                </span>
                <span
                  className={
                    "rounded-full px-2.5 py-1 text-[10px] font-black " +
                    (isReady
                      ? "bg-emerald-400/15 text-emerald-200"
                      : "bg-amber-300/15 text-amber-200")
                  }
                >
                  {statusText}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <strong className="text-3xl font-black" dir="ltr">
                  {readyCount}/{readiness.length}
                </strong>
                <span className="text-xs text-white/50">
                  {label("checks", "عناصر")}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-main transition-all duration-300"
                  style={{
                    width: `${(readyCount / readiness.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                  <Wand2 className="h-3.5 w-3.5" />
                  01
                </div>
                <h2 className="mt-3 text-2xl font-black text-black-blue">
                  {label("What are you teaching?", "هتدرّس إيه؟")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-black-blue/50">
                  {label(
                    "Stage controls the subject list. The subject and grade then define the lesson target.",
                    "المرحلة تحدد المواد المتاحة، وبعدها المادة والصف بيحددوا هدف الدرس."
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7FAF9] px-4 py-3 text-end text-xs font-bold text-black-blue/55">
                <span className="block text-[10px] uppercase tracking-[0.12em] text-black-blue/35">
                  {label("Current target", "الهدف الحالي")}
                </span>
                <span className="mt-1 block text-sm font-black text-black-blue">
                  {selectedSubject?.name || label("Choose a subject", "اختر مادة")}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-black-blue">
                {label("Education stage", "المرحلة التعليمية")}
                <select
                  {...form.register("education_level_id", {
                    onChange: (event) => {
                      const nextEducationLevelId = Number(event.target.value);
                      form.setValue("education_level_id", nextEducationLevelId, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      form.setValue("subject_id", 0, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    },
                  })}
                  disabled={isLoadingTeacher || isLoadingLevels}
                  className={`${commonInput} block h-12 w-full rounded-xl px-3`}
                >
                  <option value="">
                    {label("Select a stage", "اختر المرحلة")}
                  </option>
                  {educationLevels?.data?.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
                {error("education_level_id")}
              </label>

              <label className="text-sm font-bold text-black-blue">
                {label("Subject", "المادة")}
                <select
                  {...form.register("subject_id")}
                  disabled={!educationLevelId || isLoadingSubjects}
                  className={`${commonInput} block h-12 w-full rounded-xl px-3`}
                >
                  <option value="">
                    {label("Choose a subject", "اختر المادة")}
                  </option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {error("subject_id")}
              </label>
                {availableSubjects.length === 0 &&
                subjects?.data &&
                subjects.data.length > 0 ? (
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    {label(
                      "None of the subjects for this stage are assigned to your teacher profile. Add the subject to your profile first.",
                      "لا توجد مادة من هذه المرحلة مسجلة في ملف المعلم. أضف المادة إلى ملفك أولًا."
                    )}
                  </p>
                ) : null}
            </div>

            <label className="mt-4 block text-sm font-bold text-black-blue">
              {label("Grade", "الصف")}
              <Input
                {...form.register("grade")}
                placeholder={label(
                  "e.g. Grade 10",
                  "مثال: الصف الأول الثانوي"
                )}
                className={`${commonInput} h-12 rounded-xl`}
              />
              {error("grade")}
            </label>
          </section>

          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                <Globe2 className="h-3.5 w-3.5" />
                02
              </div>
              <h2 className="mt-3 text-2xl font-black text-black-blue">
                {label("How should students attend?", "الطلاب هيحضروا إزاي؟")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-black-blue/50">
                {label(
                  "Only the settings that matter for the selected mode stay visible.",
                  "هنظهر فقط الإعدادات المرتبطة بالنوع اللي اخترته."
                )}
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                {
                  value: "online" as const,
                  title: label("Online", "أونلاين"),
                  description: label(
                    "Each weekly slot gets its own meeting link.",
                    "كل موعد أسبوعي له رابط اجتماع مستقل."
                  ),
                  icon: <Video className="h-5 w-5" />,
                },
                {
                  value: "offline" as const,
                  title: label("In person", "حضوري"),
                  description: label(
                    "Location is resolved from the profile or active service areas.",
                    "المكان يُحدد من الملف الشخصي أو مناطق الخدمة النشطة."
                  ),
                  icon: <MapPin className="h-5 w-5" />,
                },
              ].map((option) => {
                const selected = deliveryMode === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      form.setValue("delivery_mode", option.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    className={
                      "flex min-h-[118px] items-start gap-4 rounded-2xl border p-4 text-start transition " +
                      (selected
                        ? "border-main bg-main/[0.055] ring-2 ring-main/10"
                        : "border-black-blue/[0.08] hover:border-main/25 hover:bg-main/[0.018]")
                    }
                  >
                    <span
                      className={
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
                        (selected
                          ? "bg-main text-white"
                          : "bg-main/10 text-main")
                      }
                    >
                      {option.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-black text-black-blue">
                        {option.title}
                        {selected ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : null}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-black-blue/50">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                  <UsersRound className="h-3.5 w-3.5" />
                  03
                </div>
                <h2 className="mt-3 text-2xl font-black text-black-blue">
                  {label("How can they book?", "الطالب هيحجز إزاي؟")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-black-blue/50">
                  {label(
                    "Private is one learner per booking. Group lets several learners share the same scheduled start.",
                    "الخاص لطالب واحد في الحجز. الجماعي يسمح بأكثر من طالب لنفس بداية الموعد."
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-main/10 bg-main/[0.035] px-4 py-3 text-xs font-semibold text-main">
                {bookingType === "group"
                  ? label("Group capacity is active", "السعة الجماعية مفعلة")
                  : label("Private booking", "حجز خاص")}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                {
                  value: "private" as const,
                  title: label("Private", "خاص"),
                  description: label(
                    "One learner per booking.",
                    "طالب واحد في كل حجز."
                  ),
                  icon: "1",
                },
                {
                  value: "group" as const,
                  title: label("Group", "جماعي"),
                  description: label(
                    "Multiple learners can book the same scheduled start.",
                    "أكثر من طالب يمكنه حجز نفس بداية الموعد."
                  ),
                  icon: "G",
                },
              ].map((option) => {
                const selected = bookingType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      form.setValue("booking_type", option.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    className={
                      "flex items-center gap-4 rounded-2xl border p-4 text-start transition " +
                      (selected
                        ? "border-main bg-main/[0.055]"
                        : "border-black-blue/[0.08] hover:border-main/25")
                    }
                  >
                    <span
                      className={
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black " +
                        (selected
                          ? "bg-main text-white"
                          : "bg-slate-100 text-black-blue/45")
                      }
                    >
                      {option.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-black text-black-blue">
                        {option.title}
                        {selected ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : null}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-black-blue/50">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {bookingType === "group" ? (
              <div className="mt-4 rounded-2xl border border-main/10 bg-[#F7FAF9] p-4">
                <label className="block text-sm font-black text-black-blue">
                  {label("Maximum learners", "الحد الأقصى للطلاب")}
                  <Input
                    type="number"
                    min={1}
                    {...form.register("max_students")}
                    className={`${commonInput} h-12 rounded-xl`}
                  />
                  <span className="mt-2 block text-xs font-semibold text-black-blue/45">
                    {label(
                      "Only group lessons use this capacity.",
                      "هذا الحقل يستخدم فقط مع الدرس الجماعي."
                    )}
                  </span>
                  {error("max_students")}
                </label>
              </div>
            ) : null}
          </section>

          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                  <Sparkles className="h-3.5 w-3.5" />
                  04
                </div>
                <h2 className="mt-3 text-2xl font-black text-black-blue">
                  {label("What is the lesson offer?", "تفاصيل الدرس")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-black-blue/50">
                  {label(
                    "Title and description are editable. The smart suggestion only fills empty fields.",
                    "العنوان والوصف قابلان للتعديل. الاقتراح الذكي يملأ الحقول الفارغة فقط."
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={suggestContent}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-main/15 bg-main/[0.045] px-4 py-2.5 text-sm font-black text-main transition hover:bg-main/10"
              >
                <Wand2 className="h-4 w-4" />
                {label("Suggest copy", "اقتراح ذكي")}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-black text-black-blue">
                {label("Lesson title", "عنوان الدرس")}
                <Input
                  {...form.register("title")}
                  maxLength={100}
                  placeholder={label(
                    "e.g. Mathematics — Grade 10",
                    "مثال: الرياضيات — الصف الأول الثانوي"
                  )}
                  className={`${commonInput} h-12 rounded-xl`}
                />
                <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-black-blue/35">
                  <span>{label("Clear and specific wins.", "العنوان الواضح أفضل.")}</span>
                  <span dir="ltr">{(title || "").length}/100</span>
                </div>
                {error("title")}
              </label>

              <label className="block text-sm font-black text-black-blue">
                {label("Description", "وصف الدرس")}
                <Textarea
                  {...form.register("description")}
                  maxLength={250}
                  rows={5}
                  placeholder={label(
                    "Explain what the learner will actually get.",
                    "اكتب بوضوح ماذا سيحصل عليه الطالب."
                  )}
                  className={`${commonInput} resize-none rounded-xl`}
                />
                <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-black-blue/35">
                  <span>{label("Keep it useful, not marketing-heavy.", "خليه مفيد وواضح بدون حشو.")}</span>
                  <span dir="ltr">{(description || "").length}/250</span>
                </div>
                {error("description")}
              </label>

              <div className="mt-5 rounded-2xl border border-main/10 bg-main/[0.025] p-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                  <div>
                    <p className="text-sm font-black text-black-blue">
                      {label("Booking lifecycle", "دورة حياة الحجز")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-black-blue/50">
                      {label("When capacity is full or the booking period/lesson end date passes, the lesson leaves public booking automatically but stays in your lessons archive.", "عند اكتمال السعة أو انتهاء فترة الحجز أو نهاية الدرس، يتوقف الحجز تلقائيًا ويظل الدرس محفوظًا في أرشيف دروسك.")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="block text-sm font-black text-black-blue">
                    {label("Booking opens", "بدء الحجز")}
                    <Input
                      type="datetime-local"
                      {...form.register("booking_opens_at")}
                      className={commonInput + " h-12 rounded-xl"}
                    />
                    <span className="mt-1 block text-[11px] font-semibold text-black-blue/40">
                      {label("Optional", "اختياري")}
                    </span>
                    {error("booking_opens_at")}
                  </label>

                  <label className="block text-sm font-black text-black-blue">
                    {label("Booking closes", "إغلاق الحجز")}
                    <Input
                      type="datetime-local"
                      {...form.register("booking_closes_at")}
                      className={commonInput + " h-12 rounded-xl"}
                    />
                    <span className="mt-1 block text-[11px] font-semibold text-black-blue/40">
                      {label("Optional", "اختياري")}
                    </span>
                    {error("booking_closes_at")}
                  </label>

                  <label className="block text-sm font-black text-black-blue">
                    {label("Lesson ends", "نهاية الدرس")}
                    <Input
                      type="datetime-local"
                      {...form.register("ends_at")}
                      className={commonInput + " h-12 rounded-xl"}
                    />
                    <span className="mt-1 block text-[11px] font-semibold text-black-blue/40">
                      {label("Optional, recommended for limited-time lessons", "اختياري، ومُفضّل للدروس ذات المدة المحدودة")}
                    </span>
                    {error("ends_at")}
                  </label>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-sm font-black text-black-blue">
                  {label("Duration", "المدة")}
                  <select
                    {...form.register("duration_minutes")}
                    className={`${commonInput} block h-12 w-full rounded-xl px-3`}
                  >
                    {[30, 45, 60, 75, 90, 120, 150, 180].map((value) => (
                      <option key={value} value={value}>
                        {value} {label("min", "دقيقة")}
                      </option>
                    ))}
                  </select>
                  {error("duration_minutes")}
                </label>

                <label className="text-sm font-black text-black-blue">
                  {label("Sessions", "عدد الحصص")}
                  <Input
                    type="number"
                    min={1}
                    {...form.register("sessions_count")}
                    className={`${commonInput} h-12 rounded-xl`}
                  />
                  {error("sessions_count")}
                </label>

                <label className="text-sm font-black text-black-blue sm:col-span-2">
                  {label("Price per session", "سعر الحصة")}
                  <div className="mt-2 flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...form.register("price")}
                      className={`${commonInput} mt-0 h-12 rounded-xl`}
                    />
                    <span className="flex h-12 shrink-0 items-center rounded-xl bg-[#F7FAF9] px-3 text-xs font-black text-black-blue/55">
                      EGP
                    </span>
                  </div>
                  {price === 0 ? (
                    <span className="mt-1 block text-[11px] font-bold text-emerald-600">
                      {label("This lesson is free.", "هذا الدرس مجاني.")}
                    </span>
                  ) : null}
                  {error("price")}
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                  <CalendarDays className="h-3.5 w-3.5" />
                  05
                </div>
                <h2 className="mt-3 text-2xl font-black text-black-blue">
                  {label("When can students book?", "متى يقدر الطالب يحجز؟")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-black-blue/50">
                  {label(
                    "Set the days and times that repeat every week. Each row is a recurring booking window; exact dates are only for one-off exceptions.",
                    "حدد الأيام والأوقات التي يتكرر فيها الحجز كل أسبوع. كل سطر هنا موعد أسبوعي متكرر، أما التاريخ المحدد فمخصص للاستثناءات فقط."
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7FAF9] px-4 py-3 text-start">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black-blue/35">
                  {label("Lesson duration", "مدة الدرس")}
                </p>
                <p className="mt-1 text-lg font-black text-black-blue">
                  {duration} {label("minutes", "دقيقة")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-main/10 bg-main/[0.025] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                <div>
                  <p className="text-sm font-black text-black-blue">
                    {label("Weekly schedule", "الجدول الأسبوعي")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-black-blue/45">
                    {label(
                      "Pick the days first, then give each selected day its own time. Online lessons also need a meeting URL for every recurring day.",
                      "اختار الأيام الأول، وبعدها حدد لكل يوم وقته. الدرس الأونلاين يحتاج رابط اجتماع لكل يوم متكرر."
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((day) => {
                  const selected = weeklyRows.some(
                    (row) => row.day_of_week === day.value
                  );

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeeklyDay(day.value)}
                      className={
                        "rounded-xl border px-2 py-3 text-xs font-black transition " +
                        (selected
                          ? "border-main bg-main text-white"
                          : "border-black-blue/[0.08] bg-white text-black-blue/55 hover:border-main/25")
                      }
                    >
                      {isArabic ? day.ar : day.en}
                    </button>
                  );
                })}
              </div>

              {weeklyRows.length ? (
                <div className="mt-5 space-y-3">
                  {weeklyRows.map((row, index) => {
                    const day = days.find(
                      (item) => item.value === row.day_of_week
                    );

                    return (
                      <div
                        key={row.day_of_week}
                        className="rounded-2xl border border-black-blue/[0.07] bg-white p-3 sm:p-4"
                      >
                        <div className="grid gap-3 lg:grid-cols-[0.9fr_1fr_1fr_1.2fr_2fr_auto] lg:items-end">
                          <div>
                            <p className="text-xs font-black text-black-blue/40">
                              {label("Day", "اليوم")}
                            </p>
                            <p className="mt-1 text-sm font-black text-black-blue">
                              {isArabic ? day?.ar : day?.en}
                            </p>
                            <p className="mt-1 text-[10px] font-semibold text-main">
                              {label("Repeats weekly", "يتكرر كل أسبوع")}
                            </p>
                          </div>

                          <label className="text-xs font-black text-black-blue">
                            {label("From", "من")}
                            <Input
                              type="time"
                              value={row.start_time}
                              onChange={(event) =>
                                updateWeeklyRow(
                                  index,
                                  "start_time",
                                  event.target.value
                                )
                              }
                              className={commonInput + " h-11 rounded-xl"}
                            />
                            {availabilityError(index, "start_time")}
                          </label>

                          <label className="text-xs font-black text-black-blue">
                            {label("To", "إلى")}
                            <Input
                              type="time"
                              value={row.end_time}
                              onChange={(event) =>
                                updateWeeklyRow(
                                  index,
                                  "end_time",
                                  event.target.value
                                )
                              }
                              className={commonInput + " h-11 rounded-xl"}
                            />
                            {availabilityError(index, "end_time")}
                          </label>

                          <label className="text-xs font-black text-black-blue">
                            {label("Timezone", "المنطقة الزمنية")}
                            <select
                              value={row.timezone}
                              onChange={(event) =>
                                updateWeeklyRow(
                                  index,
                                  "timezone",
                                  event.target.value
                                )
                              }
                              className={commonInput + " mt-2 block h-11 w-full rounded-xl px-3"}
                            >
                              {timezones.map((timezone) => (
                                <option
                                  key={timezone.value}
                                  value={timezone.value}
                                >
                                  {timezone.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          {deliveryMode === "online" ? (
                            <label className="text-xs font-black text-black-blue">
                              <span className="flex items-center gap-2">
                                <Link2 className="h-3.5 w-3.5 text-main" />
                                {label("Meeting URL", "رابط الاجتماع")}
                              </span>
                              <Input
                                type="url"
                                placeholder="https://..."
                                value={row.meeting_url}
                                onChange={(event) =>
                                  updateWeeklyRow(
                                    index,
                                    "meeting_url",
                                    event.target.value
                                  )
                                }
                                className={commonInput + " mt-2 h-11 rounded-xl"}
                              />
                              {availabilityError(index, "meeting_url")}
                              {row.meeting_url.trim() ? (
                                <span className="mt-1 block text-[10px] font-bold text-emerald-600">
                                  {label("Link configured", "الرابط مضبوط")}
                                </span>
                              ) : (
                                <span className="mt-1 block text-[10px] font-bold text-amber-700">
                                  {label("Required for online booking.", "مطلوب للحجز الأونلاين.")}
                                </span>
                              )}
                            </label>
                          ) : (
                            <div className="rounded-xl bg-[#F7FAF9] px-3 py-3 text-xs font-semibold text-black-blue/45">
                              {label(
                                "The destination is resolved at booking time.",
                                "مكان الحصة بيتحدد وقت الحجز."
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleWeeklyDay(row.day_of_week)}
                            title={label("Remove day", "حذف اليوم")}
                            aria-label={label("Remove day", "حذف اليوم")}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-black-blue/[0.07] pt-3">
                          <span className="text-[11px] font-semibold text-black-blue/40">
                            {label(
                              "Students can choose concrete dates generated from this weekly rule.",
                              "الطلاب هيشوفوا التواريخ الفعلية القادمة الناتجة من الجدول ده."
                            )}
                          </span>
                          <span className="shrink-0 text-[11px] font-bold text-main" dir="ltr">
                            {minutesBetween(row.start_time, row.end_time)} min
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-black-blue/[0.12] bg-white p-6 text-center">
                  <CalendarDays className="mx-auto h-6 w-6 text-black-blue/30" />
                  <p className="mt-2 text-sm font-black text-black-blue">
                    {label("No weekly days selected", "لم يتم اختيار أيام أسبوعية")}
                  </p>
                  <p className="mt-1 text-xs text-black-blue/45">
                    {label(
                      "Choose at least one day above to open recurring booking times.",
                      "اختر يومًا واحدًا على الأقل لفتح مواعيد حجز متكررة."
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs font-black text-blue-900">
                      {label("How students will book", "الطالب هيحجز إزاي")}
                    </p>
                    <p className="mt-1 text-xs leading-5 font-semibold text-blue-800/70">
                      {label(
                        "You do not enter the future date here. The system turns each weekly rule into real upcoming dates, and the student chooses one of those dates.",
                        "مش مطلوب تكتب تاريخ مستقبلي هنا. السيستم بيحوّل كل قاعدة أسبوعية لمواعيد فعلية قادمة، والطالب يختار واحدًا منها للحجز."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-black text-black-blue">
                      {label("One-off dates", "مواعيد استثنائية")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-black-blue/50">
                      {label(
                        "Use an exact date only when you need an exception outside the normal weekly schedule.",
                        "استخدم تاريخًا محددًا فقط لما تحتاج موعدًا استثنائيًا خارج الجدول الأسبوعي المعتاد."
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCustomSlot}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-black text-amber-800 transition hover:bg-amber-100"
                >
                  <Plus className="h-4 w-4" />
                  {label("Add one-off date", "إضافة موعد استثنائي")}
                </button>
              </div>

              {customAvailabilityEntries.length ? (
                <div className="mt-4 space-y-3">
                  {customAvailabilityEntries.map(({ slot, index }) => {
                    const slotMinutes = minutesBetween(
                      slot?.start_time || "",
                      slot?.end_time || ""
                    );
                    const tooShort = slotMinutes > 0 && slotMinutes < duration;
                    const isFirstCustom =
                      customAvailabilityEntries[0]?.index === index;

                    return (
                      <div
                        key={availabilityFields[index]?.id || index}
                        className={
                          "rounded-2xl border bg-white p-3 sm:p-4 " +
                          (tooShort
                            ? "border-amber-200"
                            : "border-black-blue/[0.07]")
                        }
                      >
                        <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_1.8fr_auto] lg:items-end">
                          <label className="text-xs font-black text-black-blue">
                            {label("Exact date", "التاريخ المحدد")}
                            <Input
                              type="date"
                              min={new Date().toISOString().slice(0, 10)}
                              value={slot?.available_on || ""}
                              onChange={(event) => {
                                const value = event.target.value;

                                form.setValue(
                                  availabilityField(index, "available_on"),
                                  value,
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );

                                if (value) {
                                  const date = new Date(value + "T00:00:00Z");
                                  const dayOfWeek =
                                    ((date.getUTCDay() + 6) % 7) + 1;

                                  form.setValue(
                                    availabilityField(index, "day_of_week"),
                                    dayOfWeek,
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    }
                                  );
                                }
                              }}
                              className={commonInput + " mt-2 h-11 rounded-xl"}
                            />
                            {availabilityError(index, "available_on")}
                            <span className="mt-1 block text-[10px] font-semibold text-black-blue/40">
                              {label(
                                "Only this exact date will use this slot.",
                                "الموعد ده هيظهر في التاريخ المحدد فقط."
                              )}
                            </span>
                          </label>

                          <label className="text-xs font-black text-black-blue">
                            {label("From", "من")}
                            <Input
                              type="time"
                              {...form.register(
                                availabilityField(index, "start_time")
                              )}
                              className={commonInput + " mt-2 h-11 rounded-xl"}
                            />
                            {availabilityError(index, "start_time")}
                          </label>

                          <label className="text-xs font-black text-black-blue">
                            {label("To", "إلى")}
                            <Input
                              type="time"
                              {...form.register(
                                availabilityField(index, "end_time")
                              )}
                              className={commonInput + " mt-2 h-11 rounded-xl"}
                            />
                            {availabilityError(index, "end_time")}
                            {tooShort ? (
                              <p className="mt-1 text-[10px] font-bold text-amber-700">
                                {label(
                                  "This slot is " + (duration - slotMinutes) + " min too short.",
                                  "هذا الموعد أقصر من مدة الدرس بـ " + (duration - slotMinutes) + " دقيقة."
                                )}
                              </p>
                            ) : null}
                          </label>

                          <label className="text-xs font-black text-black-blue">
                            {deliveryMode === "online"
                              ? label("Meeting URL", "رابط الاجتماع")
                              : label("Timezone", "المنطقة الزمنية")}
                            {deliveryMode === "online" ? (
                              <>
                                <Input
                                  type="url"
                                  placeholder="https://..."
                                  {...form.register(
                                    availabilityField(index, "meeting_url")
                                  )}
                                  className={commonInput + " mt-2 h-11 rounded-xl"}
                                />
                                {availabilityError(index, "meeting_url")}
                              </>
                            ) : (
                              <select
                                {...form.register(
                                  availabilityField(index, "timezone")
                                )}
                                className={commonInput + " mt-2 block h-11 w-full rounded-xl px-3"}
                              >
                                {timezones.map((timezone) => (
                                  <option
                                    key={timezone.value}
                                    value={timezone.value}
                                  >
                                    {timezone.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </label>

                          <div className="flex gap-2 lg:justify-end">
                            {deliveryMode === "online" && isFirstCustom ? (
                              <button
                                type="button"
                                onClick={() => copyMeetingLinkToAll(index)}
                                title={label(
                                  "Copy this link to every slot",
                                  "نسخ الرابط إلى كل المواعيد"
                                )}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-main/15 bg-main/[0.045] text-main transition hover:bg-main/10"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              title={label("Remove exception", "حذف الاستثناء")}
                              aria-label={label(
                                "Remove exception",
                                "حذف الاستثناء"
                              )}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-amber-200 bg-white/70 p-4 text-xs font-semibold text-amber-800/70">
                  {label(
                    "No one-off dates. Your weekly schedule will generate the bookable dates.",
                    "مفيش مواعيد استثنائية. الجدول الأسبوعي هو اللي هيولد مواعيد الحجز القادمة."
                  )}
                </p>
              )}
            </div>
          </section>
          {deliveryMode === "offline" ? (
            <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                    <MapPin className="h-3.5 w-3.5" />
                    06
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-black-blue">
                    {label("Offline delivery logic", "منطق الحضور")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-black-blue/50">
                    {label(
                      "Do not type an address into the lesson. Choose who moves and the system resolves the destination.",
                      "لا تكتب عنوانًا داخل الدرس. اختر من ينتقل والنظام يحدد المكان تلقائيًا."
                    )}
                  </p>
                </div>

                <div
                  className={
                    "rounded-2xl px-4 py-3 text-xs font-black " +
                    (offlineReady
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-800")
                  }
                >
                  {offlineReady
                    ? label("Offline setup ready", "الحضور مضبوط")
                    : label("Offline setup needs attention", "الحضور يحتاج استكمال")}
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  {
                    value: "teacher_to_student" as const,
                    title: label(
                      "Teacher goes to student",
                      "المعلم يذهب إلى الطالب"
                    ),
                    description: label(
                      "Student profile location is used at booking. You only select your active service areas.",
                      "يُستخدم موقع الطالب المحفوظ عند الحجز. أنت فقط تحدد مناطق خدمتك النشطة."
                    ),
                    icon: <UsersRound className="h-5 w-5" />,
                  },
                  {
                    value: "student_to_teacher" as const,
                    title: label(
                      "Student goes to teacher",
                      "الطالب يذهب إلى المعلم"
                    ),
                    description: label(
                      "Your teacher profile location becomes the teaching destination.",
                      "موقع التدريس المحفوظ في ملف المعلم يصبح مكان الحصة."
                    ),
                    icon: <MapPin className="h-5 w-5" />,
                  },
                ].map((option) => {
                  const selected = offlineVisitType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "offline_visit_type",
                          option.value,
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        )
                      }
                      className={
                        "rounded-2xl border p-4 text-start transition " +
                        (selected
                          ? "border-main bg-main/[0.055] ring-2 ring-main/10"
                          : "border-black-blue/[0.08] hover:border-main/25")
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " +
                            (selected
                              ? "bg-main text-white"
                              : "bg-main/10 text-main")
                          }
                        >
                          {option.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-black text-black-blue">
                            {option.title}
                            {selected ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : null}
                          </span>
                          <span className="mt-1.5 block text-xs leading-5 text-black-blue/50">
                            {option.description}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {offlineVisitType === "teacher_to_student" ? (
                <div className="mt-4 rounded-2xl border border-main/10 bg-main/[0.025] p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-black-blue">
                        {label("Service areas", "مناطق الخدمة")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-black-blue/50">
                        {label(
                          "Students outside these active areas cannot request this lesson.",
                          "الطلاب خارج المناطق النشطة المحددة لن يتمكنوا من طلب الدرس."
                        )}
                      </p>

                      {isLoadingServiceAreas ? (
                        <div className="mt-4 rounded-xl bg-white px-3 py-3 text-xs font-semibold text-black-blue/45">
                          {label(
                            "Loading service areas...",
                            "جاري تحميل مناطق الخدمة..."
                          )}
                        </div>
                      ) : activeServiceAreas.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-semibold leading-5 text-amber-800">
                          {label(
                            "No active service areas found. Configure them from your teacher profile first.",
                            "لا توجد مناطق خدمة نشطة. اضبطها من ملف المعلم أولًا."
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {activeServiceAreas.map((area) => {
                            const checked =
                              selectedServiceAreaIds.includes(area.id);

                            return (
                              <button
                                type="button"
                                key={area.id}
                                onClick={() => {
                                  const next = checked
                                    ? selectedServiceAreaIds.filter(
                                        (id) => id !== area.id
                                      )
                                    : [...selectedServiceAreaIds, area.id];

                                  form.setValue(
                                    "service_area_ids",
                                    next,
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    }
                                  );
                                }}
                                className={
                                  "flex items-start gap-3 rounded-xl border p-3 text-start transition " +
                                  (checked
                                    ? "border-main bg-white ring-1 ring-main/20"
                                    : "border-black-blue/[0.08] bg-white hover:border-main/20")
                                }
                              >
                                <span
                                  className={
                                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border " +
                                    (checked
                                      ? "border-main bg-main text-white"
                                      : "border-black-blue/15 bg-white")
                                  }
                                >
                                  {checked ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : null}
                                </span>
                                <span className="min-w-0">
                                  <span className="block break-words text-sm font-black text-black-blue">
                                    {area.name}
                                  </span>
                                  <span className="mt-1 block text-[11px] font-semibold text-black-blue/40">
                                    {label("Radius", "النطاق")}: {area.radius_km} km
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {error("service_area_ids")}
                    </div>
                  </div>
                </div>
              ) : offlineVisitType === "student_to_teacher" ? (
                <div
                  className={
                    "mt-4 flex items-start gap-3 rounded-2xl border p-4 " +
                    (locationReadyForTeacher
                      ? "border-emerald-100 bg-emerald-50"
                      : "border-amber-100 bg-amber-50")
                  }
                >
                  {locationReadyForTeacher ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <p className="font-black text-black-blue">
                      {label("Teacher location", "موقع المعلم")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-black-blue/55">
                      {locationReadyForTeacher
                        ? label(
                            "Ready. The lesson will use the address and coordinates already saved in your teacher profile.",
                            "جاهز. سيتم استخدام العنوان والإحداثيات المحفوظة بالفعل في ملف المعلم."
                          )
                        : label(
                            "Your teaching location is incomplete. Complete your profile location before publishing this lesson.",
                            "موقع التدريس في ملفك غير مكتمل. أكمل بيانات الموقع في الملف الشخصي قبل نشر الدرس."
                          )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-black-blue/10 bg-[#FBFDFC] px-4 py-4 text-sm font-bold text-black-blue/50">
                  {label(
                    "Choose who moves to finish the offline setup.",
                    "اختر من ينتقل حتى يكتمل إعداد الدرس الحضوري."
                  )}
                </p>
              )}

              {error("offline_visit_type")}
            </section>
          ) : null}

          <section className="rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                <ImageIcon className="h-3.5 w-3.5" />
                {deliveryMode === "offline" ? "07" : "06"}
              </div>
              <h2 className="mt-3 text-2xl font-black text-black-blue">
                {label("Lesson cover", "صورة الدرس")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-black-blue/50">
                {action === "create"
                  ? label(
                      "A clear cover helps the lesson stand out in the teacher catalog.",
                      "صورة واضحة تساعد الدرس يظهر بشكل أفضل في قائمة دروس المعلم."
                    )
                  : label(
                      "Replace the image only when you actually need to.",
                      "غيّر الصورة فقط عندما يكون هناك سبب فعلي."
                    )}
              </p>
            </div>

            <div className="mt-5">
              <ImageUpload
                title={label("Lesson cover image", "صورة غلاف الدرس")}
                file={file}
                setFile={setFile}
                existingUrl={
                  action === "update" ? lesson?.logo ?? undefined : undefined
                }
              />
              {!isImageReady ? (
                <p className="mt-2 flex items-center gap-2 text-xs font-bold text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  {label(
                    "Required before first publish.",
                    "مطلوبة قبل أول نشر."
                  )}
                </p>
              ) : null}
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-[24px] border border-main/10 bg-main/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-main" />
              <div>
                <p className="font-black text-black-blue">
                  {statusText}
                </p>
                <p className="mt-1 text-xs leading-5 text-black-blue/50">
                  {label(
                    action === "create"
                      ? "Submitting sends the lesson to the admin team for review. It becomes public only after approval."
                      : "The save button below is unlocked only when the lesson is internally consistent.",
                    action === "create"
                      ? "زر النشر يجعل الدرس عامًا فورًا بعد اجتياز كل التحقق."
                      : "زر الحفظ لا يتفعل إلا لما يكون الدرس متسق داخليًا وكل البيانات المطلوبة مكتملة."
                  )}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
              {action === "update" && hasChanges ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    setFile(null);
                    form.reset();
                  }}
                  className="h-12 rounded-xl border-black-blue/10 px-5 font-black text-black-blue"
                >
                  {label("Discard changes", "تجاهل التعديلات")}
                </Button>
              ) : null}

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (action === "update" && !hasChanges)
                }
                aria-disabled={
                  isSubmitting || (action === "update" && !hasChanges)
                }
                className="h-12 rounded-xl bg-main px-6 font-black text-white hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
              {isSubmitting ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="me-2 h-4 w-4" />
              )}
                {action === "create"
                  ? label("Submit for review", "إرسال للمراجعة")
                  : label(
                      hasChanges ? "Save changes" : "No changes",
                      hasChanges ? "حفظ التعديلات" : "لا توجد تعديلات"
                    )}
              </Button>
            </div>
          </div>
        </div>

        <aside className="min-w-0">
          <div className="sticky top-5 space-y-4">
            <section className="overflow-hidden rounded-[24px] border border-black-blue/[0.07] bg-white shadow-[0_16px_45px_rgba(33,55,75,0.07)]">
              <div className="border-b border-black-blue/[0.06] bg-[#FBFDFC] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-main">
                      {label("Live preview", "معاينة مباشرة")}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-black-blue">
                      {title?.trim() ||
                        label("Untitled lesson", "درس بدون عنوان")}
                    </h3>
                  </div>
                  <span
                    className={
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " +
                      (deliveryMode === "online"
                        ? "bg-main/10 text-main"
                        : "bg-blue-50 text-blue-600")
                    }
                  >
                    {deliveryMode === "online" ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-2xl border border-black-blue/[0.06] bg-[#F7FAF9] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black-blue/35">
                    {label("Target", "الهدف")}
                  </p>
                  <p className="mt-1 font-black text-black-blue">
                    {selectedSubject?.name ||
                      label("Subject not selected", "المادة لم تحدد")}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-black-blue/45">
                    {grade?.trim() ||
                      label("Grade not selected", "الصف لم يحدد")}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-black-blue/[0.06] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black-blue/30">
                      {label("Mode", "النوع")}
                    </p>
                    <p className="mt-1 text-sm font-black text-black-blue">
                      {deliveryMode === "online"
                        ? label("Online", "أونلاين")
                        : label("Offline", "حضوري")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black-blue/[0.06] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black-blue/30">
                      {label("Booking", "الحجز")}
                    </p>
                    <p className="mt-1 text-sm font-black text-black-blue">
                      {bookingType === "group"
                        ? label("Group", "جماعي")
                        : label("Private", "خاص")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-black-blue/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-main" />
                      <span className="text-sm font-black text-black-blue">
                        {duration} {label("min", "دقيقة")}
                      </span>
                    </div>
                    <span className="text-sm font-black text-main">
                      {price === 0
                        ? label("Free", "مجاني")
                        : `${price.toFixed(2)} EGP`}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-black-blue/45">
                    {sessionsCount}{" "}
                    {label(
                      sessionsCount === 1 ? "session" : "sessions",
                      sessionsCount === 1 ? "حصة" : "حصص"
                    )}
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-black-blue/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-black-blue">
                      {label("Schedule", "المواعيد")}
                    </p>
                    <span className="text-xs font-bold text-main" dir="ltr">
                      {availabilityValues.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {availabilityValues.slice(0, 4).map((slot, index) => {
                      const day = days.find(
                        (item) => item.value === Number(slot.day_of_week)
                      );

                      return (
                        <div
                          key={`${slot.available_on || slot.day_of_week}-${slot.start_time}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl bg-[#F7FAF9] px-3 py-2.5 text-xs"
                        >
                          <span className="font-black text-black-blue" dir="ltr">
                            {slot.available_on || (day ? (isArabic ? day.ar : day.en) : "—")}
                          </span>
                          <span className="font-bold text-black-blue/55" dir="ltr">
                            {slot.start_time}–{slot.end_time}
                          </span>
                        </div>
                      );
                    })}

                    {availabilityValues.length > 4 ? (
                      <p className="px-1 text-[11px] font-bold text-black-blue/35">
                        +{availabilityValues.length - 4}{" "}
                        {label("more slots", "مواعيد أخرى")}
                      </p>
                    ) : null}

                    {availabilityValues.length === 0 ? (
                      <p className="text-xs font-semibold text-amber-700">
                        {label(
                          "No booking time added yet.",
                          "لم تتم إضافة مواعيد للحجز بعد."
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {readiness.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 rounded-xl border border-black-blue/[0.05] px-3 py-2.5"
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      )}
                      <span
                        className={
                          item.done
                            ? "text-xs font-bold text-black-blue/60"
                            : "text-xs font-black text-black-blue"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-main/10 bg-main/[0.035] p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                <div>
                  <p className="font-black text-black-blue">
                    {label("Logic first", "المنطق أولًا")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-black-blue/50">
                    {label(
                      "Changing online/offline clears irrelevant settings. Private/group controls capacity. Schedule validation checks overlap and makes sure every slot can actually fit the lesson duration.",
                      "تغيير أونلاين/حضوري يمسح الإعدادات غير المرتبطة. الخاص/الجماعي يتحكم في السعة. والجدول يمنع التداخل ويتأكد أن كل موعد يكفي مدة الدرس."
                    )}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </form>
  );
};

export default SmartLessonForm;
