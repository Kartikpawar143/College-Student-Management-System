"use client";
import { User } from "@/Types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, endpoints } from "@/lib/api";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("vidya_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user data");
        localStorage.removeItem("vidya_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
        const response = await api.post(endpoints.auth.login, credentials);
        const userData = response.data;

        if (userData.status === "success") {
            const userObj = userData.user;
            setUser(userObj);
            localStorage.setItem("vidya_user", JSON.stringify(userObj));

            if (userData.redirect) {
                window.location.href = userData.redirect;
            } else {
                const role = (userObj.role || "").toLowerCase();
                window.location.href = `/${role}/dashboard`;
            }
        } else {
            throw new Error("Login failed");
        }
    } catch (err) {
        console.error("Login attempt failed:", err);
        throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vidya_user");
    window.location.href = "/login";
  };


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
