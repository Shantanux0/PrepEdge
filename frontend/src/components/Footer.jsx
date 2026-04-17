import React from 'react';
import { Github, Linkedin, Zap } from './Icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold dark:text-white">
              PrepEdge
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Empowering professionals to land their dream roles with precision-engineered interview preparation. Built for the community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 sm:gap-20">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/shantanux0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/shantanu-kale-2s20/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Support</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:kaleshantanu2260@gmail.com" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">Contact Us</a>
              <a href="#" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-400 font-medium tracking-wide">
        <div className="flex flex-col gap-1">
          <p>© {currentYear} PrepEdge. All rights reserved.</p>
          <p className="text-[10px] opacity-50 uppercase font-bold">Release v2.0.2</p>
        </div>
        <p>Expertly crafted for global developers.</p>
      </div>
    </footer>
  );
}
