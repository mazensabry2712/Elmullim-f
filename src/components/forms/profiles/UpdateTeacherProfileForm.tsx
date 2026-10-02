import { Form } from "@/components/ui/form";
import { COURSES_TYPE, UPDATE_TEACHER_PROFILE } from "@/constant";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import RenderProfileFormFields from "./RenderProfileFormFields";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LoaderCircle,
  Save,
  UserRound,
} from "lucide-react";
import { containerVariants, itemVariants } from "@/animations";
import { useEffect, useMemo, useState } from "react";
import {
  useGetAllCountries,
  useGetAllEducationLevels,
  useGetAllEducationSystems,
  useGetAllSubjects,
} from "@/lib/react-query/main";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import {
  useGetTeacherProfile,
  useUpdateTeacherProfile,
} from "@/lib/react-query/teacher/teacherProfile";
import { updateTeacherProfileSchema } from "@/validations/teacher/teacherProfile";
import Swal from "sweetalert2";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

const fieldInput = (name: string) =>
  UPDATE_TEACHER_PROFILE.find((input) => input.name === name);

const UpdateTeacherProfileForm = () => {
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = getAuthCopy(language);
  const isArabic = language === "ar";
  const { data, isLoading } = useGetTeacherProfile(token);
  const teacher = data?.data;

  const [countryId, setCountryId] = useState("");
  const [educationSystemId, setEducationSystemId] = useState("");
  const [educationLevelId, setEducationLevelId] = useState("");
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");

  const { data: countries } = useGetAllCountries();
  const { data: educationSystems, isLoading: isLoadingSystems } =
    useGetAllEducationSystems(countryId);
  const { data: educationLevels, isLoading: isLoadingLevels } =
    useGetAllEducationLevels(educationSystemId);
  const { data: subjects, isLoading: isLoadingSubjects } =
    useGetAllSubjects(educationLevelId);

  const countriesOptions = useMemo(
    () =>
      countries?.data.map((country) => ({
        label: `${country.code} - ${country.name}`,
        value: String(country.id),
      })) ?? [],
    [countries]
  );

  const educationSystemsOptions = useMemo(
    () =>
      educationSystems?.data.map((system) => ({
        label: system.name,
        value: String(system.id),
      })) ?? [],
    [educationSystems]
  );

  const educationLevelsOptions = useMemo(
    () =>
      educationLevels?.data.map((level) => ({
        label: level.name,
        value: String(level.id),
      })) ?? [],
    [educationLevels]
  );

  const subjectsOptions = useMemo(
    () =>
      subjects?.data?.map((subject) => ({
        label: subject.name,
        value: String(subject.id),
      })) ?? [],
    [subjects]
  );

  const { mutateAsync: updateTeacherProfile, isPending } =
    useUpdateTeacherProfile();

  const form = useForm<z.infer<typeof updateTeacherProfileSchema>>({
    resolver: zodResolver(updateTeacherProfileSchema),
    defaultValues: {
      name: "",
      education_system_id: "",
      education_level_id: "",
      email: "",
      gender: "",
      phone: "",
      address: "",
      profile_image: undefined,
      country_id: "",
      description: "",
      course_type: [],
      cv: undefined,
      experince: 0,
      qualification: "",
      subjects: [],
    },
  });

  const selectedProfileImage = useWatch({
    control: form.control,
    name: "profile_image",
  });

  const selectedCv = useWatch({
    control: form.control,
    name: "cv",
  });

  const sections = {
    basic: ["name", "email", "phone", "gender", "address"],
    teaching: [
      "country_id",
      "education_system_id",
      "education_level_id",
      "experince",
      "qualification",
      "course_type",
      "subjects",
    ],
  };

  const options = {
    countries: countriesOptions,
    educationSystems: educationSystemsOptions,
    educationLevels: educationLevelsOptions,
    subjects: subjectsOptions,
    coursesType: COURSES_TYPE.map((option) => ({
      value: option.value,
      label:
        isArabic
          ? option.value === "private"
            ? "خاص"
            : option.value === "online"
              ? "أونلاين"
              : option.value === "offline"
                ? "حضوري"
                : "مجموعات"
          : option.value === "private"
            ? "Private"
            : option.value === "online"
              ? "Online"
              : option.value === "offline"
                ? "Offline"
                : "Group",
    })),
  };

  const renderField = (name: string) => {
    const input = fieldInput(name);
    if (!input) return null;

    return (
      <motion.div
        key={input.name}
        variants={itemVariants}
        className="min-w-0"
      >
        <RenderProfileFormFields
          input={input}
          form={form}
          schema={updateTeacherProfileSchema}
          options={options}
        />
      </motion.div>
    );
  };

  const onSubmit = async ({
    email,
    gender,
    name,
    phone,
    address,
    education_level_id,
    country_id,
    education_system_id,
    subjects,
    profile_image,
    description,
    course_type,
    qualification,
    cv,
    experince,
  }: z.infer<typeof updateTeacherProfileSchema>) => {
    try {
      const { status, message } = await updateTeacherProfile({
        token,
        dataForm: {
          subjects,
          country_id,
          education_system_id,
          education_level_id,
          email,
          gender,
          name,
          phone,
          address,
          description,
          profile_image,
          course_type,
          experince,
          qualification,
          cv,
        },
      });

      if (!status) {
        await Swal.fire({
          title: copy.error,
          text: message!,
          icon: "error",
          confirmButtonColor: "#0AB79B",
        });
        return;
      }

      await Swal.fire({
        title: copy.success,
        text:
          message ||
          (isArabic
            ? "تم تحديث بيانات الملف الشخصي بنجاح"
            : "Your profile has been updated successfully."),
        icon: "success",
        confirmButtonColor: "#0AB79B",
      });

      navigate("/profile");
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    if (!teacher) return;

    const nextCountryId =
      teacher.education_level?.education_system?.country?.id?.toString() || "";
    const nextEducationSystemId =
      teacher.education_level?.education_system?.id?.toString() || "";
    const nextEducationLevelId = teacher.education_level?.id?.toString() || "";

    setCountryId(nextCountryId);
    setEducationSystemId(nextEducationSystemId);
    setEducationLevelId(nextEducationLevelId);

    form.reset({
      name: teacher.name || "",
      phone: teacher.phone || "",
      address: teacher.address || "",
      email: teacher.email || "",
      gender: teacher.gender || "",
      description: teacher.description || "",
      country_id: nextCountryId,
      education_system_id: nextEducationSystemId,
      education_level_id: nextEducationLevelId,
      course_type: teacher.course_types || [],
      experince:
        teacher.experince == null ? undefined : Number(teacher.experince),
      qualification: teacher.qualification || "",
      subjects: teacher.subjects?.map((subject) => subject.id.toString()) || [],
      profile_image: undefined,
      cv: undefined,
    });
  }, [form, teacher]);

  useEffect(() => {
    if (!(selectedProfileImage instanceof File)) {
      setProfilePreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedProfileImage);
    setProfilePreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedProfileImage]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country_id") {
        const nextCountryId = value.country_id as string;
        setCountryId(nextCountryId);
        form.setValue("education_system_id", "");
        form.setValue("education_level_id", "");
        form.setValue("subjects", []);
      }

      if (name === "education_system_id") {
        const nextEducationSystemId = value.education_system_id as string;
        setEducationSystemId(nextEducationSystemId);
        form.setValue("education_level_id", "");
        form.setValue("subjects", []);
      }

      if (name === "education_level_id") {
        const nextEducationLevelId = value.education_level_id as string;
        setEducationLevelId(nextEducationLevelId);
        form.setValue("subjects", []);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const profileImage =
    profilePreviewUrl || teacher?.profile_image || "/images/teacher-profile.png";

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-main/20 bg-main/5">
              <img
                src={profileImage}
                alt={teacher?.name || "Teacher"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 text-start">
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-main">
                {isArabic ? "تعديل الملف الشخصي" : "Profile editor"}
              </p>
              <h2 className="truncate font-epilogue text-xl font-bold text-black-blue sm:text-2xl">
                {teacher?.name || (isArabic ? "بيانات المعلم" : "Teacher profile")}
              </h2>
            </div>
          </div>

          <div className="rounded-xl bg-main/5 px-4 py-3 text-start text-xs leading-5 text-black-blue/70 sm:max-w-sm">
            {isArabic
              ? "حدّث بياناتك التعليمية ووسائل التواصل والملفات الشخصية من مكان واحد."
              : "Update your teaching information, contact details and profile files from one place."}
          </div>
        </div>

        <div className="space-y-5 px-5 pb-6 sm:px-6 md:px-8">
          <motion.section
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sora text-lg font-bold text-black-blue md:text-xl">
                  {isArabic ? "البيانات الأساسية" : "Basic information"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-black-blue/55 md:text-sm">
                  {isArabic
                    ? "بيانات التواصل والمعلومات الشخصية الأساسية."
                    : "Your contact and essential personal information."}
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {sections.basic.map(renderField)}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sora text-lg font-bold text-black-blue md:text-xl">
                  {isArabic ? "البيانات التعليمية والتدريسية" : "Education & teaching"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-black-blue/55 md:text-sm">
                  {isArabic
                    ? "اختيارات التعليم والمواد وأنواع التدريس والخبرة."
                    : "Education, subjects, teaching types and experience."}
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {sections.teaching.map(renderField)}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sora text-lg font-bold text-black-blue md:text-xl">
                  {isArabic ? "النبذة المهنية" : "Professional profile"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-black-blue/55 md:text-sm">
                  {isArabic
                    ? "اكتب نبذة مختصرة ومفيدة تساعد الطلاب وأولياء الأمور على التعرف عليك."
                    : "Add a concise introduction that helps students and parents know you."}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              {renderField("description")}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sora text-lg font-bold text-black-blue md:text-xl">
                  {isArabic ? "الملفات الشخصية" : "Profile files"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-black-blue/55 md:text-sm">
                  {isArabic
                    ? "يمكنك تغيير صورة الملف الشخصي ورفع سيرة ذاتية جديدة عند الحاجة."
                    : "Change your profile image and upload a new CV when needed."}
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-dashed border-main/25 bg-white p-4">
                <div className="mb-4 flex items-center gap-2 text-main">
                  <ImageIcon className="h-4 w-4" />
                  <span className="font-sora text-sm font-semibold">
                    {isArabic ? "صورة الملف الشخصي" : "Profile image"}
                  </span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50">
                    <img
                      src={profileImage}
                      alt={teacher?.name || "Teacher profile"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {renderField("profile_image")}
                    <p className="mt-2 text-[11px] leading-5 text-black-blue/50">
                      {isArabic
                        ? "JPG / JPEG / PNG / WEBP حتى 5MB"
                        : "JPG / JPEG / PNG / WEBP up to 5MB"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-dashed border-main/25 bg-white p-4">
                <div className="mb-4 flex items-center gap-2 text-main">
                  <FileText className="h-4 w-4" />
                  <span className="font-sora text-sm font-semibold">
                    {isArabic ? "السيرة الذاتية" : "Curriculum Vitae"}
                  </span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="font-sora text-sm font-semibold text-black-blue">
                    {selectedCv instanceof File
                      ? selectedCv.name
                      : teacher?.cv
                        ? isArabic
                          ? "يوجد ملف CV محفوظ حاليًا"
                          : "A CV is currently uploaded"
                        : isArabic
                          ? "لم يتم رفع سيرة ذاتية"
                          : "No CV uploaded"}
                  </p>
                  <p className="mt-1 text-xs text-black-blue/50">
                    {selectedCv instanceof File
                      ? `${(selectedCv.size / 1024 / 1024).toFixed(2)} MB`
                      : isArabic
                        ? "رفع ملف جديد سيستبدل الملف الحالي."
                        : "Uploading a new file will replace the current CV."}
                  </p>
                </div>

                <div className="mt-4">
                  {renderField("cv")}
                  <p className="mt-2 text-[11px] leading-5 text-black-blue/50">
                    {isArabic
                      ? "PDF / DOC / DOCX حتى 10MB"
                      : "PDF / DOC / DOCX up to 10MB"}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="sticky bottom-0 z-20 border-t border-gray-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 md:px-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              disabled={isPending}
              className="h-12 w-full border-gray-200 bg-white font-sora text-black-blue hover:bg-gray-50 sm:w-auto"
            >
              <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>

            <Button
              disabled={isPending || isLoadingSystems || isLoadingLevels || isLoadingSubjects}
              type="submit"
              className="h-12 w-full bg-main px-6 font-sora font-semibold text-white shadow-sm hover:bg-main/90 sm:w-auto"
            >
              {isPending ? (
                <LoaderCircle className="me-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="me-2 h-5 w-5" />
              )}
              {isArabic ? "حفظ التعديلات" : "Save changes"}
            </Button>
          </div>
        </div>
      </motion.form>
    </Form>
  );
};

export default UpdateTeacherProfileForm;
