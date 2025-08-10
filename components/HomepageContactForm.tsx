"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// The data structure for the form fields
type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function HomepageContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // State to manage the submission process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Function to handle submission to web3forms
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData();
    formData.append("access_key", "6c1d313b-8233-482f-8cc1-f4b3344fde2b"); // Your Access Key
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("message", data.message);
    formData.append("subject", `New Homepage Inquiry from ${data.name}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(
          "Thank you for your message! We will get back to you soon."
        );
        reset(); // Clear the form on success
      } else {
        console.error("Submission Error:", result);
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setSubmitMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Have a Question? Get in Touch!
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              We are here to help and answer any question you might have. We
              look forward to hearing from you.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required." })}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "A valid email is required.",
                      pattern: /^\S+@\S+$/i,
                    })}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required.",
                  })}
                  className="mt-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  {...register("message", {
                    required: "Message cannot be empty.",
                  })}
                  className="mt-2 resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
              {submitMessage && (
                <p className="text-center mt-4 text-sm font-medium text-green-700">
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
