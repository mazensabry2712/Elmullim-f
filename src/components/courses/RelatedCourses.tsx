import { Loader } from "lucide-react";
import CoursesList from "./CoursesList";
import { useGetRelatedCourses } from "@/lib/react-query/courses/courses";
import cookieService from "@/utils/cookieService";

interface IProps {
  courseId: number;
  subCategoryId: number;
}

const RelatedCourses = ({ courseId, subCategoryId }: IProps) => {
  const token = cookieService.getToken();
  const { data: courses, isLoading } = useGetRelatedCourses({
    courseId,
    subCategoryId,
    token,
  });

  if (courses?.data.length === 0) return null;

  return (
    <>
      {isLoading ? (
        <div>
          <Loader size={40} className="animate-spin" />
        </div>
      ) : (
        <section className="my-5">
          <h4 className="mb-8 mt-10 text-3xl text-black-blue font-bold text-center capitalize">
            Students also join these courses
          </h4>
          <CoursesList courses={courses?.data.slice(0, 10) || []} />
        </section>
      )}
    </>
  );
};

export default RelatedCourses;
