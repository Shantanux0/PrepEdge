import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import QuestionCard from './components/QuestionCard';
import Footer from './components/Footer';
import { Zap, Target } from './components/Icons';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [topic, setTopic] = useState("");
  const [companies, setCompanies] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [companySearchCount, setCompanySearchCount] = useState(() => {
    const saved = localStorage.getItem('companySearchCount');
    return saved ? parseInt(saved) : 0;
  });
  const COMPANY_LIMIT = 5;

  const exampleTopics = [
    "Frontend Engineering",
    "System Design",
    "Security Architect",
    "Backend Specialist",
    "Product Leadership",
    "Cloud Architecture"
  ];

  const [loadingStatus, setLoadingStatus] = useState("Analyzing Technical Graph");

  const statusMessages = [
    "Analyzing Technical Graph",
    "Synthesizing Professional Nodes",
    "Tailoring Expert Insights",
    "Engineered for Precision",
    "Optimizing Practice Data"
  ];

  // --- EFFECTS ---
  useEffect(() => {
    let statusIdx = 0;
    const interval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statusMessages.length;
      setLoadingStatus(statusMessages[statusIdx]);
    }, 400);

    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // --- API CALL ---
  const fetchQuestions = async (append = false) => {
    if (!topic.trim()) {
      setError("Please enter a role or skill to begin.");
      return;
    }

    const topics = topic.split(',').map(t => t.trim()).filter(Boolean);
    if (topics.length > 3) {
      setError("Please limit your search to 3 roles at a time for optimal results.");
      return;
    }

    setError("");
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const backendApiUrl = `${API_BASE_URL}/interview-questions/api/interview/generate`;
      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: topic,
          companies: companies.split(',').map(c => c.trim()).filter(Boolean).slice(0, 5)
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        append ? setQuestions(prev => [...prev, ...data]) : setQuestions(data);
        
        // Increment company search count if companies were used
        if (!append && companies.trim()) {
          const newCount = companySearchCount + 1;
          setCompanySearchCount(newCount);
          localStorage.setItem('companySearchCount', newCount.toString());
        }

        if (!append) {
          setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setError("We encountered an issue retrieving questions for this role. Please try a standard role name.");
      if (!append) setQuestions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (showSplash) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
        <div className="relative flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center mb-12">
            <div className="absolute inset-0 border-4 border-dashed border-primary-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-2 border-primary-500/40 rounded-full animate-spin-reverse-slow"></div>
            <div className="absolute inset-8 border border-primary-500/60 rounded-full animate-pulse-glow"></div>
            
            <div className="relative bg-primary-500 p-6 rounded-3xl shadow-2xl shadow-primary-500/50 group">
              <Target className="text-white w-12 h-12" />
              <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping scale-75 opacity-20"></div>
            </div>
          </div>

          <div className="text-center animate-fade-in-up px-6">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              PrepEdge
            </h1>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em] h-4">
                {loadingStatus}
              </span>
              <div className="flex items-center gap-1.5 h-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      
      <main className="pb-20">
        <Hero onStartScroll={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} />
        
        <div id="search-section" className="scroll-mt-24">
          <SearchSection 
            topic={topic} 
            setTopic={setTopic} 
            companies={companies}
            setCompanies={setCompanies}
            onGenerate={fetchQuestions} 
            loading={loading}
            exampleTopics={exampleTopics}
            companySearchCount={companySearchCount}
            companyLimit={COMPANY_LIMIT}
          />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <span className="text-lg">⚠️</span>
              <p className="font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        <div id="results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-800/50 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>
              ))}
            </div>
          ) : questions.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold dark:text-white tracking-tight">Curated Preparation Path</h2>
                <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500">
                  {questions.length} Concepts Identified
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {questions.map((q, idx) => (
                  <QuestionCard key={idx} q={q} index={idx} />
                ))}
              </div>
              
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => fetchQuestions(true)}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/10 dark:via-white/5 to-transparent -translate-x-[100%] group-hover:animate-shine"></div>
                  {loadingMore ? (
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-primary-500" />
                      <span>Expand Practice Set</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
             !loading && !error && (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white mb-2">Practice Session Ready</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">Enter a role or technical stack above to begin your professional interview prep.</p>
                </div>
             )
          )}
        </div>
      </main>

      <Footer />
      <Analytics />
    </div>
  );
}