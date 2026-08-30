import Newsletter from "@/components/Newsletter";
import { motion } from "framer-motion";

const EventDetails = () => {
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
          Event Details
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> Event
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className=" bg-white bg relative"
      >
        <div className="container py-12 md:py-24">
          <div className=" grid md:grid-cols-1 xl:grid-cols-[70%__minmax(0,1fr)] gap-10 py-10">
            <div className="p-3 sm:p-5 shadow-[0px_0px_40px_0px_#0E2A4614] rounded-[5px] space-y-5 sm:max-w-[80%] md:max-w-full mx-auto">
              {/* Image */}
              <div className="rounded-[5px] ">
                <img src="/images/course.webp" alt="events" />
              </div>
              {/* Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-black-blue font-epilogue capitalize font-bold text-[40px] leading-[55px]">
                    These are Designed to Provide Hands Training and
                    Skill-Building.
                  </h4>
                  <div className="my-5 ms-2 flex justify-start items-center flex-wrap gap-x-12 pb-4 gap-y-5  text-black-blue text-sm font-sora">
                    <div className="flex items- gap-x-1">
                      <i className="fi fi-sr-list-check flex text-main  text-[20px] justify-center items-center" />
                      <p className="font-sora text-[21px] font-[400px] mx-1 text-[#4D5756]">
                        Lesson 10
                      </p>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <i className="fi fi-br-clock-five flex text-main   text-[20px] justify-center items-center" />
                      <p className="font-sora text-[21px] font-[400px] mx-1 text-[#4D5756]">
                        9.00AM- 01.00 PM
                      </p>
                    </div>

                    <div className="flex items-center gap-x-1">
                      <i className="fi fi-br-location-alt flex text-main  text-[20px] justify-center items-center" />
                      <p className="font-sora text-[21px] font-[400px]  mx-1 text-[#4D5756]">
                        3783 Columbia Mine Road
                      </p>
                    </div>
                    <p className=" mt-10 font-sora text-[16px] text-[#4D5756] font-[400px] leading-[32px]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in.
                    </p>
                  </div>
                  <div className="ms-1">
                    <h4 className="font-bold uppercase text-[25px] text-black-blue font-epilogue my-10">
                      Event Description
                    </h4>
                    <p className="font-sora text-[16px] text-[#4D5756] font-[400px] leading-[32px]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim..
                    </p>
                    <p className="font-sora text-[16px] text-[#4D5756] font-[400px] leading-[32px]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum..
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* personInfo */}
            <div className="self-start bg-[#F2F2F2] p-3 rounded-[5px]">
              <img
                className="w-full mb-3"
                src="/images/event-details.webp"
                alt=""
              />
              <div className="flex flex-col gap-y-5">
                <p className="font-sora text-[16px] font-[400px] text-[#4D5756] leading-[30px]">
                  4:00 pm 6:00 pm
                </p>
                <p className="font-sora text-[16px] font-[400px] text-[#4D5756] leading-[30px]">
                  25 January, 2024
                </p>
                <p className="font-sora text-[16px] font-[400px] text-[#4D5756] leading-[30px]">
                  3783 Columbia Mine Road <br /> Shinnston, WV 26431{" "}
                </p>
                <p className="font-sora text-[16px] font-[400px] text-[#4D5756] leading-[30px]">
                  infomail@gmail.com{" "}
                </p>
                <p className="font-sora text-[16px] font-[400px] text-[#4D5756] leading-[30px]">
                  +9870123456789{" "}
                </p>
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

export default EventDetails;
