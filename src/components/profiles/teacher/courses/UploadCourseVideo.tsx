import VideoUpload from "@/components/shared/VideoUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import {
  useGetTeacherCourseLectures,
  useGetTeacherCourseContents,
  useGetTeacherCourses,
  useUploadCourseVideo,
} from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import { z } from "zod";
import { VIDEO_INPUTS } from "@/constant";
import { courseVideoSchema } from "@/validations/teacher/courseSchema";
import SelectFormItem from "@/components/forms/formItems/SelectFormItem";
import Swal from "sweetalert2";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/i18n";

interface IProps {
  children?: ReactNode;
  courseId?: number;
  contentId?: number;
  lectureId?: number;
}

const UploadCourseVideo = ({
  children,
  courseId: fixedCourseId,
  contentId: fixedContentId,
  lectureId: fixedLectureId,
}: IProps) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [courseId, setCourseId] = useState(fixedCourseId?.toString() || "");
  const [contentId, setContentId] = useState(fixedContentId?.toString() || "");
  const { language } = useI18n();

  const token = cookieService.getToken()!;
  const { data: courses } = useGetTeacherCourses(token, !fixedCourseId);
  const coursesOptions = courses?.data.map((course) => ({
    label: course.title,
    value: course.id.toString(),
  }));
  const { data: contents } = useGetTeacherCourseContents({
    courseId,
    token,
    enabled: !!courseId && !fixedContentId,
  });
  const contentsOptions = contents?.data.map((content) => ({
    label: content.title,
    value: content.id.toString(),
  }));
  const { data: lectures } = useGetTeacherCourseLectures({
    contentId,
    courseId,
    token,
    enabled: !!courseId && !!contentId && !fixedLectureId,
  });
  const lecturesOptions = lectures?.data.map((lecture) => ({
    label: lecture.title,
    value: lecture.id.toString(),
  }));

  const { mutateAsync: uploadVideo, isPending } =
    useUploadCourseVideo(setProgress);

  const form = useForm<z.infer<typeof courseVideoSchema>>({
    defaultValues: {
      courseId: fixedCourseId?.toString() || "",
      contentId: fixedContentId?.toString() || "",
      lectureId: fixedLectureId?.toString() || "",
    },
  });

  const resetForm = () => {
    form.reset({
      courseId: fixedCourseId?.toString() || "",
      contentId: fixedContentId?.toString() || "",
      lectureId: fixedLectureId?.toString() || "",
    });
    setCourseId(fixedCourseId?.toString() || "");
    setContentId(fixedContentId?.toString() || "");
    setProgress(0);
    setFile(null);
  };

  const onSubmit = async ({
    contentId: submittedContentId,
    courseId: submittedCourseId,
    lectureId: submittedLectureId,
  }: z.infer<typeof courseVideoSchema>) => {
    try {
      if (!file) {
        toast.error(language === "ar" ? "الفيديو مطلوب" : "Video is required");
        return;
      }

      const { message, status } = await uploadVideo({
        token,
        video: {
          contentId: submittedContentId,
          courseId: submittedCourseId,
          lectureId: submittedLectureId,
          video: file,
        },
      });

      if (!status) {
        await Swal.fire({
          icon: "error",
          title: language === "ar" ? "حدث خطأ" : "Oops..",
          text: message,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: language === "ar" ? "تم بنجاح" : "Done",
        text: message,
      });

      resetForm();
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "courseId" && !fixedCourseId) {
        setCourseId(value.courseId as string);
        form.setValue("contentId", "");
        form.setValue("lectureId", "");
        setContentId("");
          }
      if (name === "contentId" && !fixedContentId) {
        setContentId(value.contentId as string);
        form.setValue("lectureId", "");
          }
    });

    return () => subscription.unsubscribe();
  }, [fixedContentId, fixedCourseId, form]);

  const fields = fixedCourseId
    ? fixedLectureId
      ? []
      : VIDEO_INPUTS.filter((input) =>
          fixedContentId
            ? input.name === "lectureId"
            : input.name !== "courseId",
        )
    : VIDEO_INPUTS;

  const content = (
    <CardContent className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="max-w-4xl w-full xl:w-[70%] space-y-4">
              <VideoUpload
                title={language === "ar" ? "اضغط لرفع الفيديو" : "Click to upload video"}
                file={file}
                setFile={setFile}
              />
              {progress ? (
                <div className="flex items-center justify-center gap-4">
                  <Progress value={progress} className="[&>div]:bg-main" />
                  <p className="font-semibold">{progress}%</p>
                </div>
              ) : null}
            </div>
            {!!fields.length && (
              <div className="xl:w-[30%]">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="text-black-blue grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1"
                >
                  {fields.map((input) => (
                    <motion.div
                      variants={itemVariants}
                      key={input.name}
                      custom={input.name}
                    >
                      <FormField
                        control={form.control}
                        name={input.name as keyof z.infer<typeof courseVideoSchema>}
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
            )}
          </div>
          <Button
            className="bg-main hover:bg-main/90 h-auto py-3 w-full sm:w-fit px-4"
            disabled={isPending}
          >
            {fixedCourseId
              ? language === "ar"
                ? "رفع فيديو للمحاضرة"
                : "Upload lecture video"
              : language === "ar"
                ? "رفع الفيديو"
                : "Upload Video"}
            {isPending && <Loader2 className="animate-spin" size={24} />}
          </Button>
        </form>
      </Form>
    </CardContent>
  );

  if (children) {
    return (
      <>
        <div className="mt-3">{children}</div>
        {content}
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === "ar" ? "رفع فيديو" : "Upload Video"}</CardTitle>
        <CardDescription>
          {language === "ar" ? "رفع فيديو للمحاضرة" : "Upload video to lecture"}
        </CardDescription>
      </CardHeader>
      {content}
    </Card>
  );
};

export default UploadCourseVideo;
