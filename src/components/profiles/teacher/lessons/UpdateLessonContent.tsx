import { Loader2, Pen } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { LESSON_CONTENT_INPUTS } from "@/constant";
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
import { lessonContentSchema } from "@/validations/teacher/lessonSchema";
import { IContent } from "@/interfaces/courses/contents";
import {
  useGetTeacherLessons,
  useUpdateTeacherLessonContent,
} from "@/lib/react-query/teacher/lessons";

interface IProps {
  lessonContent: IContent;
  lessonId: number;
}

const UpdateLessonContent = ({ lessonContent, lessonId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;

  const { data: lessons } = useGetTeacherLessons(token);
  const lessonsOptions = lessons?.data.map((course) => ({
    label: course.title,
    value: course.id.toString(),
  }));
  const form = useForm<z.infer<typeof lessonContentSchema>>({
    resolver: zodResolver(lessonContentSchema),
    defaultValues: {
      lessonId: lessonId.toString() || "",
      description: lessonContent.description || "",
      title: lessonContent.title || "",
    },
  });

  const { mutateAsync: updateContent, isPending } =
    useUpdateTeacherLessonContent();

  const onSubmit = async ({
    lessonId,
    title,
    description,
  }: z.infer<typeof lessonContentSchema>) => {
    try {
      const { message, status } = await updateContent({
        token,
        content: {
          id: lessonContent.id.toString(),
          lessonId,
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
        title="Update Lesson Content"
        description={{
          text: "You can update lesson content here",
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
            {LESSON_CONTENT_INPUTS.map((input) => (
              <motion.div
                variants={itemVariants}
                key={input.name}
                custom={input.name}
              >
                <FormField
                  control={form.control}
                  name={input.name as keyof z.infer<typeof lessonContentSchema>}
                  render={({ field }) =>
                    input.name === "lessonId" ? (
                      <SelectFormItem
                        label
                        field={field}
                        input={input}
                        options={lessonsOptions || []}
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

export default UpdateLessonContent;
