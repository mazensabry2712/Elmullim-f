import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axiosAPI from "@/config/axios.config";
import cookieService from "@/utils/cookieService";
import type { RootState } from "@/store/store";

const AUTH_PATHS = new Set([
  "/login",
  "/sign-in",
  "/parent/sign-in",
  "/teacher/sign-in",
  "/forgot-password",
  "/parent/forgot-password",
  "/teacher/forgot-password",
  "/reset-password",
  "/parent/reset-password",
  "/teacher/reset-password",
]);

type MaintenanceResponse = {
  enabled?: boolean;
  message?: string;
};

type CheckAuthResponse = {
  auth?: boolean;
};

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState<MaintenanceResponse | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const statusResponse = await axiosAPI.get<{ data?: MaintenanceResponse }>("/main/maintenance");
        const status = statusResponse.data?.data ?? {};

        if (!active) return;

        if (!status.enabled) {
          setMaintenance(null);
          return;
        }

        if (AUTH_PATHS.has(location.pathname)) {
          setMaintenance(status);
          return;
        }

        const token = cookieService.getToken();

        if (!token) {
          setMaintenance(status);
          return;
        }

        try {
          const authResponse = await axiosAPI.post<{ data?: CheckAuthResponse }>("/check-auth");
          const authenticated = authResponse.data?.data?.auth === true;

          setMaintenance(authenticated ? null : status);
        } catch {
          setMaintenance(status);
        }
      } catch {
        // Do not take the whole platform offline if the status endpoint itself fails.
        if (active) setMaintenance(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    check();

    return () => {
      active = false;
    };
  }, [isAuthenticated, location.pathname]);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!maintenance) {
    return <>{children}</>;
  }

  const isArabic = localStorage.getItem("elmullim-language") === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"} style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon} aria-hidden="true">🛠️</div>
        <div style={styles.brand}>Elmullim</div>
        <h1 style={styles.title}>
          {isArabic ? "المنصة تحت الصيانة" : "Platform Under Maintenance"}
        </h1>
        <p style={styles.message}>
          {maintenance.message ||
            (isArabic
              ? "نقوم حاليًا بإجراء بعض التحديثات والتحسينات. سنعود قريبًا."
              : "We are currently performing updates and improvements. We will be back shortly.")}
        </p>

        {AUTH_PATHS.has(location.pathname) ? (
          <button style={styles.button} onClick={() => navigate("/login")}>
            {isArabic ? "العودة لتسجيل الدخول" : "Back to login"}
          </button>
        ) : (
          <button
            style={styles.button}
            onClick={() => navigate("/login")}
          >
            {isArabic ? "دخول المستخدمين المصرح لهم" : "Login for authorized users"}
          </button>
        )}

        <p style={styles.note}>
          {isArabic
            ? "أثناء الصيانة، الدخول متاح فقط للحسابات المصرح بها."
            : "During maintenance, access is limited to authorized accounts."}
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "var(--bs-body-bg, #f8f9fa)",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    textAlign: "center",
    padding: "48px 32px",
    borderRadius: "24px",
    background: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
  },
  icon: {
    fontSize: "52px",
    marginBottom: "16px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: ".02em",
    marginBottom: "20px",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "34px",
    fontWeight: 800,
  },
  message: {
    margin: "0 auto 28px",
    maxWidth: "520px",
    lineHeight: 1.8,
    color: "#667085",
  },
  button: {
    border: 0,
    borderRadius: "12px",
    padding: "12px 22px",
    fontWeight: 700,
    cursor: "pointer",
    background: "#111827",
    color: "#fff",
  },
  note: {
    margin: "18px 0 0",
    fontSize: "13px",
    color: "#98a2b3",
  },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
  },
  spinner: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#111827",
    animation: "spin 1s linear infinite",
  },
};

export default MaintenanceGate;
