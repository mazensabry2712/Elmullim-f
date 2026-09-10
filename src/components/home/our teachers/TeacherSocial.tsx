import { homeTeacherDropMenuVariants } from "@/animations";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n";

interface IProps {
  teacher: {
    id: number;
    img: string;
    links: {
      facebook: string;
      x: string;
      linkedin: string;
    };
  };
}

const TeacherSocial = ({ teacher }: IProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      href: teacher.links.facebook,
      label: t("home.teachers.facebook"),
      icon: faFacebookF,
    },
    {
      href: teacher.links.linkedin,
      label: t("home.teachers.linkedin"),
      icon: faLinkedinIn,
    },
    {
      href: teacher.links.x,
      label: t("home.teachers.x"),
      icon: faXTwitter,
    },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <>
      <Button
        type="button"
        aria-label={t("home.teachers.toggleSocialLinks")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full flex justify-center items-center bg-main hover:bg-main/90 relative z-10"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Share2 className="text-white w-6 h-6" aria-hidden="true" />
        </motion.div>
      </Button>
      <motion.ul
        variants={homeTeacherDropMenuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        aria-hidden={!isOpen}
        className={`bg-white py-3 rounded-3xl absolute bottom-full mt-2 before:w-6 ${
          isOpen ? "before:h-6" : "before:h-0 before:bottom-0"
        } before:transition-all before:rounded-full before:bg-white before:absolute before:-bottom-3 before:left-1/2 before:-translate-x-1/2 flex flex-col gap-4 justify-center items-center text-black-blue`}
        style={{ maxHeight: isOpen ? "200px" : "0px" }}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex px-4 py-2"
            >
              <FontAwesomeIcon icon={link.icon} aria-hidden="true" size="lg" />
            </a>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default TeacherSocial;
