"use client";

import React from "react";

export default function ReportClaimPage() {
  // The background image URL provided in the prompt
  const heroBackgroundImage =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center py-24"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      >
        {/* Dark Overlay - Isko halka kar diya gaya hai */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Report Claim</h1>
          <p className="mt-4 text-sm font-light">
            HOME <span className="font-semibold">REPORT CLAIM</span>
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-slate-100 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Headers */}
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-lg">
              Jeevan Suraksha Social Security Collective
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              REPORT CLAIM
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-600">
              Members requiring financial assistance must submit a formal
              request along with supporting medical documents.
            </p>
          </div>

          {/* Form */}
          <form className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Your Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Your Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Your Email *"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Type of Claim Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Type of Claim*"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address Textarea */}
            <div className="mb-8">
              <textarea
                placeholder="Address..."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-orange-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-700 transition-colors duration-300"
              >
                SEND A MESSAGE
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
