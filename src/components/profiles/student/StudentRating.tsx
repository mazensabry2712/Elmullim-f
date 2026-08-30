import { IRating } from "@/interfaces/students/studentProfile";

interface IProps {
  rate: IRating;
}

const StudentRating = ({ rate }: IProps) => {
  return (
    <div className="min-h-[100px] max-w-[1100px] rounded-[4px] pe-2">
      <div className="flex flex-col items-center md:justify-start md:flex-row bg-[#F2F2F2] py-2">
        <div className="flex items-center mx-3 justify-center py-3 px-4">
          <img
            className=" w-[80px] h-[80px] rounded-full"
            src={rate.rateable.image || "/images/profile-avatar.webp"}
            alt={rate.rateable.name}
          />
        </div>
        <div>
          <h2 className="font-sora font-medium mt-1 text-xl text-black-blue capitalize">
            {rate.rateable.name}
          </h2>
          <p className="font-sora text-lg text-main capitalize">
            {rate.description}
          </p>
          <h2 className="font-medium text-lg capitalize text-black-blue">
            rate: {rate.rate}/5
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StudentRating;
