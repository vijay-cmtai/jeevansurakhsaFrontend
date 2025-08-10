"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Home, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

// Framer Motion ke saath ShadCN Button ko use karne ke liye
const MotionButton = motion(Button);

// Chhota sa Confetti component
const ConfettiPiece = ({ styles }) => (
  <motion.div
    className="absolute h-2 w-2 rounded-full"
    style={styles.style}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: "100vh", opacity: [1, 1, 0] }}
    transition={styles.transition}
  />
);

// Pura Confetti background
const Confetti = () => {
  const confetti_styles = Array.from({ length: 25 }).map(() => ({
    style: {
      left: `${Math.random() * 100}%`,
      background: ["#00C853", "#64DD17", "#AEEA00", "#FFD600"][
        Math.floor(Math.random() * 4)
      ],
    },
    transition: {
      duration: Math.random() * 3 + 2,
      ease: "linear",
      repeat: Infinity,
      delay: Math.random() * 2,
    },
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confetti_styles.map((styles, i) => (
        <ConfettiPiece key={i} styles={styles} />
      ))}
    </div>
  );
};

// Main success content component
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("Loading...");

  useEffect(() => {
    const orderIdFromUrl = searchParams.get("order_id") || "N/A";
    setOrderId(orderIdFromUrl);

    // Page load par ek baar toast dikhayein
    toast({
      title: "✅ Registration & Payment Successful!",
      description: "Aapka Jeevan Suraksha parivaar mein swagat hai.",
      duration: 5000,
    });
  }, [searchParams, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "Copied to clipboard!",
      description: "Order ID has been copied.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200"
    >
      {/* Card ke upar gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-blue-400" />

      <div className="p-8 md:p-10 text-center">
        {/* Success Icon ka naya design */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-green-100"
        >
          <Check className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-base mb-6">
            Aapka Jeevan Suraksha parivaar mein swagat hai.
          </p>
        </motion.div>

        {/* Order ID section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-2">Your Order ID:</p>
          <div className="flex items-center justify-center space-x-2">
            <p className="font-mono text-lg text-gray-700">{orderId}</p>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          <MotionButton
            onClick={() => router.push("/login")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Go to Dashboard
          </MotionButton>

          <MotionButton
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full py-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </MotionButton>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500">
            A confirmation has been sent to your registered email.
            <br />
            For queries, contact{" "}
            <Link
              href="mailto:support@jeevansuraksha.org"
              className="text-green-600 font-medium hover:underline"
            >
              support@jeevansuraksha.org
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main page component jo Suspense aur naye background ke saath hai
export default function RegistrationSuccessPage() {
  return (
    <div className="relative min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <Confetti />
      <Suspense
        fallback={<Loader2 className="h-10 w-10 animate-spin text-gray-600" />}
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
