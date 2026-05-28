import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Handles Supabase email confirmation redirects.
 * Supabase appends #access_token=...&type=signup to the redirect URL.
 * The Supabase client picks these up via detectSessionInUrl=true,
 * fires onAuthStateChange with SIGNED_IN, and AuthContext sets the user.
 * This page just waits and redirects accordingly.
 */
const AuthCallbackPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      // Wait a bit longer for Supabase to process the hash
      const timer = setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#080a0f" }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Animated logo */}
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8468ff" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="url(#cb-grad)" opacity="0.15" />
          <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="url(#cb-grad)" strokeWidth="1.5" />
          <polygon points="18,9 27,14 27,22 18,27 9,22 9,14" fill="url(#cb-grad)" opacity="0.3" />
          <circle cx="18" cy="18" r="4" fill="url(#cb-grad)" />
        </svg>

        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#6c3aff", borderTopColor: "transparent" }}
        />

        <div className="text-center">
          <p className="text-white font-semibold mb-1">جارٍ تأكيد حسابك...</p>
          <p className="text-sm" style={{ color: "#8892a4" }}>
            Verifying your account, please wait
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
