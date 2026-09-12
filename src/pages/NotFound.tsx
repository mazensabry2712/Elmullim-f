import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";
import { useI18n } from "@/i18n";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { language } = useI18n();
  const copy =
    language === "ar"
      ? {
          page: "صفحة 404",
          notFound: "الصفحة غير موجودة",
          title: "عذرًا، الصفحة غير موجودة!",
          description: "قد تكون الصفحة التي تبحث عنها قد نُقلت أو حُذفت أو أنها غير موجودة من الأساس.",
          backHome: "العودة إلى الرئيسية",
          alt: "404 غير موجودة",
        }
      : {
          page: "404 page",
          notFound: "Page not found",
          title: "Sorry, Page Not Found!",
          description: "The page you're looking for might have been moved, deleted, or never existed.",
          backHome: "Back to home",
          alt: "404 not found",
        };

  return (
    <main>
      <PageTitle />
      <Header />
      <section>
        <div className="bg-[#21374B] py-10 md:py-28">
          <div className="container">
            <h1 className="uppercase text-center font-bold text-white text-4xl md:text-6xl">
              {copy.page}
            </h1>
            <p className="capitalize text-main font-sora text-center text-sm">
              {copy.notFound}
            </p>
          </div>
        </div>
        <div className="bg-white">
          <div className="container space-y-4 md:space-y-6 py-16">
            <div className="flex justify-center items-center">
              <img
                src="/images/404.webp"
                alt={copy.alt}
                className="w-full sm:w-[80%] md:max-w-[500px]"
              />
            </div>
            <div className="space-y-4 max-w-[600px] mx-auto">
              <h2 className="text-black-blue text-center font-bold text-4xl md:text-[45px]">
                {copy.title}
              </h2>
              <p className="text-center text-[#4D5756] font-sora">
                {copy.description}
              </p>
              <Link
                to="/"
                className="w-fit mx-auto text-white rounded-[5px] shadow hover:shadow-md transition-all duration-300 font-sora font-light flex justify-center items-center gap-2 px-7 py-3 capitalize bg-main"
              >
                {copy.backHome} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default NotFound;
