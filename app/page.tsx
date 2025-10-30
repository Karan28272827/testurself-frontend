// "use client";

// import { useState, useEffect } from "react";

// type Evaluation = {
//   is_correct: boolean;
//   justification: string;
// };

// type QuestionHistoryItem = {
//   question: string;
//   userAnswer: string;
//   evaluation: Evaluation;
// };

// export default function HomePage() {
//   const [currentQuestion, setCurrentQuestion] = useState<string>("");
//   const [userAnswer, setUserAnswer] = useState<string>("");
//   const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>([]);
//   const [generatingQuestion, setGeneratingQuestion] = useState<boolean>(false);
//   const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
//   const [showConfetti, setShowConfetti] = useState<boolean>(false);

//   useEffect(() => {
//     if (showConfetti) {
//       const timer = setTimeout(() => setShowConfetti(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showConfetti]);
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

//   const generateQuestion = async () => {
//     setGeneratingQuestion(true);
//     setEvaluation(null);
//     setUserAnswer("");

//     try {
//       const res = await fetch(`${API_URL}/generate-question`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
      
//       if (!res.ok) throw new Error("Failed to generate question");
      
//       const data = await res.json();
//       setCurrentQuestion(data.question);
//     } catch (error) {
//       console.error(error);
//       alert("Error generating question. Please try again.");
//     } finally {
//       setGeneratingQuestion(false);
//     }
//   };

//   const submitAnswer = async () => {
//     if (!userAnswer.trim()) {
//       alert("Please provide an answer");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_URL}/evaluate-answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: currentQuestion,
//           user_answer: userAnswer,
//         }),
//       });
      
//       if (!res.ok) throw new Error("Failed to evaluate answer");
      
//       const data: Evaluation = await res.json();
//       setEvaluation(data);
      
//       // Update score
//       const newScore = {
//         correct: score.correct + (data.is_correct ? 1 : 0),
//         total: score.total + 1
//       };
//       setScore(newScore);
      
//       if (data.is_correct) {
//         setShowConfetti(true);
//       }
      
//       // Add to history
//       setQuestionHistory(prev => [...prev, {
//         question: currentQuestion,
//         userAnswer: userAnswer,
//         evaluation: data
//       }]);
//     } catch (error) {
//       console.error(error);
//       alert("Error evaluating answer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextQuestion = () => {
//     setCurrentQuestion("");
//     setUserAnswer("");
//     setEvaluation(null);
//     generateQuestion();
//   };

//   const resetQuiz = () => {
//     setCurrentQuestion("");
//     setUserAnswer("");
//     setEvaluation(null);
//     setQuestionHistory([]);
//     setScore({ correct: 0, total: 0 });
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && e.ctrlKey && !loading) {
//       e.preventDefault();
//       submitAnswer();
//     }
//   };

//   const getScorePercentage = () => {
//     if (score.total === 0) return 0;
//     return Math.round((score.correct / score.total) * 100);
//   };

//   const getScoreColor = () => {
//     const percentage = getScorePercentage();
//     if (percentage >= 80) return "text-green-400";
//     if (percentage >= 60) return "text-yellow-400";
//     return "text-red-400";
//   };

//   return (
//     <main className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Confetti Effect */}
//       {showConfetti && (
//         <div className="fixed inset-0 pointer-events-none z-50">
//           {[...Array(50)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute animate-confetti"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `-20px`,
//                 animationDelay: `${Math.random() * 0.5}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`
//               }}
//             >
//               {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-8 animate-fade-in">
//           <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
//             Autonex
//           </h1>
//           <p className="text-gray-300 text-lg">🎓 Test your knowledge with AI-powered questions</p>
//         </div>

//         {/* Score Dashboard */}
//         {score.total > 0 && (
//           <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
//             <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
//               <div className="text-4xl font-bold text-white mb-2">{score.correct}</div>
//               <div className="text-green-400 text-sm">Correct Answers</div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
//               <div className="text-4xl font-bold text-white mb-2">{score.total}</div>
//               <div className="text-blue-400 text-sm">Total Questions</div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
//               <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
//                 {getScorePercentage()}%
//               </div>
//               <div className="text-purple-400 text-sm">Success Rate</div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="bg-white/10 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl border border-white/20 animate-slide-up">
//           {!currentQuestion ? (
//             <div className="text-center py-12">
//               <div className="mb-8 animate-bounce-slow">
//                 <div className="text-8xl mb-6">📚</div>
//                 <h2 className="text-2xl font-bold text-white mb-3">Ready to Learn?</h2>
//                 <p className="text-gray-300 mb-8 max-w-md mx-auto">
//                   Click the button below to generate a question from the document and test your knowledge!
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={generateQuestion}
//                   disabled={generatingQuestion}
//                   className="group bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-lg hover:shadow-purple-500/50"
//                 >
//                   {generatingQuestion ? (
//                     <span className="flex items-center gap-3 justify-center">
//                       <span className="animate-spin">⚡</span>
//                       Generating Question...
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-3 justify-center">
//                       Generate Question
//                       <span className="group-hover:translate-x-1 transition-transform">→</span>
//                     </span>
//                   )}
//                 </button>
//                 {score.total > 0 && (
//                   <button
//                     onClick={resetQuiz}
//                     className="bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-5 rounded-2xl transition-all duration-300 border border-white/20"
//                   >
//                     Reset Quiz
//                   </button>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6 animate-fade-in">
//               {/* Question Card */}
//               <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400/40 p-8 rounded-2xl shadow-xl transform hover:scale-[1.01] transition-transform">
//                 <div className="flex items-start gap-4">
//                   <div className="text-4xl animate-pulse">❓</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-4">
//                       <h3 className="text-purple-300 font-bold text-lg">Question {score.total + 1}</h3>
//                       <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">
//                         New
//                       </span>
//                     </div>
//                     <p className="text-white text-xl leading-relaxed">{currentQuestion}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Answer Section */}
//               {!evaluation ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="text-gray-200 font-semibold text-lg flex items-center gap-2">
//                       <span>✍️</span> Your Answer:
//                     </label>
//                     <span className="text-xs text-gray-400">Press Ctrl+Enter to submit</span>
//                   </div>
//                   <textarea
//                     className="w-full p-5 rounded-2xl bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-purple-500/50 transition-all resize-none border border-white/10 text-lg"
//                     rows={5}
//                     placeholder="Type your answer here..."
//                     value={userAnswer}
//                     onChange={(e) => setUserAnswer(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     disabled={loading}
//                   />
//                   <button
//                     onClick={submitAnswer}
//                     disabled={loading || !userAnswer.trim()}
//                     className="group bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl w-full hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-lg hover:shadow-purple-500/50"
//                   >
//                     {loading ? (
//                       <span className="flex items-center gap-3 justify-center">
//                         <span className="animate-spin">🔄</span>
//                         Evaluating Your Answer...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-3 justify-center">
//                         Submit Answer
//                         <span className="group-hover:translate-x-1 transition-transform">✓</span>
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-5 animate-fade-in">
//                   {/* Result Card */}
//                   <div className={`p-8 rounded-2xl border-3 shadow-2xl transform hover:scale-[1.01] transition-all ${
//                     evaluation.is_correct 
//                       ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/60" 
//                       : "bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/60"
//                   }`}>
//                     <div className="flex items-center gap-4 mb-6">
//                       <div className={`text-6xl ${evaluation.is_correct ? 'animate-bounce-slow' : 'animate-shake'}`}>
//                         {evaluation.is_correct ? "🎉" : "💡"}
//                       </div>
//                       <div>
//                         <h3 className={`text-3xl font-bold ${
//                           evaluation.is_correct ? "text-green-300" : "text-red-300"
//                         }`}>
//                           {evaluation.is_correct ? "Excellent!" : "Not Quite!"}
//                         </h3>
//                         <p className="text-white/80 text-sm mt-1">
//                           {evaluation.is_correct ? "You got it right!" : "Let's learn from this"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="bg-black/20 p-5 rounded-xl border border-white/10">
//                         <p className="text-gray-300 text-sm mb-2 font-semibold">📝 Your answer:</p>
//                         <p className="text-white leading-relaxed">{userAnswer}</p>
//                       </div>

//                       <div className="bg-black/20 p-5 rounded-xl border border-white/10">
//                         <p className="text-gray-300 text-sm mb-3 font-semibold">
//                           {evaluation.is_correct ? "🌟 Great job! Here's why:" : "📖 Here's the explanation:"}
//                         </p>
//                         <p className="text-white leading-relaxed text-lg">{evaluation.justification}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={nextQuestion}
//                     className="group bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl w-full hover:scale-[1.02] transition-all duration-300 text-lg shadow-lg hover:shadow-purple-500/50"
//                   >
//                     <span className="flex items-center gap-3 justify-center">
//                       Next Question
//                       <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
//                     </span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Question History */}
//         {questionHistory.length > 0 && (
//           <div className="mt-8 bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 animate-slide-up">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//                 <span>📊</span> Question History
//               </h2>
//               <span className="px-4 py-2 bg-purple-500/30 rounded-full text-sm text-purple-200 font-semibold">
//                 {questionHistory.length} {questionHistory.length === 1 ? 'Question' : 'Questions'}
//               </span>
//             </div>
//             <div className="grid gap-3">
//               {questionHistory.slice().reverse().map((item, idx) => (
//                 <div 
//                   key={idx}
//                   className={`group p-5 rounded-xl border-2 transition-all hover:scale-[1.01] cursor-pointer ${
//                     item.evaluation.is_correct
//                       ? "bg-green-500/10 border-green-400/40 hover:bg-green-500/20"
//                       : "bg-red-500/10 border-red-400/40 hover:bg-red-500/20"
//                   }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0">
//                       <span className="text-2xl">
//                         {item.evaluation.is_correct ? "✅" : "❌"}
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className={`font-bold ${
//                           item.evaluation.is_correct ? "text-green-300" : "text-red-300"
//                         }`}>
//                           Question {questionHistory.length - idx}
//                         </span>
//                         <span className="text-gray-400 text-xs">
//                           {item.evaluation.is_correct ? "Correct" : "Incorrect"}
//                         </span>
//                       </div>
//                       <p className="text-white/90 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
//                         {item.question}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -50px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(50px, 50px) scale(1.05); }
//         }
//         @keyframes confetti {
//           0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes bounce-slow {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//         .animation-delay-4000 { animation-delay: 4s; }
//         .animate-confetti { animation: confetti forwards; }
//         .animate-fade-in { animation: fade-in 0.5s ease-out; }
//         .animate-slide-up { animation: slide-up 0.5s ease-out; }
//         .animate-bounce-slow { animation: bounce-slow 2s infinite; }
//         .animate-shake { animation: shake 0.5s; }
//       `}</style>
//     </main>
//   );
// }

"use client";
import { useState, useEffect } from "react";

type Evaluation = {
  is_correct: boolean;
  justification: string;
};

type QuestionHistoryItem = {
  question: string;
  userAnswer: string;
  evaluation: Evaluation;
};

type QA = { q: string; a: string };

export default function HomePage() {
  const [allQuestions, setAllQuestions] = useState<QA[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>([]);
  const [generatingQuestion, setGeneratingQuestion] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Fetch all questions (objective + subjective) from backend
  const fetchAllQuestions = async () => {
    setGeneratingQuestion(true);
    setEvaluation(null);
    setUserAnswer("");
    setScore({ correct: 0, total: 0 });
    setQuestionHistory([]);
    try {
      const doc_url = "https://docs.google.com/document/d/e/2PACX-1vRDhzz4MkIcq45HkSgQzQYmaC77ta88GgnQQ7Q4L26UW9OiC7IC-4cwuVVv1g98ss-cEl3LLLtYB_i_/pub?output=txt";
      const res = await fetch(
        `${API_URL}/generate-from-doc?doc_url=${encodeURIComponent(doc_url)}`
      );
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      const text = data.generated_questions || "";

      // Parse questions from DeepSeek LLM output
      const regex = /\d+\.\s*Question[:\-]?\s*([^(\n]+)\nAnswer:\s*([^\n]+)/gi;
      let match, parsed: QA[] = [];
      while ((match = regex.exec(text)) !== null) {
        parsed.push({ q: match[1].trim(), a: match[2].trim() });
      }
      setAllQuestions(parsed);
      setQuestionIndex(0);
      if (parsed.length > 0) {
        setCurrentQuestion(parsed[0].q);
        setCurrentAnswer(parsed[0].a);
      } else {
        setCurrentQuestion("");
        setCurrentAnswer("");
      }
    } catch (error) {
      alert("Error loading questions. Try again!");
    } finally {
      setGeneratingQuestion(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Please provide an answer");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          user_answer: userAnswer,
        }),
      });
      if (!res.ok) throw new Error("Failed to evaluate answer");
      const data: Evaluation = await res.json();
      setEvaluation(data);
      const newScore = {
        correct: score.correct + (data.is_correct ? 1 : 0),
        total: score.total + 1,
      };
      setScore(newScore);
      if (data.is_correct) {
        setShowConfetti(true);
      }
      setQuestionHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          userAnswer: userAnswer,
          evaluation: data,
        },
      ]);
    } catch (error) {
      alert("Error evaluating answer. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    const nextIdx = questionIndex + 1;
    if (allQuestions.length > nextIdx) {
      setQuestionIndex(nextIdx);
      setCurrentQuestion(allQuestions[nextIdx].q);
      setCurrentAnswer(allQuestions[nextIdx].a);
      setUserAnswer("");
      setEvaluation(null);
    } else {
      setCurrentQuestion("");
      setUserAnswer("");
      setEvaluation(null);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion("");
    setUserAnswer("");
    setEvaluation(null);
    setQuestionHistory([]);
    setScore({ correct: 0, total: 0 });
    setQuestionIndex(0);
    setAllQuestions([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const getScorePercentage = () => {
    if (score.total === 0) return 0;
    return Math.round((score.correct / score.total) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-black";
    if (percentage >= 60) return "text-gray-600";
    return "text-gray-400";
  };

  return (
    <main className="min-h-screen p-4 md:p-6 bg-black text-white relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 animate-slick">
            Autonex
          </h1>
          <p className="text-gray-200 text-lg">
            Test your knowledge with AI-powered questions
          </p>
        </div>

        {score.total > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {score.correct}
              </div>
              <div className="text-black text-sm">Correct Answers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {score.total}
              </div>
              <div className="text-black text-sm">Total Questions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
                {getScorePercentage()}%
              </div>
              <div className="text-black text-sm">Success Rate</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl border border-white/20">
          {!currentQuestion ? (
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="text-8xl mb-6">📝</div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Ready to Learn?
                </h2>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Click the button below to load all questions from the doc and
                  test your knowledge!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={fetchAllQuestions}
                  disabled={generatingQuestion}
                  className="group bg-black text-white font-semibold px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-lg hover:shadow-gray-800"
                >
                  {generatingQuestion ? (
                    <span className="flex items-center gap-3 justify-center">
                      <span className="animate-spin">⚡</span>
                      Getting All Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3 justify-center">
                      Load Questions
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  )}
                </button>
                {score.total > 0 && (
                  <button
                    onClick={resetQuiz}
                    className="bg-white/10 hover:bg-white/20 text-black font-semibold px-10 py-5 rounded-2xl transition-all duration-300 border border-white/20"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Card */}
              <div className="bg-black border-2 border-white p-8 rounded-2xl shadow-xl transform hover:scale-[1.01] transition-transform">
                <div className="flex items-start gap-4">
                  <div className="text-4xl animate-pulse">❓</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-gray-300 font-bold text-lg">
                        Question {questionIndex + 1}
                      </h3>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                        New
                      </span>
                    </div>
                    <p className="text-white text-xl leading-relaxed">
                      {currentQuestion}
                    </p>
                  </div>
                </div>
              </div>
              {/* Answer Section */}
              {!evaluation ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-200 font-semibold text-lg flex items-center gap-2">
                      <span>✍️</span> Your Answer:
                    </label>
                    <span className="text-xs text-gray-400">
                      Press Ctrl+Enter to submit
                    </span>
                  </div>
                  <textarea
                    className="w-full p-5 rounded-2xl bg-black text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-gray-500/50 transition-all resize-none border border-white/10 text-lg"
                    rows={5}
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={loading || !userAnswer.trim()}
                    className="group bg-black text-white font-bold px-8 py-4 rounded-2xl w-full hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-lg hover:shadow-gray-800"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3 justify-center">
                        <span className="animate-spin">🔄</span>
                        Evaluating Your Answer...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3 justify-center">
                        Submit Answer
                        <span className="group-hover:translate-x-1 transition-transform">
                          ✓
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Result Card */}
                  <div
                    className={`p-8 rounded-2xl border-3 shadow-2xl transform hover:scale-[1.01] transition-all ${
                      evaluation.is_correct
                        ? "bg-white border-black"
                        : "bg-black border-white"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`text-6xl ${
                          evaluation.is_correct
                            ? "animate-bounce-slow"
                            : "animate-shake"
                        }`}
                      >
                        {evaluation.is_correct ? "🎉" : "💡"}
                      </div>
                      <div>
                        <h3
                          className={`text-3xl font-bold ${
                            evaluation.is_correct
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {evaluation.is_correct ? "Excellent!" : "Not Quite!"}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {evaluation.is_correct
                            ? "You got it right!"
                            : "Let's learn from this"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-black/40 p-5 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm mb-2 font-semibold">
                          📝 Your answer:
                        </p>
                        <p className="text-white leading-relaxed">
                          {userAnswer}
                        </p>
                      </div>
                      {/* Show reference answer */}
                      <div className="bg-black/40 p-5 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm mb-3 font-semibold">
                          Correct/Reference Answer:
                        </p>
                        <p className="text-white leading-relaxed text-lg">
                          {currentAnswer}
                        </p>
                      </div>
                      <div className="bg-black/40 p-5 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm mb-3 font-semibold">
                          {evaluation.is_correct
                            ? "🌟 Great job! Here's why:"
                            : "📖 Here's the explanation:"}
                        </p>
                        <p className="text-white leading-relaxed text-lg">
                          {evaluation.justification}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="group bg-black text-white font-bold px-8 py-4 rounded-2xl w-full hover:scale-[1.02] transition-all duration-300 text-lg shadow-lg hover:shadow-gray-800"
                  >
                    <span className="flex items-center gap-3 justify-center">
                      Next Question
                      <span className="group-hover:translate-x-2 transition-transform text-xl">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question History */}
        {questionHistory.length > 0 && (
          <div className="mt-8 bg-black/80 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>📊</span> Question History
              </h2>
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-200 font-semibold">
                {questionHistory.length}{" "}
                {questionHistory.length === 1 ? "Question" : "Questions"}
              </span>
            </div>
            <div className="grid gap-3">
              {questionHistory
                .slice()
                .reverse()
                .map((item, idx) => (
                  <div
                    key={idx}
                    className={`group p-5 rounded-xl border-2 transition-all hover:scale-[1.01] cursor-pointer ${
                      item.evaluation.is_correct
                        ? "bg-white/10 border-black hover:bg-white/20"
                        : "bg-black/10 border-white hover:bg-black/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">
                          {item.evaluation.is_correct ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`font-bold ${
                              item.evaluation.is_correct
                                ? "text-black"
                                : "text-white"
                            }`}
                          >
                            Question {questionHistory.length - idx}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {item.evaluation.is_correct
                              ? "Correct"
                              : "Incorrect"}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                          {item.question}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slick {
          0% {
            letter-spacing: 0.2em;
            opacity: 0;
            transform: translateY(-20px);
          }
          60% {
            letter-spacing: 0em;
            opacity: 0.7;
            transform: translateY(10px);
          }
          100% {
            letter-spacing: 0em;
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slick {
          animation: slick 1.5s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </main>
  );
}
