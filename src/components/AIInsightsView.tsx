import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoachingSession, AIInsights } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, RefreshCw, HelpCircle } from 'lucide-react';

interface AIInsightsViewProps {
  session: CoachingSession;
}

export default function AIInsightsView({ session }: AIInsightsViewProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Reset insights when switching sessions to encourage generating or showing the relevant ones
  useEffect(() => {
    setInsights(null);
    setError(null);
    setIsDemo(false);
  }, [session.id]);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Insights server.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setInsights(data.insights);
      setIsDemo(!!data.isDemoFallback);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while compiling AI insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-insights-container" className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 relative overflow-hidden text-[#1a1a1a]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-black pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-emerald-800" />
              Gemini Powered
            </span>
            {isDemo && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-200/60">
                Preview Model Active
              </span>
            )}
          </div>
          <h3 className="text-2xl font-serif text-[#1a1a1a] tracking-tight">AI Executive Briefing</h3>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Instantly synthesize a premium team-leader overview of Flynn James Pontino's session records.
          </p>
        </div>

        {!insights && !loading && (
          <button
            id="generate-insights-btn"
            onClick={generateInsights}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white animate-pulse" />
            Compile Briefing
          </button>
        )}

        {insights && !loading && (
          <button
            id="regenerate-insights-btn"
            onClick={generateInsights}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
            Refresh Briefing
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-100 border-t-emerald-600 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-800 font-serif">Analyzing raw text & metrics...</p>
              <p className="text-xs text-gray-500">Synthesizing leadership action items for your Team Leader</p>
            </div>

            {/* Shimmer placeholders */}
            <div className="w-full max-w-2xl mt-8 space-y-3 opacity-30">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
            </div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 my-4"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Analysis Failed</p>
              <p className="text-xs text-rose-700 mt-1 font-serif">{error}</p>
            </div>
          </motion.div>
        )}

        {!insights && !loading && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-300 rounded-lg bg-gray-50/50"
          >
            <Sparkles className="w-10 h-10 text-emerald-600/40 mb-3" />
            <h4 className="text-sm font-bold text-gray-800">Executive Briefing Awaiting Compilation</h4>
            <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
              Click 'Compile Briefing' above to turn Flynn's raw coaching summary and metrics into structured bullet points for your Team Leader.
            </p>
          </motion.div>
        )}

        {insights && !loading && !error && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 relative z-10"
          >
            {/* Executive Overview */}
            <div className="bg-[#f3f1eb] border border-gray-200 rounded-lg p-5">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-800 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-emerald-800/20" />
                01. Executive Summary (tl;dr)
              </h4>
              <p className="text-gray-800 text-sm leading-relaxed font-serif italic">
                {insights.executiveBriefing}
              </p>
            </div>

            {/* Strengths & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#fcfdfa] border border-emerald-100 rounded-lg p-5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-700 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  02. Key Strengths
                </h4>
                <ul className="space-y-2.5">
                  {insights.keyStrengths.map((strength, i) => (
                    <li key={i} className="text-gray-800 text-xs flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">●</span>
                      <span className="leading-relaxed font-sans">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#fcfdfa] border border-amber-100 rounded-lg p-5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-700 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  03. Operational Growth Risks
                </h4>
                <ul className="space-y-2.5">
                  {insights.riskAreas.map((risk, i) => (
                    <li key={i} className="text-gray-800 text-xs flex items-start gap-2">
                      <span className="text-amber-500 mt-1">●</span>
                      <span className="leading-relaxed font-sans">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practical Drills & Future Projection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  04. Recommended Action Drills
                </h4>
                <div className="space-y-3">
                  {insights.coachingTips.map((tip, i) => (
                    <div key={i} className="flex gap-2.5 items-start bg-[#f3f1eb]/40 p-2.5 rounded border border-gray-100">
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-[#1a1a1a] text-white font-mono text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-xs leading-relaxed font-serif italic">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#fcfdfa] border border-emerald-100 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-700 mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    05. 2-Week Target Trajectory
                  </h4>
                  <p className="text-gray-800 text-xs font-serif leading-relaxed italic">
                    {insights.projection}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-[9px] text-gray-400 uppercase tracking-widest">
                  Target projected based on metrics progression.
                </div>
              </div>
            </div>

            {/* Note on API setup */}
            {isDemo && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200/50 rounded text-xs text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Tip for Flynn:</strong> This is a beautifully synthesized mock report. To query real Gemini AI models live, open the <strong>Settings &gt; Secrets</strong> menu on the top-right and add your <strong>GEMINI_API_KEY</strong>.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
