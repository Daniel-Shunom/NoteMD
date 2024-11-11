"use client"
// src/components/WaitlistForm.tsx
import React, { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
}

const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form Data:', formData);
      setSuccess(true);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-11/12 max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-black mb-6">Join Our Waitlist</h2>
      <p className="text-center text-gray-600 mb-8">
        Be the first to experience our new platform. Enter your details below to get notified when we launch!
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        <div className="w-full md:w-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold whitespace-nowrap rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Join Now'}
          </button>
        </div>
      </form>
      {error && <p className="mt-6 text-red-500 text-center">{error}</p>}
      {success && <p className="mt-6 text-green-500 text-center">Successfully joined the waitlist!</p>}
    </div>
  );
};

export default WaitlistForm;
