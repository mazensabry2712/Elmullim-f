import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useSelector } from "react-redux";
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
  allowed?: boolean;
  message?: string;
};

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState<MaintenanceResponse | null>(null);

  const currentPath = window.location.pathname;

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const token = cookieService.getToken();

        const statusResponse = await axiosAPI.get<{ data?: MaintenanceResponse }>(
          "/main/maintenance",
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined
        );
        const status = statusResponse.data?.data ?? {};

        if (!active) return;

        if (!status.enabled || status.allowed) {
          setMaintenance(null);
          return;
        }

        setMaintenance(status);
      } catch {
        if (active) {
          setMaintenance(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    check();

    return () => {
      active = false;
    };
  }, [isAuthenticated, currentPath]);

  if (loading) {
    return (
      <div style={styles.center} aria-label="Loading">
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!maintenance || AUTH_PATHS.has(currentPath)) {
    return <>{children}</>;
  }

  const isArabic = localStorage.getItem("elmullim-language") === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"} style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />
      <div style={styles.glowOne} aria-hidden="true" />
      <div style={styles.glowTwo} aria-hidden="true" />

      <main style={styles.shell}>
        <div style={styles.topBar}>
          <div style={styles.brandGroup}>
            <div style={styles.logoMark} aria-hidden="true">
              <span style={styles.logoBook}>E</span>
            </div>
            <span style={styles.brand}>Elmullim</span>
          </div>

          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            {isArabic ? "تحديثات جارية" : "Updates in progress"}
          </div>
        </div>

        <section style={styles.card} aria-labelledby="maintenance-title">
          <div style={styles.iconWrap} aria-hidden="true">
            <div style={styles.iconRing}>
              <span style={styles.icon}>⚙</span>
            </div>
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
                {isArabic ? "دخول الحسابات المصرح لها" : "Authorized access"}
              </strong>
              <span style={styles.note}>
                {isArabic
                  ? "الحسابات الموجودة في قائمة السماح يمكنها متابعة استخدام المنصة أثناء الصيانة."
                  : "Accounts on the allowlist can continue using the platform during maintenance."}
              </span>
            </div>
          </div>

          <button
            type="button"
            style={styles.button}
            onClick={() => window.location.assign("/login")}
          >
            <span>{isArabic ? "تسجيل الدخول" : "Login"}</span>
            <span style={styles.buttonArrow} aria-hidden="true">
              {isArabic ? "←" : "→"}
            </span>
          </button>

          <p style={styles.footerNote}>
            {isArabic
              ? "الوصول الكامل يعود تلقائيًا بمجرد انتهاء الصيانة."
              : "Full access will return automatically when maintenance is complete."}
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
    color: "#101828",
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
    background: "rgba(59,130,246,.14)",
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
    background: "rgba(99,102,241,.12)",
    filter: "blur(18px)",
    pointerEvents: "none",
  },
  shell: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "980px",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "20px",
  },
  brandGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(145deg, #111827, #334155)",
    boxShadow: "0 10px 24px rgba(15,23,42,.18)",
  },
  logoBook: {
    color: "#fff",
    fontWeight: 900,
    fontSize: "19px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-.02em",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px 13px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.78)",
    border: "1px solid rgba(16,24,40,.08)",
    boxShadow: "0 8px 22px rgba(15,23,42,.06)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#475467",
    backdropFilter: "blur(12px)",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#f59e0b",
    boxShadow: "0 0 0 5px rgba(245,158,11,.13)",
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
  iconWrap: {
    display: "grid",
    placeItems: "center",
    marginBottom: "26px",
  },
  iconRing: {
    width: "94px",
    height: "94px",
    borderRadius: "30px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(145deg, #111827, #1f3b73)",
    boxShadow:
      "0 20px 46px rgba(30,64,175,.22), inset 0 1px 0 rgba(255,255,255,.18)",
    transform: "rotate(-5deg)",
  },
  icon: {
    display: "block",
    fontSize: "41px",
    color: "#fff",
    transform: "rotate(5deg)",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: ".18em",
    color: "#64748b",
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
    background: "linear-gradient(90deg, #111827, #4f46e5)",
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
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    minWidth: "210px",
    border: 0,
    borderRadius: "15px",
    padding: "14px 20px",
    fontWeight: 800,
    fontSize: "14px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #111827, #283b67)",
    color: "#fff",
    boxShadow: "0 14px 30px rgba(15,23,42,.18)",
  },
  buttonArrow: {
    fontSize: "18px",
    lineHeight: 1,
  },
  footerNote: {
    margin: "19px 0 0",
    fontSize: "12px",
    color: "#98a2b3",
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
