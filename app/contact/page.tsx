"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-2"
          >
            Contacts
          </motion.h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Illustration and Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Family Under Umbrella Illustration */}
              <div className="mb-12">
                <img
                  src="/placeholder.svg?height=300&width=400&text=Family+Under+Umbrella+with+House"
                  alt="Family under umbrella with house"
                  className="mx-auto h-80 w-auto"
                />
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="text-right mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600">
                    We'd love to hear from you. Send us a message and we'll
                    respond as soon as possible.
                  </p>
                </div>

                <div className="space-y-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Visit us
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Health Guard Foundation
                        <br />
                        123 Community Street, Karolbagh
                        <br />
                        New Delhi - 110005
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Mail us
                      </h4>
                      <p className="text-gray-600 text-sm">
                        info@jeevansuraksha.org
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Call us
                      </h4>
                      <p className="text-gray-600 text-sm">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Leave a Reply
                </h3>
                <p className="text-gray-600 mb-8">
                  Your email address will not be published. Required fields are
                  marked *
                </p>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={6}
                      className="border-gray-300 resize-none"
                    />
                  </div>

                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-300">
        <div className="w-full h-full bg-gradient-to-r from-green-200 to-blue-200 flex items-center justify-center">
          <p className="text-gray-700 text-lg">
            Interactive Map will be displayed here
          </p>
        </div>
      </section>
    </div>
  );
}
