import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Building } from './Icons';

export default function SearchSection({ 
  topic, 
  setTopic, 
  companies, 
  setCompanies, 
  onGenerate, 
  loading, 
  exampleTopics,
  companySearchCount,
  companyLimit
}) {
  const [inputValue, setInputValue] = useState(topic);
  const [allTopics, setAllTopics] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const isLimitReached = companySearchCount >= companyLimit;

  // Sync internal value with prop if prop changes from outside (e.g. example topics)
  useEffect(() => {
    setInputValue(topic);
  }, [topic]);

  // --- FETCH TOPICS ---
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${API_BASE_URL}/interview-questions/api/interview/topics`);
        if (response.ok) {
          const data = await response.json();
          setAllTopics(Array.from(data));
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // --- CLOSE DROPDOWN ON CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FILTER LOGIC ---
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const segments = value.split(',').map(s => s.trim());
    const currentSegment = segments[segments.length - 1].toLowerCase();

    if (!currentSegment) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allTopics.filter(t => 
      t.toLowerCase().startsWith(currentSegment) && 
      !segments.slice(0, -1).some(s => s.toLowerCase() === t.toLowerCase())
    ).slice(0, 6);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setActiveIndex(-1);
  };

  const selectSuggestion = (suggestion) => {
    const segments = inputValue.split(',').map(s => s.trim());
    segments[segments.length - 1] = suggestion;
    
    let newTopic = segments.join(', ');
    if (segments.length < 3) {
      newTopic += ', ';
    } else {
      newTopic += '';
    }
    
    setInputValue(newTopic);
    setTopic(newTopic); // Update parent
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && activeIndex > -1) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Enter') {
      setTopic(inputValue); // Sync parent
      onGenerate(false);
    }
  };

  const handleGenerate = () => {
    setTopic(inputValue); // Sync parent before generating
    onGenerate(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mb-16">
      <div className="relative group" ref={dropdownRef}>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        
        <div className={`relative flex flex-col items-stretch gap-4 p-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 ${loading ? 'animate-success-glow' : ''}`}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-grow flex items-center gap-3 px-4 w-full relative">
              <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="e.g. 'Frontend, React' (Max 3 topics)"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full py-3 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none text-lg"
                autoComplete="off"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-4 p-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-reveal will-change-transform">
                  <ul className="flex flex-col gap-1">
                    {suggestions.map((s, idx) => (
                      <li 
                        key={s}
                        onClick={() => selectSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`px-4 py-3 rounded-2xl cursor-pointer text-sm font-bold flex items-center justify-between transition-all duration-200 ${
                          idx === activeIndex 
                            ? 'bg-primary-500 text-white' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{s}</span>
                        {idx === activeIndex && <Zap className="w-3 h-3 text-white animate-pulse" />}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !inputValue.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-primary-500 dark:to-orange-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative shadow-lg shadow-black/10 dark:shadow-primary-500/20 hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-primary-500/40 hover:-translate-y-0.5 active:scale-95 border-t border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shine"></div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="tracking-tight">Get Questions</span>
                </>
              )}
            </button>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-4"></div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4">
            <div className="flex items-center gap-3 flex-grow">
              <Building className="text-slate-400 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                placeholder={isLimitReached ? "Company-wise limit reached (5/5)" : "Target Companies (e.g. Google, Amazon) - Optional (Max 5)"}
                value={companies}
                disabled={isLimitReached}
                onChange={(e) => {
                  const val = e.target.value;
                  const count = val.split(',').filter(c => c.trim()).length;
                  if (count <= 5 || val.endsWith(',') || val.length < companies.length) {
                    setCompanies(val);
                  }
                }}
                className="w-full py-1 bg-transparent text-sm text-slate-600 dark:text-slate-400 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end sm:justify-start">
              {isLimitReached ? (
                <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Limit Reached
                </span>
              ) : companies && (
                <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {companies.split(',').filter(c => c.trim()).length}/5 Companies
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
        {isLimitReached ? "Company feature limit reached. Standard search is still unlimited!" : "Expert interview questions for any role or skill"}
      </p>

      <div className="mt-8">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center mb-4">
          Or try a popular topic
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleTopics.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t + ', ');
                onGenerate(false);
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all duration-300 border border-transparent hover:border-primary-400"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
