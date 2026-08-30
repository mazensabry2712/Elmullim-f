import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SuspenseLoader from "./components/SuspenseLoader/SuspenseLoader";

const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<SuspenseLoader />}>
    <App />
  </Suspense>
);
