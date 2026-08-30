interface IProps {
  bgColor: any;
  image: string;
  rate: string;
  rateColor: any;
  desc: string;
}

const TeacherRating = ({ bgColor, image, rate, rateColor, desc }: IProps) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="py-3 lg:pb-0 min-h-[129px] max-w-[1100px] rounded-[4px] flex items-center px-4"
    >
      <div className="flex flex-col items-center justify-center lg:flex-row gap-x-12">
        <div className="lg:w-[35%] lg:border-e-[1px] h-[129px] flex items-center justify-center">
          <img
            className=" w-[81px] h-[81px] rounded-full  "
            src={image}
            alt={desc}
          />
        </div>

        <div className="flex gap-2">
          <img
            className="w-[46px] h-[46px] relative lg:-top-8  "
            src="images/mark.png"
            alt=""
          />
          <p className="font-sora text-[13px] md:text-[15px] font-[200px] ms-5 capitalize mt-2  ">
            {desc}
            <span style={{ color: rateColor }} className="font-bold ">
              {rate}
            </span>
          </p>
          <img
            className="w-[46px] h-[46px] rotate-180  relative -bottom-8 ms-3 "
            src="images/mark.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherRating;
