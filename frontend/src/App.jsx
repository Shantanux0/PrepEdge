import React from 'react';

// Main application component
export default function App() {
    // --- STATE MANAGEMENT ---
    const [topic, setTopic] = React.useState("");
    const [questions, setQuestions] = React.useState([]);
    const [loading, setLoading] = React.useState(false); // For initial generation
    const [error, setError] = React.useState("");
    const [showSplash, setShowSplash] = React.useState(true); // For initial splash screen
    const [loadingMore, setLoadingMore] = React.useState(false); // For "Generate More" button
    const [selectedQuestion, setSelectedQuestion] = React.useState(null);

    // --- CONSTANTS ---
    const exampleTopics = [
        "Java Backend",
        "MERN Stack",
        "React Frontend",
        "Spring Microservices",
        "Python Data Science",
        "Fullstack Development",
        "Docker & Kubernetes"
    ];

    // --- EFFECTS ---

    // Effect to hide the splash screen after a delay
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Effect to lock body scroll when the modal is open
    React.useEffect(() => {
        if (selectedQuestion) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function to ensure scroll is unlocked on component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedQuestion]);


    // --- API CALL ---

    /**
     * Fetches interview questions from the backend.
     * @param {boolean} append - If true, appends new questions. Otherwise, replaces them.
     * @param {string|null} immediateTopic - If provided, uses this topic for the fetch, otherwise uses state.
     */
    const fetchQuestions = async (append = false, immediateTopic = null) => {
        const topicToFetch = immediateTopic ?? topic;

        if (!topicToFetch.trim()) {
            setError("Please enter a topic to generate questions.");
            return;
        }
        setError("");
        append ? setLoadingMore(true) : setLoading(true);

        try {
            const backendApiUrl = 'https://prepedgeai.onrender.com/interview-questions/api/interview/generate';

            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topicToFetch })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Backend error: ${response.status} ${errorText}`);
            }

            const generatedQuestions = await response.json();

            if (generatedQuestions && Array.isArray(generatedQuestions)) {
                append
                    ? setQuestions(prev => [...prev, ...generatedQuestions])
                    : setQuestions(generatedQuestions);
            } else {
                throw new Error("Invalid response structure from the backend.");
            }

        } catch (err) {
            console.error("Backend Fetch Error:", err);
            setError("Oops! No questions found—try a more general topic or check back later.");
            if (!append) setQuestions([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };


    // --- RENDER METHODS ---

    // Splash Screen Component
    const SplashScreen = () => (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
            <div className="w-16 h-16 mb-4 animate-spin-slow">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L12 5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L12 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12H2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12H19" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.0711 4.92896L16.9497 7.05029" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.05029 16.9497L4.92896 19.0711" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.0711 19.0711L16.9497 16.9497" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.05029 7.05029L4.92896 4.92896" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-700 text-center">PrepEdge AI</h1>
            <p className="text-slate-500 text-center">Preparing your interview toolkit...</p>
        </div>
    );

    // Modal component for displaying a single question in a focused view.
    const QuestionModal = ({ question, onClose }) => {
        if (!question) return null;

        const handleOverlayClick = (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full relative transform transition-all duration-300 scale-95 animate-modal-pop-in">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-800 transition-colors"
                        aria-label="Close question view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="text-amber-500 font-bold text-2xl sm:text-3xl flex-shrink-0">Q{question.index + 1}</div>
                        <div className="flex-grow">
                            <h2 className="font-bold text-slate-800 text-lg sm:text-2xl mb-4">
                                {question.question}
                            </h2>
                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">{question.answer}</p>
                            <span className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full ${
                                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                                {question.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // Question Card Component
    const QuestionCard = ({ q, index, onClick }) => (
        <div
            onClick={onClick}
            // --- CHANGED: Added `relative` and `group` classes to enable the hover tooltip.
            className="relative group bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="text-amber-500 font-bold text-lg sm:text-xl flex-shrink-0">Q{index + 1}</div>
                <div className="flex-grow">
                    <h2 className="font-semibold text-slate-800 text-base sm:text-lg mb-3">
                        {q.question}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{q.answer}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                        {q.difficulty}
                    </span>
                </div>
            </div>
            {/* --- NEW: Tooltip that appears on hover to guide the user. --- */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/80 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm">
                Click to expand
            </div>
        </div>
    );

    // Empty State Component
    const EmptyState = () => (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-slate-100 rounded-xl border border-dashed border-slate-300">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-base sm:text-lg font-medium text-slate-800">Ready to start?</h3>
            <p className="mt-1 text-sm text-slate-500">Enter a topic above or click an example to see the magic happen.</p>
        </div>
    );

    // Loading Spinner Icon
    const Spinner = () => <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>;

    // Professional Footer Component
    const ProfessionalFooter = () => (
        <footer className="bg-slate-800 text-slate-300 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
                    <div><h3 className="text-lg font-bold text-white">lazycodder</h3></div>
                    <div className="flex flex-col items-center md:items-start space-y-1">
                         <a href="mailto:kaleshantanu2260@gmail.com" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            kaleshantanu2260@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="https://www.linkedin.com/in/shantanu-kale-2s20/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            <span className="sr-only">LinkedIn</span>
                        </a>
                         <a href="https://github.com/shantanux0" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            <span className="sr-only">GitHub</span>
                        </a>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} PrepEdge AI. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );


    // --- MAIN RENDER ---

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="flex-grow max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12 w-full">
                <header className="mb-8 sm:mb-10 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
                        PrepEdge <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">AI</span>
                    </h1>
                    <p className="text-slate-500 text-base sm:text-lg mt-2">
                        Your AI-powered assistant for acing technical interviews.
                    </p>
                </header>

                <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-lg py-4 sm:py-6 mb-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white rounded-full shadow-md border border-slate-200">
                            <input
                                type="text"
                                placeholder="e.g., 'React Hooks'"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchQuestions(false)}
                                className="px-5 py-2 sm:py-3 rounded-full focus:outline-none w-full text-base sm:text-lg bg-transparent"
                            />
                            <button
                                onClick={() => fetchQuestions(false)}
                                className="bg-slate-800 text-white font-semibold px-6 py-2 sm:py-3 rounded-full shadow-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : (
                                    <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg><span className="sm:inline">Generate</span></>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4 px-2">
                            {exampleTopics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setTopic(t);
                                        fetchQuestions(false, t);
                                    }}
                                    className="bg-slate-200 text-slate-600 text-xs sm:text-sm px-3 py-1 rounded-full hover:bg-slate-300 hover:text-slate-800 transition"
                                >{t}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center mb-6 bg-red-100 p-3 rounded-lg mx-auto max-w-2xl">{error}</p>}

                <main>
                    {loading ? (
                        <div className="flex justify-center items-center py-20"><Spinner /></div>
                    ) : questions.length > 0 ? (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {questions.map((q, idx) => (
                                <QuestionCard
                                    key={idx}
                                    q={q}
                                    index={idx}
                                    onClick={() => setSelectedQuestion({ ...q, index: idx })}
                                />
                            ))}
                        </div>
                    ) : (
                        !error && <EmptyState />
                    )}
                </main>

                {questions.length > 0 && !loading && (
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <button
                            onClick={() => fetchQuestions(true)}
                            className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Spinner /> : "✨ Generate More"}
                        </button>
                    </div>
                )}
            </div>
            <ProfessionalFooter />

            <QuestionModal
                question={selectedQuestion}
                onClose={() => setSelectedQuestion(null)}
            />
        </div>
    );
}
