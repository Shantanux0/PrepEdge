import React from 'react';
import { ChevronRight, Target } from './Icons';

export default function Hero({ onStartScroll }) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] dark:opacity-[0.05] grayscale scale-125 blur-sm">
          <img src="/assets/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
          <Target className="w-4 h-4" />
          <span>Professional Interview Prep</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 animate-fade-in-up [animation-delay:200ms]">
          Master Your Next Interview with <span className="bg-gradient-to-r from-primary-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Elite Insights</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms]">
          Stop guessing. Get industry-standard interview questions tailored to your specific role and tech stack. Engineered for precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
          <button
            onClick={onStartScroll}
            className="group px-10 py-4.5 bg-gradient-to-br from-primary-500 to-orange-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 active:scale-95 relative overflow-hidden border-t border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shine"></div>
            <span className="relative z-10">Get Started Now</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
          
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
              </div>
            ))}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
              1k+
            </div>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Trusted by developers</span>
        </div>
      </div>
    </section>
  );
}
