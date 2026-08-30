export default function TestimonialsCard() {
  return (
    <div className="bg-black-blue px-5 py-8 shadow-md">
      <div className="flex justify-between items-center px-2 md:px-5">
        <div className="flex items-center gap-x-5">
          <img
            className="w-[90px] h-[90px]  rounded-full border-[3px] border-white object-cover object-top"
            src="/images/teacher-img1.png"
            alt="teacher"
          />
          <div className="space-y-1">
            <h2 className="font-epilogue font-bold text-[21px] text-white capitalize">
              Edith Mahoney
            </h2>
            <p className="text-[#00AFEF] font-sora font-medium text-[14px]">
              Student
            </p>
          </div>
        </div>
        <div className="hidden md:flex">
          <svg
            width="59"
            height="93"
            viewBox="0 0 59 93"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.4285 0.789062C46.2913 0.789062 58.4974 15.1075 58.4974 35.9411C58.4974 66.3682 35.7784 87.9179 3.25227 92.0703C2.6284 92.1259 2.00525 91.9582 1.49054 91.5962C0.975827 91.2342 0.602237 90.7005 0.434618 90.0882C0.266999 89.4759 0.315894 88.8233 0.572852 88.2438C0.82981 87.6642 1.27832 87.1947 1.84108 86.9158C14.3294 81.3316 20.6796 74.1721 21.4557 67.0844C21.8927 64.8801 21.5528 62.59 20.4954 60.6142C19.438 58.6383 17.7301 57.1021 15.6701 56.2737C6.42734 54.0544 0.289062 42.3847 0.289062 30.3571C0.289062 22.5152 3.35915 14.9944 8.82386 9.44937C14.2886 3.9043 21.7003 0.789062 29.4285 0.789062Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
          <svg
            width="59"
            height="93"
            viewBox="0 0 59 93"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.4285 0.789062C46.2913 0.789062 58.4974 15.1075 58.4974 35.9411C58.4974 66.3682 35.7784 87.9179 3.25227 92.0703C2.6284 92.1259 2.00525 91.9582 1.49054 91.5962C0.975827 91.2342 0.602237 90.7005 0.434618 90.0882C0.266999 89.4759 0.315894 88.8233 0.572852 88.2438C0.82981 87.6642 1.27832 87.1947 1.84108 86.9158C14.3294 81.3316 20.6796 74.1721 21.4557 67.0844C21.8927 64.8801 21.5528 62.59 20.4954 60.6142C19.438 58.6383 17.7301 57.1021 15.6701 56.2737C6.42734 54.0544 0.289062 42.3847 0.289062 30.3571C0.289062 22.5152 3.35915 14.9944 8.82386 9.44937C14.2886 3.9043 21.7003 0.789062 29.4285 0.789062Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
        </div>
      </div>
      <p className="font-sora text-[14px] lg:text-[17px] p-1 md:px-5 mt-10 leading-[32px] font-[400px] text-white">
        “Lorem ipsum dolor sit amet, consectetur adipiscing elit do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation”
      </p>
    </div>
  );
}
