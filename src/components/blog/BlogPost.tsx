import { Button } from "@/components/ui/button";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BlogPost() {
  return (
    <div className="bg-white">
      <div className="">
        <img
          src="/images/course.webp"
          alt="Blog Post"
          className="object-cover object-center w-full h-full lg:max-h-[450px]"
        />
      </div>
      <div className="flex ms-5 gap-20 mt-8 font-sora text-[#4D5756] text-xs md:text-sm">
        <span>14 June 2023</span>
        <span>Comment (06)</span>
      </div>
      <h2 className="my-4 text-black-blue font-bold font-epilogue capitalize text-md md:text-2xl">
        Pellentesque dignissim enim sit amet venenatis cursus eget nunc.
      </h2>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm  ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm my-4  ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <div className="mt-6 bg-main text-white px-10 py-6 ">
        <p className="uppercase text-sm md:text-lg 2xl:text-lg leading-8 font-bold underline">
          “Educational Strategies: We delve into effective teaching and learning
          strategies, instructional method, & innovative approaches to engage
          students and enhance learning outcomes.”.
        </p>
      </div>
      <h2 className="mt-6 text-black-blue font-epilogue font-bold text-md md:text-2xl ">
        Learned From Doing One Of Those Social Media
      </h2>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm  ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm my-4  ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <p className="font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat aute irure dolor in reprehenderit.
      </p>
      <div className="mt-6 flex flex-col gap-4   md:flex-row bg-[#d6dad9] md:justify-between py-5 px-3">
        <div className="flex items-center space-x-2">
          <span className="text-black-blue font-epilogue text-md md:text-lg font-bold">
            TAGS:
          </span>
          <span className="px-4 py-1  uppercase bg-white text-[#4D5756] font-sora text-sm md:text-md  cursor-pointer">
            riding
          </span>
          <span className="px-4 py-1 uppercase bg-white text-[#4D5756] font-sora text-sm md:text-md  cursor-pointer">
            travel
          </span>
          <span className="px-4 py-1 uppercase bg-white text-[#4D5756] font-sora text-sm md:text-md  cursor-pointer">
            taxi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-black-blue font-epilogue text-md md:text-lg font-bold">
            SHARE:
          </span>
          <div className="w-10 h-10 bg-white cursor-pointer rounded-md  hover:bg-main transition-colors duration-300 ease-in-out"></div>
          <div className="w-10 h-10 bg-white cursor-pointer rounded-md  hover:bg-main transition-colors duration-300 ease-in-out"></div>
          <div className="w-10 h-10 bg-white cursor-pointer rounded-md  hover:bg-main transition-colors duration-300 ease-in-out"></div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-md md:text-2xl font-bold text-black-blue my-5">
          Comment (02)
        </h2>
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="border border-[#E2E1E1] p-5 mt-5">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img
                  src="/images/teacher-img1.png"
                  alt="comment-img"
                  className="w-20 h-20 rounded-lg object-cover object-top"
                />
                <div>
                  <h3 className="text-sm md:text-lg font-bold font-epilogue text-black-blue">
                    Jenny Wilson
                  </h3>
                  <p className="text-xs md:text-sm text-[#4D5756] font-sora">
                    19 June 2023
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center">
                <h3 className="text-sm md:text-lg font-bold font-epilogue text-black-blue">
                  Rating:
                </h3>
                <span className="text-xs md:text-sm font-sora text-[#4D5756]">
                  (4.8)
                </span>
              </div>
            </div>
            <p className="mt-4 font-sora text-[#4D5756] leading-6 md:leading-8 text-xs md:text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat aute irure dolor in
              reprehenderit.
            </p>
          </div>
        ))}
      </div>
      <form className="mt-8">
        <h2 className="text-black-blue font-epilogue font-bold capitalize text-md md:text-2xl mb-4">
          leave a review
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          <input
            type="text"
            placeholder="First Name:"
            className="w-full py-4 px-6 border rounded-md focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
          />
          <input
            type="text"
            placeholder="Last Name:"
            className="w-full py-4 px-6 border rounded-md focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
          />
          <input
            type="text"
            placeholder="Email Address:"
            className="w-full py-4 px-6 border rounded-lg focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
          />
          <input
            type="text"
            placeholder="Rating:"
            className="w-full py-4 px-6 border rounded-md focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
          />
        </div>
        <textarea
          placeholder="Write Here..."
          className="w-full row-2 py-4 my-4 h-32 px-6 border rounded-md focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
        ></textarea>
        <Button className="bg-main hover:bg-main/90 capitalize text-white rounded-md font-sora text-sm md:text-md py-6 transition-colors duration-300 ease-in-out">
          Submit comment{" "}
          <FontAwesomeIcon className="ms-1" icon={faArrowRight} />
        </Button>
      </form>
    </div>
  );
}

export default BlogPost;
