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

    // --- API CALL ---

    /**
     * Fetches interview questions from your Spring Boot backend.
     * @param {boolean} append - If true, appends new questions to the existing list. Otherwise, replaces them.
     */
    const fetchQuestions = async (append = false) => {
        if (!topic.trim()) {
            setError("Please enter a topic to generate questions.");
            return;
        }
        setError("");
        append ? setLoadingMore(true) : setLoading(true);

        try {
            // URL for your Spring Boot backend.
            // For production, this should come from an environment variable.
            const backendApiUrl = 'http://localhost:8080/interview-questions/api/interview/generate';

            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic: topic })
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
            <div className="w-16 h-16 mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L12 5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L12 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12H2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12H19" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.0711 4.92896L16.9497 7.05029" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.05029 16.9497L4.92896 19.0711" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.0711 19.0711L16.9497 16.9497" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.05029 7.05029L4.92896 4.92896" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-700 text-center">PrepEdge AI</h1>
            <p className="text-slate-500 text-center">Preparing your interview toolkit...</p>
        </div>
    );

    // Question Card Component
    const QuestionCard = ({ q, index }) => (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-start gap-4">
                <div className="text-amber-500 font-bold text-lg sm:text-xl flex-shrink-0">Q{index + 1}</div>
                <div className="flex-grow">
                    <h2 className="font-semibold text-slate-800 text-base sm:text-lg mb-3">
                        {q.question}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{q.answer}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                        {q.difficulty}
                    </span>
                </div>
            </div>
        </div>
    );

    // Empty State Component (when no questions are loaded)
    const EmptyState = () => (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-slate-100 rounded-xl border border-dashed border-slate-300">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-base sm:text-lg font-medium text-slate-800">Ready to start?</h3>
            <p className="mt-1 text-sm text-slate-500">Enter a topic above and click "Generate" to see the magic happen.</p>
        </div>
    );

    // Loading Spinner Icon
    const Spinner = () => <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>;

    // --- MAIN RENDER ---

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12">
                {/* Header */}
                <header className="mb-8 sm:mb-10 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
                        PrepEdge{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                            AI
                        </span>
                    </h1>
                    <p className="text-slate-500 text-base sm:text-lg mt-2">
                        Your AI-powered assistant for acing technical interviews.
                    </p>
                </header>

                {/* Input Section */}
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
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                                        <span className="sm:inline">Generate</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {/* Example Topics */}
                        <div className="flex flex-wrap gap-2 justify-center mt-4 px-2">
                            {exampleTopics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setTopic(t);
                                    }}
                                    className="bg-slate-200 text-slate-600 text-xs sm:text-sm px-3 py-1 rounded-full hover:bg-slate-300 hover:text-slate-800 transition"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center mb-6 bg-red-100 p-3 rounded-lg mx-auto max-w-2xl">{error}</p>}

                {/* Content Area */}
                <main>
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner />
                        </div>
                    ) : questions.length > 0 ? (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {questions.map((q, idx) => (
                                <QuestionCard key={idx} q={q} index={idx} />
                            ))}
                        </div>
                    ) : (
                        !error && <EmptyState />
                    )}
                </main>

                {/* "Generate More" Button */}
                {questions.length > 0 && !loading && (
                    <footer className="flex justify-center mt-8 sm:mt-10">
                        <button
                            onClick={() => fetchQuestions(true)}
                            className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Spinner /> : "✨ Generate More"}
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
}
