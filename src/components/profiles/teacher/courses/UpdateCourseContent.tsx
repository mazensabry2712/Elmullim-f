import { Loader2, Pen } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { COURSE_CONTENT_INPUTS } from "@/constant";
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
  useGetTeacherCourses,
  useUpdateTeacherCourseContent,
} from "@/lib/react-query/teacher/courses";
import { courseContentSchema } from "@/validations/teacher/courseSchema";
import { IContent } from "@/interfaces/courses/contents";

interface IProps {
  courseContent: IContent;
  courseId: number;
}

const UpdateCourseContent = ({ courseContent, courseId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;

  const { data: courses } = useGetTeacherCourses(token);
  const coursesOptions = courses?.data.map((course) => ({
    label: course.title,
    value: course.id.toString(),
  }));
  const form = useForm<z.infer<typeof courseContentSchema>>({
    resolver: zodResolver(courseContentSchema),
    defaultValues: {
      courseId: courseId.toString() || "",
      description: courseContent.description || "",
      title: courseContent.title || "",
    },
  });

  const { mutateAsync: updateContent, isPending } =
    useUpdateTeacherCourseContent();

  const onSubmit = async ({
    courseId,
    title,
    description,
  }: z.infer<typeof courseContentSchema>) => {
    try {
      const { message, status } = await updateContent({
        token,
        content: {
          id: courseContent.id.toString(),
          courseId,
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

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-500/90"
        size="icon"
      >
        <Pen className="w-4 h-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title="Update Course Content"
        description={{
          text: "You can update course content here",
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
            {COURSE_CONTENT_INPUTS.map((input) => (
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

export default UpdateCourseContent;
