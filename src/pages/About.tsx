import Newsletter from "@/components/Newsletter";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import CoursesList from "@/components/courses/CoursesList";
import FunFacts from "@/components/FunFacts";
import { useGetCourses } from "@/lib/react-query/courses/courses";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const About = () => {
  const token = cookieService.getToken();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: courses, isLoading } = useGetCourses({
    ...(token && { token }),
  });
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
          about us
        </h1>
        <p className="font-sora font-light leading-[30px]">
          Home <span className="text-main">//</span> ABOUT US
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24 overflow-hidden">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-x-4 gap-y-7">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <img
                src="/images/about.webp"
                alt="about us"
                className="w-full h-full scale-110"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative"
            >
              <img
                src="/icons/triangle.webp"
                alt="elmullim"
                className="w-72 absolute -bottom-8 -right-0 lg:-right-32"
              />

              <div className="relative">
                <div className="space-y-2 xl:space-y-3 text-center xl:text-start">
                  <p className="text-main font-sora uppercase flex items-center justify-center xl:justify-start gap-1 xl:text-lg font-light">
                    <i className="fi fi-ts-book-bookmark flex justify-center items-center" />
                    about us
                  </p>
                  <h1 className="text-black-blue text-3xl xl:text-[44px] leading-[55px] capitalize font-bold">
                    we are always ensure best course for your{" "}
                    <span className="text-main">learning</span>
                  </h1>
                  <p className="text-[#4D5756] font-sora leading-[32px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod temp incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi.
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 bg-black-blue text-white rounded-[10px] w-[60px] h-[60px] flex justify-center items-center">
                      <i className="fi fi-tr-lesson text-3xl flex justify-center items-center" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl text-black-blue font-bold">
                        Sharing a Screen
                      </h3>
                      <p className="text-[#4D5756] text-[17px] font-sora">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do tempor incididunt ut labore et dolore magna
                        aliqua.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 bg-black-blue text-white rounded-[10px] w-[60px] h-[60px] flex justify-center items-center">
                      <i className="fi fi-rr-lightbulb-on text-3xl flex justify-center items-center" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl text-black-blue font-bold">
                        presenter Control
                      </h3>
                      <p className="text-[#4D5756] text-[17px] font-sora">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do tempor incididunt ut labore et dolore magna
                        aliqua.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-8 gap-y-3">
                  <Link
                    to={isAuthenticated ? "/profile" : "/login"}
                    className="w-full md:w-fit flex justify-center items-center gap-2 bg-main rounded-[5px] px-5 py-4 capitalize text-white font-sora"
                  >
                    admission open <ArrowRight />
                  </Link>
                  <img
                    src="/icons/arrows.webp"
                    alt="arrow"
                    className="max-w-64"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <FunFacts />
        <AboutTestimonial />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container py-12 md:py-24 space-y-6"
        >
          <div className="space-y-2">
            <p className="text-main uppercase flex items-center gap-2 justify-center font-semibold text-lg">
              <i className="fi fi-ts-book-bookmark flex justify-center items-center" />
              courses
              <i className="fi fi-ts-book-bookmark flex justify-center items-center" />
            </p>
            <h4 className="text-center text-black-blue text-3xl xl:text-[44px] leading-[55px] capitalize font-bold mx-auto max-w-[660px]">
              Histudy Course student can join with us.
            </h4>
          </div>
          {isLoading ? (
            <div className="py-5">
              <Loader size={40} className="animate-spin mx-auto" />
            </div>
          ) : (
            <CoursesList courses={courses?.data.slice(0, 3) || []} />
          )}
          <Link
            to={"/courses"}
            className="block w-fit mt-5 bg-main hover:bg-main/90 duration-200 rounded-lg mx-auto px-10 py-3 text-white"
          >
            All Courses
          </Link>
        </motion.div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default About;
