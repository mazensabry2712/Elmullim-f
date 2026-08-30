import Newsletter from "@/components/Newsletter";
import LessonList from "@/components/lessons/LessonsList";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import { useGetLessons } from "@/lib/react-query/lessons/lessons";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useSearchParams } from "react-router-dom";
const Lessons = () => {
  const [searchParams] = useSearchParams();
  const search = useDebounce(searchParams.get("q"), 500)!;
  const token = cookieService.getToken()!;
  const { data: lessons, isLoading } = useGetLessons({
    q: search,
    ...(token && { token }),
  });

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          Lessons
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> lessons
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24">
          <div className="mb-5">
            <SearchInput placeholder="Search Lessons..." />
          </div>
          {isLoading ? (
            <Loader size={40} className="animate-spin mx-auto" />
          ) : (
            <LessonList lessons={lessons?.data || []} />
          )}
        </div>
      </motion.section>
      <div>
        <Newsletter />
      </div>
    </main>
  );
};

export default Lessons;
