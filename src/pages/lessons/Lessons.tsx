import { useEffect } from "react";
import Newsletter from "@/components/Newsletter";
import LessonList from "@/components/lessons/LessonsList";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetLessonFilterOptions,
  useGetLessons,
} from "@/lib/react-query/lessons/lessons";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getLessonsCopy } from "./lessonCopy";

const Lessons = () => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = useDebounce(searchParams.get("q"), 500) ?? undefined;
  const { data: filterOptions } = useGetLessonFilterOptions();
  const token = cookieService.getToken() || undefined;

  const deliveryMode = searchParams.get("delivery_mode") as "online" | "offline" | null;
  const educationLevelIdValue = searchParams.get("education_level_id");
  const subjectIdValue = searchParams.get("subject_id");
  const educationLevelId = educationLevelIdValue ? Number(educationLevelIdValue) : undefined;
  const subjectId = subjectIdValue ? Number(subjectIdValue) : undefined;
  const bookingType = searchParams.get("booking_type") as "private" | "group" | null;
  const grade = searchParams.get("grade") || undefined;
  const location = searchParams.get("location") || undefined;
  const minPriceValue = searchParams.get("min_price");
  const maxPriceValue = searchParams.get("max_price");
  const minPrice = minPriceValue !== null && minPriceValue !== "" ? Number(minPriceValue) : undefined;
  const maxPrice = maxPriceValue !== null && maxPriceValue !== "" ? Number(maxPriceValue) : undefined;

  const { data: lessons, isLoading, isError, refetch } = useGetLessons({
    q: search,
    token,
    ...(deliveryMode && { delivery_mode: deliveryMode }),
    ...(bookingType && { booking_type: bookingType }),
    ...(Number.isFinite(educationLevelId) && { education_level_id: educationLevelId }),
    ...(Number.isFinite(subjectId) && { subject_id: subjectId }),
    ...(grade && { grade }),
    ...(location && { location }),
    ...(Number.isFinite(minPrice) && { min_price: minPrice }),
    ...(Number.isFinite(maxPrice) && { max_price: maxPrice }),
  });

  useEffect(() => {
    document.title = `${copy.title} | Elmullim`;
  }, [copy.title]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) next.set(key, value);
    else next.delete(key);

    if (key === "delivery_mode" && value === "online") {
      next.delete("location");
    }

    if (key === "min_price" && value !== "") {
      const max = next.get("max_price");
      if (max !== null && max !== "" && Number(value) > Number(max)) {
        next.delete("max_price");
      }
    }

    if (key === "max_price" && value !== "") {
      const min = next.get("min_price");
      if (min !== null && min !== "" && Number(value) < Number(min)) {
        next.delete("min_price");
      }
    }

    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const currentQuery = searchParams.get("q");
    if (currentQuery) next.set("q", currentQuery);
    setSearchParams(next);
  };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]">
          {copy.title}
        </h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.breadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="lessons-title"
      >
        <div className="container py-12 md:py-24">
          <h2 id="lessons-title" className="sr-only">{copy.title}</h2>

          <div className="mb-5">
            <SearchInput placeholder={copy.searchPlaceholder} ariaLabel={copy.searchLabel} />
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-[#F0F1F1] p-4 font-sora">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-black-blue">{copy.filters}</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-main hover:underline"
              >
                {copy.clearFilters}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.delivery}</span>
                <select
                  aria-label={copy.delivery}
                  value={deliveryMode ?? ""}
                  onChange={(event) => updateFilter("delivery_mode", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">{copy.allTypes}</option>
                  <option value="online">{copy.online}</option>
                  <option value="offline">{copy.offline}</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.bookingType}</span>
                <select
                  aria-label={copy.bookingType}
                  value={bookingType ?? ""}
                  onChange={(event) => updateFilter("booking_type", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">{copy.allTypes}</option>
                  <option value="private">{copy.private}</option>
                  <option value="group">{copy.group}</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.educationStage}</span>
                <select
                  aria-label={copy.educationStage}
                  value={educationLevelIdValue ?? ""}
                  onChange={(event) => updateFilter("education_level_id", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">{copy.allTypes}</option>
                  {filterOptions?.data.education_levels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.subject}</span>
                <select
                  aria-label={copy.subject}
                  value={subjectIdValue ?? ""}
                  onChange={(event) => updateFilter("subject_id", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">{copy.allTypes}</option>
                  {filterOptions?.data.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.grade}</span>
                <input
                  aria-label={copy.grade}
                  value={grade ?? ""}
                  onChange={(event) => updateFilter("grade", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                  placeholder={copy.grade}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.serviceAreaFilter}</span>
                <input
                  aria-label={copy.serviceAreaFilter}
                  value={location ?? ""}
                  onChange={(event) => updateFilter("location", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                  placeholder={copy.serviceAreaFilter}
                  disabled={deliveryMode !== "offline"}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.minPrice}</span>
                <input
                  type="number"
                  min="0"
                  aria-label={copy.minPrice}
                  value={minPriceValue ?? ""}
                  onChange={(event) => updateFilter("min_price", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="block mb-2 text-black-blue">{copy.maxPrice}</span>
                <input
                  type="number"
                  min="0"
                  aria-label={copy.maxPrice}
                  value={maxPriceValue ?? ""}
                  onChange={(event) => updateFilter("max_price", event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                />
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
              <span className="sr-only">{copy.loading}</span>
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-lg text-[#4D5756]">{copy.error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
              >
                {copy.retry}
              </button>
            </div>
          ) : (
            <LessonList lessons={lessons?.data ?? []} copy={copy} />
          )}
        </div>
      </motion.section>
      <Newsletter />
    </main>
  );
};

export default Lessons;
