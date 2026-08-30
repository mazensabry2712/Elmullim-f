import { Loader } from "lucide-react";

import cookieService from "@/utils/cookieService";
import { useGetRelatedLesson } from "@/lib/react-query/lessons/lessons";
import LessonList from "./LessonsList";

interface IProps {
  lessonId: number;
  teacherId: number;
}

const RelatedLessons = ({ lessonId, teacherId }: IProps) => {
  const token = cookieService.getToken();
  const { data: lessons, isLoading } = useGetRelatedLesson({
    lessonId,
    teacherId,
    token,
  });

  if (lessons?.data.length === 0) return null;

  return (
    <>
      {isLoading ? (
        <div>
          <Loader size={40} className="animate-spin mx-auto" />
        </div>
      ) : (
        <section className="my-5">
          <h4 className="mb-8 mt-10 text-3xl text-black-blue font-bold text-center capitalize">
            Students also join these lessons
          </h4>
          <LessonList lessons={lessons?.data.slice(0, 10) || []} />
        </section>
      )}
    </>
  );
};

export default RelatedLessons;
