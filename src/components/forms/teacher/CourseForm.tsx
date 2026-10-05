import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { COURSE_INPUTS } from "@/constant";
import { ICourse } from "@/interfaces/courses/courses";
import { courseSchema } from "@/validations/teacher/courseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RenderCourseFormItems from "./RenderCourseFormItems";
import CourseBuilderSection, {
  type CoursePublishingStatus,
} from "./CourseBuilderSection";
import { useGetCategories, useGetSubCategory } from "@/lib/react-query/main";
import { Loader2 } from "lucide-react";
import handleResError from "@/utils/handleResponseError";
import { toast } from "react-toastify";
import {
  useCreateTeacherCourse,
  useUpdateTeacherCourse,
} from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import Swal from "sweetalert2";
import { useI18n } from "@/i18n";

interface IProps {
  action: "create" | "update";
  course?: ICourse;
}

const CourseForm = ({ course }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(
    course?.id ?? null
  );
  const [activeCourseStatus, setActiveCourseStatus] =
    useState<CoursePublishingStatus>(
      course?.publishing_status || "draft"
    );

  const [categoryId, setCategoryId] = useState(
    course?.sub_category.category.id.toString() || ""
  );

  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const { data: categories } = useGetCategories();
  const categoriesOptions = categories?.data.map((cate) => ({
    label: cate.name,
    value: cate.id.toString(),
  }));

  const { data: subCategories } = useGetSubCategory(categoryId);
  const subCategoriesOptions = subCategories?.data.map((cate) => ({
    label: cate.name,
    value: cate.id.toString(),
  }));

  const { mutateAsync: createCourse, isPending: isCreating } =
    useCreateTeacherCourse();
  const { mutateAsync: updateCourse, isPending: isUpdating } =
    useUpdateTeacherCourse();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      price: Number(course?.price) || 0,
      level: course?.level || "",
      sub_category_id: course?.sub_category.id.toString() || "",
      category_id: course?.sub_category.category.id.toString() || "",
    },
  });

  const effectiveCourseId = activeCourseId ?? course?.id ?? null;
  const isEditable =
    activeCourseStatus === "draft" || activeCourseStatus === "rejected";

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    try {
      if (effectiveCourseId) {
        const { status, message } = await updateCourse({
          token,
          course: {
            id: effectiveCourseId,
            description: data.description,
            level: data.level,
            price: data.price,
            sub_category_id: data.sub_category_id,
            title: data.title,
            image: file,
          },
        });

        if (!status) {
          return Swal.fire({
            icon: "error",
            title: language === "ar" ? "حدث خطأ" : "Oops...",
            text: message ?? undefined,
          });
        }

        Swal.fire({
          icon: "success",
          title: language === "ar" ? "تم بنجاح" : "Done",
          text: message ?? undefined,
        });

        return;
      }

      if (!file) {
        return toast.error(
          language === "ar"
            ? "صورة الكورس مطلوبة"
            : "Course picture is required"
        );
      }

      const {
        message,
        status,
        data: createdCourse,
      } = await createCourse({
        token,
        course: {
          title: data.title,
          description: data.description,
          level: data.level,
          price: data.price,
          sub_category_id: data.sub_category_id,
          image: file,
        },
      });

      if (!status) {
        return Swal.fire({
          icon: "error",
          title: language === "ar" ? "حدث خطأ" : "Oops...",
          text: message ?? undefined,
        });
      }

      await Swal.fire({
        icon: "success",
        title: language === "ar" ? "تم إنشاء الكورس" : "Course created",
        text:
          language === "ar"
            ? "تم إنشاء الكورس كمسودة. يمكنك الآن إضافة المحتوى والمحاضرات والفيديو والاختبارات من نفس الصفحة."
            : "The course was created as a draft. You can now add content, lectures, videos and quizzes from this page.",
      });

      if (createdCourse?.id) {
        setActiveCourseId(createdCourse.id);
        setActiveCourseStatus("draft");
      }
    } catch (error) {
      handleResError(error);
    }
  };

  useEffect(() => {
    if (course?.id) {
      setActiveCourseId(course.id);
      setActiveCourseStatus(course.publishing_status || "draft");
    }

    form.reset({
      title: course?.title || "",
      category_id: course?.sub_category.category.id.toString() || "",
      description: course?.description || "",
      level: course?.level || "",
      price: Number(course?.price) || 0,
      sub_category_id: course?.sub_category.id.toString() || "",
    });
  }, [course, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "category_id") {
        setCategoryId(value.category_id as string);
        form.setValue("sub_category_id", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="max-w-full w-full lg:max-w-[40%]">
            <ImageUpload
              file={file}
              setFile={setFile}
              title={
                language === "ar"
                  ? "اضغط لرفع صورة الكورس"
                  : "Click to upload course picture"
              }
            />
          </div>

          <div className="max-w-full w-full lg:max-w-[60%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COURSE_INPUTS.map((input) => (
                <RenderCourseFormItems
                  key={input.name}
                  form={form}
                  input={input}
                  schema={courseSchema}
                  options={{
                    categories: categoriesOptions!,
                    subCategories: subCategoriesOptions!,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-main hover:bg-main/90 h-auto py-3 w-full sm:w-fit px-4"
          disabled={isCreating || isUpdating || !isEditable}
        >
          {effectiveCourseId
            ? language === "ar"
              ? "حفظ بيانات الكورس"
              : "Save Course Details"
            : language === "ar"
              ? "إنشاء كورس جديد"
              : "Create New Course"}
          {(isCreating || isUpdating) && (
            <Loader2 className="animate-spin" size={24} />
          )}
        </Button>
      </form>

      {effectiveCourseId ? (
        <CourseBuilderSection
          courseId={effectiveCourseId}
          status={activeCourseStatus}
          publishingNote={course?.publishing_note}
          onStatusChange={setActiveCourseStatus}
        />
      ) : null}
    </Form>
  );
};

export default CourseForm;
