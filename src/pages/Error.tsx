import { useI18n } from "@/i18n";

const Error = () => {
  const { language } = useI18n();
  return <div>{language === "ar" ? "حدث خطأ" : "Error"}</div>;
};

export default Error;
