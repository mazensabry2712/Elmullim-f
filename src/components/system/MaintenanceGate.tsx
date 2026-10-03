import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useSelector } from "react-redux";
import axiosAPI from "@/config/axios.config";
import type { RootState } from "@/store/store";
import { useI18n } from "@/i18n";

type MaintenanceResponse = {
  enabled?: boolean;
  message?: string;
};

const MAINTENANCE_EVENT = "elmullim:maintenance";
const CHECK_INTERVAL_MS = 30_000;
const CHECK_TIMEOUT_MS = 5_000;

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState<MaintenanceResponse | null>(null);

  const check = useCallback(async () => {
    try {
      const statusResponse = await axiosAPI.get<{ data?: MaintenanceResponse }>(
        "/main/maintenance",
        {
          timeout: CHECK_TIMEOUT_MS,
        }
      );

      const status = statusResponse.data?.data ?? {};

      setMaintenance(status.enabled ? status : null);
    } catch {
      // Keep the last known state on transient failures. The backend remains
      // the real enforcement boundary for all protected API operations.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const runCheck = async () => {
      if (!active) return;
      await check();
    };

    const handleMaintenanceEvent = (event: Event) => {
      const customEvent = event as CustomEvent<MaintenanceResponse>;
      if (customEvent.detail?.enabled) {
        setMaintenance(customEvent.detail);
      } else {
        setMaintenance(null);
      }
    };

    window.addEventListener(MAINTENANCE_EVENT, handleMaintenanceEvent);
    void runCheck();

    const intervalId = window.setInterval(() => {
      void runCheck();
    }, CHECK_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void runCheck();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener(MAINTENANCE_EVENT, handleMaintenanceEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [check, isAuthenticated, language]);

  if (loading) {
    return (
      <div style={styles.center} aria-label="Loading">
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!maintenance) {
    return <>{children}</>;
  }

  const isArabic = language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"} style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />
      <div style={styles.glowOne} aria-hidden="true" />
      <div style={styles.glowTwo} aria-hidden="true" />

      <main style={styles.shell}>
        <section style={styles.card} aria-labelledby="maintenance-title">
          <div style={styles.heroBrand} aria-hidden="true">
            <div style={styles.heroBrandGlow} />
            <img src="/images/logo.webp" alt="" style={styles.heroLogo} />
          </div>

          <div style={styles.eyebrow}>
            {isArabic ? "نعود قريبًا" : "BACK ONLINE SOON"}
          </div>

          <h1 id="maintenance-title" style={styles.title}>
            {isArabic ? "المنصة تحت الصيانة" : "Platform Under Maintenance"}
          </h1>

          <p style={styles.message}>
            {maintenance.message ||
              (isArabic
                ? "نعمل حاليًا على تحديثات وتحسينات مهمة لتجربة أفضل. سنعود للعمل قريبًا."
                : "We’re making important updates and improvements for a better experience. We’ll be back shortly.")}
          </p>

          <div style={styles.progress} aria-hidden="true">
            <span style={styles.progressLine} />
            <span style={styles.progressPulse} />
          </div>

          <div style={styles.accessBox}>
            <div style={styles.accessIcon} aria-hidden="true">
              🔐
            </div>
            <div style={styles.accessText}>
              <strong style={styles.accessTitle}>
                {isArabic ? "الإدارة متاحة أثناء الصيانة" : "Admin access remains available"}
              </strong>
              <span style={styles.note}>
                {isArabic
                  ? "يمكن للـSuper Admin الدخول إلى لوحة الإدارة لإيقاف وضع الصيانة."
                  : "Super Admin can access the Admin Panel and disable maintenance mode."}
              </span>
            </div>
          </div>

          <p style={styles.footerNote}>
            {isArabic
              ? "سيعود الوصول الكامل تلقائيًا بمجرد إيقاف وضع الصيانة."
              : "Full access returns automatically once maintenance mode is disabled."}
          </p>

          <p style={styles.developedBy}>
            {isArabic
              ? "تم تطوير منصة Elmullim بواسطة "
              : "Elmullim platform developed by "}
            <strong>The Xro System</strong>
          </p>
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
    padding: "clamp(18px, 4vw, 36px)",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, #eef4ff 0%, #f7f9fc 42%, #eef1f6 100%)",
    color: "#21374B",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  grid: {
    position: "absolute",
    inset: 0,
    opacity: 0.35,
    backgroundImage:
      "linear-gradient(rgba(16,24,40,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,24,40,.045) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
    maskImage: "linear-gradient(to bottom, black, transparent 82%)",
    pointerEvents: "none",
  },
  glowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    top: "-190px",
    left: "-130px",
    background: "rgba(10,185,157,.13)",
    filter: "blur(18px)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    bottom: "-160px",
    right: "-100px",
    background: "rgba(33,55,75,.10)",
    filter: "blur(18px)",
    pointerEvents: "none",
  },
  shell: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "980px",
  },
  card: {
    width: "100%",
    boxSizing: "border-box",
    padding: "clamp(34px, 5vw, 58px) clamp(20px, 5vw, 78px) 42px",
    borderRadius: "32px",
    background: "rgba(255,255,255,.9)",
    border: "1px solid rgba(255,255,255,.92)",
    boxShadow: "0 28px 90px rgba(15,23,42,.12)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
  },
  heroBrand: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "min(340px, 82vw)",
    minHeight: "104px",
    margin: "0 auto 30px",
    padding: "20px 28px",
    borderRadius: "28px",
    background: "rgba(255,255,255,.72)",
    border: "1px solid rgba(10,185,157,.16)",
    boxShadow: "0 20px 60px rgba(33,55,75,.10)",
    backdropFilter: "blur(15px)",
    overflow: "hidden",
  },
  heroBrandGlow: {
    position: "absolute",
    width: "190px",
    height: "190px",
    borderRadius: "50%",
    background: "rgba(10,185,157,.13)",
    filter: "blur(20px)",
  },
  heroLogo: {
    position: "relative",
    zIndex: 1,
    display: "block",
    width: "min(260px, 70vw)",
    height: "auto",
    objectFit: "contain",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: ".18em",
    color: "#0a9f89",
    marginBottom: "13px",
  },
  title: {
    margin: "0",
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1.05,
    letterSpacing: "-.045em",
    fontWeight: 900,
  },
  message: {
    margin: "20px auto 0",
    maxWidth: "720px",
    fontSize: "clamp(15px, 2vw, 18px)",
    lineHeight: 1.85,
    color: "#667085",
  },
  progress: {
    position: "relative",
    width: "min(340px, 72%)",
    height: "5px",
    margin: "30px auto",
    borderRadius: "999px",
    overflow: "hidden",
    background: "#e8edf5",
  },
  progressLine: {
    position: "absolute",
    inset: 0,
    width: "68%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #0ab99d, #21374B)",
  },
  progressPulse: {
    position: "absolute",
    top: 0,
    left: "22%",
    width: "70px",
    height: "100%",
    borderRadius: "999px",
    background: "rgba(255,255,255,.72)",
    filter: "blur(3px)",
  },
  accessBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    maxWidth: "690px",
    margin: "0 auto 24px",
    padding: "17px 18px",
    borderRadius: "18px",
    textAlign: "start",
    background: "#f7f9fc",
    border: "1px solid #e7ebf2",
  },
  accessIcon: {
    flex: "0 0 auto",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    background: "#fff",
    boxShadow: "0 7px 16px rgba(15,23,42,.06)",
    fontSize: "18px",
  },
  accessText: {
    display: "grid",
    gap: "5px",
  },
  accessTitle: {
    fontSize: "14px",
    fontWeight: 800,
  },
  note: {
    display: "block",
    fontSize: "12px",
    color: "#98a2b3",
    lineHeight: 1.7,
  },
  footerNote: {
    margin: "19px 0 0",
    fontSize: "12px",
    color: "#98a2b3",
  },
  developedBy: {
    margin: "10px 0 0",
    fontSize: "12px",
    color: "#667085",
    lineHeight: 1.6,
  },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f8fafc",
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
