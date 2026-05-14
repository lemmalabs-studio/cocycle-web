"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { API_URL } from "@/lib/constants";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  firebaseUser: User | null;
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  idToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);

          // Fetch user record from our API to check role
          const res = await fetch(`${API_URL}/api/users/firebase/${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setAdminUser(data);
          } else {
            setAdminUser(null);
          }
        } catch {
          setAdminUser(null);
          setIdToken(null);
        }
      } else {
        setAdminUser(null);
        setIdToken(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh token every 50 minutes (tokens expire after 60)
  useEffect(() => {
    if (!firebaseUser) return;
    const interval = setInterval(async () => {
      const token = await firebaseUser.getIdToken(true);
      setIdToken(token);
    }, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [firebaseUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const msg = getErrorMessage(err.code);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminUser(null);
    setIdToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        firebaseUser,
        adminUser,
        isLoading,
        isAdmin: adminUser?.role === "admin",
        idToken,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Sign in failed. Please try again.";
  }
}