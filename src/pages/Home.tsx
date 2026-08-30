import ChatRoom from "@/components/home/ChatRoom/ChatRoom";
import Comments from "@/components/home/comments/Comments";
import Hero from "@/components/home/hero/Hero";
import Category from "@/components/home/categories/Categories";
import PopularCourses from "@/components/home/PopularCourses";
import Career from "@/components/home/Career/Career";
import OurTeachers from "@/components/home/our teachers/OurTeachers";
import PopularLessons from "@/components/home/PopularLesson";

const Home = () => {
  return (
    <main>
      <Hero />
      <Category />
      <ChatRoom />
      <Comments />
      <Career />
      <PopularCourses />
      <PopularLessons />
      <OurTeachers />
    </main>
  );
};

export default Home;
