import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { useGetRelatedLesson } from "@/lib/react-query/lessons/lessons";
import LessonList from "./LessonsList";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { useI18n } from "@/i18n";

interface IProps {
  lessonId: number;
  teacherId: number;
  copy?: LessonsCopy;
}

const RelatedLessons = ({ lessonId, teacherId, copy: providedCopy }: IProps) => {
  const { language } = useI18n();
  const copy = providedCopy ?? getLessonsCopy(language);
  const token = cookieService.getToken();
  const { data: lessons, isLoading } = useGetRelatedLesson({
    lessonId,
    teacherId,
    token,
  });

  if (!isLoading && lessons?.data?.length === 0) return null;

  return (
    <section className="my-5" aria-labelledby="related-lessons-title">
      {isLoading ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
          <span className="sr-only">{copy.loadingLesson}</span>
        </div>
      ) : (
        <>
          <h4 id="related-lessons-title" className="mb-8 mt-10 text-3xl text-black-blue font-bold text-center capitalize">
            {copy.relatedLessons}
          </h4>
          <LessonList lessons={lessons?.data?.slice(0, 10) || []} />
        </>
      )}
    </section>
  );
};

export default RelatedLessons;
