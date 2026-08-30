import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main>
      <Header />
      <section>
        <div className="bg-[#21374B] py-10 md:py-28">
          <div className="container">
            <h1 className="uppercase text-center font-bold text-white text-4xl md:text-6xl">
              404 page
            </h1>
            <p className="capitalize text-main font-sora text-center text-sm">
              Page not found
            </p>
          </div>
        </div>
        <div className="bg-white">
          <div className="container space-y-4 md:space-y-6 py-16">
            <div className="flex justify-center items-center">
              <img
                src="/images/404.webp"
                alt="404 not found"
                className="w-full sm:w-[80%] md:max-w-[500px]"
              />
            </div>
            <div className="space-y-4 max-w-[600px] mx-auto">
              <h2 className="text-black-blue text-center font-bold text-4xl md:text-[45px]">
                Sorry, Page Not Found!
              </h2>
              <p className="text-center text-[#4D5756] font-sora">
                The page you're looking for might have been moved, deleted, or
                never existed.
              </p>
              <Link
                to={"/"}
                className="w-fit mx-auto text-white rounded-[5px] shadow hover:shadow-md transition-all duration-300 font-sora font-light flex justify-center items-center gap-2 px-7 py-3 capitalize bg-main"
              >
                Back to home <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default NotFound;
