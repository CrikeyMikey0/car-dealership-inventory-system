import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { notify } from '../utils/notification';

export const ContactUs: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      notify.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-12 pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Have a question about a vehicle, financing, or anything else? Our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900/40 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Our Location</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Dept of Computer Science<br />
                      Gujarat University<br />
                      Ahmedabad, Gujarat 380015
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Phone Number</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      (+91) 9876543210<br />
                      Mon-Fri 9am to 6pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Email Address</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      kata.support@gmail.com (Working email.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Dummy Image */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group h-48">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Map location dummy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Doe" required />
              </div>

              <Input label="Email Address" type="email" placeholder="john@example.com" required />
              <Input label="Subject" placeholder="How can we help you?" required />

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <Button type="submit" variant="primary" className="w-full h-12 text-lg rounded-xl mt-2" isLoading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
