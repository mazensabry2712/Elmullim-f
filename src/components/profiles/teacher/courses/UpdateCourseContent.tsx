import { Loader2, PencilLine, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import handleResError from "@/utils/handleResponseError";
import cookieService from "@/utils/cookieService";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateTeacherCourseContent } from "@/lib/react-query/teacher/courses";
import { courseContentSchema } from "@/validations/teacher/courseSchema";
import { IContent } from "@/interfaces/courses/contents";
import { useI18n } from "@/i18n";
import { toast } from "react-toastify";

interface IProps {
  courseContent: IContent;
  courseId: number;
}

const UpdateCourseContent = ({ courseContent, courseId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";

  const initialValues = {
    courseId: courseId.toString(),
    title: courseContent.title || "",
    description: courseContent.description || "",
  };

  const form = useForm<z.infer<typeof courseContentSchema>>({
    resolver: zodResolver(courseContentSchema),
    defaultValues: initialValues,
  });

  const { mutateAsync: updateContent, isPending } =
    useUpdateTeacherCourseContent();

  const openEditor = () => {
    form.reset(initialValues);
    setIsOpen(true);
  };

  const closeEditor = () => {
    if (isPending) return;
    setIsOpen(false);
    form.reset(initialValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openEditor();
    } else {
      closeEditor();
    }
  };

  const onSubmit = async (values: z.infer<typeof courseContentSchema>) => {
    try {
      const response = await updateContent({
        token,
        content: {
          id: courseContent.id.toString(),
          courseId: courseId.toString(),
          title: values.title.trim(),
          description: values.description.trim(),
        },
      });

      if (!response.status) {
        toast.error(
          response.message ||
            (isArabic ? "تعذر تحديث المحتوى." : "Unable to update this content.")
        );
        return;
      }

      toast.success(
        response.message ||
          (isArabic ? "تم تحديث المحتوى بنجاح." : "Content updated successfully.")
      );
      setIsOpen(false);
      form.reset(initialValues);
    } catch (error) {
      handleResError(error);
    }
  };

  const titleError = form.formState.errors.title?.message;
  const descriptionError = form.formState.errors.description?.message;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={openEditor}
        disabled={isPending}
        aria-label={isArabic ? "تعديل المحتوى" : "Edit content"}
        title={isArabic ? "تعديل المحتوى" : "Edit content"}
        aria-haspopup="dialog"
        className="h-9 w-9 shrink-0 rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <PencilLine className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogPortal>
          <DialogOverlay className="z-[1000] bg-slate-950/45 backdrop-blur-[2px]" />
          <DialogPrimitive.Content
            dir={isArabic ? "rtl" : "ltr"}
            className="fixed left-1/2 top-1/2 z-[1001] grid max-h-[min(90dvh,48rem)] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.24)] outline-none"
          >
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <DialogTitle className="pe-10 text-start text-xl font-extrabold text-slate-900">
                {isArabic ? "تعديل المحتوى" : "Edit course content"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-start text-sm leading-6 text-slate-500">
                {isArabic
                  ? "عدّل عنوان المحتوى ووصفه، ثم احفظ التغييرات."
                  : "Update the content title and description, then save your changes."}
              </DialogDescription>
              <DialogClose
                disabled={isPending}
                aria-label={isArabic ? "إغلاق نافذة التعديل" : "Close edit dialog"}
                className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </DialogClose>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 px-6 py-6 sm:px-7"
                noValidate
              >
                <input type="hidden" {...form.register("courseId")} />

                <div className="space-y-2">
                  <label htmlFor={\`course-content-title-\${courseContent.id}\`} className="block text-sm font-bold text-slate-700">
                    {isArabic ? "عنوان المحتوى" : "Content title"}
                  </label>
                  <input
                    id={\`course-content-title-\${courseContent.id}\`}
                    {...form.register("title")}
                    autoComplete="off"
                    maxLength={255}
                    aria-invalid={Boolean(titleError)}
                    aria-describedby={titleError ? \`course-content-title-error-\${courseContent.id}\` : undefined}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 aria-[invalid=true]:border-rose-300 aria-[invalid=true]:focus:ring-rose-500/10"
                    placeholder={isArabic ? "مثال: مقدمة الوحدة الأولى" : "e.g. Introduction to unit one"}
                  />
                  {titleError ? (
                    <p id={\`course-content-title-error-\${courseContent.id}\`} className="text-sm font-medium text-rose-600">
                      {String(titleError)}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor={\`course-content-description-\${courseContent.id}\`} className="block text-sm font-bold text-slate-700">
                    {isArabic ? "وصف المحتوى" : "Content description"}
                  </label>
                  <textarea
                    id={\`course-content-description-\${courseContent.id}\`}
                    {...form.register("description")}
                    rows={5}
                    maxLength={5000}
                    aria-invalid={Boolean(descriptionError)}
                    aria-describedby={descriptionError ? \`course-content-description-error-\${courseContent.id}\` : undefined}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 aria-[invalid=true]:border-rose-300 aria-[invalid=true]:focus:ring-rose-500/10"
                    placeholder={isArabic ? "اكتب وصفًا واضحًا للمحتوى..." : "Describe what this section covers..."}
                  />
                  {descriptionError ? (
                    <p id={\`course-content-description-error-\${courseContent.id}\`} className="text-sm font-medium text-rose-600">
                      {String(descriptionError)}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEditor}
                    disabled={isPending}
                    className="min-h-11 rounded-xl border-slate-200 px-5 text-slate-700"
                  >
                    {isArabic ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="min-h-11 rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    {isPending
                      ? isArabic ? "جارٍ الحفظ..." : "Saving..."
                      : isArabic ? "حفظ التعديلات" : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default UpdateCourseContent;
