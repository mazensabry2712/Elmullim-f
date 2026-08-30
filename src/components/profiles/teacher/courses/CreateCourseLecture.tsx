import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
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
  useCreateTeacherCourseLecture,
  useGetTeacherCourseContents,
  useGetTeacherCourses,
} from "@/lib/react-query/teacher/courses";
import {
  courseContentSchema,
  courseLectureSchema,
} from "@/validations/teacher/courseSchema";
import { COURSE_LECTURE_INPUTS } from "@/constant";

interface IProps {
  children: ReactNode;
}
const CreateCourseLecture = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const [courseId, setCourseId] = useState("");

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
      courseId: "",
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
      <div onClick={() => setIsOpen(true)} className="w-full px-2 py-3">
        {children}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title="Create Course Lecture"
        description={{
          text: "Create new course lecture",
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
                  name={input.name as keyof z.infer<typeof courseContentSchema>}
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
                Create
                {isPending && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </AlertDialogFooter>
          </motion.form>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCourseLecture;
