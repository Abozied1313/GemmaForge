import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Shield, FileText } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const TermsPage: React.FC = () => {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const sections = lang === "ar"
    ? [
        {
          title: "قبول الشروط",
          content: "باستخدامك لمنصة Gemma Forge، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.",
        },
        {
          title: "وصف الخدمة",
          content: "Gemma Forge هي منصة لإدارة محتوى الأوامر (Prompt CMS) مخصصة لاختبار نماذج Google Gemma. تتيح المنصة للمطورين إنشاء وتنظيم واختبار البرومبتات.",
        },
        {
          title: "استخدام الحساب",
          content: "أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب إخطارنا فوراً في حال الاشتباه بأي وصول غير مصرح به لحسابك.",
        },
        {
          title: "الملكية الفكرية",
          content: "تظل جميع البرومبتات والمشاريع التي تنشئها ملكاً لك. تحتفظ Gemma Forge بحقوق المنصة وتصميمها وأكوادها البرمجية.",
        },
        {
          title: "سياسة الاستخدام المقبول",
          content: "يُحظر استخدام المنصة لأغراض غير قانونية أو ضارة، أو لإنشاء محتوى مسيء أو مضلل. نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه السياسة.",
        },
        {
          title: "الخصوصية والبيانات",
          content: "نلتزم بحماية خصوصيتك وفقاً لسياسة الخصوصية الخاصة بنا. لا نشارك بياناتك الشخصية مع أطراف ثالثة دون موافقتك الصريحة.",
        },
        {
          title: "التعديلات",
          content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني المسجل.",
        },
        {
          title: "إخلاء المسؤولية",
          content: "تُقدَّم المنصة 'كما هي' دون ضمانات من أي نوع. لا نتحمل المسؤولية عن أي أضرار ناجمة عن استخدام المنصة أو عدم توافرها.",
        },
      ]
    : [
        {
          title: "Acceptance of Terms",
          content: "By using Gemma Forge, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use the platform.",
        },
        {
          title: "Description of Service",
          content: "Gemma Forge is a Prompt CMS platform dedicated to testing Google Gemma models. The platform allows developers to create, organize, and test prompts.",
        },
        {
          title: "Account Usage",
          content: "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any suspected unauthorized access to your account.",
        },
        {
          title: "Intellectual Property",
          content: "All prompts and projects you create remain your property. Gemma Forge retains rights to the platform, its design, and source code.",
        },
        {
          title: "Acceptable Use Policy",
          content: "The platform may not be used for illegal or harmful purposes, or to create offensive or misleading content. We reserve the right to suspend or terminate accounts that violate this policy.",
        },
        {
          title: "Privacy and Data",
          content: "We are committed to protecting your privacy in accordance with our Privacy Policy. We do not share your personal data with third parties without your explicit consent.",
        },
        {
          title: "Modifications",
          content: "We reserve the right to modify these terms at any time. You will be notified of any material changes via your registered email.",
        },
        {
          title: "Disclaimer",
          content: 'The platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of or inability to use the platform.',
        },
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
              style={{ background: "rgba(108,58,255,0.15)", border: "1px solid rgba(108,58,255,0.3)" }}
            >
              <FileText className="w-4 h-4" style={{ color: "#a99bff" }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                {lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </h1>
              <p className="text-xs" style={{ color: "#8892a4" }}>
                {lang === "ar" ? "آخر تحديث: يناير 2025" : "Last updated: January 2025"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro Banner */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: "rgba(108,58,255,0.08)", border: "1px solid rgba(108,58,255,0.2)" }}
        >
          <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
            <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#a99bff" }} />
            <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
              {lang === "ar"
                ? "يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة Gemma Forge. تحكم هذه الشروط استخدامك للمنصة وتُشكّل اتفاقية ملزمة بينك وبيننا."
                : "Please read these Terms and Conditions carefully before using Gemma Forge. These terms govern your use of the platform and constitute a binding agreement between you and us."}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{ background: "#0e1117", border: "1px solid #1e2535" }}
            >
              <div className={cn("flex items-start gap-3 mb-3", isRTL && "flex-row-reverse")}>
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(108,58,255,0.2)", color: "#a99bff", border: "1px solid rgba(108,58,255,0.3)" }}
                >
                  {i + 1}
                </span>
                <h2 className="text-base font-semibold text-white">{section.title}</h2>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#94a3b8", paddingRight: isRTL ? "2.25rem" : "0", paddingLeft: isRTL ? "0" : "2.25rem" }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Note */}
        <div
          className="mt-8 rounded-xl p-5 text-sm text-center"
          style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}
        >
          {lang === "ar"
            ? "للاستفسار عن هذه الشروط، تواصل معنا عبر صفحة "
            : "For questions about these terms, contact us via "}
          <button
            onClick={() => navigate("/contact")}
            className="font-medium hover:underline"
            style={{ color: "#6c3aff", background: "none", border: "none", cursor: "pointer" }}
          >
            {lang === "ar" ? "التواصل والدعم" : "Contact & Support"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
