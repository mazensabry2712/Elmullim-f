import router from "@/routes";
import { store } from "@/store/store";
import { lazy } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { I18nProvider } from "@/i18n";
import MaintenanceGate from "@/components/system/MaintenanceGate";
const QueryProvider = lazy(() => import("./QueryProvider"));

const Providers = () => {
  return (
    <I18nProvider>
      <QueryProvider>
        <Provider store={store}>
          <MaintenanceGate>
            <RouterProvider router={router} />
          </MaintenanceGate>
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
    </I18nProvider>
  );
};

export default Providers;
