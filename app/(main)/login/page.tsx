"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

// Redux Imports
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  loginUser,
  loginAdmin,
  loginDashboardUser,
} from "@/lib/redux/features/auth/authSlice";

// UI & Icon Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Eye, EyeOff, LogIn, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDashboardLogin, setIsDashboardLogin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { userInfo, status, error } = useSelector(
    (state: RootState) => state.auth
  );
  const loading = status === "loading";

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [userInfo, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    if (isDashboardLogin) {
      if (
        email.toLowerCase() ===
        (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "healthguard0102@gmail.com")
      ) {
        dispatch(loginAdmin({ email, password }));
      } else {
        dispatch(loginDashboardUser({ email, password }));
      }
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      {/* 👉 Responsive Card Container: Mobile par max-width set kiya gaya hai. */}
      <div className="w-full max-w-md lg:max-w-4xl mx-auto grid lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image (Yeh 'hidden lg:block' ke kaaran mobile par nahi dikhega) */}
        <div className="hidden lg:block relative">
          <Image
            src="https://tse1.mm.bing.net/th/id/OIP.yzBw0jD8ft6sOHYOlwAJ2QHaHl?pid=Api&P=0&h=180"
            alt="Community"
            width={800}
            height={1200}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/70 flex flex-col items-center justify-center p-8 text-white text-center">
            <div>
              <Shield className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">Jeevan Suraksha</h1>
              <p className="text-lg text-blue-100">
                Your community-driven financial safety net.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        {/* 👉 Responsive Padding: Mobile ke liye padding kam ki gayi hai. */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <Card className="border-none shadow-none">
            {/* 👉 Responsive Header: Mobile par text center mein aur bade screen par left mein. */}
            <CardHeader className="text-center lg:text-left pb-6">
              {/* 👉 Responsive Title: Mobile par font size chhota rakha gaya hai. */}
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome Back!
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 👉 Responsive Spacing: Form elements ke beech ka space mobile ke liye adjust kiya gaya hai. */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* LOGIN AS TOGGLE */}
                <div className="flex items-center justify-center space-x-2 p-2 bg-gray-100 rounded-md">
                  <UserIcon
                    className={`h-5 w-5 transition-colors ${!isDashboardLogin ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <Label
                    htmlFor="login-as"
                    className={`text-sm sm:text-base transition-colors cursor-pointer ${!isDashboardLogin ? "font-bold text-gray-800" : "text-gray-500"}`}
                  >
                    Member
                  </Label>
                  <Switch
                    id="login-as"
                    checked={isDashboardLogin}
                    onCheckedChange={setIsDashboardLogin}
                  />
                  <Label
                    htmlFor="login-as"
                    className={`text-sm sm:text-base transition-colors cursor-pointer ${isDashboardLogin ? "font-bold text-gray-800" : "text-gray-500"}`}
                  >
                    Admin/Manager
                  </Label>
                  <Shield
                    className={`h-5 w-5 transition-colors ${isDashboardLogin ? "text-blue-600" : "text-gray-400"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md text-center">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  // 👉 Responsive Button: Mobile ke liye text size adjust kiya gaya hai.
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base sm:text-lg font-bold flex items-center gap-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" /> Sign In
                    </>
                  )}
                </Button>

                {!isDashboardLogin && (
                  <div className="text-center text-sm text-gray-600 pt-4">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Create one now
                    </Link>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
