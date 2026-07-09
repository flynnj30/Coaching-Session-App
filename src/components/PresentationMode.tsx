import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoachingSession, AIInsights } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  FileText,
  CheckCircle,
  TrendingUp,
  Award,
  Sparkles,
  BarChart2,
  Calendar,
  User,
  Zap,
} from 'lucide-react';

interface PresentationModeProps {
  session: CoachingSession;
  onClose: () => void;
}

export default function PresentationMode({ session, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const slidesCount = aiInsights ? 6 : 5;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(prev + 1, slidesCount - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slidesCount, onClose]);

  const loadAIInsights = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights);
        setCurrentSlide(5); // Go directly to the AI slide
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slidesCount - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  // Visual background depending on slide
  const slideBackgrounds = [
    'bg-[#fdfcf9]', // Slide 1
    'bg-[#fcfdfa]', // Slide 2
    'bg-[#fdfcf9]', // Slide 3
    'bg-[#fcfdfa]', // Slide 4
    'bg-[#fdfcf9]', // Slide 5
    'bg-[#fcfdfa]', // Slide 6 (AI Insights)
  ];

  return (
    <div
      id="presentation-overlay"
      className={`fixed inset-0 z-50 ${slideBackgrounds[currentSlide]} text-[#1a1a1a] flex flex-col justify-between p-6 md:p-12 transition-all duration-700 ease-in-out border-8 border-[#1a1a1a]`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-black pb-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-800" />
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
              Coaching Presentation Mode
            </h2>
            <p className="text-xs text-[#1a1a1a] font-serif italic">
              Flynn James Pontino &rarr; {session.traineeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f3f1eb] text-gray-700 px-3 py-1.5 rounded border border-gray-300">
            Slide {currentSlide + 1} of {slidesCount}
          </span>
          <button
            id="close-presentation-btn"
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 text-gray-700 hover:text-black rounded border border-gray-300 transition-all cursor-pointer"
            title="Exit Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 my-6 flex items-center justify-center max-w-5xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8 py-10"
            >
              <div className="inline-flex p-4 rounded bg-[#f3f1eb] border border-gray-300 text-emerald-800 mb-2">
                <Maximize2 className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none text-gray-950">
                  Coaching Performance <br />Documentation.
                </h1>
                <p className="text-sm text-gray-500 font-serif italic max-w-xl mx-auto mt-4">
                  A high-fidelity structured summary mapping development, KPIs, and trajectory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-black text-left">
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Coach Signature</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-serif italic font-bold text-gray-900">{session.coachName}</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Trainee Roster</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-serif italic font-bold text-gray-900">{session.traineeName}</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Calibration Date</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-mono font-bold text-gray-900">{session.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center w-full"
            >
              <div className="md:col-span-1 space-y-4">
                <div className="w-12 h-12 rounded bg-[#f3f1eb] border border-gray-300 flex items-center justify-center text-emerald-800">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-serif tracking-tight text-gray-900">
                  Coaching Summary
                </h2>
                <p className="text-sm text-gray-500">
                  Overview of core training objectives, focus vectors, and performance during roleplays and live workshops.
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold border border-gray-200 text-gray-700 font-serif italic">
                    {session.sessionType}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 bg-white border border-gray-200 rounded p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Objective Context
                </div>
                <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-serif italic">
                  &ldquo;{session.summary}&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 w-full"
            >
              <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
                <div className="inline-flex p-3 rounded bg-[#f3f1eb] border border-gray-300 text-emerald-800">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-serif tracking-tight text-gray-900">Performance Scorecard</h2>
                <p className="text-sm text-gray-500">
                  Core KPI metrics evaluated based on today's performance calibration metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: 'Script Adherence', val: session.metrics.scriptAdherence, color: 'stroke-emerald-950' },
                  { label: 'Tonality', val: session.metrics.tonality, color: 'stroke-emerald-800' },
                  { label: 'Conversational Flow', val: session.metrics.conversationalFlow, color: 'stroke-amber-600' },
                  { label: 'Confidence', val: session.metrics.confidence, color: 'stroke-gray-800' },
                  { label: 'Pacing & Tempo', val: session.metrics.pacing, color: 'stroke-black' },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-5 rounded text-center flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-4">
                      {kpi.label}
                    </span>
                    <div className="relative inline-flex items-center justify-center my-3">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#f3f1eb" strokeWidth="6" fill="transparent" />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="40"
                          className={kpi.color}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - kpi.val / 100) }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </svg>
                      <span className="absolute text-xl font-serif font-bold tracking-tight">{kpi.val}%</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-2">Target &gt; 85%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center w-full"
            >
              <div className="md:col-span-1 space-y-4">
                <div className="w-12 h-12 rounded bg-[#f3f1eb] border border-gray-300 flex items-center justify-center text-emerald-800">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-serif tracking-tight text-gray-900">
                  Strengths observed
                </h2>
                <p className="text-sm text-gray-500">
                  Demonstrated excellence, receptive traits, and behavioral strengths that serve as Flynn's calibrated foundation.
                </p>
              </div>

              <div className="md:col-span-2 bg-white border border-gray-200 rounded p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded border-b border-l border-emerald-200 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> High Performer Vector
                </div>
                <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-serif italic">
                  {session.positiveFeedback}
                </p>
              </div>
            </motion.div>
          )}

          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
            >
              <div className="bg-white border border-gray-200 rounded p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-[#1a1a1a]" />
                    <h3 className="text-lg font-serif text-gray-900 font-bold">Action Plan (Target Roadmap)</h3>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed font-serif italic">
                    {session.actionPlan}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
                  <span>Calibrated drills</span>
                  <span className="font-mono bg-gray-100 px-2.5 py-1 rounded">Daily review</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-lg font-serif text-gray-900 font-bold">Coach's Remarks</h3>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed font-serif italic">
                    &ldquo;{session.coachRemarks}&rdquo;
                  </p>
                </div>

                {!aiInsights && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider text-center sm:text-left">
                      Reveal AI Executive summary
                    </span>
                    <button
                      id="presentation-compile-briefing-btn"
                      onClick={loadAIInsights}
                      disabled={loadingAI}
                      className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center cursor-pointer"
                    >
                      {loadingAI ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 fill-white" />
                          Compile Briefing
                        </>
                      )}
                    </button>
                  </div>
                )}

                {aiInsights && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      id="go-to-ai-slide-btn"
                      onClick={() => setCurrentSlide(5)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      View Executive Briefing &rarr;
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentSlide === 5 && aiInsights && (
            <motion.div
              key="slide-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 w-full text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-800" />
                <h2 className="text-3xl font-serif tracking-tight text-gray-900">AI Executive Briefing</h2>
              </div>

              {/* Briefing */}
              <div className="bg-[#f3f1eb] border border-gray-200 p-5 rounded">
                <p className="text-gray-800 text-sm md:text-base leading-relaxed font-serif italic">
                  {aiInsights.executiveBriefing}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths & Risks */}
                <div className="bg-white border border-gray-200 p-5 rounded space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <CheckCircle className="w-4 h-4" /> Core Growth Drivers
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.keyStrengths.map((str, i) => (
                      <li key={i} className="text-gray-800 text-xs flex items-start gap-2 leading-relaxed font-sans">
                        <span className="text-emerald-500 mt-1">●</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Zap className="w-4 h-4 text-amber-600" /> Focus Development Risks
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.riskAreas.map((risk, i) => (
                      <li key={i} className="text-gray-800 text-xs flex items-start gap-2 leading-relaxed font-sans">
                        <span className="text-amber-500 mt-1">●</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action drill */}
              <div className="bg-white border border-gray-200 p-5 rounded flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                    2-Week Predicted Outcome
                  </h4>
                  <p className="text-gray-700 text-xs leading-relaxed max-w-2xl font-serif italic">
                    {aiInsights.projection}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider text-center flex-shrink-0">
                  Calibration Level: Optimal
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-black pt-4 max-w-5xl mx-auto w-full">
        <button
          id="prev-slide-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-30 text-gray-700 hover:text-black rounded border border-gray-300 transition-all flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: slidesCount }).map((_, i) => (
            <button
              key={i}
              id={`slide-dot-btn-${i}`}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded transition-all cursor-pointer ${
                currentSlide === i ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {currentSlide === slidesCount - 1 ? (
          <button
            id="finish-presentation-btn"
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Finish &amp; Exit
          </button>
        ) : (
          <button
            id="next-slide-btn"
            onClick={nextSlide}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 hover:text-black rounded border border-gray-300 transition-all flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
