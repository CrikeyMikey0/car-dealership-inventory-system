import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const AboutUs: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-16 pb-12">
        {/* Hero Section */}
        <section 
          className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-16 md:p-24 shadow-2xl flex flex-col items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-md">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium">
              We are redefining the dealership experience with transparency, speed, and uncompromising quality. Welcome to the future of car buying.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              We built KATA on the foundation of trust and technological excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                🔍
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Transparency</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                No hidden fees. No aggressive upselling. What you see is exactly what you get, down to the last penny.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Speed</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                From browsing to checkout in minutes, not hours. Our digital platform is optimized for your valuable time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                💎
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Quality</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every vehicle in our inventory goes through an exhaustive multi-point inspection to guarantee excellence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-12 text-center text-white shadow-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Ready to find your match?</h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Explore our curated selection of premium vehicles today.
          </p>
          <div className="pt-4">
            <Link to="/vehicles">
              <Button variant="primary" size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl rounded-full px-8 border-none">
                Browse Inventory
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};
