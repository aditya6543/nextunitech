import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const waitlistSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const FindMeJobAI: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema)
  });

  const onSubmit = async (data: WaitlistFormData) => {
    try {
      const response = await fetch('http://localhost:4000/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          status: 'pending'
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-6 text-primary-500">
          FindMeJob.ai
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          We're currently developing an AI-powered job matching platform to revolutionize your career journey.
        </p>
        
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our AI-powered job matching platform is under development. 
            Stay tuned for features like:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-4">
            <li>Resume Analysis</li>
            <li>Personalized Job Recommendations</li>
            <li>Career Growth Insights</li>
            <li>Daily Job Alerts</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded dark:bg-gray-900 dark:border-gray-700"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <textarea
              {...register('message')}
              placeholder="Optional: Tell us about your career goals"
              className="w-full p-3 border rounded dark:bg-gray-900 dark:border-gray-700"
              rows={3}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primary-500 text-white p-3 rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist'}
          </motion.button>

          {submitStatus === 'success' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 mt-4"
            >
              You've been added to the waitlist! We'll contact you soon.
            </motion.p>
          )}
          
          {submitStatus === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4"
            >
              Failed to join waitlist. Please try again.
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default FindMeJobAI;
