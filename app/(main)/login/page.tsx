"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  loginUser,
  loginAdmin,
  loginDashboardUser,
} from "@/lib/redux/features/auth/authSlice";
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
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [memberIdentifier, setMemberIdentifier] = useState("");
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

    if (isDashboardLogin) {
      if (!adminIdentifier || !password) return;
      if (
        adminIdentifier.toLowerCase() ===
        (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "healthguard0102@gmail.com")
      ) {
        dispatch(loginAdmin({ email: adminIdentifier, password }));
      } else {
        dispatch(loginDashboardUser({ email: adminIdentifier, password }));
      }
    } else {
      if (!memberIdentifier || !password) return;
      dispatch(loginUser({ identifier: memberIdentifier, password }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full min-h-screen lg:min-h-0 lg:max-w-4xl lg:mx-auto lg:grid lg:grid-cols-2 bg-white lg:rounded-2xl lg:shadow-2xl overflow-hidden">
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

        <div className="flex flex-col justify-center min-h-screen lg:min-h-0 px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="lg:hidden text-center mb-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Jeevan Suraksha
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Financial safety net for communities
            </p>
          </div>

          <Card className="border-none shadow-none w-full max-w-sm mx-auto lg:max-w-none">
            <CardHeader className="text-center lg:text-left pb-4 lg:pb-6 px-0">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome Back!
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <UserIcon
                      className={`h-4 w-4 transition-colors ${
                        !isDashboardLogin ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <Label
                      htmlFor="login-as"
                      className={`text-sm transition-colors cursor-pointer ${
                        !isDashboardLogin
                          ? "font-semibold text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      Member
                    </Label>
                  </div>

                  <Switch
                    id="login-as"
                    checked={isDashboardLogin}
                    onCheckedChange={setIsDashboardLogin}
                    className="mx-3"
                  />

                  <div className="flex items-center space-x-2">
                    <Label
                      htmlFor="login-as"
                      className={`text-sm transition-colors cursor-pointer ${
                        isDashboardLogin
                          ? "font-semibold text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      Admin/Manager
                    </Label>
                    <Shield
                      className={`h-4 w-4 transition-colors ${
                        isDashboardLogin ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>

                {/* --- यह हिस्सा बदला गया है --- */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium">
                    {isDashboardLogin
                      ? "Email Address"
                      : "Email or Phone Number"}
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={
                      isDashboardLogin
                        ? "you@example.com"
                        : "Email / Phone Number"
                    }
                    value={
                      isDashboardLogin ? adminIdentifier : memberIdentifier
                    }
                    onChange={(e) => {
                      if (isDashboardLogin) {
                        setAdminIdentifier(e.target.value);
                      } else {
                        setMemberIdentifier(e.target.value);
                      }
                    }}
                    disabled={loading}
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-11 text-base pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg text-center border border-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-semibold flex items-center justify-center gap-x-2 mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" /> Sign In
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
