import { Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
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
import {
  useCreateTeacherLessonContent,
  useGetTeacherLessons,
} from "@/lib/react-query/teacher/lessons";

interface IProps {
  children: ReactNode;
}
const CreateLessonContent = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;

  const { data: lessons } = useGetTeacherLessons(token);
  const lessonsOptions = lessons?.data.map((lesson) => ({
    label: lesson.title,
    value: lesson.id.toString(),
  }));
  const form = useForm<z.infer<typeof lessonContentSchema>>({
    resolver: zodResolver(lessonContentSchema),
    defaultValues: {
      lessonId: "",
      description: "",
      title: "",
    },
  });

  const { mutateAsync: createContent, isPending } =
    useCreateTeacherLessonContent();

  const onSubmit = async ({
    lessonId,
    title,
    description,
  }: z.infer<typeof lessonContentSchema>) => {
    try {
      const { message, status } = await createContent({
        token,
        content: {
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
      <div onClick={() => setIsOpen(true)} className="w-full px-2 py-3">
        {children}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        title="Create Lesson Content"
        description={{
          text: "Create new lesson content",
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

export default CreateLessonContent;
