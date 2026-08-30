import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import axios from "axios";

const GetVimeoVideo = async (videoId: string) => {
  const accessToken = "fabae0cb7fa36e04577aa79f43055239"; // Replace with your access token
  try {
    const response = await axios.get(
      `https://api.vimeo.com/videos/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Vimeo video:",
      error.response?.data?.error || error.message
    );
    throw error;
  }
};
const VideoPlayer = ({ videoId }: { videoId: string }) => {
  const [videoEmbedUrl, setVideoEmbedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const videoData = await GetVimeoVideo(videoId);
        // Assuming the API returns an embed URL or player URL
        setVideoEmbedUrl(
          videoData.player_embed_url ||
            `https://player.vimeo.com/video/${videoId}`
        );
      } catch (_err) {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Vimeo
        video={videoEmbedUrl}
        showTitle={false}
        showByline={false}
        showPortrait={false}
        autoplay={false}
        controls
        responsive
        onError={(err) => console.error("Vimeo player error:", err)}
        className="aspect-video w-full"
      />
    </div>
  );
};

const ServiceDetails = () => {
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
          services details
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> service
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24 space-y-10">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7 rounded-[5px] overflow-hidden">
              <img
                src="/images/course.webp"
                alt="service"
                className="w-full md:h-[450px] object-cover object-center"
              />
            </div>
            <div className="col-span-12 lg:col-span-5 space-y-3">
              <h1 className="uppercase text-black-blue leading-[55px] text-3xl md:text-[45px] font-bold">
                web designing
              </h1>
              <p className="text-[#4D5756] leading-[32px] font-sora">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat aute irure dolor in
                reprehenderit.
              </p>
              <p className="text-[#4D5756] leading-[32px] font-sora">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                exercitation ullamco laboris.
              </p>
            </div>
          </div>
          <div className="md:px-9 space-y-10">
            <div className="space-y-3">
              <h2 className="uppercase leading-[55px] text-black-blue text-3xl md:text-[45px] font-bold">
                service Description
              </h2>
              <p className="text-[#4D5756] leading-[32px] font-sora">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat aute irure dolor in
                reprehenderit.
              </p>
              <p className="text-[#4D5756] leading-[32px] font-sora mt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat aute irure dolor in
                reprehenderit.
              </p>
            </div>
            <div className="flex flex-col gap-y-4 gap-x-8 lg:flex-row ">
              {Array.from({ length: 2 }, (_, idx) => (
                <div
                  key={idx}
                  className="space-y-4 bg-[#F2F2F2] p-7 rounded-[5px]"
                >
                  <h4 className="flex items-center gap-2 text-[#4D5756] text-[17px] font-semibold">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-white bg-[#F2A227] w-3 h-3 p-1 rounded-full flex-shrink-0"
                    />
                    Requirements
                  </h4>
                  <p className="font-sora leading-[28px] text-[#4D5756]">
                    Dui id ornare arcu odio ut sem nulla pharetra diam eget
                    aliquet nibh praesent tristique magna sit amet purus. Aenean
                    euismod elementum nisi quis eleifend quam adipiscing vitae
                    proin.
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="uppercase leading-[55px] text-black-blue text-3xl md:text-[45px] font-bold">
                What you'll learn
              </h4>
              <p className="font-sora leading-[28px] text-[#4D5756]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat aute irure dolor in
                reprehenderit.
              </p>
            </div>
            <div>
              {/* {isLoading && <Loader />}
              <div
                className={`${
                  isLoading ? "hidden" : "block"
                } aspect-video w-full mx-auto`}
              >
                <div ref={playerContainerRef}></div>
              </div> */}

              <VideoPlayer videoId="1077152374" />

              <div className="mt-10">
                <p className="text-[#4D5756] leading-[32px] font-sora">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat aute irure
                  dolor in reprehenderit.
                </p>
                <br />
                <p className="text-[#4D5756] leading-[32px] font-sora">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat aute irure
                  dolor in reprehenderit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default ServiceDetails;
