import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoachingSession, SessionMetrics } from './types';
import { INITIAL_SESSIONS } from './initialData';
import MetricsScorecard from './components/MetricsScorecard';
import AIInsightsView from './components/AIInsightsView';
import PresentationMode from './components/PresentationMode';
import SessionEditor from './components/SessionEditor';
import {
  Users,
  Plus,
  Tv,
  Edit2,
  Trash2,
  Calendar,
  User,
  Printer,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  CheckSquare,
  Bookmark,
  Activity,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function App() {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [selectedTrainee, setSelectedTrainee] = useState<string>('Victor');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<CoachingSession | null>(null);
  const [viewTab, setViewTab] = useState<'details' | 'dashboard'>('details');

  // Load from local storage or set initial data
  useEffect(() => {
    const saved = localStorage.getItem('coaching_sessions_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          // Set first available trainee
          setSelectedTrainee(parsed[0].traineeName);
          return;
        }
      } catch (err) {
        console.error('Failed to parse local storage sessions:', err);
      }
    }
    setSessions(INITIAL_SESSIONS);
    setSelectedTrainee('Victor');
    localStorage.setItem('coaching_sessions_data', JSON.stringify(INITIAL_SESSIONS));
  }, []);

  // Update localStorage whenever sessions change
  const saveToLocalStorage = (updatedSessions: CoachingSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('coaching_sessions_data', JSON.stringify(updatedSessions));
  };

  // Get unique list of trainees
  const trainees: string[] = Array.from(new Set(sessions.map((s) => s.traineeName)));

  // Get current active sessions for selected trainee, sorted by date descending
  const activeTraineeSessions = sessions
    .filter((s) => s.traineeName === selectedTrainee)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Determine selected session
  const currentSession =
    activeTraineeSessions.find((s) => s.id === selectedSessionId) || activeTraineeSessions[0];

  // Sync selected session ID when trainee changes
  useEffect(() => {
    if (activeTraineeSessions.length > 0) {
      setSelectedSessionId(activeTraineeSessions[0].id);
    }
  }, [selectedTrainee, sessions]);

  // Handle adding or updating session
  const handleSaveSession = (savedSession: CoachingSession) => {
    let updated: CoachingSession[];
    const exists = sessions.some((s) => s.id === savedSession.id);
    
    if (exists) {
      updated = sessions.map((s) => (s.id === savedSession.id ? savedSession : s));
    } else {
      updated = [savedSession, ...sessions];
    }
    
    saveToLocalStorage(updated);
    setSelectedTrainee(savedSession.traineeName);
    setSelectedSessionId(savedSession.id);
    setShowEditor(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this coaching record?')) {
      const updated = sessions.filter((s) => s.id !== id);
      saveToLocalStorage(updated);
      
      // Select another trainee if current active one has no more sessions
      const remainingForActiveTrainee = updated.filter((s) => s.traineeName === selectedTrainee);
      if (remainingForActiveTrainee.length === 0 && updated.length > 0) {
        setSelectedTrainee(updated[0].traineeName);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate aggregated dashboard stats for the Team Leader
  const totalSessions = sessions.length;
  const avgMetrics: SessionMetrics = sessions.reduce(
    (acc, s) => {
      acc.scriptAdherence += s.metrics.scriptAdherence;
      acc.tonality += s.metrics.tonality;
      acc.conversationalFlow += s.metrics.conversationalFlow;
      acc.confidence += s.metrics.confidence;
      acc.pacing += s.metrics.pacing;
      return acc;
    },
    { scriptAdherence: 0, tonality: 0, conversationalFlow: 0, confidence: 0, pacing: 0 }
  );

  if (totalSessions > 0) {
    avgMetrics.scriptAdherence = Math.round(avgMetrics.scriptAdherence / totalSessions);
    avgMetrics.tonality = Math.round(avgMetrics.tonality / totalSessions);
    avgMetrics.conversationalFlow = Math.round(avgMetrics.conversationalFlow / totalSessions);
    avgMetrics.confidence = Math.round(avgMetrics.confidence / totalSessions);
    avgMetrics.pacing = Math.round(avgMetrics.pacing / totalSessions);
  }

  // Find top and bottom trainees based on aggregate confidence & tonality
  const traineeAggregates = trainees.map((name) => {
    const ts = sessions.filter((s) => s.traineeName === name);
    const sum = ts.reduce((acc, s) => acc + s.metrics.confidence + s.metrics.tonality, 0);
    return { name, avgScore: Math.round(sum / (ts.length * 2)) };
  });

  return (
    <div id="app-wrapper" className="min-h-screen bg-[#fdfcf9] text-[#1a1a1a] flex flex-col font-sans">
      {/* Visual styles for document printing */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #sidebar, #header-actions, #ai-insights-container, #print-control-row, #editor-modal-container {
            display: none !important;
          }
          #main-content {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: 1px solid #000000 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Main Corporate Header */}
      <header id="app-header" className="bg-[#fdfcf9] border-b border-black py-6 px-6 md:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sticky top-0 z-30 no-print">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Confidential Session Record</span>
          <h1 className="text-4xl font-serif italic font-light tracking-tighter text-[#1a1a1a] flex items-center gap-3">
            Coaching Insight.
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#f3f1eb] font-semibold border border-gray-300 text-gray-600 font-sans tracking-normal not-italic">
              Team Lead Mode
            </span>
          </h1>
          <p className="text-xs text-gray-500 font-serif italic mt-1">
            Calibrated sessions dashboard &bull; Flynn James Pontino
          </p>
        </div>

        {/* Global Action buttons */}
        <div id="header-actions" className="flex items-center gap-2">
          <button
            id="tl-overview-toggle-btn"
            onClick={() => setViewTab(viewTab === 'dashboard' ? 'details' : 'dashboard')}
            className={`px-4 py-2 rounded text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              viewTab === 'dashboard'
                ? 'bg-[#1a1a1a] text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-[#f3f1eb]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {viewTab === 'dashboard' ? 'Show Sessions' : 'Team Leader Analytics'}
          </button>

          {currentSession && (
            <button
              id="enter-presentation-mode-btn"
              onClick={() => setIsPresentationMode(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              Present to Team Leader
            </button>
          )}

          <button
            id="create-new-session-btn"
            onClick={() => {
              setEditingSession(null);
              setShowEditor(true);
            }}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Session
          </button>
        </div>
      </header>

      {/* Main App Layout Grid */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
        
        {/* Trainees Navigation Sidebar */}
        <aside id="sidebar" className="w-full lg:w-72 space-y-4 flex-shrink-0 no-print">
          
          {/* Section: Trainee Document tabs (mimicking Google Docs view from the image) */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-none">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-700" />
                Document Tabs
              </span>
              <span className="font-mono text-[9px] font-bold text-gray-600 bg-[#f3f1eb] border border-gray-200 px-2 py-0.5 rounded">
                {trainees.length} Active
              </span>
            </div>

            <div className="space-y-1">
              {trainees.map((name) => {
                const isSelected = selectedTrainee === name && viewTab === 'details';
                const totalForTrainee = sessions.filter((s) => s.traineeName === name).length;

                return (
                  <button
                    key={name}
                    id={`trainee-tab-${name}`}
                    onClick={() => {
                      setSelectedTrainee(name);
                      setViewTab('details');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded text-left text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1a1a] text-white border-black font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                      <span>{name} Trainee</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-black text-emerald-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {totalForTrainee} {totalForTrainee === 1 ? 'doc' : 'docs'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mini Insights quick view card */}
          <div className="bg-[#1a1a1a] text-white rounded p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400/10" />
              Quick Summary
            </h4>
            <p className="text-xs text-gray-300 font-serif italic leading-relaxed">
               Flynn's sessions are highly standardized. The average team calibration score is current at <strong className="text-white font-bold">{avgMetrics.confidence}%</strong> confidence with excellent receptive feedback.
            </p>
          </div>
        </aside>

        {/* Primary Viewstage */}
        <main id="main-content" className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* View 1: Detailed Trainee Coaching Session Document */}
            {viewTab === 'details' && (
              <motion.div
                key="details-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentSession ? (
                  <div className="space-y-6">
                    {/* Active Document Header card */}
                    <div className="bg-white border border-gray-200 rounded p-5 shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold uppercase tracking-widest">
                            {currentSession.status}
                          </span>
                          <span className="text-xs text-gray-400 font-medium flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-gray-500" />
                            {currentSession.date}
                          </span>
                        </div>
                        <h2 className="text-2xl font-serif text-[#1a1a1a] tracking-tight mt-1">
                          {currentSession.traineeName} Trainee Documentation
                        </h2>
                        <p className="text-xs text-gray-500">
                          Focus Area: <strong className="text-gray-800 font-serif italic">{currentSession.sessionType}</strong>
                        </p>
                      </div>

                      {/* Header controls for selected document */}
                      <div id="print-control-row" className="flex items-center gap-2 self-start sm:self-auto">
                        {activeTraineeSessions.length > 1 && (
                          <div className="flex items-center gap-1 bg-gray-100 rounded p-0.5 border border-gray-200">
                            {activeTraineeSessions.map((s, idx) => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedSessionId(s.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  currentSession.id === s.id
                                    ? 'bg-[#1a1a1a] text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                Doc {activeTraineeSessions.length - idx}
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          id="edit-session-btn"
                          onClick={() => {
                            setEditingSession(currentSession);
                            setShowEditor(true);
                          }}
                          className="p-2 hover:bg-[#f3f1eb] border border-gray-200 text-gray-500 hover:text-[#1a1a1a] rounded transition-all cursor-pointer"
                          title="Edit Document"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id="print-session-btn"
                          onClick={handlePrint}
                          className="p-2 hover:bg-[#f3f1eb] border border-gray-200 text-gray-500 hover:text-[#1a1a1a] rounded transition-all cursor-pointer"
                          title="Print Document"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          id="delete-session-btn"
                          onClick={() => handleDeleteSession(currentSession.id)}
                          className="p-2 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-rose-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Standardized layout blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left and Middle Content columns */}
                      <div className="md:col-span-2 space-y-6">
                        
                        {/* Summary Section */}
                        <div className="bg-white border border-gray-200 rounded p-6 shadow-none print-card">
                          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                            <Bookmark className="w-4 h-4 text-[#1a1a1a]" />
                            Coaching Summary:
                          </h3>
                          <p className="text-gray-800 text-sm leading-relaxed font-serif">
                            {currentSession.summary}
                          </p>
                        </div>

                        {/* Positive Feedback Section */}
                        <div className="bg-[#fcfdfa] border border-emerald-100 rounded p-6 shadow-none print-card">
                          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600 mb-3 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-emerald-600" />
                            01. Strengths observed
                          </h3>
                          <div className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-1">●</span>
                            <p className="text-sm leading-relaxed text-gray-800 font-serif italic">
                              {currentSession.positiveFeedback}
                            </p>
                          </div>
                        </div>

                        {/* Action Plan Section */}
                        <div className="bg-white border border-gray-200 rounded p-6 shadow-none print-card relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/30 opacity-50 rounded-bl-full pointer-events-none" />
                          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-600 mb-3 flex items-center gap-1.5">
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                            02. Growth Opportunities & Action Roadmap
                          </h3>
                          <div className="flex items-start gap-3">
                            <span className="text-amber-500 mt-1">●</span>
                            <p className="text-sm leading-relaxed text-gray-800 font-serif italic">
                              {currentSession.actionPlan}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Meta Column */}
                      <div className="space-y-6">
                        {/* Coach/Trainee Metadata Card */}
                        <div className="bg-white border border-gray-200 rounded p-5 shadow-none space-y-3.5 print-card">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Coachee Profile</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-[#f3f1eb] px-2 py-0.5 rounded border border-emerald-200/50">Official Calibration</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xl font-serif text-gray-900 mb-0.5">{currentSession.traineeName}</h4>
                              <p className="text-[11px] text-gray-500 uppercase tracking-wider">Representative Trainee</p>
                            </div>
                            
                            <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                              <div className="flex items-center gap-2.5">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Coach Signature: <strong className="text-gray-900 font-serif italic">{currentSession.coachName}</strong></span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Session Date: <strong className="text-gray-900 font-serif italic">{currentSession.date}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Coach's Remarks Card */}
                        <div className="bg-[#f3f1eb] border border-gray-200 rounded p-6 shadow-none italic relative print-card">
                          <div className="absolute top-0 right-0 p-4 text-gray-300 font-serif text-5xl leading-none font-bold select-none pointer-events-none">
                            &ldquo;
                          </div>
                          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2.5">
                            03. Coach's Remarks
                          </h3>
                          <p className="text-gray-700 text-xs leading-relaxed font-serif italic">
                            {currentSession.coachRemarks}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Integrated KPI Metrics section */}
                    <div className="bg-white border border-gray-200 rounded p-6 shadow-none print-card">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-[#1a1a1a]" />
                          Performance KPI Calibration
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">Evaluated out of 100%</span>
                      </div>
                      <MetricsScorecard metrics={currentSession.metrics} />
                    </div>

                    {/* AI Executive Insights module */}
                    <div className="no-print">
                      <AIInsightsView session={currentSession} />
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white border border-gray-200 rounded p-8 shadow-none">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-800">No Coaching Documentation Found</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Click the 'Record Session' button above to generate Flynn James Pontino's calibration worksheets.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* View 2: High-Level Team Leader Dashboard */}
            {viewTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Aggregate KPI Grid cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 p-5 rounded shadow-none">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Total Coaching Sheets</span>
                    <p className="text-3xl font-serif font-bold text-gray-900 mt-1">{totalSessions}</p>
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                      ● All sessions calibrated
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded shadow-none">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Unique Trainees</span>
                    <p className="text-3xl font-serif font-bold text-gray-900 mt-1">{trainees.length}</p>
                    <span className="text-[10px] text-gray-500 font-serif italic mt-1 block">
                      Active team roster
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded shadow-none">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Roster Average Score</span>
                    <p className="text-3xl font-serif font-bold text-gray-900 mt-1">
                      {totalSessions > 0
                        ? Math.round(
                            (avgMetrics.scriptAdherence +
                              avgMetrics.tonality +
                              avgMetrics.conversationalFlow +
                              avgMetrics.confidence +
                              avgMetrics.pacing) /
                              5
                          )
                        : 0}
                      %
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                      ● High Calibration Average
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded shadow-none">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Latest Calibration</span>
                    <p className="text-lg font-serif italic text-gray-900 mt-2 truncate">
                      {sessions[0]?.traineeName || 'N/A'}
                    </p>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      Dated {sessions[0]?.date || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Team Lead Aggregate KPIs */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-none">
                  <div className="flex items-end justify-between mb-6 border-b border-black pb-3">
                    <div>
                      <h3 className="text-xl font-serif text-gray-900 tracking-tight">Roster Core KPI Averages</h3>
                      <p className="text-xs text-gray-500">Aggregate scoring curves for all trainees combined.</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 px-2.5 py-1 border border-gray-200 rounded text-gray-700">
                      Operational Benchmarks
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Script Adherence', score: avgMetrics.scriptAdherence, color: 'bg-emerald-900' },
                      { label: 'Tonality & Mood', score: avgMetrics.tonality, color: 'bg-emerald-700' },
                      { label: 'Conversational Flow', score: avgMetrics.conversationalFlow, color: 'bg-amber-600' },
                      { label: 'Confidence & Demeanor', score: avgMetrics.confidence, color: 'bg-gray-800' },
                      { label: 'Pacing & Tempo', score: avgMetrics.pacing, color: 'bg-[#1a1a1a]' },
                    ].map((kpi, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-700 uppercase tracking-wider text-[10px]">{kpi.label}</span>
                          <span className="text-gray-900 font-serif font-bold text-sm">{kpi.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1 rounded-none overflow-hidden border border-gray-200/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${kpi.score}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`h-full ${kpi.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual comparison table */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-none overflow-hidden">
                  <h3 className="text-xl font-serif text-gray-900 tracking-tight mb-4">Trainee Comparison Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black text-[9px] font-bold uppercase tracking-widest text-gray-400">
                          <th className="py-3 px-4">Trainee</th>
                          <th className="py-3 px-4">Latest Session Date</th>
                          <th className="py-3 px-4">Confidence</th>
                          <th className="py-3 px-4">Tonality</th>
                          <th className="py-3 px-4">Script Adherence</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {traineeAggregates.map((item) => {
                          const traineeSessions = sessions.filter((s) => s.traineeName === item.name);
                          const latest = traineeSessions.sort(
                             (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                          )[0];

                          return (
                            <tr key={item.name} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-serif italic text-gray-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded bg-emerald-700" />
                                {item.name} Trainee
                              </td>
                              <td className="py-3.5 px-4 text-gray-500 font-mono">{latest?.date || 'N/A'}</td>
                              <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{latest?.metrics.confidence}%</td>
                              <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{latest?.metrics.tonality}%</td>
                              <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{latest?.metrics.scriptAdherence}%</td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  id={`comparative-view-btn-${item.name}`}
                                  onClick={() => {
                                    setSelectedTrainee(item.name);
                                    setViewTab('details');
                                  }}
                                  className="text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                                >
                                  View Docs
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Presentation Overlay */}
      <AnimatePresence>
        {isPresentationMode && currentSession && (
          <PresentationMode session={currentSession} onClose={() => setIsPresentationMode(false)} />
        )}
      </AnimatePresence>

      {/* Floating Session Recording Modal */}
      <AnimatePresence>
        {showEditor && (
          <SessionEditor
            session={editingSession || undefined}
            availableTrainees={trainees}
            onSave={handleSaveSession}
            onCancel={() => {
              setShowEditor(false);
              setEditingSession(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
