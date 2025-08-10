"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Ek chhota helper component taaki code repeat na ho
const InputField = ({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-600">
      {label}
    </Label>
    <Input
      id={id}
      placeholder={placeholder}
      type={type}
      className="bg-gray-50"
    />
  </div>
);

export default function DonatePage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan aap form submission logic likh sakte hain
    console.log("Form submitted!");
  };

  return (
    <div className="min-h-screen w-full bg-[#2d3748] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl pt-16 pb-10 px-6 sm:px-10"
      >
        {/* Logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-lg flex items-center justify-center">
            <Image
              src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
              alt="Jeevan Suraksha Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome To Jeevan Suraksha
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField id="name" label="Name." placeholder="Enter Your name" />
          <InputField
            id="email"
            label="Email Id."
            placeholder="Enter Your Email Id"
            type="email"
          />
          <InputField
            id="mobile"
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            type="tel"
          />
          <InputField
            id="amount"
            label="Enter Amount"
            placeholder="Enter Amount"
            type="number"
          />
          <InputField
            id="address"
            label="Address"
            placeholder="Enter Address"
          />

          {/* Tax Deduction Section */}
          <div className="text-center pt-4 mt-6 border-t border-gray-200">
            <p className="font-bold text-gray-800">
              If You Want To Claim The Tax Deduction, Then Fill Below Fields Or
              Left Blank
            </p>
          </div>

          <div className="space-y-6">
            <InputField
              id="pan"
              label="PAN Number"
              placeholder="Enter PAN Number"
            />
            <InputField
              id="bankName"
              label="Bank Name"
              placeholder="Enter Bank Name"
            />
            <InputField
              id="branchName"
              label="Branch Name"
              placeholder="Enter Bank Branch Name"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Donate Now
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-8">
        <p>Designed & Developed By Winggo Soft</p>
        <p>+91 9140724426® 2024</p>
      </footer>
    </div>
  );
}
