import { RiDoubleQuotesR } from "react-icons/ri";

const CommentCard = () => {
  return (
    <div className="bg-black-blue relative shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="absolute right-20 -translate-y-1/2">
        <div className="bg-main px-4 py-2">
          <RiDoubleQuotesR size={40} className="text-black-blue" />
        </div>
        <div className="w-12 h-8 absolute border border-[#8694A2] -z-10 -bottom-2 -left-2" />
      </div>
      <div className="py-10 px-6 md:px-8 lg:px-16 flex flex-col md:flex-row items-center gap-4 gap-x-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-[44px] h-[30px] md:w-[66px] md:h-[50px] bg-white rounded-full" />
          <div className="w-[90px] h-[61px] md:w-[110px] md:h-[81px] bg-white rounded-full" />
          <div className="w-[44px] h-[30px] md:w-[66px] md:h-[50px] bg-white rounded-full" />
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-2xl text-white text-center md:text-start">
              Courtney Henry
            </h2>
            <p className="font-sora font-light text-main uppercase text-[13px] text-center md:text-start">
              happy customer
            </p>
          </div>
          <p className="font-sora text-base md:text-[17px] leading-relaxed text-white text-center md:text-start">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
