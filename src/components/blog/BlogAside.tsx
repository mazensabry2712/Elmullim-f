import { CATEGORY, POPULAR_TAG } from "@/constant";

const BlogAside = () => {
  return (
    <div className="space-y-6">
      <form className="bg-white ">
        <input
          type="text"
          placeholder="Search here"
          className="w-full py-4 px-6 border rounded-lg focus:outline-none placeholder:text-[#4D5756] placeholder:font-sora placeholder:text-sm md:placeholder:text-base"
        />
      </form>
      <div>
        <h2 className="text-md md:text-xl font-bold text-black-blue mb-5 ">
          CATEGORY
        </h2>
        <ul className="space-y-3">
          {CATEGORY.map((cat, idx) => (
            <li
              key={idx}
              className="py-4 px-6 capitalize hover:bg-main hover:text-white transition-colors duration-300 ease-in-out rounded-lg cursor-pointer border border-[#E2E1E1] text-[#4D5756] font-sora text-sm md:text-md"
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-md md:text-xl font-bold text-black-blue mb-5 uppercase ">
          Recent blogs
        </h2>
        <ul className="space-y-4 mt-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <li key={idx} className="flex gap-4 border-t  py-5">
              <div className="w-20 lg:w-1/3 max-h-20 flex items-center">
                <div className="bg-[#4D5756] rounded-md w-full h-3/4"></div>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#4D5756] font-sora text-center">
                  14 June 2023
                </p>
                <p className="text-black-blue font-epilogue text-sm md:text-lg leading-6 mt-2">
                  Interdum velit laoreet id donec ultrices tincidunt arcu.
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div className="">
        <h2 className="mt-10 text-black-blue font-bold uppercase text-md md:text-xl mb-4">
          popular tag:
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAG.map((tag, idx) => (
            <span
              key={idx}
              className="px-8 py-3 capitalize bg-[#F2F2F2] text-[#4D5756] rounded-md font-sora text-sm hover:bg-[#F2A227] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogAside;
