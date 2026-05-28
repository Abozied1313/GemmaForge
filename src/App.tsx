import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import PromptEditorPage from "@/pages/PromptEditorPage";
import TestRunnerPage from "@/pages/TestRunnerPage";
import SettingsPage from "@/pages/SettingsPage";
import TermsPage from "@/pages/TermsPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

/* ── Shared Loading Spinner ── */
const FullPageSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#080a0f" }}>
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(108,58,255,0.2)", border: "1px solid rgba(108,58,255,0.4)" }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#6c3aff", borderTopColor: "transparent" }}
        />
      </div>
      <p className="text-sm" style={{ color: "#8892a4" }}>جارٍ التحميل...</p>
    </div>
  </div>
);

/* ── Route Guards ── */

/**
 * ProtectedRoute: Only accessible when logged in.
 * Shows spinner while session is being resolved.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

/**
 * PublicRoute: Redirects logged-in users to dashboard.
 * Shows nothing while loading to avoid flash.
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

/**
 * HomeRoute: Landing page — redirects authenticated users to dashboard.
 */
const HomeRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
};

/* ── Routes ── */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing — auto-redirects to /dashboard if already logged in */}
      <Route path="/" element={<HomeRoute />} />

      {/* Auth pages */}
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

      {/* Supabase email confirmation callback handler.
          Supabase redirects here after email click with hash tokens.
          AuthContext detects the session via detectSessionInUrl=true. */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Public informational pages */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/editor" element={<ProtectedRoute><PromptEditorPage /></ProtectedRoute>} />
      <Route path="/runner" element={<ProtectedRoute><TestRunnerPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

/* ── App Root ── */
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
