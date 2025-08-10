// app/payment/success/payment-success-client.tsx

"use client"; // Ye sabse zaroori hai

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Download, Share2, Home, Receipt } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Humne component ka naam badal diya hai
export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: "",
    amount: "",
    transactionId: "",
    paymentTime: "",
  });

  useEffect(() => {
    const orderId = searchParams.get("order_id") || "N/A";
    const amount = searchParams.get("amount") || "N/A";
    const transactionId = searchParams.get("cf_payment_id") || "N/A";
    const paymentTime = new Date().toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    setPaymentDetails({ orderId, amount, transactionId, paymentTime });

    toast({
      title: "Payment Successful! 🎉",
      description: "Thank you for your generous donation.",
      duration: 5000,
    });
  }, [searchParams, toast]);

  const handleDownloadReceipt = () => {
    const receiptContent = `
JEEVAN SURAKSHA DONATION RECEIPT
=====================================
Transaction Details:
- Order ID: ${paymentDetails.orderId}
- Transaction ID: ${paymentDetails.transactionId}
- Amount: ₹${paymentDetails.amount}
- Date: ${paymentDetails.paymentTime}
- Status: SUCCESS

Thank you for your generous donation!
For any queries, contact us at:
Email: support@jeevansuraksha.org
Phone: +91-XXXXXXXXXX
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-receipt-${paymentDetails.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your donation receipt has been downloaded.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I just donated to Jeevan Suraksha!",
          text: `I just made a donation of ₹${paymentDetails.amount} to Jeevan Suraksha. Join me in supporting this great cause!`,
          url: "https://jeevansuraksha.org",
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(
        `I just made a donation of ₹${paymentDetails.amount} to Jeevan Suraksha. Join me in supporting this great cause! https://jeevansuraksha.org`
      );
      toast({
        title: "Copied to Clipboard",
        description: "Share message copied to clipboard!",
      });
    }
  };

  // Baaki ka return JSX yahan se...
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Aapka pura UI code yahan paste karein. Maine neeche paste kar diya hai. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full"
              initial={{
                x: Math.random() * 400,
                y: Math.random() * 600,
                opacity: 0,
              }}
              animate={{ y: -100, opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </div>
        <div className="relative p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white p-3 shadow-lg">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
                alt="Jeevan Suraksha Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Thank you for your generous donation!
            </p>
            <p className="text-sm text-gray-500">
              Your support helps us make a difference in people's lives.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 rounded-xl p-6 mb-8 text-left"
          >
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Transaction Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-green-600">
                  ₹{paymentDetails.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono text-sm text-gray-700">
                  {paymentDetails.orderId.length > 20
                    ? `${paymentDetails.orderId.slice(0, 20)}...`
                    : paymentDetails.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-sm text-gray-700">
                  {paymentDetails.transactionId.length > 20
                    ? `${paymentDetails.transactionId.slice(0, 20)}...`
                    : paymentDetails.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-sm text-gray-700">
                  {paymentDetails.paymentTime}
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-12"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/donate")}
              variant="outline"
              className="w-full"
            >
              Donate Again
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-xs text-gray-500">
              A confirmation email will be sent to your registered email
              address.
              <br />
              For any queries, contact us at{" "}
              <a
                href="mailto:support@jeevansuraksha.org"
                className="text-green-500 hover:underline"
              >
                support@jeevansuraksha.org
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 text-sm">
          🙏 Your kindness makes the world a better place
        </p>
      </motion.div>
    </div>
  );
}
