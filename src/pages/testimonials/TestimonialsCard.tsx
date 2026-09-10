import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  name: string;
  role: string;
  quote: string;
  image: string;
  imageAlt: string;
}

export default function TestimonialsCard({ name, role, quote, image, imageAlt }: Props) {
  return (
    <article className="bg-black-blue px-5 py-8 shadow-md rounded-[5px] h-full">
      <div className="flex justify-between items-start gap-4 px-2 md:px-5">
        <div className="flex items-center gap-x-5 min-w-0">
          <img
            className="w-[90px] h-[90px] rounded-full border-[3px] border-white object-cover object-top flex-shrink-0"
            src={image}
            alt={imageAlt}
          />
          <div className="space-y-1 min-w-0">
            <h2 className="font-epilogue font-bold text-[21px] text-white capitalize truncate">
              {name}
            </h2>
            <p className="text-[#00AFEF] font-sora font-medium text-[14px]">{role}</p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faQuoteLeft}
          aria-hidden="true"
          className="hidden md:block text-white/10 text-5xl flex-shrink-0"
        />
      </div>
      <p className="font-sora text-[14px] lg:text-[17px] p-1 md:px-5 mt-10 leading-[32px] font-normal text-white">
        “{quote}”
      </p>
    </article>
  );
}
