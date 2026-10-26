import Hero from "@/components/home/hero/Hero";
import Category from "@/components/home/categories/Categories";
import OurTeachers from "@/components/home/our teachers/OurTeachers";
import PopularLessons from "@/components/home/PopularLesson";
import PopularCourses from "@/components/home/PopularCourses";
import HomeHighlights from "@/components/home/comments/Comments";
import ChatRoom from "@/components/home/ChatRoom/ChatRoom";

const Home = () => {
  return (
    <main className="w-full overflow-x-clip">
      <Hero />
      <Category />
      <PopularLessons />
      <PopularCourses />
      <OurTeachers />
      <HomeHighlights />
      <ChatRoom />
    </main>
  );
};

export default Home;
