import LessonForm from "@/components/forms/teacher/LessonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n";

const CreateLesson = () => {
  const { language } = useI18n();
  const isArabic = language === "ar";

  return (
    <Card className="overflow-hidden rounded-3xl border-black-blue/[0.07] shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
      <CardHeader className="border-b border-black-blue/[0.06] bg-gradient-to-r from-main/[0.055] via-white to-white px-5 py-5 sm:px-7 sm:py-6">
        <CardTitle className="text-2xl font-black text-black-blue">
          {isArabic ? "إنشاء درس جديد" : "Create a new lesson"}
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6 text-black-blue/55">
          {isArabic
            ? "ابنِ درسًا واضحًا وجاهزًا للحجز خطوة بخطوة."
            : "Build a clear, booking-ready lesson step by step."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 md:p-8">
        <LessonForm action="create" />
      </CardContent>
    </Card>
  );
};

export default CreateLesson;
