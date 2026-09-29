import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import authRoutes from "./authRoutes";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";

const RootLayout = lazy(() => import("@/layout/RootLayout"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));
const Chat = lazy(() => import("@/components/chat/Chat"));

// Public
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const Events = lazy(() => import("@/pages/events/Events"));
const EventDetails = lazy(() => import("@/pages/events/EventDetails"));
const Services = lazy(() => import("@/pages/services/Services"));
const ServiceDetails = lazy(() => import("@/pages/services/ServiceDetails"));
const Faqs = lazy(() => import("@/pages/Faqs"));
const Testimonials = lazy(() => import("@/pages/testimonials/Testimonials"));
const Courses = lazy(() => import("@/pages/courses/Courses"));
const CourseDetails = lazy(() => import("@/pages/courses/CourseDetails"));
const CourseEnroll = lazy(() => import("@/pages/courses/EnrollCourse"));
const ViewCourse = lazy(() => import("@/pages/courses/ViewCourse"));
const Lessons = lazy(() => import("@/pages/lessons/Lessons"));
const LessonDetails = lazy(() => import("@/pages/lessons/LessonDetails"));
const UploadCourse = lazy(() => import("@/pages/profile/teacher/UploadCourse"));
const UpdateCourse = lazy(() => import("@/pages/profile/teacher/UpdateCourse"));
const UploadLesson = lazy(() => import("@/pages/profile/teacher/UploadLesson"));
const UpdateLesson = lazy(() => import("@/pages/profile/teacher/UpdateLesson"));
const ServiceAreas = lazy(() => import("@/pages/profile/teacher/ServiceAreas"));
const TeacherViewCourse = lazy(() => import("@/pages/profile/teacher/TeacherViewCourse"));
const Bookings = lazy(() => import("@/pages/bookings/Bookings"));
const Schedule = lazy(() => import("@/pages/bookings/Schedule"));
const TeacherBookings = lazy(() => import("@/pages/profile/teacher/TeacherBookings"));
const Notifications = lazy(() => import("@/pages/Notifications"));
// Profile
const Profile = lazy(() => import("@/pages/profile/Profile"));
const UpdateProfile = lazy(() => import("@/pages/profile/UpdateProfile"));

export const routes = createRoutesFromElements(
  <>
    <Route element={<RootLayout />} id="root-layout">
      <Route path="/" element={<Home />} id="home" />
      <Route path="/about" element={<About />} id="about" />
      <Route path="/contact-us" element={<ContactUs />} id="contact-us" />
      <Route path="/events" element={<Events />} id="events" />
      <Route path="/events/:eventId" element={<EventDetails />} id="event-details" />
      <Route path="/courses" element={<Courses />} id="courses" />
      <Route path="/courses/:courseId" element={<CourseDetails />} id="course-details" />
      <Route path="/courses/:courseId/view" element={<ProtectedRoute requiredRole="student"><ViewCourse /></ProtectedRoute>} id="view-course" />
      <Route path="/course/:courseId/enroll" element={<CourseEnroll />} id="courseId" />
      <Route path="/lessons" element={<Lessons />} id="lessons" />
      <Route path="/lessons/:lessonId" element={<LessonDetails />} id="lesson-details" />
      <Route path="/view-quiz" element={<ProtectedRoute requiredRole="student"><ViewQuiz /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} id="chat" />
      <Route path="/bookings" element={<ProtectedRoute requiredRole={["student", "parent"]}><Bookings /></ProtectedRoute>} id="bookings" />
      <Route path="/schedule" element={<ProtectedRoute requiredRole={["student", "parent", "teacher"]}><Schedule /></ProtectedRoute>} id="schedule" />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} id="notifications" />
      <Route path="/profile/teacher/bookings" element={<ProtectedRoute requiredRole="teacher"><TeacherBookings /></ProtectedRoute>} id="teacher-bookings" />
      <Route path="/profile/teacher/schedule" element={<ProtectedRoute requiredRole="teacher"><Schedule /></ProtectedRoute>} id="teacher-schedule" />

      <Route path="/services" element={<Services />} id="services" />
      <Route path="/services/:serviceId" element={<ServiceDetails />} id="services-details" />
      <Route path="/faqs" element={<Faqs />} id="faqs" />
      <Route path="/testimonials" element={<Testimonials />} id="testimonials" />

      <Route path="/profile/teacher/courses/upload" element={<ProtectedRoute requiredRole="teacher"><UploadCourse /></ProtectedRoute>} />
      <Route path="/profile/my-courses/:courseId/update" element={<ProtectedRoute requiredRole="teacher"><UpdateCourse /></ProtectedRoute>} />
      <Route path="/profile/teacher/lessons/upload" element={<ProtectedRoute requiredRole="teacher"><UploadLesson /></ProtectedRoute>} />
      <Route path="/profile/teacher/service-areas" element={<ProtectedRoute requiredRole="teacher"><ServiceAreas /></ProtectedRoute>} />
      <Route path="/profile/my-lessons/:lessonId/update" element={<ProtectedRoute requiredRole="teacher"><UpdateLesson /></ProtectedRoute>} />
      <Route path="/profile/my-courses/:courseId/view" element={<ProtectedRoute requiredRole="teacher"><TeacherViewCourse /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} id="profile" />
      <Route path="/profile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} id="update-profile" />
    </Route>

    <Route path="/unauthorized" element={<Unauthorized />} id="unauthorized" />
    <Route path="*" element={<NotFound />} id="not-found" />
  </>
);

export const router = createBrowserRouter([...routes, ...authRoutes], { basename: "/" });

export default router;
