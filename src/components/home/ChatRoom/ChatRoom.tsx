import "./ChatRoom.css";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CHAT_OPTIONS } from "@/constant";
import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";

const ChatRoom = () => {
  return (
    <section
      aria-labelledby="chat-rooms-title"
      className="chat-room relative py-20 bg-[#F8F6F1]"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-20 flex flex-col md:flex-col lg:flex-row container pb-10 gap-5 md:gap-16 lg:gap-24"
      >
        <div className="flex md:mb-0 items-center justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-80 lg:w-96 mt-16 md:mt-0 rounded-lg flex items-center justify-center logo relative"
          >
            <img
              src="/Image.png"
              alt="ELMULLIM learning platform"
              width={384}
              height={384}
              loading="lazy"
              className="h-auto w-full"
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center items-center lg:items-start gap-4"
          >
            <BadgeTitle title="CHAT ROOMS" />
            <h2
              id="chat-rooms-title"
              className="capitalize text-black-blue font-bold text-4xl md:text-[45px] text-center lg:text-start leading-[55px]"
            >
              Stay In Touch With Your Teacher <br /> Through Our Chat Rooms
            </h2>
          </motion.div>

          <div className="w-full max-w-3xl" role="list">
            {CHAT_OPTIONS.map((item) => (
              <motion.article
                variants={itemVariants}
                key={item.title}
                role="listitem"
                className="relative group w-full bg-white shadow-md hover:shadow-lg rounded-lg p-4 mb-4 flex items-center gap-5 transition-shadow duration-300 overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="absolute bg-[url('/images/chat-card-bg.png')] opacity-0 group-hover:opacity-100 inset-0 bg-cover bg-center transition-opacity rounded-lg duration-500"
                />
                <div className="relative z-10 flex shrink-0 justify-center items-center rounded-full p-6 bg-main group-hover:bg-white transition-colors duration-200">
                  <FontAwesomeIcon
                    className="text-2xl text-white group-hover:text-main transition-colors duration-200 w-6 h-6"
                    icon={item.icon}
                    aria-hidden="true"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold font-epilogue text-black-blue group-hover:text-white transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="font-sora text-muted group-hover:text-white transition-colors duration-200">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChatRoom;
