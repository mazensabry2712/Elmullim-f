import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import authRoutes from "./authRoutes";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";


const RootLayout = lazy(() => import("@/layout/RootLayout"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));

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
const ViewLesson = lazy(() => import("@/pages/lessons/ViewLesson"));
const UploadCourse = lazy(() => import("@/pages/profile/teacher/UploadCourse"));
const UpdateCourse = lazy(() => import("@/pages/profile/teacher/UpdateCourse"));
const UploadLesson = lazy(() => import("@/pages/profile/teacher/UploadLesson"));
const UpdateLesson = lazy(() => import("@/pages/profile/teacher/UpdateLesson"));
const TeacherViewLesson = lazy(
  () => import("@/pages/profile/teacher/TeacherViewLesson")
);
const TeacherViewCourse = lazy(
  () => import("@/pages/profile/teacher/TeacherViewCourse")
);
// Profile
const Profile = lazy(() => import("@/pages/profile/Profile"));
const UpdateProfile = lazy(() => import("@/pages/profile/UpdateProfile"));

export const routes = createRoutesFromElements(
  <>
    {/* Root */}
    <Route
      element={<RootLayout />}
      // errorElement={<Error />}
      id="root-layout"
    >
      <Route path="/" element={<Home />} id="home" />
      <Route path="/about" element={<About />} id="about" />
      <Route path="/contact-us" element={<ContactUs />} id="contact-us" />
      <Route path="/events" element={<Events />} id="events" />
      <Route
        path="/events/:eventId"
        element={<EventDetails />}
        id="event-details"
      />
      <Route path="/courses" element={<Courses />} id="courses" />
      <Route
        path="/courses/:courseId"
        element={<CourseDetails />}
        id="course-details"
      />
      <Route
        path="/courses/:courseId/view"
        element={
          <ProtectedRoute requiredRole={"student"}>
            <ViewCourse />
          </ProtectedRoute>
        }
        id="view-course"
      />
      <Route path="/course/:courseId/enroll" element={<CourseEnroll />} id="courseId" />
      <Route path="/lessons" element={<Lessons />} id="lessons" />
      <Route
        path="/lessons/:lessonId"
        element={<LessonDetails />}
        id="lesson-details"
      />
      <Route
        path="/lessons/:lessonId/view"
        element={
          <ProtectedRoute requiredRole={"student"}>
            <ViewLesson />
          </ProtectedRoute>
        }
      />
      <Route path="/view-quiz" element={
        <ProtectedRoute  requiredRole={
          "student"
        }>
          <ViewQuiz/>
        </ProtectedRoute>
      }>
      </Route>

      <Route path="/services" element={<Services />} id="services" />
      <Route
        path="/services/:serviceId"
        element={<ServiceDetails />}
        id="services-details"
      />
      <Route path="/faqs" element={<Faqs />} id="faqs" />
      <Route
        path="/testimonials"
        element={<Testimonials />}
        id="testimonials"
      />

      <Route
        path="/profile/teacher/courses/upload"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <UploadCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/my-courses/:courseId/update"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <UpdateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/teacher/lessons/upload"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <UploadLesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/my-lessons/:lessonId/update"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <UpdateLesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/my-courses/:courseId/view"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <TeacherViewCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/my-lessons/:lessonId/view"
        element={
          <ProtectedRoute requiredRole={"teacher"}>
            <TeacherViewLesson />
          </ProtectedRoute>
        }
      />
      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        id="profile"
      />
      <Route
        path="/profile/update"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
        id="update-profile"
      />
    </Route>

    <Route path="/unauthorized" element={<Unauthorized />} id="unauthorized" />

    {/* NotFound */}
    <Route path="*" element={<NotFound />} id="not-found" />
  </>
);

export const router = createBrowserRouter([...routes, ...authRoutes], {
  basename: "/",
});

export default router;
