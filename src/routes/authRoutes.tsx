import { lazy } from "react";
import { createRoutesFromElements, Route } from "react-router-dom";
// Auth
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));
const AuthLayout = lazy(() => import("@/layout/AuthLayout"));
const ChooseLoginAs = lazy(() => import("@/pages/auth/ChooseLoginAs"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyAccount"));

// Student auth
const StudentSignIn = lazy(() => import("@/pages/auth/student/SignIn"));
const StudentSignUp = lazy(() => import("@/pages/auth/student/SignUp"));
const StudentForgotPassword = lazy(
  () => import("@/pages/auth/student/StudentForgotPassword")
);
const StudentResetPassword = lazy(
  () => import("@/pages/auth/student/StudentRestPassword")
);

// Parent auth
const ParentSignIn = lazy(() => import("@/pages/auth/parent/SignIn"));
const ParentSignUp = lazy(() => import("@/pages/auth/parent/SignUp"));
const ParentForgotPassword = lazy(
  () => import("@/pages/auth/parent/ParentForgotPassword")
);
const ParentResetPassword = lazy(
  () => import("@/pages/auth/parent/ParentRestPassword")
);
// Teacher auth
const TeacherSignIn = lazy(() => import("@/pages/auth/teacher/SignIn"));
const TeacherSignUp = lazy(() => import("@/pages/auth/teacher/SignUp"));
// ForgotPassword
const TeacherForgotPassword = lazy(
  () => import("@/pages/auth/teacher/TeacherForgotPassword")
);
const TeacherResetPassword = lazy(
  () => import("@/pages/auth/teacher/TeacherRestPassword")
);

const authRoutes = createRoutesFromElements(
  <>
    <Route
      path="/verify-account"
      element={
        <ProtectedRoute>
          <VerifyEmail />
        </ProtectedRoute>
      }
      id="verify-account"
    />

    <Route
      element={<AuthLayout />}
      // errorElement={<Error/>}
      id="auth-layout"
    >
      <Route path="/login" element={<ChooseLoginAs />} id="login" />

      {/* Student Auth */}
      <Route
        path="/forgot-password"
        element={<StudentForgotPassword />}
        id="forgot-password"
      />
      <Route
        path="/reset-password"
        element={<StudentResetPassword />}
        id="reset-password"
      />
      <Route path="/sign-up" element={<StudentSignUp />} id="sign-up" />
      <Route path="/sign-in" element={<StudentSignIn />} id="sign-in" />

      {/* Parent Auth */}
      <Route
        path="/parent/forgot-password"
        element={<ParentForgotPassword />}
        id="parent-forgot-password"
      />
      <Route
        path="/parent/reset-password"
        element={<ParentResetPassword />}
        id="parent-reset-password"
      />
      <Route
        path="/parent/sign-up"
        element={<ParentSignUp />}
        id="parent-sign-up"
      />
      <Route
        path="/parent/sign-in"
        element={<ParentSignIn />}
        id="parent-sign-in"
      />

      {/* Teacher Auth */}
      <Route
        path="/teacher/forgot-password"
        element={<TeacherForgotPassword />}
        id="teacher-forgot-password"
      />
      <Route
        path="/teacher/reset-password"
        element={<TeacherResetPassword />}
        id="teacher-reset-password"
      />
      <Route
        path="/teacher/sign-up"
        element={<TeacherSignUp />}
        id="teacher-sign-up"
      />
      <Route
        path="/teacher/sign-in"
        element={<TeacherSignIn />}
        id="teacher-sign-in"
      />
    </Route>
  </>
);

export default authRoutes;
