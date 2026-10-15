import ImageUpload from "@/components/shared/ImageUpload";
import VideoUpload from "@/components/shared/VideoUpload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategories, useGetSubCategory } from "@/lib/react-query/main";
import {
  useCreateTeacherCourse,
  useCreateTeacherCourseContent,
  useCreateTeacherCourseLecture,
  useCreateTeacherCourseQuiz,
  useUpdateTeacherCourse,
  useUpdateTeacherCourseContent,
  useUpdateTeacherCourseLecture,
  useUpdateTeacherCourseQuiz,
  useSubmitTeacherCourseForReview,
  useUploadCourseVideo,
} from "@/lib/react-query/teacher/courses";
import { COURSE_LEVELS } from "@/constant";
import { courseSchema } from "@/validations/teacher/courseSchema";
import cookieService from "@/utils/cookieService";
import { getResponseErrorMessage } from "@/utils/handleResponseError";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useI18n } from "@/i18n";

interface QuizOptionDraft {
  title: string;
  is_correct: boolean;
}

interface QuizQuestionDraft {
  title: string;
  score: number;
  options: QuizOptionDraft[];
}

interface LectureDraft {
  id: string;
  title: string;
  description: string;
  video: File | null;
  quizEnabled: boolean;
  quizTitle: string;
  quizTimeLimit: number;
  questions: QuizQuestionDraft[];
}

interface ContentDraft {
  id: string;
  title: string;
  description: string;
  lectures: LectureDraft[];
}

const makeOption = (): QuizOptionDraft => ({
  title: "",
  is_correct: false,
});

const makeQuestion = (): QuizQuestionDraft => ({
  title: "",
  score: 10,
  options: [makeOption(), makeOption()],
});

const makeLecture = (): LectureDraft => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  video: null,
  quizEnabled: false,
  quizTitle: "",
  quizTimeLimit: 0,
  questions: [],
});

const makeContent = (): ContentDraft => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  lectures: [],
});

const getResourceId = (response: unknown): number | null => {
  const data = response as { data?: { id?: number | string } } | null;
  const id = data?.data?.id;
  return id != null ? Number(id) : null;
};

const COURSE_LEVEL_LABELS: Record<string, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
  expert: { ar: "خبير", en: "Expert" },
};

const CourseWizardForm = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [level, setLevel] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [contents, setContents] = useState<ContentDraft[]>([]);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [uploadingLectureId, setUploadingLectureId] = useState<string | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const persistedContentIds = useRef<Record<string, number>>({});
  const persistedLectureIds = useRef<Record<string, number>>({});
  const uploadedLectureIds = useRef<Set<string>>(new Set());
  const createdQuizLectureIds = useRef<Set<string>>(new Set());

  const { data: categories } = useGetCategories();
  const { data: subCategories } = useGetSubCategory(categoryId);

  const createCourse = useCreateTeacherCourse();
  const createContent = useCreateTeacherCourseContent();
  const createLecture = useCreateTeacherCourseLecture();
  const updateCourse = useUpdateTeacherCourse();
  const updateContentMutation = useUpdateTeacherCourseContent();
  const updateLectureMutation = useUpdateTeacherCourseLecture();
  const uploadVideo = useUploadCourseVideo(setUploadProgress);
  const createQuiz = useCreateTeacherCourseQuiz();
  const updateQuiz = useUpdateTeacherCourseQuiz();
  const submitForReview = useSubmitTeacherCourseForReview();

  const categoryOptions = useMemo(
    () =>
      categories?.data?.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })) || [],
    [categories]
  );

  const subCategoryOptions = useMemo(
    () =>
      subCategories?.data?.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })) || [],
    [subCategories]
  );

  const updateContent = (
    contentId: string,
    updates: Partial<ContentDraft>
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id === contentId ? { ...content, ...updates } : content
      )
    );
  };

  const updateLecture = (
    contentId: string,
    lectureId: string,
    updates: Partial<LectureDraft>
  ) => {
    if (updates.video !== undefined) {
      uploadedLectureIds.current.delete(lectureId);
    }

    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id === lectureId
                  ? { ...lecture, ...updates }
                  : lecture
              ),
            }
      )
    );
  };

  const updateQuestion = (
    contentId: string,
    lectureId: string,
    questionIndex: number,
    updates: Partial<QuizQuestionDraft>
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions: lecture.questions.map((question, index) =>
                        index === questionIndex
                          ? { ...question, ...updates }
                          : question
                      ),
                    }
              ),
            }
      )
    );
  };

  const updateOption = (
    contentId: string,
    lectureId: string,
    questionIndex: number,
    optionIndex: number,
    updates: Partial<QuizOptionDraft>
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions: lecture.questions.map((question, index) =>
                        index !== questionIndex
                          ? question
                          : {
                              ...question,
                              options: question.options.map((option, i) =>
                                i === optionIndex
                                  ? { ...option, ...updates }
                                  : option
                              ),
                            }
                      ),
                    }
              ),
            }
      )
    );
  };

  const markCorrect = (
    contentId: string,
    lectureId: string,
    questionIndex: number,
    optionIndex: number
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions: lecture.questions.map((question, index) =>
                        index !== questionIndex
                          ? question
                          : {
                              ...question,
                              options: question.options.map((option, i) => ({
                                ...option,
                                is_correct: i === optionIndex,
                              })),
                            }
                      ),
                    }
              ),
            }
      )
    );
  };

  const addContent = () => {
    setContents((current) => [...current, makeContent()]);
  };

  const removeContent = (contentId: string) => {
    setContents((current) =>
      current.length === 1
        ? current
        : current.filter((content) => content.id !== contentId)
    );
  };

  const addLecture = (contentId: string) => {
    setContents((current) =>
      current.map((content) =>
        content.id === contentId
          ? { ...content, lectures: [...content.lectures, makeLecture()] }
          : content
      )
    );
  };

  const removeLecture = (contentId: string, lectureId: string) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures:
                content.lectures.length === 1
                  ? content.lectures
                  : content.lectures.filter(
                      (lecture) => lecture.id !== lectureId
                    ),
            }
      )
    );
  };

  const addQuestion = (contentId: string, lectureId: string) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id === lectureId && lecture.questions.length < 50
                  ? {
                      ...lecture,
                      questions: [...lecture.questions, makeQuestion()],
                    }
                  : lecture
              ),
            }
      )
    );
  };

  const removeQuestion = (
    contentId: string,
    lectureId: string,
    questionIndex: number
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions:
                        lecture.questions.length === 1
                          ? lecture.questions
                          : lecture.questions.filter(
                              (_, index) => index !== questionIndex
                            ),
                    }
              ),
            }
      )
    );
  };

  const addOption = (
    contentId: string,
    lectureId: string,
    questionIndex: number
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions: lecture.questions.map((question, index) =>
                        index !== questionIndex || question.options.length >= 4
                          ? question
                          : {
                              ...question,
                              options: [...question.options, makeOption()],
                            }
                      ),
                    }
              ),
            }
      )
    );
  };

  const removeOption = (
    contentId: string,
    lectureId: string,
    questionIndex: number,
    optionIndex: number
  ) => {
    setContents((current) =>
      current.map((content) =>
        content.id !== contentId
          ? content
          : {
              ...content,
              lectures: content.lectures.map((lecture) =>
                lecture.id !== lectureId
                  ? lecture
                  : {
                      ...lecture,
                      questions: lecture.questions.map((question, index) =>
                        index !== questionIndex || question.options.length <= 2
                          ? question
                          : {
                              ...question,
                              options: question.options.filter(
                                (_, i) => i !== optionIndex
                              ),
                            }
                      ),
                    }
              ),
            }
      )
    );
  };

  const validate = (submitForReviewMode: boolean) => {
    if (!image && !createdCourseId) {
      toast.error(
        isArabic
          ? "صورة الكورس مطلوبة."
          : "Course picture is required."
      );
      return false;
    }

    if (!price.trim()) {
      toast.error(
        isArabic
          ? "أدخل السعر أو اكتب 0 إذا كان الكورس مجانيًا."
          : "Enter a price or use 0 if the course is free."
      );
      return false;
    }

    const courseDetails = courseSchema.safeParse({
      title,
      description,
      price,
      level,
      category_id: categoryId,
      sub_category_id: subCategoryId,
    });

    if (!courseDetails.success) {
      const field = courseDetails.error.issues[0]?.path[0];
      let message: string;

      if (field === "title") {
        message = !title.trim()
          ? (isArabic ? "عنوان الكورس مطلوب." : "Course title is required.")
          : (isArabic
              ? "اكتب عنوانًا واضحًا من 3 إلى 100 حرف، وتجنب تكرار الكلمات."
              : "Use a clear title of 3–100 characters and avoid repeated words.");
      } else if (field === "description") {
        message = !description.trim()
          ? (isArabic ? "وصف الكورس مطلوب." : "Course description is required.")
          : (isArabic
              ? "اكتب وصفًا واضحًا من 20 إلى 250 حرفًا، و3 كلمات على الأقل، دون تكرار."
              : "Use a clear 20–250 character description with at least 3 words and no repeated filler.");
      } else if (field === "price") {
        message = isArabic
          ? "أدخل سعرًا صحيحًا غير سالب. اكتب 0 إذا كان الكورس مجانيًا."
          : "Enter a valid, non-negative price. Use 0 for a free course.";
      } else if (field === "level") {
        message = isArabic ? "اختار مستوى الكورس." : "Choose a course level.";
      } else if (field === "category_id") {
        message = isArabic ? "اختار تصنيف الكورس." : "Choose a course category.";
      } else {
        message = isArabic
          ? "اختار التصنيف الفرعي للكورس."
          : "Choose a course subcategory.";
      }

      toast.error(message);
      return false;
    }

    if (submitForReviewMode && contents.length === 0) {
      toast.error(
        isArabic ? "أضف محتوى واحدًا على الأقل." : "Add at least one content."
      );
      return false;
    }

    const activeContents = contents.filter(
      (content) =>
        content.title.trim() ||
        content.description.trim() ||
        content.lectures.length > 0
    );

    for (let contentIndex = 0; contentIndex < activeContents.length; contentIndex += 1) {
      const content = activeContents[contentIndex];

      if (content.title.trim().length < 3) {
        toast.error(
          isArabic
            ? `عنوان المحتوى رقم ${contentIndex + 1} لازم يكون 3 أحرف على الأقل.`
            : `Content ${contentIndex + 1} title must be at least 3 characters.`
        );
        return false;
      }

      const contentDescription = content.description.trim();
      if (
        contentDescription &&
        (contentDescription.length < 20 ||
          contentDescription.split(/\s+/u).filter(Boolean).length < 3)
      ) {
        toast.error(
          isArabic
            ? `وصف المحتوى رقم ${contentIndex + 1} لازم يكون 20 حرفًا على الأقل و3 كلمات.`
            : `Content ${contentIndex + 1} description must be at least 20 characters and 3 words.`
        );
        return false;
      }

      if (submitForReviewMode && content.lectures.length === 0) {
        toast.error(
          isArabic
            ? `أضف محاضرة واحدة على الأقل للمحتوى رقم ${contentIndex + 1}.`
            : `Add at least one lecture to content ${contentIndex + 1}.`
        );
        return false;
      }

      for (let lectureIndex = 0; lectureIndex < content.lectures.length; lectureIndex += 1) {
        const lecture = content.lectures[lectureIndex];

        if (lecture.title.trim().length < 3) {
          toast.error(
            isArabic
              ? `عنوان المحاضرة رقم ${lectureIndex + 1} في المحتوى ${contentIndex + 1} لازم يكون 3 أحرف على الأقل.`
              : `Lecture ${lectureIndex + 1} in content ${contentIndex + 1} needs a title of at least 3 characters.`
          );
          return false;
        }

        const lectureDescription = lecture.description.trim();
        if (
          lectureDescription &&
          (lectureDescription.length < 20 ||
            lectureDescription.split(/\s+/u).filter(Boolean).length < 3)
        ) {
          toast.error(
            isArabic
              ? `وصف المحاضرة "${lecture.title}" لازم يكون 20 حرفًا على الأقل و3 كلمات.`
              : `Lecture "${lecture.title}" description must be at least 20 characters and 3 words.`
          );
          return false;
        }

        if (lecture.video) {
          const videoExtension = lecture.video.name.split(".").pop()?.toLowerCase();
          if (!["mp4", "mov", "avi", "wmv"].includes(videoExtension ?? "")) {
            toast.error(
              isArabic
                ? "فيديو المحاضرة لازم يكون بصيغة MP4 أو MOV أو AVI أو WMV."
                : "Lecture video must be MP4, MOV, AVI, or WMV."
            );
            return false;
          }
          if (lecture.video.size > 20_000 * 1024) {
            toast.error(
              isArabic
                ? "حجم فيديو المحاضرة لازم يكون 20 ميجابايت أو أقل."
                : "Lecture video must be 20 MB or smaller."
            );
            return false;
          }
        }

        if (submitForReviewMode && !lecture.video) {
          toast.error(
            isArabic
              ? `ارفع فيديو للمحاضرة "${lecture.title || lectureIndex + 1}" قبل الإرسال للمراجعة.`
              : `Upload a video for "${lecture.title || lectureIndex + 1}" before review.`
          );
          return false;
        }

        if (!lecture.quizEnabled) continue;

        if (submitForReviewMode && !lecture.video) {
          toast.error(
            isArabic
              ? `ارفع الفيديو أولًا قبل إضافة اختبار للمحاضرة "${lecture.title}".`
              : `Upload the video before adding a quiz to "${lecture.title}".`
          );
          return false;
        }

        if (!lecture.quizTitle.trim()) {
          toast.error(
            isArabic
              ? `عنوان الاختبار للمحاضرة "${lecture.title}" مطلوب.`
              : `Quiz title for "${lecture.title}" is required.`
          );
          return false;
        }

        if (lecture.questions.length === 0) {
          toast.error(
            isArabic
              ? `أضف سؤالًا واحدًا على الأقل للاختبار "${lecture.quizTitle}".`
              : `Add at least one question to "${lecture.quizTitle}".`
          );
          return false;
        }

        for (let questionIndex = 0; questionIndex < lecture.questions.length; questionIndex += 1) {
          const question = lecture.questions[questionIndex];
          const options = question.options.map((option) => ({
            ...option,
            title: option.title.trim(),
          }));

          if (!question.title.trim()) {
            toast.error(
              isArabic
                ? `السؤال رقم ${questionIndex + 1} مطلوب.`
                : `Question ${questionIndex + 1} is required.`
            );
            return false;
          }

          if (
            options.length < 2 ||
            options.some((option) => !option.title) ||
            options.filter((option) => option.is_correct).length !== 1
          ) {
            toast.error(
              isArabic
                ? `راجع إجابات السؤال رقم ${questionIndex + 1}: مطلوب من 2 إلى 4 إجابات وإجابة صحيحة واحدة.`
                : `Question ${questionIndex + 1} needs 2-4 options and exactly one correct answer.`
            );
            return false;
          }

          const normalized = options.map((option) =>
            option.title.toLocaleLowerCase()
          );
          if (new Set(normalized).size !== normalized.length) {
            toast.error(
              isArabic
                ? `إجابات السؤال رقم ${questionIndex + 1} يجب أن تكون مختلفة.`
                : `Options in question ${questionIndex + 1} must be unique.`
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  const save = async (submitForReviewMode: boolean) => {
    if (isSaving || !validate(submitForReviewMode)) return;

    setIsSaving(true);

    try {
      let courseId = createdCourseId;
      let courseWasCreatedNow = false;

      if (!courseId) {
        const response = await createCourse.mutateAsync({
          token,
          course: {
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            level,
            sub_category_id: subCategoryId,
            image,
          },
        });

        if (!response.status) {
          toast.error(response.message || (isArabic ? "تعذر إنشاء الكورس." : "Unable to create course."));
          return;
        }

        courseId = getResourceId(response);

        if (!courseId) {
          toast.error(
            isArabic
              ? "تم إنشاء الكورس لكن تعذر الحصول على رقمه."
              : "The course was created but its ID was not returned."
          );
          return;
        }

        setCreatedCourseId(courseId);
        courseWasCreatedNow = true;
      }

      if (!courseWasCreatedNow) {
        const response = await updateCourse.mutateAsync({
          token,
          course: {
            id: courseId,
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            level,
            sub_category_id: subCategoryId,
            image,
          },
        });

        if (!response.status) {
          throw new Error(
            response.message ||
              (isArabic
                ? "تعذر حفظ بيانات الكورس."
                : "Unable to save course details.")
          );
        }
      }

      for (const content of contents) {
        const hasContentData =
          content.title.trim() ||
          content.description.trim() ||
          content.lectures.length > 0;

        if (!hasContentData) continue;
        let contentId = persistedContentIds.current[content.id];

        if (!contentId) {
          const contentResponse = await createContent.mutateAsync({
            token,
            content: {
              courseId: courseId.toString(),
              title: content.title.trim(),
              description: content.description.trim(),
            },
          });

          if (!contentResponse.status) {
            throw new Error(
              contentResponse.message ||
                (isArabic ? "تعذر حفظ محتوى الكورس." : "Unable to save course content.")
            );
          }

          const createdContentId = getResourceId(contentResponse);

          if (!createdContentId) {
            throw new Error(
              isArabic
                ? "تم حفظ المحتوى لكن تعذر الحصول على رقمه."
                : "Content was saved but its ID was not returned."
            );
          }

          contentId = createdContentId;
          persistedContentIds.current[content.id] = createdContentId;
        } else if (!courseWasCreatedNow) {
          const contentResponse = await updateContentMutation.mutateAsync({
            token,
            content: {
              id: contentId.toString(),
              courseId: courseId.toString(),
              title: content.title.trim(),
              description: content.description.trim(),
            },
          });

          if (!contentResponse.status) {
            throw new Error(
              contentResponse.message ||
                (isArabic ? "تعذر تحديث محتوى الكورس." : "Unable to update course content.")
            );
          }
        }

        for (const lecture of content.lectures) {
          let lectureId = persistedLectureIds.current[lecture.id];

          if (!lectureId) {
            const lectureResponse = await createLecture.mutateAsync({
              token,
              lecture: {
                courseId: courseId.toString(),
                contentId: contentId.toString(),
                title: lecture.title.trim(),
                description: lecture.description.trim(),
              },
            });

            if (!lectureResponse.status) {
              throw new Error(
                lectureResponse.message ||
                  (isArabic
                    ? "تعذر حفظ المحاضرة."
                    : "Unable to save the lecture.")
              );
            }

            const createdLectureId = getResourceId(lectureResponse);

            if (!createdLectureId) {
              throw new Error(
                isArabic
                  ? "تم حفظ المحاضرة لكن تعذر الحصول على رقمها."
                  : "Lecture was saved but its ID was not returned."
              );
            }

            lectureId = createdLectureId;
            persistedLectureIds.current[lecture.id] = createdLectureId;
          } else if (!courseWasCreatedNow) {
            const lectureResponse = await updateLectureMutation.mutateAsync({
              token,
              lecture: {
                id: lectureId.toString(),
                courseId: courseId.toString(),
                contentId: contentId.toString(),
                title: lecture.title.trim(),
                description: lecture.description.trim(),
              },
            });

            if (!lectureResponse.status) {
              throw new Error(
                lectureResponse.message ||
                  (isArabic ? "تعذر تحديث المحاضرة." : "Unable to update the lecture.")
              );
            }
          }

          if (lecture.video && !uploadedLectureIds.current.has(lecture.id)) {
            setUploadingLectureId(lecture.id);
            setUploadProgress(0);

            const videoResponse = await uploadVideo.mutateAsync({
              token,
              video: {
                courseId: courseId.toString(),
                contentId: contentId.toString(),
                lectureId: lectureId.toString(),
                video: lecture.video,
              },
            });

            if (!videoResponse.status) {
              throw new Error(
                videoResponse.message ||
                  (isArabic
                    ? "تعذر رفع فيديو المحاضرة."
                    : "Unable to upload the lecture video.")
              );
            }

            uploadedLectureIds.current.add(lecture.id);
            setUploadingLectureId(null);
            setUploadProgress(0);
          }

          if (lecture.quizEnabled) {
            const quizResponse = createdQuizLectureIds.current.has(lecture.id)
              ? await updateQuiz.mutateAsync({
                  token,
                  quiz: {
                    courseId: courseId.toString(),
                    contentId: contentId.toString(),
                    lectureId: lectureId.toString(),
                    title: lecture.quizTitle.trim(),
                    timeLimit: Math.max(0, Number(lecture.quizTimeLimit) || 0),
                    questions: lecture.questions.map((question) => ({
                      title: question.title.trim(),
                      score: Math.max(1, Number(question.score) || 1),
                      options: question.options.map((option) => ({
                        title: option.title.trim(),
                        is_correct: option.is_correct,
                      })),
                    })),
                  },
                })
              : await createQuiz.mutateAsync({
                  token,
                  quiz: {
                    courseId: courseId.toString(),
                    contentId: contentId.toString(),
                    lectureId: lectureId.toString(),
                    title: lecture.quizTitle.trim(),
                    timeLimit: Math.max(0, Number(lecture.quizTimeLimit) || 0),
                    questions: lecture.questions.map((question) => ({
                      title: question.title.trim(),
                      score: Math.max(1, Number(question.score) || 1),
                      options: question.options.map((option) => ({
                        title: option.title.trim(),
                        is_correct: option.is_correct,
                      })),
                    })),
                  },
                });

            if (!quizResponse.status) {
              throw new Error(
                quizResponse.message ||
                  (isArabic
                    ? "تعذر حفظ الاختبار."
                    : "Unable to save the quiz.")
              );
            }

            createdQuizLectureIds.current.add(lecture.id);
          }
        }
      }

      setUploadingLectureId(null);
      setUploadProgress(0);

      if (submitForReviewMode) {
        const reviewResponse = await submitForReview.mutateAsync({
          token,
          id: courseId.toString(),
        });

        if (!reviewResponse.status) {
          throw new Error(
            reviewResponse.message ||
              (isArabic
                ? "تم حفظ الكورس لكن تعذر إرساله للمراجعة."
                : "The course was saved but could not be submitted for review.")
          );
        }
      }

      await Swal.fire({
        icon: "success",
        title: isArabic ? "تم حفظ الكورس" : "Course saved",
        text: submitForReviewMode
          ? isArabic
            ? "تم حفظ الكورس وإرساله للمراجعة."
            : "The course was saved and submitted for review."
          : isArabic
            ? "تم حفظ الكورس كمسودة."
            : "The course was saved as a draft.",
      });

      window.location.href = `/profile/my-courses/${courseId}/view`;
    } catch (error) {
      setUploadingLectureId(null);
      setUploadProgress(0);
      const apiMessage = getResponseErrorMessage(error);
      const responseStatus = (error as { response?: { status?: number } } | null)
        ?.response?.status;
      const message =
        apiMessage ||
        (responseStatus === 422
          ? isArabic
            ? "السيرفر رفض بعض البيانات. راجع تفاصيل الكورس والمحتوى والمحاضرات والفيديو."
            : "The server rejected some data. Check the course, content, lecture, and video details."
          : error instanceof Error
            ? error.message
            : isArabic
              ? "حدث خطأ أثناء حفظ الكورس."
              : "Something went wrong while saving the course.");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-black-blue">
      <section className="rounded-3xl border border-black-blue/10 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {isArabic ? "بيانات الكورس" : "Course Details"}
          </h2>
          <p className="mt-1 text-sm text-black-blue/60">
            {isArabic
              ? "أدخل معلومات الكورس الأساسية."
              : "Enter the basic course information."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <ImageUpload
            allowedFormats={["png", "jpg", "jpeg", "webp"]}
            file={image}
            setFile={setImage}
            title={
              isArabic ? "صورة الكورس *" : "Course Picture *"
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "العنوان *" : "Title *"}
              </label>
              <input
                id="course-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={100}
                aria-required="true"
                className="w-full rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
              />
              <p className="mt-1 text-end text-xs text-black-blue/50" aria-live="polite">
                {title.length}/100
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "الوصف *" : "Description *"}
              </label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={250}
                aria-required="true"
                className="min-h-28 rounded-xl border-black-blue/10"
              />
              <p className="mt-1 text-end text-xs text-black-blue/50" aria-live="polite">
                {description.length}/250
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "السعر (جنيه مصري) *" : "Price (EGP) *"}
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                aria-required="true"
                className="w-full rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
              />
              <p className="mt-1 text-xs text-black-blue/60">
                {isArabic
                  ? "اكتب 0 إذا كان الكورس مجانيًا."
                  : "Enter 0 if the course is free."}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "المستوى *" : "Level *"}
              </label>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
              >
                <option value="">
                  {isArabic ? "اختر المستوى" : "Choose Level..."}
                </option>
                {COURSE_LEVELS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {isArabic
                      ? COURSE_LEVEL_LABELS[item.value]?.ar ?? item.label
                      : COURSE_LEVEL_LABELS[item.value]?.en ?? item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "التصنيف *" : "Category *"}
              </label>
              <select
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setSubCategoryId("");
                }}
                className="w-full rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
              >
                <option value="">
                  {isArabic ? "اختر التصنيف" : "Choose Category..."}
                </option>
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {isArabic ? "التصنيف الفرعي *" : "Sub Category *"}
              </label>
              <select
                value={subCategoryId}
                onChange={(event) => setSubCategoryId(event.target.value)}
                disabled={!categoryId}
                className="w-full rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none disabled:bg-gray-50 focus:border-main"
              >
                <option value="">
                  {isArabic ? "اختر التصنيف الفرعي" : "Choose Sub Category..."}
                </option>
                {subCategoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black-blue/10 bg-slate-50 p-5 md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {isArabic ? "محتوى الكورس" : "Course Content"}
            </h2>
            <p className="mt-1 text-sm text-black-blue/60">
              {isArabic
                ? "أضف المحتويات والمحاضرات والفيديو والاختبارات."
                : "Add contents, lectures, videos and optional quizzes."}
            </p>
            <p className="mt-2 max-w-3xl text-sm text-black-blue/70">
              {isArabic
                ? "للإرسال للمراجعة: أضف محتوى بعنوان، ومحاضرة واحدة على الأقل، وارفع فيديو لكل محاضرة. الاختبار اختياري."
                : "For review: add a titled content section, at least one lecture, and a video for every lecture. Quizzes are optional."}
            </p>
          </div>

          <Button
            type="button"
            onClick={addContent}
            className="w-full bg-main hover:bg-main/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? "إضافة محتوى" : "Add Content"}
          </Button>
        </div>

        <div className="space-y-6">
          {contents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black-blue/20 bg-white px-5 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-main/10 text-main">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-bold">
                {isArabic ? "لسه مفيش محتوى للكورس" : "No course content yet"}
              </h3>
              <p className="mx-auto mt-1 max-w-xl text-sm text-black-blue/60">
                {isArabic
                  ? "ابدأ بإضافة محتوى، ثم أضف محاضرة وارفع فيديوها. تقدر تضيف اختبار للمحاضرة بشكل اختياري."
                  : "Start by adding a content section, then add a lecture and upload its video. You can optionally add a quiz."}
              </p>
            </div>
          ) : null}
          {contents.map((content, contentIndex) => (
            <div
              key={content.id}
              className="rounded-2xl border border-black-blue/10 bg-white p-4 md:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {isArabic ? "المحتوى" : "Content"} {contentIndex + 1}
                </h3>
                {contents.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeContent(content.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={content.title}
                  onChange={(event) =>
                    updateContent(content.id, { title: event.target.value })
                  }
                  maxLength={255}
                  placeholder={isArabic ? "عنوان المحتوى" : "Content title"}
                  className="rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
                />
                <input
                  value={content.description}
                  onChange={(event) =>
                    updateContent(content.id, {
                      description: event.target.value,
                    })
                  }
                  maxLength={5000}
                  placeholder={
                    isArabic ? "وصف المحتوى (اختياري)" : "Content description (optional)"
                  }
                  className="rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
                />
              </div>

              <div className="mt-6 space-y-5">
                {content.lectures.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.id}
                    className="rounded-2xl border border-black-blue/10 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="font-bold">
                        {isArabic ? "المحاضرة" : "Lecture"} {lectureIndex + 1}
                      </h4>
                      {content.lectures.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            removeLecture(content.id, lecture.id)
                          }
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={lecture.title}
                        onChange={(event) =>
                          updateLecture(content.id, lecture.id, {
                            title: event.target.value,
                          })
                        }
                        maxLength={255}
                        placeholder={
                          isArabic ? "عنوان المحاضرة" : "Lecture title"
                        }
                        className="rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
                      />

                      <input
                        value={lecture.description}
                        onChange={(event) =>
                          updateLecture(content.id, lecture.id, {
                            description: event.target.value,
                          })
                        }
                        maxLength={5000}
                        placeholder={
                          isArabic
                            ? "وصف المحاضرة (اختياري)"
                            : "Lecture description (optional)"
                        }
                        className="rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
                      />
                    </div>

                    <div className="mt-5 rounded-xl bg-white p-4">
                      <VideoUpload
                        courseApiCompatible
                        file={lecture.video}
                        setFile={(value) =>
                          updateLecture(content.id, lecture.id, {
                            video:
                              typeof value === "function"
                                ? value(lecture.video)
                                : value,
                          })
                        }
                        title={
                          isArabic
                            ? "فيديو المحاضرة"
                            : "Lecture Video"
                        }
                      />

                      {uploadingLectureId === lecture.id && (
                        <div className="mt-3">
                          <div className="flex items-center gap-3 text-sm font-semibold">
                            <UploadCloud className="h-4 w-4 text-main" />
                            {isArabic
                              ? `جاري رفع الفيديو... ${uploadProgress}%`
                              : `Uploading video... ${uploadProgress}%`}
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-main transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-xl border border-black-blue/10 bg-white p-4">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={lecture.quizEnabled}
                          onChange={(event) =>
                            updateLecture(content.id, lecture.id, {
                              quizEnabled: event.target.checked,
                              questions:
                                event.target.checked && lecture.questions.length === 0
                                  ? [makeQuestion()]
                                  : lecture.questions,
                            })
                          }
                        />
                        {isArabic
                          ? "إضافة اختبار بعد المحاضرة"
                          : "Add quiz after this lecture"}
                      </label>

                      {lecture.quizEnabled ? (
                        <div className="mt-4 space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <input
                              value={lecture.quizTitle}
                              onChange={(event) =>
                                updateLecture(content.id, lecture.id, {
                                  quizTitle: event.target.value,
                                })
                              }
                              placeholder={
                                isArabic ? "عنوان الاختبار" : "Quiz title"
                              }
                              className="rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
                            />

                            <input
                              type="number"
                              min={0}
                              max={1440}
                              value={lecture.quizTimeLimit}
                              onChange={(event) =>
                                updateLecture(content.id, lecture.id, {
                                  quizTimeLimit: Number(event.target.value),
                                })
                              }
                              placeholder={
                                isArabic
                                  ? "المدة بالدقائق (0 = بدون حد)"
                                  : "Time limit in minutes (0 = unlimited)"
                              }
                              className="rounded-xl border border-black-blue/10 px-4 py-3 outline-none focus:border-main"
                            />
                          </div>

                          {lecture.questions.map((question, questionIndex) => (
                            <div
                              key={questionIndex}
                              className="rounded-xl border border-black-blue/10 bg-slate-50 p-4"
                            >
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <h5 className="font-bold">
                                  {isArabic ? "السؤال" : "Question"}{" "}
                                  {questionIndex + 1}
                                </h5>
                                {lecture.questions.length > 1 ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                      removeQuestion(
                                        content.id,
                                        lecture.id,
                                        questionIndex
                                      )
                                    }
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                ) : null}
                              </div>

                              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                                <input
                                  value={question.title}
                                  onChange={(event) =>
                                    updateQuestion(
                                      content.id,
                                      lecture.id,
                                      questionIndex,
                                      { title: event.target.value }
                                    )
                                  }
                                  placeholder={
                                    isArabic
                                      ? "اكتب السؤال"
                                      : "Write the question"
                                  }
                                  className="rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
                                />

                                <input
                                  type="number"
                                  min={1}
                                  value={question.score}
                                  onChange={(event) =>
                                    updateQuestion(
                                      content.id,
                                      lecture.id,
                                      questionIndex,
                                      { score: Number(event.target.value) }
                                    )
                                  }
                                  placeholder={
                                    isArabic ? "الدرجة" : "Score"
                                  }
                                  className="rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
                                />
                              </div>

                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      value={option.title}
                                      onChange={(event) =>
                                        updateOption(
                                          content.id,
                                          lecture.id,
                                          questionIndex,
                                          optionIndex,
                                          { title: event.target.value }
                                        )
                                      }
                                      placeholder={
                                        isArabic
                                          ? `الإجابة ${optionIndex + 1}`
                                          : `Option ${optionIndex + 1}`
                                      }
                                      className="min-w-0 flex-1 rounded-xl border border-black-blue/10 bg-white px-4 py-3 outline-none focus:border-main"
                                    />
                                    <input
                                      type="radio"
                                      name={`correct-${lecture.id}-${questionIndex}`}
                                      checked={option.is_correct}
                                      onChange={() =>
                                        markCorrect(
                                          content.id,
                                          lecture.id,
                                          questionIndex,
                                          optionIndex
                                        )
                                      }
                                      aria-label={
                                        isArabic
                                          ? "الإجابة الصحيحة"
                                          : "Correct answer"
                                      }
                                    />
                                    {question.options.length > 2 ? (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                          removeOption(
                                            content.id,
                                            lecture.id,
                                            questionIndex,
                                            optionIndex
                                          )
                                        }
                                        className="px-2 text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    ) : null}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    addOption(
                                      content.id,
                                      lecture.id,
                                      questionIndex
                                    )
                                  }
                                  disabled={question.options.length >= 4}
                                  className="border-main text-main hover:bg-main hover:text-white"
                                >
                                  <Plus className="h-4 w-4" />
                                  {isArabic ? "إضافة إجابة" : "Add Option"}
                                </Button>
                              </div>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addQuestion(content.id, lecture.id)}
                            disabled={lecture.questions.length >= 50}
                            className="border-main text-main hover:bg-main hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                            {isArabic ? "إضافة سؤال" : "Add Question"}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => addLecture(content.id)}
                className="mt-5 border-main text-main hover:bg-main hover:text-white"
              >
                <Plus className="h-4 w-4" />
                {isArabic ? "إضافة محاضرة" : "Add Lecture"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => void save(false)}
          disabled={isSaving}
          className="w-full border-main bg-white text-main hover:bg-main hover:text-white sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {isArabic ? "حفظ كمسودة" : "Save as Draft"}
        </Button>

        <Button
          type="button"
          onClick={() => void save(true)}
          disabled={isSaving}
          className="w-full bg-main hover:bg-main/90 sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {isArabic ? "حفظ وإرسال للمراجعة" : "Save & Submit for Review"}
        </Button>
      </div>
    </div>
  );
};

export default CourseWizardForm;
