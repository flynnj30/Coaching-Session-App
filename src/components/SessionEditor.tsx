import { useState, useEffect, FormEvent } from 'react';
import { CoachingSession, SessionMetrics, SessionStatus } from '../types';
import { X, Save, AlertCircle, PlusCircle, Sliders } from 'lucide-react';
import MetricsScorecard from './MetricsScorecard';

interface SessionEditorProps {
  session?: CoachingSession; // If provided, we are editing. Otherwise, creating new.
  onSave: (session: CoachingSession) => void;
  onCancel: () => void;
  availableTrainees: string[];
}

export default function SessionEditor({ session, onSave, onCancel, availableTrainees }: SessionEditorProps) {
  const [traineeName, setTraineeName] = useState('');
  const [customTrainee, setCustomTrainee] = useState('');
  const [isNewTrainee, setIsNewTrainee] = useState(false);
  
  const [sessionType, setSessionType] = useState('Mock Calls & Conversational Delivery');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [positiveFeedback, setPositiveFeedback] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [coachRemarks, setCoachRemarks] = useState('');
  const [status, setStatus] = useState<SessionStatus>('Completed');
  
  const [metrics, setMetrics] = useState<SessionMetrics>({
    scriptAdherence: 80,
    tonality: 80,
    conversationalFlow: 80,
    confidence: 80,
    pacing: 80
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setTraineeName(session.traineeName);
      setSessionType(session.sessionType);
      setDate(session.date);
      setSummary(session.summary);
      setPositiveFeedback(session.positiveFeedback);
      setActionPlan(session.actionPlan);
      setCoachRemarks(session.coachRemarks);
      setMetrics({ ...session.metrics });
      setStatus(session.status);
      setIsNewTrainee(false);
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      if (availableTrainees.length > 0) {
        setTraineeName(availableTrainees[0]);
      } else {
        setIsNewTrainee(true);
      }
    }
  }, [session, availableTrainees]);

  const handleUpdateMetric = (key: keyof SessionMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const activeTraineeName = isNewTrainee ? customTrainee.trim() : traineeName;

    if (!activeTraineeName) {
      setError('Trainee name is required.');
      return;
    }
    if (!sessionType.trim()) {
      setError('Session type / core focus is required.');
      return;
    }
    if (!date) {
      setError('Session date is required.');
      return;
    }
    if (!summary.trim()) {
      setError('Coaching summary is required.');
      return;
    }
    if (!positiveFeedback.trim()) {
      setError('Positive feedback is required.');
      return;
    }
    if (!actionPlan.trim()) {
      setError('Action plan is required.');
      return;
    }
    if (!coachRemarks.trim()) {
      setError("Coach's remarks are required.");
      return;
    }

    const savedSession: CoachingSession = {
      id: session?.id || `session-${Date.now()}`,
      coachName: session?.coachName || 'Flynn James Pontino',
      traineeName: activeTraineeName,
      date,
      sessionType,
      summary,
      positiveFeedback,
      actionPlan,
      coachRemarks,
      metrics,
      status
    };

    onSave(savedSession);
  };

  return (
    <div id="editor-modal-container" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div 
        id="editor-modal"
        className="bg-white rounded border border-gray-300 w-full max-w-4xl shadow-none flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#fdfcf9]">
          <div>
            <h3 className="text-xl font-serif text-gray-900 tracking-tight">
              {session ? 'Edit Session Record' : 'Record New Session'}
            </h3>
            <p className="text-xs text-gray-500 font-serif italic mt-0.5">
              Flynn James Pontino &bull; Standardized Calibration Sheet
            </p>
          </div>
          <button
            id="cancel-editor-btn-top"
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-start gap-2.5 font-serif italic">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Review Required Fields</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trainee */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Trainee Name
              </label>
              {isNewTrainee ? (
                <div className="flex gap-2">
                  <input
                    id="custom-trainee-input"
                    type="text"
                    value={customTrainee}
                    onChange={(e) => setCustomTrainee(e.target.value)}
                    placeholder="Enter trainee name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black transition-colors bg-white font-sans"
                  />
                  {availableTrainees.length > 0 && (
                    <button
                      id="select-existing-trainee-btn"
                      type="button"
                      onClick={() => setIsNewTrainee(false)}
                      className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-800 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    id="trainee-select"
                    value={traineeName}
                    onChange={(e) => setTraineeName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black transition-colors bg-white font-sans"
                  >
                    {availableTrainees.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <button
                    id="add-new-trainee-btn"
                    type="button"
                    onClick={() => setIsNewTrainee(true)}
                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-700 bg-[#f3f1eb] border border-gray-300 rounded hover:bg-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New
                  </button>
                </div>
              )}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Core Training Focus / Session Type
              </label>
              <input
                id="session-type-input"
                type="text"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                placeholder="e.g. Mock Calls & Script Calibration"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black transition-colors bg-white font-sans"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Session Date
              </label>
              <input
                id="session-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black transition-colors bg-white font-sans"
              />
            </div>
          </div>

          {/* Interactive KPI Sliders section */}
          <div className="bg-[#fcfdfa] rounded p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Performance KPI Calibration
              </h4>
            </div>
            <MetricsScorecard 
              metrics={metrics} 
              onUpdateMetric={handleUpdateMetric} 
              isEditable={true} 
            />
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coaching Summary */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Coaching Summary
              </label>
              <textarea
                id="summary-textarea"
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe the main objectives focused on today..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black bg-white leading-relaxed resize-none font-serif"
              />
            </div>

            {/* Positive Feedback */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Positive Feedback
              </label>
              <textarea
                id="positive-feedback-textarea"
                rows={4}
                value={positiveFeedback}
                onChange={(e) => setPositiveFeedback(e.target.value)}
                placeholder="Highlight what the trainee did well, strengths shown..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black bg-white leading-relaxed resize-none font-serif"
              />
            </div>

            {/* Action Plan */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Action Plan &amp; Roadmap
              </label>
              <textarea
                id="action-plan-textarea"
                rows={4}
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder="Specify precise practice exercises, rules, or live-call adjustments..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black bg-white leading-relaxed resize-none font-serif"
              />
            </div>

            {/* Coach's Remarks */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Coach's Remarks &amp; Closing Words
              </label>
              <textarea
                id="coach-remarks-textarea"
                rows={4}
                value={coachRemarks}
                onChange={(e) => setCoachRemarks(e.target.value)}
                placeholder="Add supportive closing thoughts and encouragement..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black bg-white leading-relaxed resize-none font-serif italic text-gray-700"
              />
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-5">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
              <div className="flex gap-2 mt-1">
                {(['Completed', 'Draft', 'Pending Review'] as SessionStatus[]).map(s => (
                  <button
                    key={s}
                    id={`status-select-btn-${s}`}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border cursor-pointer ${
                      status === s 
                        ? 'bg-[#1a1a1a] text-white border-black font-bold shadow-xs'
                        : 'bg-white text-gray-500 border-gray-300 hover:bg-[#f3f1eb]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-[#fdfcf9]">
          <button
            id="cancel-editor-btn-bottom"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-editor-btn"
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Session
          </button>
        </div>
      </div>
    </div>
  );
}
