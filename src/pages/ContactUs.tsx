import ContactUsForm from "@/components/forms/contactUs/ContactUsForm";
import Newsletter from "@/components/Newsletter";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const contactInfo = [
  {
    title: "address" as const,
    description: import.meta.env.VITE_CONTACT_ADDRESS?.trim(),
    icon: faLocationDot,
  },
  {
    title: "hours" as const,
    description: import.meta.env.VITE_CONTACT_HOURS?.trim(),
    icon: faClock,
  },
  {
    title: "phone" as const,
    description: import.meta.env.VITE_CONTACT_PHONE?.trim(),
    icon: faPhone,
    href: import.meta.env.VITE_CONTACT_PHONE?.trim()
      ? "tel:" + import.meta.env.VITE_CONTACT_PHONE.trim().replace(/\s+/g, "")
      : undefined,
  },
  {
    title: "email" as const,
    description: import.meta.env.VITE_CONTACT_EMAIL?.trim() || "support@elmullim.com",
    icon: faEnvelope,
    href: "mailto:" + (import.meta.env.VITE_CONTACT_EMAIL?.trim() || "support@elmullim.com"),
  },
].filter((item) => item.description);

const ContactUs = () => {
  const { language, t } = useI18n();
  const copy = contactCopy[language];

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1
          id="contact-us-title"
          className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]"
        >
          {copy.title}
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          <span>{t("nav.home")}</span> <span className="text-main">//</span>{" "}
          <span>{copy.title}</span>
        </p>
      </motion.div>
      <motion.section
        aria-labelledby="contact-us-title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24">
          <div className="max-w-[1320px] mx-auto bg-white-gray relative shadow-md">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute bottom-0 left-0 w-full h-full bg-main"
              style={{ clipPath: "polygon(0 60%, 0% 100%, 32% 100%)" }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-16 py-8 px-4 md:p-16 relative">
              <div className="space-y-5">
                <div className="space-y-10">
                  <div className="space-y-3 text-center lg:text-start">
                    <h2 className="font-bold text-3xl md:text-4xl text-black-blue">
                      {copy.getInTouch}
                    </h2>
                    <p className="font-sora text-sm md:text-[17px] text-[#4D5756]">
                      {copy.description}
                    </p>
                  </div>
                  <div className="bg-white py-12 px-4 xl:px-9">
                    <div className="space-y-7">
                      {contactInfo.map((item) => {
                        const label = copy[item.title];
                        const content = (
                          <>
                            <p className="text-sm md:text-base font-sora text-[#4D5756] capitalize">
                              {label}
                            </p>
                            <h3 className="md:text-[21px] font-bold text-black-blue break-words">
                              {item.description}
                            </h3>
                          </>
                        );

                        return (
                          <div className="flex gap-3" key={item.title}>
                            <div className="flex-shrink-0 bg-[#0AB99D]/30 w-8 h-8 md:w-12 md:h-12 rounded-full flex justify-center items-center">
                              <FontAwesomeIcon
                                icon={item.icon}
                                className="md:text-xl text-main"
                                aria-hidden="true"
                              />
                            </div>
                            <div>
                              {item.href ? (
                                <a
                                  href={item.href}
                                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 rounded-sm"
                                >
                                  {content}
                                </a>
                              ) : (
                                content
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ContactUsForm />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <div>
        <Newsletter />
      </div>
    </main>
  );
};

export default ContactUs;
