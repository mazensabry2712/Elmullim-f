import { Loader } from "lucide-react";
import CoursesList from "./CoursesList";
import { useGetRelatedCourses } from "@/lib/react-query/courses/courses";
import cookieService from "@/utils/cookieService";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  courseId: number;
  subCategoryId: number;
  copy: CoursesCopy;
}

const RelatedCourses = ({ courseId, subCategoryId, copy }: IProps) => {
  const token = cookieService.getToken();
  const { data: courses, isLoading } = useGetRelatedCourses({
    courseId,
    subCategoryId,
    token,
  });

  if (!isLoading && courses?.data?.length === 0) return null;

  return (
    <section className="my-5" aria-labelledby="related-courses-title">
      {isLoading ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
        </div>
      ) : (
        <>
          <h4 id="related-courses-title" className="mb-8 mt-10 text-3xl text-black-blue font-bold text-center capitalize">
            {copy.relatedCourses}
          </h4>
          <CoursesList courses={courses?.data?.slice(0, 10) || []} copy={copy} />
        </>
      )}
    </section>
  );
};

export default RelatedCourses;
