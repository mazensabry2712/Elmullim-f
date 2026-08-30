import { IFormInput } from "@/interfaces";
import { TCourseType } from "@/types";
import {
  faSquareRootVariable,
  faDna,
  faLanguage,
  faLandmark,
  faAtom,
  faMicroscope,
  faBrain,
  faEarthAsia,
  faChalkboardTeacher,
  faUsers,
  faEye,
  faTrophy,
  faBoltLightning,
  faVideo,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

export const SIGNIN_FORM_INPUTS: IFormInput[] = [
  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password *",
  },
];

export const BLOG_LIST = [
  {
    image: "/images/blog-img.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
  {
    image: "/images/blog-img.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
  {
    image: "/images/blog-img.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
  {
    image: "/images/blog-img2.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
  {
    image: "/images/blog-img2.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
  {
    image: "/images/blog-img2.webp",
    date: "14 June 2023",
    comments: "Comment (06)",
    descrp:
      "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
  },
];
export const CHANGE_PASSWORD_INPUTS: IFormInput[] = [
  {
    label: "New Password",
    name: "password",
    type: "password",
    placeholder: "New Password",
  },
  {
    label: "Confirm New Password",
    name: "password_confirmation",
    type: "password",
    placeholder: "Confirm New Password",
  },
];

export const RESET_PASSWORD_FORM_INPUTS: IFormInput[] = [
  {
    placeholder: "Verification code",
    name: "code",
    type: "text",
  },
  {
    placeholder: "New Password",
    name: "password",
    type: "password",
  },
  {
    placeholder: "Confirm New Password",
    name: "password_confirmation",
    type: "password",
  },
];

export const STUDENT_SIGNUP_FORM_INPUTS: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name *",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password *",
  },

  {
    name: "address",
    type: "select",
    placeholder: "Your address",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },
];

export const PARENT_SIGNUP_FORM_INPUTS: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name *",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password *",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Your Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },
  {
    name: "students",
    type: "text",
    placeholder: "Student Phone Number *",
  },
];

export const TEACHER_SIGNUP_FORM_INPUTS: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name *",
  },

  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password *",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },
  {
    name: "subjects",
    type: "select",
    label: "Subjects",
  },
  {
    name: "course_type",
    type: "select",
    label: "Courses Type",
  },
];

// Update Profile

export const UPDATE_STUDENT_PROFILE: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name *",
  },
  {
    name: "description",
    type: "text",
    placeholder: "Description *",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "address",
    type: "select",
    placeholder: "Your address",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },

  {
    name: "favourite_subjects",
    type: "select",
    label: "Favorite Subjects",
  },
  {
    name: "profile_image",
    type: "file",
    label: "Profile Image",
    accept: "image/*",
  },
];

export const UPDATE_TEACHER_PROFILE: IFormInput[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Full Name *",
  },
  {
    name: "experince",
    label: "Experience",
    type: "text",
    placeholder: "Experience *",
  },
  {
    name: "qualification",
    label: "Qualification",
    type: "text",
    placeholder: "Qualification *",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    placeholder: "Description *",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },
  {
    name: "subjects",
    type: "select",
    label: "Subjects",
  },

  {
    name: "profile_image",
    type: "file",
    label: "Profile Image",
    accept: "image/*",
  },
  {
    name: "cv",
    type: "file",
    label: "CV",
    accept: ".pdf,.doc,.docx,.txt,.rtf,.odt",
  },
];

export const UPDATE_PARENT_PROFILE: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name *",
  },
  {
    name: "description",
    type: "text",
    placeholder: "Description *",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email *",
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
  },
  {
    name: "country_id",
    type: "select",
    label: "Country Name",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone Number *",
  },
  {
    name: "education_system_id",
    type: "select",
    label: "Education System",
  },
  {
    name: "education_level_id",
    type: "select",
    label: "Education Level",
  },
  {
    name: "students",
    type: "text",
    placeholder: "Student Phone Number *",
  },
  {
    name: "profile_image",
    type: "file",
    label: "Profile Image",
    accept: "image/*",
  },
];

export const COURSES_TYPE: { label: TCourseType; value: TCourseType }[] = [
  {
    label: "general",
    value: "general",
  },
  {
    label: "online",
    value: "online",
  },
  {
    label: "private",
    value: "private",
  },
];

export const GENDERS = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];

export const CONTACT_US_FORM_INPUTS: IFormInput[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Name",
    label: "Name",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email",
    label: "Email Address",
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    label: "Phone",
  },
  {
    name: "subject",
    type: "text",
    placeholder: "Subject",
    label: "Subject",
  },
  {
    name: "message",
    type: "text",
    placeholder: "Message",
    label: "Message",
  },
];

export const BENEFITS = [
  {
    title: "Secured Payment",
    description: "post a project or contest for what you need done .",
  },
  {
    title: "Rating for Teachers & Students",
    description: "browse freelancer profiles chat in real-time .",
  },
  {
    title: "Dashboard for Parents to oversee their heroes",
    description: "pay securely using our  milestone payment system",
  },
  {
    title: "Ability to learn Online or Offline",
    description: "post a project or contest for what you need done .",
  },
];

export const STATISTICS = [
  {
    title: "3.9k+",
    description: "Successfully graduated",
    icon: "fi fi-rr-chalkboard-user",
  },
  {
    title: "15.8k+",
    description: "Classes Completed",
    icon: "fi fi-tr-document-signed",
  },
  {
    title: "97.5k+",
    description: "Satisfaction Rate",
    icon: "fi fi-tr-feedback-review",
  },
  {
    title: "100.2k+",
    description: "Students Community",
    icon: "fi fi-tr-users-class",
  },
];

export const CATEGORIES = [
  { title: "Physics", icon: faDna },
  { title: "Maths", icon: faSquareRootVariable },
  { title: "Languages", icon: faLanguage },
  { title: "History", icon: faLandmark },
  { title: "Geography", icon: faEarthAsia },
  { title: "Chemistry", icon: faAtom },
  { title: "Biology", icon: faMicroscope },
  { title: "philosophy and Logic", icon: faBrain },
];

export const TEACHERS = [
  {
    id: 1,
    img: "/images/teacher-img1.png",
    links: {
      facebook: "",
      x: "",
      linkedin: "",
    },
  },
  {
    id: 2,
    img: "/images/teacher-img2.png",
    links: {
      facebook: "",
      x: "",
      linkedin: "",
    },
  },
  {
    id: 3,
    img: "/images/teacher-img3.png",
    links: {
      facebook: "",
      x: "",
      linkedin: "",
    },
  },
  {
    id: 4,
    img: "/images/teacher-img4.png",
    links: {
      facebook: "",
      x: "",
      linkedin: "",
    },
  },
];

export const POPULAR_COURSE = [
  {
    title: "Development",
    desc: "It statistics data science and Business analysis",
  },
  {
    title: "Design",
    desc: "Web Development Fully Complete Guideline",
  },
  {
    title: "Marketing",
    desc: "Bilginer Adobe Illustrator for Graphic Design",
  },
];

export const CAREER_CONTENT = [
  {
    title: "Start from today",
    description: "Join our training courses &Build your skill.",
    image: "/images/career-img1.svg",
  },
  {
    title: "Start from today",
    description: "Join our training courses &Build your skill.",
    image: "/images/career-img2.svg",
  },
];

export const CHAT_OPTIONS = [
  {
    title: "Create a New Room",
    description:
      "Create a private chat room and add your team to complete your project.",
    icon: faChalkboardTeacher,
  },
  {
    title: "Join a Room",
    description: "Join a room using the promo code.",
    icon: faUsers,
  },
  {
    title: "View Available Rooms",
    description: "View all available rooms and request to join.",
    icon: faEye,
  },
];

export const FAVOURITE_SUBJECT = [
  {
    bgColor: "#FFC263",
    image: "/images/ar.png",
    name: "arabic",
  },
  {
    bgColor: "#00AFEF",
    image: "/images/eng.png",
    name: "english",
  },
  {
    bgColor: "#0AB99D ",
    image: "/images/math.png",
    name: "math",
  },
  {
    bgColor: "#FFC787 ",
    image: "/images/gro.png",
    name: "social studies",
  },
];

export const STUDENTS_RATING = [
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
  {
    image: "/images/man.png",
    name: "ahmed",
    desc: "very good student helps me alot learning him new thinigs he is actually genius because he studied any thing i say to him to study",
  },
];
export const TEACHING_SUBJECT = [
  {
    bgColor: "#0AB99D",
    image: "/images/math.png",
    name: "math",
  },
  {
    bgColor: "#FFC263",
    image: "/images/ar.png",
    name: "arabic",
  },
  {
    bgColor: "#FFC787",
    image: "/images/gro.png",
    name: "social studies",
  },
];

export const COURSE_LESSON = [
  {
    lesson: "lesson 1",
    LessonName: "HTML",
    CourseDuration: "4 Weeks",
    Description:
      "HTML (HyperText Markup Language) is the primary language used to build web pages, defining the structure of the page and organizing its content such as text, images, and links.",
  },
  {
    lesson: "lesson 2",
    LessonName: "css",
    CourseDuration: "2 Weeks",
    Description:
      "HTML (HyperText Markup Language) is the primary language used to build web pages, defining the structure of the page and organizing its content such as text, images, and links.",
  },
  {
    lesson: "lesson 3",
    LessonName: "react",
    CourseDuration: "5 Weeks",
    Description:
      "HTML (HyperText Markup Language) is the primary language used to build web pages, defining the structure of the page and organizing its content such as text, images, and links.",
  },
  {
    lesson: "lesson 4",
    LessonName: "Java",
    CourseDuration: "6 Weeks",
    Description:
      "HTML (HyperText Markup Language) is the primary language used to build web pages, defining the structure of the page and organizing its content such as text, images, and links.",
  },
];
export const SERVICES_LIST = [
  {
    icon: faChalkboardTeacher,
    title: "Best Coaching",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
  {
    icon: faTrophy,
    title: "Convenient Practice",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
  {
    icon: faBoltLightning,
    title: "energitic lessons",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
  {
    icon: faBrain,
    title: "Creative minds",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
  {
    icon: faVideo,
    title: "Video tutorials",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
  {
    icon: faMedal,
    title: "worlds record",
    descrp:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt ut labore et",
  },
];
export const POPULAR_TAG = [
  "Balance",
  "coaching",
  "Motivation",
  "courses",
  "Life guide",
  "strategy",
  "Education",
  "coach",
];
export const CATEGORY = [
  "students",
  "education",
  "schools",
  "teachers and students",
  "graduation",
  "exams and solvings",
];

export const COURSE_INPUTS: IFormInput[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "title",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "description",
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "price",
  },
  {
    label: "Level",
    name: "level",
    type: "select",
  },
  {
    label: "Category",
    name: "category_id",
    type: "select",
  },
  {
    label: "Sub category",
    name: "sub_category_id",
    type: "select",
  },
];
export const LESSON_INPUTS: IFormInput[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "title",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "description",
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "price",
  },
];

export const COURSE_CONTENT_INPUTS: IFormInput[] = [
  {
    name: "courseId",
    label: "Course",
    type: "select",
  },
  {
    name: "title",
    label: "Conent Title",
    placeholder: "content title",
    type: "text",
  },
  {
    name: "description",
    label: "Conent Description",
    placeholder: "content description",
    type: "text",
  },
];
export const LESSON_CONTENT_INPUTS: IFormInput[] = [
  {
    name: "lessonId",
    label: "Lesson",
    type: "select",
  },
  {
    name: "title",
    label: "Conent Title",
    placeholder: "content title",
    type: "text",
  },
  {
    name: "description",
    label: "Conent Description",
    placeholder: "content description",
    type: "text",
  },
];

export const COURSE_LECTURE_INPUTS: IFormInput[] = [
  {
    name: "courseId",
    label: "Course",
    type: "select",
  },
  {
    name: "contentId",
    label: "Content",
    type: "select",
  },
  {
    name: "title",
    label: "Lecture Title",
    placeholder: "lecture title",
    type: "text",
  },
  {
    name: "description",
    label: "Lecture Description",
    placeholder: "lecture description",
    type: "text",
  },
];
export const LESSON_LECTURE_INPUTS: IFormInput[] = [
  {
    name: "lessonId",
    label: "Lesson",
    type: "select",
  },
  {
    name: "contentId",
    label: "Content",
    type: "select",
  },
  {
    name: "title",
    label: "Lecture Title",
    placeholder: "lecture title",
    type: "text",
  },
  {
    name: "description",
    label: "Lecture Description",
    placeholder: "lecture description",
    type: "text",
  },
];

export const VIDEO_INPUTS: IFormInput[] = [
  {
    name: "courseId",
    label: "Course",
    type: "select",
  },
  {
    name: "contentId",
    label: "Content",
    type: "select",
  },
  {
    name: "lectureId",
    label: "Lecture",
    type: "select",
  },
];
export const LESSON_VIDEO_INPUTS: IFormInput[] = [
  {
    name: "lessonId",
    label: "Lesson",
    type: "select",
  },
  {
    name: "contentId",
    label: "Content",
    type: "select",
  },
  {
    name: "lectureId",
    label: "Lecture",
    type: "select",
  },
];

export const COURSE_LEVELS = [
  {
    label: "beginner",
    value: "beginner",
  },

  {
    label: "intermediate",
    value: "intermediate",
  },
  {
    label: "advanced",
    value: "advanced",
  },
  {
    label: "expert",
    value: "expert",
  },
];
