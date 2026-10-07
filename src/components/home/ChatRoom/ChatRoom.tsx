import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const ChatRoom = () => {
  const { t, language } = useI18n();

  return (
    <section
      id="chat-rooms"
      aria-labelledby="chat-rooms-title"
      className="bg-[#F8F6F1] py-16 md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container"
      >
        <div className="mx-auto grid max-w-5xl items-center gap-8 rounded-2xl bg-white p-6 shadow-md md:grid-cols-[220px_1fr] md:p-10">
          <div className="flex items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-main/10 text-main md:h-48 md:w-48">
              <MessageCircle className="h-20 w-20 md:h-24 md:w-24" aria-hidden="true" />
            </div>
          </div>

          <div className="text-center md:text-start">
            <p className="font-sora text-sm font-bold uppercase tracking-[0.14em] text-main">
              {t("home.chat.badge")}
            </p>
            <h2
              id="chat-rooms-title"
              className="mt-2 text-3xl font-bold leading-tight text-black-blue md:text-4xl"
            >
              {t("home.chat.title")}
            </h2>
            <p className="mt-4 max-w-2xl font-sora text-sm leading-7 text-[#4D5756] md:text-base">
              {t("home.chat.description")}
            </p>
            <Link
              to="/chat"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-main px-6 py-3 font-sora text-sm font-bold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {t("home.chat.action")}
            </Link>
            <p className="mt-3 text-xs font-semibold text-black-blue/45">
              {language === "ar"
                ? "يتطلب تسجيل الدخول"
                : "Sign in to start a conversation"}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChatRoom;
