import router from "@/routes";
import { store } from "@/store/store";
import { lazy } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
const QueryProvider = lazy(() => import("./QueryProvider"));

const Providers = () => {
  return (
    <QueryProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          closeOnClick={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </Provider>
    </QueryProvider>
  );
};

export default Providers;
