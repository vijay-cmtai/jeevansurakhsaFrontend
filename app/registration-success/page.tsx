"use-client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";
import axiosInstance from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Confetti from "react-confetti";

// Interface for the backend response
interface VerificationResponse {
  status: "SUCCESS" | "PENDING" | "FAILED";
  message: string;
  user?: any;
}

// Main Page Component
export default function RegistrationStatusPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<
    "LOADING" | "SUCCESS" | "PENDING" | "FAILED"
  >("LOADING");
  const [message, setMessage] = useState(
    "Verifying your registration payment..."
  );

  // State to control confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setStatus("FAILED");
      setMessage("No order ID found. Cannot verify payment.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data } = await axiosInstance.post<VerificationResponse>(
          "/api/payment/verify-registration",
          { order_id: orderId }
        );

        // Only update state if it has changed to avoid unnecessary re-renders
        if (data.status !== status) setStatus(data.status);
        if (data.message !== message) setMessage(data.message);

        if (data.status === "SUCCESS" && data.user) {
          dispatch(setCredentials(data.user));
          setShowConfetti(true); // Trigger confetti on success
          toast({
            title: "Registration Complete!",
            description: "Welcome! You are now logged in.",
          });
        }
      } catch (err) {
        setStatus("FAILED");
        setMessage(
          "An error occurred during verification. Please contact support."
        );
      }
    };

    const interval = setInterval(() => {
      if (status !== "LOADING" && status !== "PENDING") {
        clearInterval(interval);
        return;
      }
      verifyPayment();
    }, 4000);

    const timeout = setTimeout(() => {
      if (status === "PENDING" || status === "LOADING") {
        setMessage(
          "Verification is taking longer than usual. Please check your dashboard later or contact support."
        );
        setStatus("FAILED"); // Set to a final state
      }
      clearInterval(interval);
    }, 35000); // Slightly longer timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, status, dispatch, toast, message]);

  const renderStatusContent = () => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: <CheckCircle className="h-20 w-20 text-green-500" />,
          title: "Welcome Aboard!",
          colorClass: "text-green-600",
        };
      case "FAILED":
        return {
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          title: "Something Went Wrong",
          colorClass: "text-red-600",
        };
      default: // LOADING or PENDING
        return {
          icon: <Loader2 className="h-20 w-20 animate-spin text-indigo-500" />,
          title: "Finalizing Your Account...",
          colorClass: "text-indigo-600",
        };
    }
  };

  const { icon, title, colorClass } = renderStatusContent();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 text-center">
          <CardHeader className="items-center p-8">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {icon}
            </motion.div>
            <h1 className={`text-3xl font-bold ${colorClass} mt-4`}>{title}</h1>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {message}
            </p>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-b-2xl">
            {status === "SUCCESS" ? (
              <Button
                asChild
                className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
              >
                <Link href="/dashboard">
                  <Home className="mr-2 h-5 w-5" /> Go to Your Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                className="w-full h-12 text-base"
                variant="secondary"
              >
                <Link href="/login">
                  <LogIn className="mr-2 h-5 w-5" /> Go to Login Page
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
