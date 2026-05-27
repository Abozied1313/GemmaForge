import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Zap, Shield, ArrowLeft, ArrowRight, Globe, Sparkles,
  GitCompare, Database, ChevronRight, Star, Terminal, Cpu,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/* ── Gemma Logo SVG ─────────────────────────────────────────── */
const GemmaLogoMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8468ff" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="url(#lp-grad)" opacity="0.15" />
    <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="url(#lp-grad)" strokeWidth="1.5" />
    <polygon points="18,9 27,14 27,22 18,27 9,22 9,14" fill="url(#lp-grad)" opacity="0.3" />
    <circle cx="18" cy="18" r="4" fill="url(#lp-grad)" />
  </svg>
);

/* ── Nav ──────────────────────────────────────────────────────── */
const LandingNav: React.FC = () => {
  const { lang, setLang, isRTL } = useLang();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4",
        isRTL && "flex-row-reverse"
      )}
      style={{
        background: "rgba(8,10,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(30,37,53,0.8)",
      }}
    >
      {/* Logo */}
      <div
        className={cn("flex items-center gap-3 cursor-pointer", isRTL && "flex-row-reverse")}
        onClick={() => navigate("/")}
      >
        <GemmaLogoMark size={32} />
        <span
          className="text-lg font-bold"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <span className="text-white">Gemma </span>
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
        </span>
      </div>

      {/* Right Actions */}
      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold">{lang === "ar" ? "EN" : "عربي"}</span>
        </button>

        <button
          onClick={() => navigate("/auth?mode=signin")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-white"
          style={{ color: "#a99bff", background: "transparent", border: "1px solid rgba(108,58,255,0.3)" }}
        >
          {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
        </button>

        <button
          onClick={() => navigate("/auth?mode=signup")}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg,#6c3aff,#22d3ee)",
            color: "#fff",
            boxShadow: "0 0 16px rgba(108,58,255,0.35)",
          }}
        >
          {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
        </button>
      </div>
    </nav>
  );
};

/* ── Feature Card ─────────────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  accentColor: string;
  isRTL: boolean;
  lang: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon, titleAr, titleEn, descAr, descEn, accentColor, isRTL, lang,
}) => (
  <div
    className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 group"
    style={{
      background: "#0e1117",
      border: "1px solid #1e2535",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.border = `1px solid ${accentColor}50`;
      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${accentColor}12`;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.border = "1px solid #1e2535";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35` }}
    >
      <Icon className="w-5 h-5" style={{ color: accentColor }} />
    </div>
    <div className={isRTL ? "text-right" : ""}>
      <h3 className="text-base font-semibold text-white mb-2">
        {lang === "ar" ? titleAr : titleEn}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#8892a4" }}>
        {lang === "ar" ? descAr : descEn}
      </p>
    </div>
  </div>
);

/* ── Stat Chip ────────────────────────────────────────────────── */
const StatChip: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
  <div
    className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl"
    style={{ background: "#0e1117", border: "1px solid #1e2535" }}
  >
    <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
    <span className="text-xs" style={{ color: "#8892a4" }}>{label}</span>
  </div>
);

/* ── Main Landing Page ────────────────────────────────────────── */
const LandingPage: React.FC = () => {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const features = [
    {
      icon: Code2,
      titleAr: "محرر متطور مع المتغيرات الفورية",
      titleEn: "Advanced Editor with Live Variables",
      descAr: 'محرر برومبت احترافي مع استخراج تلقائي للمتغيرات الديناميكية بصيغة {{variables}} ومعاينة فورية قبل التشغيل.',
      descEn: "Professional prompt editor with automatic dynamic variable extraction using {{variables}} syntax and live preview before execution.",
      accentColor: "#6c3aff",
    },
    {
      icon: GitCompare,
      titleAr: "مختبر A/B للمقارنة المزدوجة",
      titleEn: "A/B Testing Dual Runner",
      descAr: "اختبر برومبتاتك على نموذجين من Gemma في آنٍ واحد جنباً إلى جنب مع مقارنة التوكنز وزمن التنفيذ.",
      descEn: "Test your prompts on two Gemma models simultaneously side-by-side with token count and execution time comparison.",
      accentColor: "#22d3ee",
    },
    {
      icon: Database,
      titleAr: "تكامل Supabase الآمن والمستمر",
      titleEn: "Secure Supabase Integration",
      descAr: "إدارة مشاريع ومكتبة برومبت حقيقية محفوظة في Supabase PostgreSQL مع مصادقة كاملة وحماية البيانات.",
      descEn: "Real project management and prompt library saved in Supabase PostgreSQL with full authentication and data protection.",
      accentColor: "#10b981",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080a0f" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <LandingNav />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 relative overflow-hidden">
        {/* Background glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-60%)",
            background: "radial-gradient(ellipse at center, rgba(108,58,255,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: "55%",
            left: "60%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(ellipse at center, rgba(34,211,238,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Main Title */}
        <h1
          className="font-extrabold leading-none mb-6 animate-fade-in"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          <span className="text-white">Gemma </span>
          <span
            style={{
              background: "linear-gradient(135deg, #8468ff 0%, #22d3ee 60%, #6c3aff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Forge
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl mx-auto text-lg leading-relaxed mb-10 animate-fade-in"
          style={{ color: "#94a3b8", lineHeight: 1.75 }}
        >
          {lang === "ar"
            ? "منصة إدارة محتوى الأوامر (Prompt CMS) وبيئة الاختبار المتقدمة المخصصة حصرياً لعائلة نماذج Google Gemma."
            : "A specialized Prompt CMS and advanced testing environment built exclusively for the Google Gemma model family."}
        </p>

        {/* CTA Buttons */}
        <div className={cn("flex items-center gap-4 mb-16 animate-fade-in", isRTL && "flex-row-reverse")}>
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className={cn(
              "flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200",
              isRTL && "flex-row-reverse"
            )}
            style={{
              background: "linear-gradient(135deg,#6c3aff,#22d3ee)",
              color: "#fff",
              boxShadow: "0 0 28px rgba(108,58,255,0.4), 0 4px 16px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(108,58,255,0.6), 0 4px 20px rgba(0,0,0,0.5)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(108,58,255,0.4), 0 4px 16px rgba(0,0,0,0.4)"; }}
          >
            {lang === "ar" ? "ابدأ الآن مجاناً" : "Get Started Free"}
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate("/auth?mode=signin")}
            className="px-7 py-3.5 rounded-xl font-medium text-base transition-all duration-200 hover:text-white"
            style={{
              background: "transparent",
              color: "#8892a4",
              border: "1px solid #1e2535",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#374151"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e2535"; }}
          >
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </button>
        </div>

        {/* Stats Row */}
        <div className={cn("flex items-center gap-4 flex-wrap justify-center")}>
          <StatChip value="4+" label={lang === "ar" ? "نماذج Gemma" : "Gemma Models"} color="#6c3aff" />
          <StatChip value="A/B" label={lang === "ar" ? "اختبار مزدوج" : "Dual Testing"} color="#22d3ee" />
          <StatChip value="RTL" label={lang === "ar" ? "دعم العربية" : "Arabic Support"} color="#10b981" />
          <StatChip value="∞" label={lang === "ar" ? "برومبتات" : "Prompts"} color="#f59e0b" />
        </div>
      </section>

      {/* ── Terminal Preview ─────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-20 max-w-5xl mx-auto w-full">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #1e2535",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(108,58,255,0.08)",
          }}
        >
          {/* Window chrome */}
          <div
            className={cn("flex items-center gap-2 px-4 py-3", isRTL && "flex-row-reverse")}
            style={{ background: "#0e1117", borderBottom: "1px solid #1e2535" }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
            <div className={cn("flex items-center gap-2 ml-3", isRTL && "mr-3 ml-0 flex-row-reverse")}>
              <Terminal className="w-3.5 h-3.5" style={{ color: "#8892a4" }} />
              <span className="text-xs font-mono" style={{ color: "#8892a4" }}>Gemma Forge — A/B Test Runner</span>
            </div>
          </div>
          {/* Mock terminal content */}
          <div
            className="p-6 font-mono text-sm leading-relaxed"
            style={{ background: "#080a0f" }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Panel A */}
              <div>
                <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(108,58,255,0.25)", color: "#a99bff", border: "1px solid rgba(108,58,255,0.4)" }}
                  >A</span>
                  <span className="text-xs" style={{ color: "#6c3aff" }}>gemma-2-27b</span>
                </div>
                <div className="space-y-1.5">
                  <p style={{ color: "#a99bff" }}>$ <span style={{ color: "#e2e8f0" }}>Running prompt...</span></p>
                  <p style={{ color: "#8892a4" }}>{"→ Tokens: 248 in / 412 out"}</p>
                  <p style={{ color: "#8892a4" }}>{"→ Time: 1,243ms"}</p>
                  <p className="mt-3" style={{ color: "#e2e8f0" }}>
                    {lang === "ar"
                      ? "التحليل يُشير إلى أن..."
                      : "Analysis indicates that the..."
                    }
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderLeft: "1px solid #1e2535", paddingLeft: "1rem" }}>
                <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(34,211,238,0.2)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.4)" }}
                  >B</span>
                  <span className="text-xs" style={{ color: "#22d3ee" }}>gemma-3-12b</span>
                </div>
                <div className="space-y-1.5">
                  <p style={{ color: "#22d3ee" }}>$ <span style={{ color: "#e2e8f0" }}>Running prompt...</span></p>
                  <p style={{ color: "#8892a4" }}>{"→ Tokens: 248 in / 387 out"}</p>
                  <p style={{ color: "#8892a4" }}>{"→ Time: 892ms"}</p>
                  <p className="mt-3" style={{ color: "#e2e8f0" }}>
                    {lang === "ar"
                      ? "النتائج تدل على وجود..."
                      : "Results indicate the presence of..."
                    }
                  </p>
                </div>
              </div>
            </div>

            <div
              className={cn("flex items-center gap-2 mt-4 pt-4 text-xs", isRTL && "flex-row-reverse")}
              style={{ borderTop: "1px solid #1e2535", color: "#8892a4" }}
            >
              <span style={{ color: "#10b981" }}>✓</span>
              <span>{lang === "ar" ? "اكتمل الاختبار المزدوج في 1.2 ثانية" : "Dual test completed in 1.2 seconds"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto w-full">
        <div className={cn("text-center mb-12", isRTL && "text-right md:text-center")}>
          <h2
            className="text-3xl font-extrabold text-white mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            {lang === "ar" ? "كل ما تحتاجه لهندسة البرومبت" : "Everything You Need for Prompt Engineering"}
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#8892a4" }}>
            {lang === "ar"
              ? "من الكتابة إلى الاختبار إلى الحفظ — دورة كاملة في منصة واحدة"
              : "From writing to testing to saving — a complete cycle in one platform"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <FeatureCard key={f.titleEn} {...f} isRTL={isRTL} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── Model Showcase ────────────────────────────────────────── */}
      <section
        className="mx-6 md:mx-10 mb-24 rounded-2xl px-8 py-10 max-w-6xl xl:mx-auto"
        style={{ background: "#0e1117", border: "1px solid #1e2535" }}
      >
        <div className={cn("flex flex-col md:flex-row items-center justify-between gap-8", isRTL && "md:flex-row-reverse")}>
          <div className={isRTL ? "text-right" : ""}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}
            >
              <Cpu className="w-3.5 h-3.5" />
              {lang === "ar" ? "نماذج مدعومة" : "Supported Models"}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {lang === "ar" ? "عائلة Google Gemma كاملة" : "Full Google Gemma Family"}
            </h3>
            <p className="text-sm" style={{ color: "#8892a4" }}>
              {lang === "ar"
                ? "من Gemma 2B الخفيف إلى Gemma 27B الضخم — اختر النموذج المناسب لمهمتك"
                : "From lightweight Gemma 2B to powerful Gemma 27B — choose the right model for your task"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { name: "Gemma 4", params: "4B", color: "#6c3aff", badge: "جديد" },
              { name: "Gemma 2-27B", params: "27B", color: "#22d3ee", badge: "قوي" },
              { name: "Gemma 3-12B", params: "12B", color: "#10b981", badge: "متوازن" },
              { name: "Gemma 2-9B", params: "9B", color: "#f59e0b", badge: "سريع" },
            ].map((m) => (
              <div
                key={m.name}
                className="px-4 py-3 rounded-xl flex flex-col gap-1"
                style={{ background: "#131720", border: `1px solid ${m.color}30` }}
              >
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.name}</span>
                <span className="text-[11px] font-mono" style={{ color: "#8892a4" }}>{m.params} params</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-28 max-w-4xl mx-auto w-full text-center">
        <div
          className="rounded-2xl px-8 py-14 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(108,58,255,0.18) 0%, rgba(34,211,238,0.1) 100%)",
            border: "1px solid rgba(108,58,255,0.3)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(108,58,255,0.1) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              {lang === "ar" ? "ابدأ رحلتك مع Gemma اليوم" : "Start Your Gemma Journey Today"}
            </h2>
            <p className="text-base mb-8" style={{ color: "#94a3b8" }}>
              {lang === "ar"
                ? "سجّل مجاناً وابدأ في بناء برومبتاتك الاحترافية على نماذج Gemma"
                : "Sign up for free and start building professional prompts on Gemma models"}
            </p>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className={cn("inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all", isRTL && "flex-row-reverse")}
              style={{
                background: "linear-gradient(135deg,#6c3aff,#22d3ee)",
                color: "#fff",
                boxShadow: "0 0 30px rgba(108,58,255,0.45)",
              }}
            >
              <Sparkles className="w-5 h-5" />
              {lang === "ar" ? "ابدأ الآن مجاناً" : "Get Started Free"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
};

/* ── Landing Footer ───────────────────────────────────────────── */
const LandingFooter: React.FC = () => {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  return (
    <footer
      className="border-t px-6 md:px-10 py-10"
      style={{ borderColor: "#1e2535", background: "#080a0f" }}
    >
      <div className={cn("max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6", isRTL && "md:flex-row-reverse")}>
        {/* Brand */}
        <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
          <GemmaLogoMark size={24} />
          <span className="text-sm font-bold text-white">Gemma Forge</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(108,58,255,0.15)", color: "#a99bff", border: "1px solid rgba(108,58,255,0.3)" }}>
            Beta
          </span>
        </div>

        {/* Links */}
        <div className={cn("flex items-center gap-6 text-sm", isRTL && "flex-row-reverse")}>
          <button onClick={() => navigate("/terms")} className="transition-colors hover:text-white" style={{ color: "#8892a4", background: "none", border: "none", cursor: "pointer" }}>
            {lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
          </button>
          <button onClick={() => navigate("/contact")} className="transition-colors hover:text-white" style={{ color: "#8892a4", background: "none", border: "none", cursor: "pointer" }}>
            {lang === "ar" ? "التواصل والدعم" : "Contact & Support"}
          </button>
          <button onClick={() => navigate("/auth")} className="transition-colors hover:text-white" style={{ color: "#8892a4", background: "none", border: "none", cursor: "pointer" }}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </button>
        </div>

        {/* Copy */}
        <p className="text-xs" style={{ color: "#4a5568" }}>
          © 2025 Gemma Forge · Google Gemma Challenge
        </p>
      </div>
    </footer>
  );
};

export default LandingPage;
