import React from 'react';
import { Clipboard, Check } from './Icons';

export default function QuestionCard({ q, index, studyMode }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div 
      className={`perspective-1000 h-80 group cursor-pointer animate-reveal`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full text-center transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side: Question */}
        <div className="absolute inset-0 backface-hidden flex flex-col p-6 rounded-3xl glass-card text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
              Question #{index + 1}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${difficultyColors[q.difficulty] || difficultyColors.Medium}`}>
              {q.difficulty}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-snug flex-grow overflow-y-auto pr-2 scrollbar-none">
            {q.question}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              Click to reveal answer
            </span>
            <button 
              onClick={(e) => handleCopy(e, q.question)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              title="Copy Question"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Back Side: Answer */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col p-6 rounded-3xl glass-card text-left bg-slate-50 dark:bg-slate-900/50 overflow-hidden ${isFlipped ? 'animate-success-glow' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-shine"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
              Expert Answer
            </span>
            <button 
              onClick={(e) => handleCopy(e, q.answer)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              title="Copy Answer"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed overflow-y-auto pr-2 scrollbar-tight flex-grow">
            {q.answer}
          </p>

          <div className="mt-4 text-xs text-slate-400 italic text-center">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
