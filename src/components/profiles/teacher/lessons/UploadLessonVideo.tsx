import VideoUpload from "@/components/shared/VideoUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";

import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { z } from "zod";
import { LESSON_VIDEO_INPUTS } from "@/constant";
import { lessonVideoSchema } from "@/validations/teacher/lessonSchema";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import Swal from "sweetalert2";
import { Progress } from "@/components/ui/progress";
import { useGetTeacherLessonContents, useGetTeacherLessonLectures, useGetTeacherLessons, useUploadLessonVideo } from "@/lib/react-query/teacher/lessons";

const UploadLessonVideo = () => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [lessonId, setLessonId] = useState("");
  const [contentId, setContentId] = useState("");

  const token = cookieService.getToken()!;
  const { data: lessons } = useGetTeacherLessons(token);
  const lessonsOptions = lessons?.data.map((lesson) => ({
    label: lesson.title,
    value: lesson.id.toString(),
  }));
  const { data: contents } = useGetTeacherLessonContents({ lessonId, token });
  const contentsOptions = contents?.data.map((content) => ({
    label: content.title,
    value: content.id.toString(),
  }));
  const { data: lectures } = useGetTeacherLessonLectures({
    contentId,
    lessonId,
    token,
  });
  const lecturesOptions = lectures?.data.map((lecture) => ({
    label: lecture.title,
    value: lecture.id.toString(),
  }));

  const { mutateAsync: uploadVideo, isPending } =
    useUploadLessonVideo(setProgress);

  const form = useForm<z.infer<typeof lessonVideoSchema>>();

  const onSubmit = async ({
    contentId,
    lessonId,
    lectureId,
  }: z.infer<typeof lessonVideoSchema>) => {
    try {
      if (!file) return toast.error("Video is required");
      const { message, status } = await uploadVideo({
        token,
        video: {
          contentId,
          lessonId,
          lectureId,
          video: file,
        },
      });

      if (!status)
        return Swal.fire({
          icon: "error",
          title: "Oops..",
          text: message,
        });

      // Upload success
      Swal.fire({
        icon: "success",
        title: "Done",
        text: message,
      });
      form.reset();
      setLessonId("");
      setContentId("");
      setProgress(0);
      setFile(null);
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "lessonId") {
        setLessonId(value.lessonId as string);
        form.setValue("contentId", "");
        form.setValue("lectureId", "");
        setContentId("");
      }
      if (name === "contentId") {
        setContentId(value.contentId as string);
        form.setValue("lectureId", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>Upload video to lecture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="max-w-4xl w-full xl:w-[70%] space-y-4">
                <VideoUpload
                  title="Click to upload video"
                  file={file}
                  setFile={setFile}
                />
                {progress ? (
                  <div className="flex items-center justify-center gap-4">
                    <Progress value={progress} className="[&>div]:bg-main" />
                    <p className="font-semibold flex justify-center items-center">
                      {progress}%
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="xl:w-[30%]">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="text-black-blue grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1"
                >
                  {LESSON_VIDEO_INPUTS.map((input) => (
                    <motion.div
                      variants={itemVariants}
                      key={input.name}
                      custom={input.name}
                    >
                      <FormField
                        control={form.control}
                        name={
                          input.name as keyof z.infer<typeof lessonVideoSchema>
                        }
                        render={({ field }) =>
                          input.name === "lessonId" ? (
                            <SelectFormItem
                              label
                              field={field}
                              input={input}
                              options={lessonsOptions || []}
                            />
                          ) : input.name === "contentId" ? (
                            <SelectFormItem
                              label
                              field={field}
                              input={input}
                              options={contentsOptions || []}
                            />
                          ) : (
                            <SelectFormItem
                              label
                              field={field}
                              input={input}
                              options={lecturesOptions || []}
                            />
                          )
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
            <Button
              className="bg-main hover:bg-main/90 h-auto py-3 w-full sm:w-fit px-4"
              disabled={isPending}
            >
              Upload Video
              {isPending && <Loader2 className="animate-spin" size={24} />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadLessonVideo;
