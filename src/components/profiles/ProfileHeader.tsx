import { motion } from "framer-motion";

interface IProps {
  profileImage: string;
}

const ProfileHeader = ({ profileImage }: IProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[211px] mb-24"
    >
      {/* cover image*/}
      <motion.div className="w-full h-full">
        <img
          src={"/images/profile-cover.webp"}
          alt="Cover Image"
          className="object-cover w-full h-full overflow-hidden"
        />
      </motion.div>

      {/* profile image*/}

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative h-20"
      >
        <div className="w-40 h-40 absolute -top-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-16 bg-white dark:bg-dark border-[5px] border-[#fff] dark:border-dark rounded-full overflow-hidden flex justify-center items-center">
          <img
            src={profileImage || "/images/profile-avatar.webp"}
            alt="logo"
            className="object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileHeader;
