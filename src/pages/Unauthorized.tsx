import PageTitle from "@/components/PageTitle";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const { language } = useI18n();
  const copy =
    language === "ar"
      ? {
          accessDenied: "تم رفض الوصول",
          title: "غير مصرح",
          description: "ليس لديك صلاحية للوصول إلى هذه الصفحة بهذا الحساب الحالي.",
          backHome: "العودة إلى الرئيسية",
        }
      : {
          accessDenied: "Access denied",
          title: "Unauthorized",
          description: "You do not have permission to access this page with your current account.",
          backHome: "Back to home",
        };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <PageTitle />
      <section className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-main">
          {copy.accessDenied}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#21374B] md:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-5 text-base text-[#4D5756] font-sora md:text-lg">
          {copy.description}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-[5px] bg-main px-7 py-3 text-white font-sora shadow transition-all duration-300 hover:shadow-md"
        >
          {copy.backHome}
        </Link>
      </section>
    </main>
  );
};

export default Unauthorized;
