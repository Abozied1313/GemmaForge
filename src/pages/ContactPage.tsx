import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Mail, Phone, MapPin,
  MessageCircle, ExternalLink, Headphones,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const ContactPage: React.FC = () => {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const contactItems = [
    {
      icon: Mail,
      label: lang === "ar" ? "البريد الإلكتروني" : "Email",
      value: "mohamedabozied596@gmail.com",
      href: "mailto:mohamedabozied596@gmail.com",
      color: "#6c3aff",
      desc: lang === "ar" ? "تواصل معنا عبر البريد الإلكتروني في أي وقت" : "Reach us via email anytime",
    },
    {
      icon: MessageCircle,
      label: lang === "ar" ? "واتساب" : "WhatsApp",
      value: "+20 106 978 7615",
      href: "https://wa.me/201069787615",
      color: "#25d366",
      desc: lang === "ar" ? "تحدث معنا مباشرةً على واتساب" : "Chat with us directly on WhatsApp",
    },
    {
      icon: MapPin,
      label: lang === "ar" ? "الموقع" : "Location",
      value: lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt",
      href: "https://maps.google.com/?q=Cairo,Egypt",
      color: "#f59e0b",
      desc: lang === "ar" ? "مقرنا الرئيسي في القاهرة" : "Our main headquarters in Cairo",
    },
  ];

  const faqs = lang === "ar"
    ? [
        { q: "كيف أبدأ استخدام المنصة؟", a: "أنشئ حساباً مجانياً من صفحة التسجيل، ثم أضف مشروعاً أول وابدأ في كتابة برومبتاتك." },
        { q: "ما النماذج المدعومة حالياً؟", a: "ندعم Gemma 4، Gemma 2-27B، Gemma 3-12B، Gemma 3-4B، وغيرها من عائلة Gemma." },
        { q: "هل المنصة مجانية؟", a: "نعم، المنصة مجانية بالكامل خلال مرحلة البيتا في Google Gemma Challenge." },
        { q: "كيف يعمل اختبار A/B؟", a: "اكتب برومبتك واختر نموذجين من Gemma، ثم اضغط تشغيل لترى النتيجتين جنباً إلى جنب مع مقارنة التوكنز والوقت." },
      ]
    : [
        { q: "How do I get started?", a: "Create a free account from the sign-up page, then add a first project and start writing your prompts." },
        { q: "What models are currently supported?", a: "We support Gemma 4, Gemma 2-27B, Gemma 3-12B, Gemma 3-4B, and other models from the Gemma family." },
        { q: "Is the platform free?", a: "Yes, the platform is completely free during the Beta phase of the Google Gemma Challenge." },
        { q: "How does A/B testing work?", a: "Write your prompt and select two Gemma models, then click Run to see both results side-by-side with token count and time comparison." },
      ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#080a0f" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-6 py-4 border-b"
        style={{ background: "rgba(8,10,15,0.95)", backdropFilter: "blur(20px)", borderColor: "#1e2535" }}
      >
        <div className={cn("max-w-4xl mx-auto flex items-center gap-4", isRTL && "flex-row-reverse")}>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors hover:text-white"
            style={{ color: "#8892a4", background: "#131720", border: "1px solid #1e2535" }}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)" }}
            >
              <Headphones className="w-4 h-4" style={{ color: "#22d3ee" }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                {lang === "ar" ? "التواصل والدعم" : "Contact & Support"}
              </h1>
              <p className="text-xs" style={{ color: "#8892a4" }}>
                {lang === "ar" ? "نحن هنا للمساعدة" : "We are here to help"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className={cn("mb-12", isRTL ? "text-right" : "")}>
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            {lang === "ar" ? "تواصل معنا" : "Get In Touch"}
          </h2>
          <p className="text-base" style={{ color: "#8892a4" }}>
            {lang === "ar"
              ? "فريقنا جاهز للرد على استفساراتك ومساعدتك في الحصول على أقصى استفادة من Gemma Forge"
              : "Our team is ready to answer your questions and help you get the most out of Gemma Forge"}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 group no-underline"
              style={{ background: "#0e1117", border: "1px solid #1e2535", textDecoration: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border = `1px solid ${item.color}50`;
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 24px ${item.color}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border = "1px solid #1e2535";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}35` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }} />
              </div>

              <div className={isRTL ? "text-right" : ""}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#8892a4" }}>
                  {item.label}
                </p>
                <p className="text-base font-semibold text-white mb-1.5 break-all" style={{ direction: "ltr", textAlign: isRTL ? "right" : "left" }}>
                  {item.value}
                </p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{item.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Quick Contact CTA */}
        <div
          className="rounded-2xl p-6 mb-12"
          style={{
            background: "linear-gradient(135deg, rgba(108,58,255,0.1) 0%, rgba(34,211,238,0.06) 100%)",
            border: "1px solid rgba(108,58,255,0.25)",
          }}
        >
          <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
            <div className={isRTL ? "text-right" : ""}>
              <h3 className="text-base font-semibold text-white mb-1">
                {lang === "ar" ? "هل تحتاج مساعدة فورية؟" : "Need immediate help?"}
              </h3>
              <p className="text-sm" style={{ color: "#8892a4" }}>
                {lang === "ar" ? "تواصل معنا مباشرةً عبر واتساب للرد الفوري" : "Contact us directly via WhatsApp for instant response"}
              </p>
            </div>
            <a
              href="https://wa.me/201069787615"
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 no-underline", isRTL && "flex-row-reverse")}
              style={{
                background: "#25d366",
                color: "#fff",
                boxShadow: "0 0 16px rgba(37,211,102,0.3)",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {lang === "ar" ? "فتح واتساب" : "Open WhatsApp"}
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className={cn("text-xl font-bold text-white mb-6", isRTL && "text-right")}>
            {lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ background: "#0e1117", border: "1px solid #1e2535" }}
              >
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" }}
                  >
                    Q
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-2">{faq.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#8892a4" }}>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div
          className="mt-10 text-center text-xs py-4"
          style={{ color: "#4a5568", borderTop: "1px solid #1e2535" }}
        >
          {lang === "ar"
            ? "Gemma Forge · مشروع تحدي Google Gemma 2025 · القاهرة، مصر"
            : "Gemma Forge · Google Gemma Challenge 2025 · Cairo, Egypt"}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
