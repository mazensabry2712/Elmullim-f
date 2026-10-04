import { Star, Loader2 } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { useGetGivenRatings } from "@/lib/react-query/rating";
import { formatDateTime } from "@/utils/dateTime";

const Ratings = () => {
  const { language } = useI18n();
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole() as "student" | "parent" | "teacher";
  const query = useGetGivenRatings(token, role, !!token);

  const copy = ar
    ? {
        title: "تقييماتي",
        description: "كل التقييمات التي أرسلتها بعد الجلسات المكتملة.",
        empty: "لم ترسل أي تقييمات حتى الآن.",
        loading: "جاري تحميل التقييمات...",
        error: "تعذر تحميل التقييمات.",
        rating: "التقييم",
        booking: "الحجز",
      }
    : {
        title: "My Ratings",
        description: "All ratings you have submitted after completed sessions.",
        empty: "You have not submitted any ratings yet.",
        loading: "Loading ratings...",
        error: "Could not load ratings.",
        rating: "Rating",
        booking: "Booking",
      };

  const items = query.data?.data ?? [];

  return (
    <main className="min-h-screen bg-white py-10 md:py-14">
      <div className="container max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
              <Star className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-epilogue text-3xl font-bold text-black-blue md:text-5xl">{copy.title}</h1>
              <p className="mt-2 font-sora text-sm text-black-blue/55 md:text-base">{copy.description}</p>
            </div>
          </div>
        </div>

        {query.isLoading && (
          <div className="rounded-2xl border border-gray-100 bg-[#F6F8FA] p-12 text-center" role="status">
            <Loader2 className="mx-auto animate-spin text-main" size={32} />
            <p className="mt-3 font-sora text-sm text-black-blue/50">{copy.loading}</p>
          </div>
        )}

        {query.isError && !query.isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
            {copy.error}
          </div>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-[#F6F8FA] p-12 text-center font-sora text-black-blue/50">
            {copy.empty}
          </div>
        )}

        {!query.isLoading && !query.isError && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => {
              const target = item.rateable;
              const image = target?.image?.trim() || undefined;
              const name = target?.name?.trim() || "—";
              const rate = Number(item.rate ?? 0);

              return (
                <article key={`${item.booking_id}-${target?.id}-${item.created_at}`} className="rounded-2xl border border-gray-100 bg-[#F6F8FA] p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                        {image ? (
                          <img src={image} alt={name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-main">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-sora font-bold text-black-blue">{name}</h2>
                        <p className="mt-1 text-xs text-black-blue/45">{copy.booking} #{item.booking_id ?? "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" aria-label={`${copy.rating}: ${rate}/5`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={17}
                          className={star <= rate ? "fill-main text-main" : "text-black-blue/15"}
                        />
                      ))}
                      <span className="ms-1 text-sm font-bold text-black-blue">{rate}/5</span>
                    </div>
                  </div>

                  {item.description?.trim() && (
                    <p className="mt-4 rounded-xl bg-white px-4 py-3 font-sora text-sm leading-6 text-black-blue/65">
                      {item.description}
                    </p>
                  )}

                  {item.created_at && (
                    <p className="mt-3 text-xs text-black-blue/40">
                      {formatDateTime(item.created_at, language)}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Ratings;
