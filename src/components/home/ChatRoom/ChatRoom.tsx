import "./ChatRoom.css";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CHAT_OPTIONS } from "@/constant";
import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const chatTranslationKeys = [
  {
    title: "home.chat.createTitle",
    description: "home.chat.createDescription",
  },
  {
    title: "home.chat.joinTitle",
    description: "home.chat.joinDescription",
  },
  {
    title: "home.chat.availableTitle",
    description: "home.chat.availableDescription",
  },
] as const;

const ChatRoom = () => {
  const { t } = useI18n();

  return (
    <section
      id="chat-rooms"
      aria-labelledby="chat-rooms-title"
      className="chat-room relative bg-[#F8F6F1] py-20"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-20 container flex flex-col gap-5 pb-10 md:gap-16 lg:flex-row lg:gap-24"
      >
        <div className="flex items-center justify-center md:mb-0 lg:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="logo relative mt-16 flex w-80 items-center justify-center rounded-lg md:mt-0 lg:w-96"
          >
            <img
              src="/Image.png"
              alt={t("home.chat.imageAlt")}
              width={384}
              height={384}
              loading="lazy"
              className="h-auto w-full"
            />
          </motion.div>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-4 lg:items-start"
          >
            <BadgeTitle title={t("home.chat.badge")} />
            <h2
              id="chat-rooms-title"
              className="text-center text-4xl font-bold capitalize leading-[55px] text-black-blue md:text-[45px] lg:text-start"
            >
              {t("home.chat.title")}
            </h2>
          </motion.div>

          <div className="w-full max-w-3xl" role="list">
            {CHAT_OPTIONS.map((item, index) => {
              const translation = chatTranslationKeys[index];

              return (
                <motion.article
                  variants={itemVariants}
                  key={item.title}
                  role="listitem"
                  className="group relative mb-4 flex w-full items-center gap-5 overflow-hidden rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-[url('/images/chat-card-bg.png')] bg-cover bg-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-main p-6 transition-colors duration-200 group-hover:bg-white">
                    <FontAwesomeIcon
                      className="h-6 w-6 text-2xl text-white transition-colors duration-200 group-hover:text-main"
                      icon={item.icon}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-epilogue text-lg font-bold text-black-blue transition-colors duration-200 group-hover:text-white">
                      {translation ? t(translation.title) : item.title}
                    </h3>
                    <p className="font-sora text-muted transition-colors duration-200 group-hover:text-white">
                      {translation ? t(translation.description) : item.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChatRoom;
