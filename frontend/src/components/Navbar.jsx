import React from 'react';
import { Sun, Moon, Zap } from './Icons';

export default function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl glass rounded-full px-4 py-2 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            PrepEdge
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a
            href="https://github.com/shantanux0"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-semibold rounded-full hover:scale-105 transition-transform"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
