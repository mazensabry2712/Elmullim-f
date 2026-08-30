import { Link } from "react-router-dom";

const EventCard = () => {
  return (
    <div className="p-3 sm:p-5   shadow-[0px_0px_40px_0px_#0E2A4614] rounded-[5px] space-y-5 sm:max-w-[80%] md:max-w-full mx-auto">
      <Link to={`/events/1`}>
        <div>
          <div className="rounded-[5px] mb-5 overflow-hidden relative max-h-80 sm:max-h-72 md:max-h-52">
            <div className="flex flex-col items-center gap-y-1 absolute top-6 right-16 bg-[#F2A227] text-white font-sora border-[1px] border-white text-sm rounded-[3px] py-4 px-2">
              <h4 className="font-[700] text-[30px] text-[#0E2A46]">05</h4>
              <h5 className="text-black">October</h5>
            </div>

            <img
              src="/images/events.webp"
              alt="events"
              className="object-cover w-full "
            />
          </div>
          <div className="space-y-4 px-3">
            {/* Info */}
            <div>
              <h4 className="text-black-blue capitalize font-semibold text-[21px] leading-[30px]">
                print, and publishing industries for previewing
              </h4>
              <p className="font-sora font-[400px] text-[17px] text-[#4D5756]">
                Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod
                tempor
              </p>
              <div className="my-3 flex justify-between items-center  gap-1 pb-2  text-black-blue text-sm font-sora">
                <div className="flex items-center gap-x-1">
                  <i className="fi fi-rs-clock-five w-4 text-main flex justify-center items-center" />
                  <p className="font-sora font-[400px] text-[14px] text-[#4D5756]">
                    {" "}
                    Time: 11:00am 03;00pm
                  </p>
                </div>
                <div className="flex items-center gap-x-1">
                  <i className="fi fi-br-location-alt w-2 text-main flex justify-center items-center" />
                  <p className="font-sora font-[400px] text-[14px] text-[#4D5756]">
                    {" "}
                    Location: USA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
