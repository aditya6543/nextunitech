import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { messageService } from "../services/api.js";

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await messageService.createMessage(data);
      // **REMOVE THE EXTRA BRACE THAT WAS HERE**

      // **FIX THE TYPO: Use lowercase 'r' for response**
      if (response.success) {
        setSubmitStatus("success");
        reset();
      } else {
        console.error("Backend error:", response.error || response.message);
        setSubmitStatus("error");
      }
    } catch (error) { // Keep the existing catch block
      let errorMessage = "Message submit failed. Please try again.";
      if (error instanceof Error) {
          errorMessage = error.message;
      } else if (typeof error === 'string') {
          errorMessage = error;
      }
      console.error("Message submit failed:", errorMessage, error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary-500">Contact Us</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="Your Name"
                className={`w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700 
                  ${errors.name ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Your Email"
                className={`w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700 
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                placeholder="Your Message"
                rows={4}
                className={`w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700 
                  ${errors.message ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white p-3 rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <p className="text-green-500 text-center mt-2">Message sent successfully!</p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-500 text-center mt-2">
                Failed to send message. Please try again later.
              </p>
            )}
          </form>
        </div>

        {/* Company Info & Social Links */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary-500">NextUnitech.PVT.LTD</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            AI Solutions for Bharat. Making advanced technologies accessible and relevant for every Indian.
          </p>

          {/* Real Social Links */}
          <div className="flex space-x-6">
            <motion.a
              href="https://linkedin.com/company/madhav-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500"
              whileHover={{ scale: 1.1 }}
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="mailto:madhavofficialai@gmail.com"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500"
              whileHover={{ scale: 1.1 }}
            >
              Email
            </motion.a>
          </div>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 NextUnitech.PVT.LTD</p>
            <p>All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;