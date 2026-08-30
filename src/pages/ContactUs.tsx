import ContactUsForm from "@/components/forms/contactUs/ContactUsForm";
import Newsletter from "@/components/Newsletter";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const contactInfo: {
  title: string;
  description: string;
  subDescription?: string;
  icon: IconDefinition;
}[] = [
  {
    title: "our address",
    description: "1564 Goosetown Drive Matthews, NC 28105",
    icon: faLocationDot,
  },
  {
    title: "Hours of Operation",
    description: "Mon - Fri: 9.00am to 5.00pm",
    subDescription: "[2nd sat Holiday]",
    icon: faClock,
  },
  {
    title: "phone",
    description: "+99- 35895-4565",
    icon: faPhone,
  },
  {
    title: "email",
    description: "support@elmullim.com",
    icon: faEnvelope,
  },
];

const links = [
  {
    link: "/",
    icon: faFacebookF,
  },
  {
    link: "/",
    icon: faYoutube,
  },
  {
    link: "/",
    icon: faTwitter,
  },
  {
    link: "/",
    icon: faInstagram,
  },
];

const ContactUs = () => {
  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          Cntact Us
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> contact us
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24">
          <div className="max-w-[1320px] mx-auto bg-white-gray relative shadow-md">
            <div
              className="hidden lg:block absolute bottom-0 left-0 w-full h-full bg-main"
              style={{ clipPath: "polygon(0 60%, 0% 100%, 32% 100%)" }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-16 py-8 px-4 md:p-16 relative">
              <div className="space-y-5">
                <div className="space-y-10">
                  <div className="space-y-3 text-center lg:text-start">
                    <h2 className="font-bold text-3xl md:text-4xl text-black-blue">
                      Get in Touch
                    </h2>
                    <p className="font-sora text-sm md:text-[17px] text-[#4D5756]">
                      Suspendisse ultrice gravida dictum fusce placerat
                      ultricies integer
                    </p>
                  </div>
                  <div className="bg-white py-12 px-4 xl:px-9">
                    <div className="space-y-7">
                      {contactInfo.map((item) => (
                        <div className="flex gap-3" key={item.title}>
                          <div className="flex-shrink-0 bg-[#0AB99D]/30 w-8 h-8 md:w-12 md:h-12 rounded-full flex justify-center items-center">
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="md:text-xl text-main"
                            />
                          </div>
                          <div>
                            <p className="text-sm md:text-base font-sora text-[#4D5756] capitalize">
                              {item.title}
                            </p>
                            <h3 className="md:text-[21px] font-bold text-black-blue">
                              {item.description}
                            </h3>
                            {item.subDescription && (
                              <p className="text-sm md:text-base font-sora text-[#4D5756] capitalize">
                                {item.subDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end gap-3 items-center">
                  {links.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.link}
                      className="w-10 h-10 flex-shrink-0 bg-main/30 rounded-full text-main flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={link.icon} />
                    </Link>
                  ))}
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
