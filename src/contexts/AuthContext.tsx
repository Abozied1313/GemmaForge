import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  /** Returns null on success, or an error message string on failure */
  signIn: (email: string, password: string) => Promise<string | null>;
  /** Returns null on success (means: confirmation email sent), or an error message string */
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => "Not initialized",
  signUp: async () => "Not initialized",
  signOut: () => {},
});

function mapUser(u: SupabaseUser): User {
  return {
    id: u.id,
    email: u.email!,
    name:
      u.user_metadata?.full_name ||
      u.user_metadata?.name ||
      u.email!.split("@")[0],
    createdAt: u.created_at,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety #1: Check existing session (page refresh / callback URL)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) setUser(mapUser(session.user));
      setIsLoading(false);
    });

    // Safety #2: Listen for realtime auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      console.log("[Auth] event:", event, session?.user?.email ?? "no user");

      if (event === "SIGNED_IN" && session?.user) {
        setUser(mapUser(session.user));
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(mapUser(session.user));
      } else if (event === "USER_UPDATED" && session?.user) {
        setUser(mapUser(session.user));
      }
      // INITIAL_SESSION is handled by getSession() above — ignore here to avoid race
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email + password.
   * Returns null on success, or a human-readable Arabic/English error message.
   */
  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("[Auth] signIn error:", error.message);
      // Map common Supabase error messages to friendly text
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_credentials")
      ) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة / Invalid email or password";
      }
      if (error.message.includes("Email not confirmed")) {
        return "يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد / Please confirm your email first";
      }
      return error.message;
    }
    if (!data.user) return "فشل تسجيل الدخول / Login failed";
    setUser(mapUser(data.user));
    return null; // success
  };

  /**
   * Sign up with email + password + name.
   * Returns null on success (email confirmation sent), or error message.
   *
   * NOTE: If Supabase email confirmation is ENABLED (default), the user won't
   * have an active session until they click the confirmation link.
   * If email confirmation is DISABLED, they are signed in immediately.
   */
  const signUp = async (email: string, password: string, name: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, name },
        // Redirect to callback page after email confirmation
        // Use the production URL explicitly to avoid localhost in confirmation emails
        emailRedirectTo: `${window.location.hostname === 'localhost' ? 'https://react-9bhws8.onspace.build' : window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("[Auth] signUp error:", error.message);
      if (error.message.includes("already registered") || error.message.includes("User already registered")) {
        return "هذا البريد الإلكتروني مسجّل مسبقاً — جرّب تسجيل الدخول / Email already registered";
      }
      return error.message;
    }

    if (!data.user) return "فشل إنشاء الحساب / Sign up failed";

    // If session exists immediately → email confirmation is disabled, user is logged in
    if (data.session) {
      setUser(mapUser(data.user));
    }

    return null; // success (either session set or email confirmation sent)
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
