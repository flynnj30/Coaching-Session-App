import { motion } from 'motion/react';
import { SessionMetrics } from '../types';
import { FileCheck, Music, Sparkles, MessageSquare, Hourglass } from 'lucide-react';

interface MetricsScorecardProps {
  metrics: SessionMetrics;
  onUpdateMetric?: (key: keyof SessionMetrics, value: number) => void;
  isEditable?: boolean;
}

export default function MetricsScorecard({ metrics, onUpdateMetric, isEditable = false }: MetricsScorecardProps) {
  const metricItems = [
    {
      key: 'scriptAdherence' as keyof SessionMetrics,
      label: 'Script Adherence',
      description: 'Follows structured call flow and guidelines',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      icon: FileCheck,
    },
    {
      key: 'tonality' as keyof SessionMetrics,
      label: 'Tonality & Mood',
      description: 'Warm, helpful, curious, and welcoming',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      icon: Music,
    },
    {
      key: 'conversationalFlow' as keyof SessionMetrics,
      label: 'Conversational Flow',
      description: 'Natural dialogue without sounding overly sales-focused',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      icon: MessageSquare,
    },
    {
      key: 'confidence' as keyof SessionMetrics,
      label: 'Confidence & Demeanor',
      description: 'Shows assertion and conviction in introduction',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      icon: Sparkles,
    },
    {
      key: 'pacing' as keyof SessionMetrics,
      label: 'Pacing & Tempo',
      description: 'Maintains slower, deliberate speaking speed',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      icon: Hourglass,
    },
  ];

  return (
    <div id="metrics-card-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricItems.map((item) => {
        const value = metrics[item.key] || 0;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.key}
            id={`metric-card-${item.key}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:border-gray-400 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded bg-[#f3f1eb] ${item.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  KPI Metric
                </span>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">{item.label}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-normal font-serif italic min-h-[32px]">{item.description}</p>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-serif text-[#1a1a1a] tracking-tight">{value}%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Score</span>
              </div>

              {/* Progress track */}
              {isEditable && onUpdateMetric ? (
                <input
                  id={`metric-slider-${item.key}`}
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => onUpdateMetric(item.key, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded appearance-none cursor-pointer accent-[#1a1a1a]"
                />
              ) : (
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <motion.div
                    id={`metric-progress-${item.key}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
