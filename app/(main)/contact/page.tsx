"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

// The data structure for our form fields
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // State to manage the submission process (loading, success, error)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // This function handles the submission to web3forms
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    // Create a FormData object to send to web3forms
    const formData = new FormData();
    formData.append("access_key", "6c1d313b-8233-482f-8cc1-f4b3344fde2b"); // Your Access Key
    formData.append("First Name", data.firstName);
    formData.append("Last Name", data.lastName);
    formData.append("Email", data.email);
    formData.append("Message", data.message);
    formData.append(
      "subject",
      `New Contact Form Submission from ${data.firstName} ${data.lastName}`
    );

    try {
      // Use the Fetch API to send the data
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(
          "Thank you for your message! We will get back to you soon."
        );
        reset(); // Clear the form fields on successful submission
      } else {
        console.error("Submission Error:", result);
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setSubmitMessage(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold"
          >
            Contacts
          </motion.h1>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side: Illustration and Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center mb-12">
                <p className="text-gray-500">Illustration or Image Here</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Address
                    </h4>
                    <p className="text-gray-600">
                      Health Guard Foundation 1-63, Amadabakula (Village),
                      Kothakota (Mandal), Wanaparty (District), Telangana, India
                      - 509381
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Email
                    </h4>
                    <a
                      href="mailto:info@jeevansuraksha.org"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      info@jeevansuraksha.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Phone
                    </h4>
                    <a
                      href="tel:+917816058717"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      +91-78160 58717
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 shadow-xl"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Leave a Reply
              </h3>
              <p className="text-gray-600 mb-8">
                Your email address will not be published. Required fields are
                marked *
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: true })}
                      className="mt-2"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        First name is required.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: true })}
                      className="mt-2"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        Last name is required.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      A valid email is required.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    {...register("message", { required: true })}
                    className="mt-2 resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      Message is required.
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
                      Sending...
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3828.4031708889975!2d77.946808!3d16.353411999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1755160240159!5m2!1sen!2sin"
          width="100%" // Changed to 100% for responsiveness
          height="100%" // Changed to 100% to fill the section
          style={{ border: 0 }} // Corrected style prop
          allowFullScreen="" // Changed to camelCase allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
