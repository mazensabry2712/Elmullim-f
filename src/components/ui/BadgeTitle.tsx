import { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
}
const BadgeTitle = ({ title }: IProps) => {
  return (
    <p className="font-sora w-fit uppercase bg-[#0AB99D33] text-main rounded-[5px] py-2 px-[14px] text-sm">
      {title}
    </p>
  );
};

export default BadgeTitle;
