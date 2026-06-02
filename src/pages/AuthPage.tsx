import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Globe, ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/* ── Gemma SVG Logo ── */
const GemmaLogoMark: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="auth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8468ff" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="url(#auth-grad)" opacity="0.15" />
    <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="none" stroke="url(#auth-grad)" strokeWidth="1.5" />
    <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="url(#auth-grad)" opacity="0.3" />
    <circle cx="16" cy="16" r="3.5" fill="url(#auth-grad)" />
  </svg>
);

const AuthPage: React.FC = () => {
  const { t, lang, setLang, isRTL } = useLang();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /** Shown after successful sign-up when email confirmation is required */
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "signin") setMode(m);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signin") {
      const err = await signIn(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      }
      // On success: useEffect above will detect user and navigate to /dashboard
      // Don't call setLoading(false) on success — let navigation happen naturally
    } else {
      // Sign up
      if (password.length < 6) {
        setError(
          isRTL
            ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
            : "Password must be at least 6 characters"
        );
        setLoading(false);
        return;
      }

      const err = await signUp(email, password, name);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }

      setLoading(false);

      // If user is now set → email confirmation was disabled, redirect immediately
      // If user is not set → confirmation email was sent, show confirmation screen
      // The user state update is handled by onAuthStateChange, give it a tick
      setTimeout(() => {
        // Check if AuthContext set the user (email confirm disabled)
        // If not, show the confirmation sent screen
        setConfirmationSent(true);
      }, 300);
    }
  };

  /* ── Confirmation Screen ── */
  if (confirmationSent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "#080a0f" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className="w-full max-w-md text-center rounded-2xl p-10"
          style={{
            background: "#0e1117",
            border: "1px solid #1e2535",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)" }}
          >
            <Mail className="w-8 h-8" style={{ color: "#22d3ee" }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRTL ? "تحقق من بريدك الإلكتروني" : "Check your email"}
          </h2>
          <p className="text-sm mb-2" style={{ color: "#8892a4" }}>
            {isRTL
              ? `أرسلنا رابط تأكيد إلى:`
              : `We sent a confirmation link to:`}
          </p>
          <p className="font-mono text-sm mb-6 text-white">{email}</p>
          <p className="text-sm mb-8" style={{ color: "#8892a4" }}>
            {isRTL
              ? "انقر على الرابط في البريد لتفعيل حسابك والدخول."
              : "Click the link in the email to activate your account and sign in."}
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false);
              setMode("signin");
              setPassword("");
            }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#6c3aff,#22d3ee)",
              boxShadow: "0 0 20px rgba(108,58,255,0.35)",
            }}
          >
            {isRTL ? "الانتقال لتسجيل الدخول" : "Go to Sign In"}
          </button>
          <p className="text-xs mt-4" style={{ color: "#4a5568" }}>
            {isRTL
              ? "لم تستلم البريد؟ تحقق من مجلد البريد المزعج"
              : "Didn't receive it? Check your spam folder"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#080a0f" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(ellipse at center, rgba(108,58,255,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: "30%",
          right: "15%",
          background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Back to home */}
      <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
        <button
          onClick={() => navigate("/")}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:text-white", isRTL && "flex-row-reverse")}
          style={{ color: "#8892a4", background: "#131720", border: "1px solid #1e2535" }}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isRTL ? "الرئيسية" : "Home"}
        </button>
      </div>

      {/* Lang Toggle */}
      <div className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold">{lang === "ar" ? "EN" : "عربي"}</span>
        </button>
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          background: "#0e1117",
          border: "1px solid #1e2535",
          borderRadius: "1.5rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(108,58,255,0.06)",
        }}
      >
        {/* Card Header */}
        <div className="px-8 py-8 border-b" style={{ borderColor: "#1e2535" }}>
          <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
            <GemmaLogoMark size={36} />
            <div className={isRTL ? "text-right" : ""}>
              <p className="text-lg font-bold leading-none text-white" style={{ fontFamily: "Inter, sans-serif" }}>
                Gemma{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg,#8468ff,#22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 800,
                  }}
                >
                  Forge
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#4a5568" }}>Prompt Engineering CMS</p>
            </div>
          </div>

          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-xl font-bold text-white mb-1">
              {mode === "signin" ? t("welcomeBack") : t("createAccount")}
            </h2>
            <p className="text-sm" style={{ color: "#8892a4" }}>
              {mode === "signin" ? t("loginSubtitle") : t("signupSubtitle")}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-8 py-7">
          {/* Mode Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "#131720", border: "1px solid #1e2535" }}
          >
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: mode === m ? "#6c3aff" : "transparent",
                  color: mode === m ? "#fff" : "#8892a4",
                  boxShadow: mode === m ? "0 0 12px rgba(108,58,255,0.4)" : "none",
                }}
              >
                {m === "signin" ? t("signIn") : t("signUp")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {mode === "signup" && (
              <div>
                <label className={cn("block text-sm font-medium text-white mb-1.5", isRTL && "text-right")}>
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  required
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all",
                    "focus:ring-1 focus:ring-purple-500/50",
                    isRTL && "text-right"
                  )}
                  style={{ background: "#131720", border: "1px solid #1e2535" }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className={cn("block text-sm font-medium text-white mb-1.5", isRTL && "text-right")}>
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "#131720", border: "1px solid #1e2535", direction: "ltr" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className={cn("block text-sm font-medium text-white mb-1.5", isRTL && "text-right")}>
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={{
                    background: "#131720",
                    border: "1px solid #1e2535",
                    paddingLeft: isRTL ? "1rem" : "3rem",
                    paddingRight: isRTL ? "3rem" : "1rem",
                    direction: "ltr",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute top-1/2 -translate-y-1/2 transition-colors"
                  style={{ [isRTL ? "right" : "left"]: "0", padding: "0 12px", color: "#8892a4" }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? "#4a2fa0" : "linear-gradient(135deg,#6c3aff,#22d3ee)",
                boxShadow: loading ? "none" : "0 0 20px rgba(108,58,255,0.35)",
              }}
            >
              {loading
                ? (mode === "signin"
                    ? (isRTL ? "جارٍ تسجيل الدخول..." : "Signing in...")
                    : (isRTL ? "جارٍ إنشاء الحساب..." : "Creating account..."))
                : (mode === "signin" ? t("signIn") : t("signUp"))
              }
            </button>
          </form>

          {/* Switch Mode */}
          <p className={cn("mt-5 text-sm text-center")} style={{ color: "#8892a4" }}>
            {mode === "signin" ? t("noAccount") : t("hasAccount")}{" "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              className="font-medium hover:underline transition-colors"
              style={{ color: "#6c3aff", background: "none", border: "none", cursor: "pointer" }}
            >
              {mode === "signin" ? t("signUp") : t("signIn")}
            </button>
          </p>
        </div>

        {/* Card Footer */}
        <div
          className={cn("px-8 py-4 border-t flex items-center justify-center gap-4 text-xs", isRTL && "flex-row-reverse")}
          style={{ borderColor: "#1e2535", color: "#4a5568" }}
        >
          <Link to="/terms" className="hover:text-white transition-colors" style={{ color: "inherit" }}>
            {lang === "ar" ? "الشروط والأحكام" : "Terms"}
          </Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-white transition-colors" style={{ color: "inherit" }}>
            {lang === "ar" ? "الدعم" : "Support"}
          </Link>
          <span>·</span>
          <span>Gemma Forge © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
