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
import { useNavigate } from "react-router-dom";

interface IProps {
  action: "create" | "update";
  course?: ICourse;
}
const CourseForm = ({ action, course }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(
    course?.sub_category.category.id.toString() || ""
  );
  const navigate = useNavigate();
  const token = cookieService.getToken()!;
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

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    try {
      if (action === "update") {
        const { status, message } = await updateCourse({
          token,
          course: {
            id: course?.id as number,
            description: data.description,
            level: data.level,
            price: data.price,
            sub_category_id: data.sub_category_id,
            title: data.title,
            image: file,
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
        navigate("/profile", {
          state: {
            myCourses: true,
          },
        });
        form.reset();
        return;
      }
      if (action === "create") {
        if (!file) return toast.error("Course picture is required");
        const { message, status } = await createCourse({
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
    const subscription = form.watch((value, { name }) => {
      if (name === "category_id") {
        setCategoryId(value.category_id as string);
        form.setValue("sub_category_id", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    form.reset({
      title: course?.title || "",
      category_id: course?.sub_category.category.id.toString() || "",
      description: course?.description || "",
      level: course?.level || "",
      price: Number(course?.price) || 0,
      sub_category_id: course?.sub_category.id.toString() || "",
    });
  }, [course, form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="max-w-full w-full lg:max-w-[40%]">
            <ImageUpload
              file={file}
              setFile={setFile}
              title="Click to upload course picture"
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
          className="bg-main hover:bg-main/90 h-auto py-3 w-full sm:w-fit px-4"
          disabled={isCreating || isUpdating}
        >
          {action === "update" ? "Update Course" : "Create New course"}
          {(isCreating || isUpdating) && (
            <Loader2 className="animate-spin" size={24} />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;
