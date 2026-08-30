import Footer from "@/components/Footer";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ScrollRestoration />
      <main>
        <Outlet />
        <Footer />
      </main>
    </>
  );
};

export default AuthLayout;
