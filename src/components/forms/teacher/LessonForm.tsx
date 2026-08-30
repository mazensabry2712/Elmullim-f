import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LESSON_INPUTS } from "@/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import handleResError from "@/utils/handleResponseError";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import Swal from "sweetalert2";
import { ILesson } from "@/interfaces/courses/lessons";
import {
  useCreateTeacherLesson,
  useUpdateTeacherLesson,
} from "@/lib/react-query/teacher/lessons";
import { lessonSchema } from "@/validations/teacher/lessonSchema";
import RenderLessonFormItems from "./RenderLessonFormItems";
import { useNavigate } from "react-router-dom";

interface IProps {
  action: "create" | "update";
  lesson?: ILesson;
}
const LessonForm = ({ action, lesson }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { mutateAsync: CreateLesson, isPending: isCreating } =
    useCreateTeacherLesson();
  const { mutateAsync: UpdateLesson, isPending: isUpdating } =
    useUpdateTeacherLesson();
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      price: Number(lesson?.price) || 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof lessonSchema>) => {
    try {
      if (action === "update") {
        const { status, message } = await UpdateLesson({
          token,
          lesson: {
            id: lesson?.id as number,
            description: data.description,
            price: data.price,
            title: data.title,
            logo: file || undefined,
          },
        });
        if (!status)
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
          });

        // update success
        Swal.fire({
          icon: "success",
          title: "Done",
          text: message,
        });
        form.reset();
        navigate("/profile", { state: { myLessons: true } });
      }
      if (action === "create") {
        if (!file) return toast.error("Lesson picture is required");
        const { message, status } = await CreateLesson({
          token,
          lesson: {
            title: data.title,
            description: data.description,
            price: data.price,
            logo: file,
          },
        });
        if (!status)
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
          });

        // create success
        Swal.fire({
          icon: "success",
          title: "Done",
          text: message,
        });
        form.reset();
      }
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    form.reset({
      title: lesson?.title || "",
      description: lesson?.description || "",
      price: Number(lesson?.price) || 0,
    });
  }, [lesson, form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="max-w-full w-full lg:max-w-[40%]">
            <ImageUpload
              file={file}
              setFile={setFile}
              title="Click to upload lesson picture"
            />
          </div>
          <div className="max-w-full w-full lg:max-w-[60%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LESSON_INPUTS.map((input) => (
                <RenderLessonFormItems
                  key={input.name}
                  form={form}
                  input={input}
                  schema={lessonSchema}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          className="bg-main hover:bg-main/90 h-auto py-3 w-full sm:w-fit px-4"
          disabled={isCreating || isUpdating}
        >
          {action === "update" ? "Update Lesson" : "Create New lesson"}
          {(isCreating || isUpdating) && (
            <Loader2 className="animate-spin" size={24} />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LessonForm;
