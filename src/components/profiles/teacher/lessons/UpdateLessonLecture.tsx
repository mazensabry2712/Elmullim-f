import { Loader2, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import { Form, FormField } from "@/components/ui/form";
import InputFormItem from "@/components/forms/formItems/InputFormItem";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import { LESSON_LECTURE_INPUTS } from "@/constant";
import { ILecture } from "@/interfaces/courses/lectures";
import { lessonLectureSchema } from "@/validations/teacher/lessonSchema";
import {
  useGetTeacherLessonContents,
  useGetTeacherLessons,
  useUpdateTeacherLessonLecture,
} from "@/lib/react-query/teacher/lessons";
import { useI18n } from "@/i18n";

interface IProps {
  lecture: ILecture;
  lessonLectureId: string;
  contentId: string;
}

const UpdateLessonLecture = ({ lecture, lessonLectureId, contentId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const [lessonId, setLessonId] = useState(lessonLectureId.toString() || "");
  const { language } = useI18n();

  const { data: lessons } = useGetTeacherLessons(token);
  const lessonsOptions = lessons?.data.map((lesson) => ({
    label: lesson.title,
    value: lesson.id.toString(),
  }));

  const { data: contents } = useGetTeacherLessonContents({ token, lessonId });
  const contentsOptions = contents?.data.map((content) => ({
    label: content.title,
    value: content.id.toString(),
  }));

  const form = useForm<z.infer<typeof lessonLectureSchema>>({
    resolver: zodResolver(lessonLectureSchema),
    defaultValues: {
      lessonId: lessonId.toString() || "",
      contentId: contentId.toString() || "",
      description: lecture.description || "",
      title: lecture.title || "",
    },
  });

  const { mutateAsync: updateLecture, isPending } = useUpdateTeacherLessonLecture();

  const onSubmit = async ({ lessonId, contentId, title, description }: z.infer<typeof lessonLectureSchema>) => {
    try {
      const { message, status } = await updateLecture({
        token,
        lecture: {
          id: lecture.id.toString(),
          lessonId,
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
    } catch (error) {
      handleResError(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    form.reset();
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "lessonId") {
        setLessonId(value.lessonId as string);
        form.setValue("contentId", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-600/90"
        size={"icon"}
        aria-label={language === "ar" ? "تحديث المحاضرة" : "Update lecture"}
        title={language === "ar" ? "تحديث المحاضرة" : "Update lecture"}
      >
        <Pen className="w-4 h-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title={language === "ar" ? "تحديث محاضرة الدرس" : "Update Lesson Lecture"}
        description={{
          text:
            language === "ar"
              ? "يمكنك تحديث محاضرة الدرس من هنا"
              : "You can update lesson lecture here.",
        }}
        showFooter={false}
      >
        <Form {...form}>
          <motion.form
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 text-black-blue"
          >
            {LESSON_LECTURE_INPUTS.map((input) => (
              <motion.div variants={itemVariants} key={input.name} custom={input.name}>
                <FormField
                  control={form.control}
                  name={input.name as keyof z.infer<typeof lessonLectureSchema>}
                  render={({ field }) =>
                    input.name === "lessonId" ? (
                      <SelectFormItem label field={field} input={input} options={lessonsOptions || []} />
                    ) : input.name === "contentId" ? (
                      <SelectFormItem label field={field} input={input} options={contentsOptions || []} />
                    ) : (
                      <InputFormItem
                        field={field as unknown as ControllerRenderProps<FieldValues, string>}
                        input={input}
                        label
                      />
                    )
                  }
                />
              </motion.div>
            ))}

            <AlertDialogFooter className="text-start gap-2">
              <AlertDialogCancel onClick={handleCloseModal} className="text-black py-2.5 h-auto">
                {language === "ar" ? "إلغاء" : "Cancel"}
              </AlertDialogCancel>
              <Button type="submit" disabled={isPending} className="py-2.5 h-auto bg-main hover:bg-main/90">
                {language === "ar" ? "تحديث" : "Update"}
                {isPending && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </AlertDialogFooter>
          </motion.form>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateLessonLecture;
