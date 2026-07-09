export interface SessionMetrics {
  scriptAdherence: number; // 0 to 100
  tonality: number;        // 0 to 100
  conversationalFlow: number; // 0 to 100
  confidence: number;      // 0 to 100
  pacing: number;          // 0 to 100
}

export type SessionStatus = 'Draft' | 'Completed' | 'Pending Review';

export interface CoachingSession {
  id: string;
  coachName: string;
  traineeName: string;
  date: string; // YYYY-MM-DD
  sessionType: string; // e.g. 'Mock Calls', 'Objection Handling', 'Closing Techniques'
  summary: string;
  positiveFeedback: string;
  actionPlan: string;
  coachRemarks: string;
  metrics: SessionMetrics;
  status: SessionStatus;
}

export interface AIInsights {
  executiveBriefing: string;
  keyStrengths: string[];
  riskAreas: string[];
  coachingTips: string[];
  projection: string;
}
