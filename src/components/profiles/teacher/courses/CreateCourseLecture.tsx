import { Loader2, X } from "lucide-react";
import { cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useId, useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import Swal from "sweetalert2";
import { Form, FormField } from "@/components/ui/form";
import InputFormItem from "@/components/forms/formItems/InputFormItem";
import { Button } from "@/components/ui/button";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import {
  useCreateTeacherCourseLecture,
  useGetTeacherCourseContents,
  useGetTeacherCourses,
} from "@/lib/react-query/teacher/courses";
import {
  courseLectureSchema,
} from "@/validations/teacher/courseSchema";
import { COURSE_LECTURE_INPUTS } from "@/constant";
import { useI18n } from "@/i18n";

interface IProps {
  children: ReactNode;
  courseId?: number;
}

const CreateCourseLecture = ({ children, courseId: fixedCourseId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const token = cookieService.getToken()!;
  const [courseId, setCourseId] = useState(fixedCourseId?.toString() || "");
  const { language } = useI18n();

  const { data: courses } = useGetTeacherCourses(token, !fixedCourseId);
  const coursesOptions = courses?.data.map((course) => ({
    label: course.title,
    value: course.id.toString(),
  }));

  const { data: contents } = useGetTeacherCourseContents({ token, courseId });
  const contentsOptions = contents?.data.map((content) => ({
    label: content.title,
    value: content.id.toString(),
  }));

  const form = useForm<z.infer<typeof courseLectureSchema>>({
    resolver: zodResolver(courseLectureSchema),
    defaultValues: {
      courseId: fixedCourseId?.toString() || "",
      contentId: "",
      description: "",
      title: "",
    },
  });

  const { mutateAsync: createLecture, isPending } =
    useCreateTeacherCourseLecture();

  const onSubmit = async ({
    courseId,
    contentId,
    title,
    description,
  }: z.infer<typeof courseLectureSchema>) => {
    try {
      const { message, status } = await createLecture({
        token,
        lecture: {
          courseId,
          contentId,
          title,
          description,
        },
      });

      if (!status)
        return Swal.fire({
          icon: "error",
          title: language === "ar" ? "حدث خطأ" : "Oops...",
          text: message,
        });

      Swal.fire({
        icon: "success",
        title: language === "ar" ? "تم بنجاح" : "Success",
        text: message,
      });
      handleCloseModal();
    } catch (error) {
      handleResError(error);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    form.reset({
      courseId: fixedCourseId?.toString() || "",
      contentId: "",
      description: "",
      title: "",
    });
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "courseId") {
        setCourseId(value.courseId as string);
        form.setValue("contentId", "");
      }
    });

  

  return () => subscription.unsubscribe();
  }, [form]);

  const childOnClick = isValidElement(children)
    ? (children.props as { onClick?: React.MouseEventHandler }).onClick
    : undefined;
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{
        onClick?: React.MouseEventHandler;
        "aria-expanded"?: boolean;
        "aria-controls"?: string;
      }>, {
        onClick: (event: React.MouseEvent) => {
          childOnClick?.(event);
          setIsOpen((current) => !current);
        },
        "aria-expanded": isOpen,
        "aria-controls": panelId,
      })
    : children;

  return (
    <>
      <div className="relative w-full sm:w-auto">
        <div className="w-full">{trigger}</div>

        {isOpen ? (
          <section
        id={panelId}
        role="region"
        aria-label={language === "ar" ? "إنشاء محاضرة للكورس" : "Create course lecture"}
        className="absolute start-0 top-full z-[100] mt-2 w-[min(34rem,calc(100vw-2rem))] max-h-[min(75vh,42rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl sm:p-6"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === "ar" ? "إضافة محاضرة للكورس" : "Add course lecture"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {language === "ar" ? "اختر قسم المحتوى ثم أدخل بيانات المحاضرة." : "Choose a content section, then enter the lecture details."}
            </p>
          </div>
          <button type="button" onClick={handleCloseModal} disabled={isPending} aria-label={language === "ar" ? "إغلاق النموذج" : "Close form"} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </header>
        <Form {...form}>
          <motion.form
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 text-black-blue"
          >
            {(fixedCourseId
              ? COURSE_LECTURE_INPUTS.filter((input) => input.name !== "courseId")
              : COURSE_LECTURE_INPUTS
            ).map((input) => (
              <motion.div
                variants={itemVariants}
                key={input.name}
                custom={input.name}
              >
                <FormField
                  control={form.control}
                  name={input.name as keyof z.infer<typeof courseLectureSchema>}
                  render={({ field }) =>
                    input.name === "courseId" ? (
                      <SelectFormItem
                        label
                        field={field}
                        input={input}
                        options={coursesOptions || []}
                      />
                    ) : input.name === "contentId" ? (
                      <SelectFormItem
                        label
                        field={field}
                        input={input}
                        options={contentsOptions || []}
                      />
                    ) : (
                      <InputFormItem
                        field={
                          field as unknown as ControllerRenderProps<
                            FieldValues,
                            string
                          >
                        }
                        input={input}
                        label
                      />
                    )
                  }
                />
              </motion.div>
            ))}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isPending} className="min-h-11">
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isPending} className="min-h-11 bg-emerald-600 text-white hover:bg-emerald-700">
                {isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                {language === "ar" ? "إنشاء المحاضرة" : "Create lecture"}
              </Button>
            </div>
          </motion.form>
        </Form>
          </section>
        ) : null}
      </div>
    </>
  );
};

export default CreateCourseLecture;
