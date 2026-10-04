import { useEffect, useMemo, useState } from "react";
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
import { ChevronDown, Loader, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getLessonsCopy } from "./lessonCopy";

type SortOption = "latest" | "price_asc" | "price_desc" | "rating_desc";

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

  const [gradeDraft, setGradeDraft] = useState(searchParams.get("grade") ?? "");
  const [minPriceDraft, setMinPriceDraft] = useState(searchParams.get("min_price") ?? "");
  const [maxPriceDraft, setMaxPriceDraft] = useState(searchParams.get("max_price") ?? "");

  const grade = useDebounce(gradeDraft.trim(), 500);
  const minPriceDebounced = useDebounce(minPriceDraft, 500);
  const maxPriceDebounced = useDebounce(maxPriceDraft, 500);

  const serviceAreaIdValue = searchParams.get("service_area_id");
  const serviceAreaId = serviceAreaIdValue ? Number(serviceAreaIdValue) : undefined;
  const sort = (searchParams.get("sort") as SortOption | null) ?? "latest";

  useEffect(() => {
    setGradeDraft(searchParams.get("grade") ?? "");
    setMinPriceDraft(searchParams.get("min_price") ?? "");
    setMaxPriceDraft(searchParams.get("max_price") ?? "");
  }, [searchParams]);

  const visibleSubjects = useMemo(() => {
    const subjects = filterOptions?.data.subjects ?? [];
    if (!Number.isFinite(educationLevelId)) return subjects;

    return subjects.filter(
      (subject) => Number(subject.education_level?.id) === educationLevelId
    );
  }, [educationLevelId, filterOptions?.data.subjects]);

  const minPrice =
    minPriceDebounced !== "" && Number.isFinite(Number(minPriceDebounced))
      ? Number(minPriceDebounced)
      : undefined;
  const maxPrice =
    maxPriceDebounced !== "" && Number.isFinite(Number(maxPriceDebounced))
      ? Number(maxPriceDebounced)
      : undefined;

  const { data: lessons, isLoading, isError, refetch } = useGetLessons({
    q: search,
    token,
    ...(deliveryMode && { delivery_mode: deliveryMode }),
    ...(bookingType && { booking_type: bookingType }),
    ...(Number.isFinite(educationLevelId) && { education_level_id: educationLevelId }),
    ...(Number.isFinite(subjectId) && { subject_id: subjectId }),
    ...(grade && { grade }),
    ...(Number.isFinite(serviceAreaId) && { service_area_id: serviceAreaId }),
    ...(Number.isFinite(minPrice) && { min_price: minPrice }),
    ...(Number.isFinite(maxPrice) && { max_price: maxPrice }),
    sort,
  });

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) next.set(key, value);
    else next.delete(key);

    if (key === "delivery_mode" && value === "online") {
      next.delete("location");
      next.delete("service_area_id");
    }

    if (key === "education_level_id" && value) {
      const selectedSubjectId = next.get("subject_id");
      const selectedSubject = visibleSubjects.find(
        (subject) => String(subject.id) === selectedSubjectId
      );

      if (selectedSubject && String(selectedSubject.education_level?.id) !== value) {
        next.delete("subject_id");
      }
    }

    if (key === "min_price" && value !== "") {
      const max = next.get("max_price");
      if (max !== null && max !== "" && Number(value) > Number(max)) {
        next.delete("max_price");
        setMaxPriceDraft("");
      }
    }

    if (key === "max_price" && value !== "") {
      const min = next.get("min_price");
      if (min !== null && min !== "" && Number(value) < Number(min)) {
        next.delete("min_price");
        setMinPriceDraft("");
      }
    }

    setSearchParams(next);
  };

  const activeFilterCount = [
    deliveryMode,
    bookingType,
    educationLevelIdValue,
    subjectIdValue,
    gradeDraft.trim(),
    serviceAreaIdValue,
    minPriceDraft,
    maxPriceDraft,
    sort !== "latest" ? sort : "",
  ].filter(Boolean).length;

  const chipItems = [
    deliveryMode
      ? {
          key: "delivery_mode",
          label: copy.delivery,
          value: deliveryMode === "online" ? copy.online : copy.offline,
        }
      : null,
    bookingType
      ? {
          key: "booking_type",
          label: copy.bookingType,
          value: bookingType === "group" ? copy.group : copy.private,
        }
      : null,
    educationLevelIdValue
      ? {
          key: "education_level_id",
          label: copy.educationStage,
          value:
            filterOptions?.data.education_levels.find(
              (level) => String(level.id) === educationLevelIdValue
            )?.name ?? educationLevelIdValue,
        }
      : null,
    subjectIdValue
      ? {
          key: "subject_id",
          label: copy.subject,
          value:
            filterOptions?.data.subjects.find(
              (subject) => String(subject.id) === subjectIdValue
            )?.name ?? subjectIdValue,
        }
      : null,
    gradeDraft.trim()
      ? { key: "grade", label: copy.grade, value: gradeDraft.trim() }
      : null,
    serviceAreaIdValue
      ? {
          key: "service_area_id",
          label: copy.serviceAreaFilter,
          value:
            filterOptions?.data.service_areas.find(
              (area) => String(area.id) === serviceAreaIdValue
            )?.name ?? serviceAreaIdValue,
        }
      : null,
    minPriceDraft
      ? { key: "min_price", label: copy.minPrice, value: minPriceDraft }
      : null,
    maxPriceDraft
      ? { key: "max_price", label: copy.maxPrice, value: maxPriceDraft }
      : null,
    sort !== "latest"
      ? {
          key: "sort",
          label: copy.sort,
          value:
            sort === "price_asc"
              ? copy.sortPriceAsc
              : sort === "price_desc"
                ? copy.sortPriceDesc
                : copy.sortRating,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;

  const clearFilterChip = (key: string) => {
    if (key === "grade") setGradeDraft("");
    if (key === "min_price") setMinPriceDraft("");
    if (key === "max_price") setMaxPriceDraft("");
    updateFilter(key, "");
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const currentQuery = searchParams.get("q");
    if (currentQuery) next.set("q", currentQuery);

    setGradeDraft("");
    setMinPriceDraft("");
    setMaxPriceDraft("");
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

          <details open className="mb-8 rounded-2xl border border-gray-200 bg-[#F0F1F1] font-sora">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 lg:pointer-events-none">
              <span className="flex items-center gap-2 text-lg font-semibold text-black-blue">
                <SlidersHorizontal className="h-5 w-5 text-main" aria-hidden="true" />
                {copy.filters}
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-main px-2 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </span>
              <ChevronDown className="h-5 w-5 text-black-blue/50 lg:hidden" aria-hidden="true" />
            </summary>

            <div className="border-t border-gray-200 p-4">
              <div className="mb-4 flex flex-col gap-2 text-sm text-[#4D5756] sm:flex-row sm:items-center sm:justify-between">
                <p>{copy.filtersSummary}</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit text-main hover:underline"
                >
                  {copy.clearFilters}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.delivery}</span>
                  <select
                    aria-label={copy.delivery}
                    value={deliveryMode ?? ""}
                    onChange={(event) => updateFilter("delivery_mode", event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">{copy.allTypes}</option>
                    <option value="online">{copy.online}</option>
                    <option value="offline">{copy.offline}</option>
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.bookingType}</span>
                  <select
                    aria-label={copy.bookingType}
                    value={bookingType ?? ""}
                    onChange={(event) => updateFilter("booking_type", event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">{copy.allTypes}</option>
                    <option value="private">{copy.private}</option>
                    <option value="group">{copy.group}</option>
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.educationStage}</span>
                  <select
                    aria-label={copy.educationStage}
                    value={educationLevelIdValue ?? ""}
                    onChange={(event) => updateFilter("education_level_id", event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">{copy.allTypes}</option>
                    {filterOptions?.data.education_levels.map((level) => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.subject}</span>
                  <select
                    aria-label={copy.subject}
                    value={subjectIdValue ?? ""}
                    onChange={(event) => updateFilter("subject_id", event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">{copy.allTypes}</option>
                    {visibleSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.grade}</span>
                  <select
                    aria-label={copy.grade}
                    value={gradeDraft}
                    onChange={(event) => {
                      setGradeDraft(event.target.value);
                      updateFilter("grade", event.target.value);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">{copy.allGrades}</option>
                    {(filterOptions?.data.grades ?? []).map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.serviceAreaFilter}</span>
                  <select
                    aria-label={copy.serviceAreaFilter}
                    value={serviceAreaIdValue ?? ""}
                    onChange={(event) => updateFilter("service_area_id", event.target.value)}
                    disabled={deliveryMode !== "offline"}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">{copy.allServiceAreas}</option>
                    {(filterOptions?.data.service_areas ?? []).map((area) => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.minPrice}</span>
                  <input
                    type="number"
                    min="0"
                    aria-label={copy.minPrice}
                    value={minPriceDraft}
                    onChange={(event) => {
                      setMinPriceDraft(event.target.value);
                      updateFilter("min_price", event.target.value);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.maxPrice}</span>
                  <input
                    type="number"
                    min="0"
                    aria-label={copy.maxPrice}
                    value={maxPriceDraft}
                    onChange={(event) => {
                      setMaxPriceDraft(event.target.value);
                      updateFilter("max_price", event.target.value);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-2 block text-black-blue">{copy.sort}</span>
                  <select
                    aria-label={copy.sort}
                    value={sort}
                    onChange={(event) => updateFilter("sort", event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="latest">{copy.sortLatest}</option>
                    <option value="price_asc">{copy.sortPriceAsc}</option>
                    <option value="price_desc">{copy.sortPriceDesc}</option>
                    <option value="rating_desc">{copy.sortRating}</option>
                  </select>
                </label>
              </div>

              {chipItems.length > 0 ? (
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-black-blue/50">
                    {copy.activeFilters}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chipItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => clearFilterChip(item.key)}
                        className="inline-flex items-center gap-2 rounded-full border border-main/20 bg-white px-3 py-1.5 text-xs font-bold text-black-blue transition hover:border-main hover:text-main"
                        aria-label={item.label + ": " + item.value}
                      >
                        <span>{item.label}: {item.value}</span>
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </details>

          {!isLoading && !isError ? (
            <div className="mb-5 flex items-center justify-between gap-3 text-sm font-semibold text-black-blue/60">
              <span>
                {lessons?.data.length ?? 0} {copy.resultsShown}
              </span>
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
              <span className="sr-only">{copy.loading}</span>
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-lg text-[#4D5756]">{copy.error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 w-fit rounded-[5px] bg-main px-6 py-2 font-sora text-sm text-white transition-all duration-200 hover:bg-main/90"
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
