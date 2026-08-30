import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-main">
          Access denied
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#21374B] md:text-6xl">
          Unauthorized
        </h1>
        <p className="mt-5 text-base text-[#4D5756] font-sora md:text-lg">
          You do not have permission to access this page with your current account.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-[5px] bg-main px-7 py-3 text-white font-sora shadow transition-all duration-300 hover:shadow-md"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
};

export default Unauthorized;
