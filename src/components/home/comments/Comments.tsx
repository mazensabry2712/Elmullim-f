import { BookOpen, MessageCircle, Users } from "lucide-react";
import { useI18n } from "@/i18n";

const HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: "home.highlights.lessons.title",
    description: "home.highlights.lessons.description",
  },
  {
    icon: Users,
    title: "home.highlights.flexible.title",
    description: "home.highlights.flexible.description",
  },
  {
    icon: MessageCircle,
    title: "home.highlights.connected.title",
    description: "home.highlights.connected.description",
  },
] as const;

const HomeHighlights = () => {
  const { t } = useI18n();

  return (
    <section
      id="home-highlights"
      aria-labelledby="home-highlights-title"
      className="bg-[#F8F6F1] py-14 md:py-16"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sora text-sm font-bold uppercase tracking-[0.14em] text-main">
            {t("home.highlights.badge")}
          </p>
          <h2
            id="home-highlights-title"
            className="mt-3 text-3xl font-bold leading-tight text-black-blue sm:text-4xl"
          >
            {t("home.highlights.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sora text-sm leading-7 text-[#4D5756] md:text-base">
            {t("home.highlights.description")}
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-main/10 text-main">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-black-blue">
                {t(title)}
              </h3>
              <p className="mt-3 font-sora text-sm leading-7 text-[#4D5756]">
                {t(description)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHighlights;
