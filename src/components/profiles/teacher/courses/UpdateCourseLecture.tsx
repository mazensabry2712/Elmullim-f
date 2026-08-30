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
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import {
  useGetTeacherCourseContents,
  useGetTeacherCourses,
  useUpdateTeacherCourseLecture,
} from "@/lib/react-query/teacher/courses";
import { courseLectureSchema } from "@/validations/teacher/courseSchema";
import { COURSE_LECTURE_INPUTS } from "@/constant";
import { ILecture } from "@/interfaces/courses/lectures";

interface IProps {
  lecture: ILecture;
  courseLectureId: number;
  contentId: number;
}
const UpdateCourseLecture = ({
  lecture,
  courseLectureId,
  contentId,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const [courseId, setCourseId] = useState(courseLectureId.toString() || "");

  const { data: courses } = useGetTeacherCourses(token);
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
      courseId: courseLectureId.toString() || "",
      contentId: contentId.toString() || "",
      description: lecture.description || "",
      title: lecture.title || "",
    },
  });

  const { mutateAsync: updateLecture, isPending } =
    useUpdateTeacherCourseLecture();

  const onSubmit = async ({
    courseId,
    contentId,
    title,
    description,
  }: z.infer<typeof courseLectureSchema>) => {
    try {
      const { message, status } = await updateLecture({
        token,
        lecture: {
          id: lecture.id.toString(),
          courseId,
          contentId,
          title,
          description,
        },
      });
      if (!status)
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });

      Swal.fire({
        icon: "success",
        title: "Success",
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
      if (name === "courseId") {
        setCourseId(value.courseId as string);
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
      >
        <Pen className="w-4 h-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title="Update Course Lecture"
        description={{
          text: "You can update course lecture here.",
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
            {COURSE_LECTURE_INPUTS.map((input) => (
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

            <AlertDialogFooter className="text-start gap-2">
              <AlertDialogCancel
                onClick={handleCloseModal}
                className="text-black py-2.5 h-auto"
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isPending}
                className="py-2.5 h-auto bg-main hover:bg-main/90"
              >
                Update
                {isPending && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </AlertDialogFooter>
          </motion.form>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateCourseLecture;
