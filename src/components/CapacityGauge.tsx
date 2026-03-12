import { useMemo } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CapacityGaugeProps {
  current: number;
  capacity: number;
  doorLocked: boolean;
  unlockTimer: number | null;
}

export function CapacityGauge({ current, capacity, doorLocked, unlockTimer }: CapacityGaugeProps) {
  const percentage = useMemo(() => Math.min(100, (current / capacity) * 100), [current, capacity]);
  
  const statusColor = percentage >= 100 ? 'text-destructive' : percentage >= 80 ? 'text-warning' : 'text-success';
  const barColor = percentage >= 100 ? 'bg-destructive' : percentage >= 80 ? 'bg-warning' : 'bg-success';
  const glowClass = percentage >= 100 ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : percentage >= 80 ? 'shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'shadow-[0_0_15px_rgba(34,197,94,0.4)]';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 relative overflow-hidden ${doorLocked ? 'animate-pulse-red' : ''}`}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Live Occupancy</p>
          <div className="flex items-baseline gap-2 mt-1">
            <motion.span 
              key={current}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-5xl font-mono font-bold ${statusColor}`}
            >
              {current.toLocaleString()}
            </motion.span>
            <span className="text-lg font-mono text-muted-foreground">/ {capacity.toLocaleString()}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={doorLocked ? 'locked' : 'unlocked'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${doorLocked ? 'bg-destructive/20 border border-destructive/40' : 'bg-success/20 border border-success/40'}`}
          >
            <motion.div
              animate={doorLocked ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {doorLocked ? (
                <Lock className="w-5 h-5 text-destructive" />
              ) : (
                <Unlock className="w-5 h-5 text-success" />
              )}
            </motion.div>
            <div>
              <p className={`text-sm font-mono font-bold ${doorLocked ? 'text-destructive' : 'text-success'}`}>
                {doorLocked ? 'LOCKED' : 'OPEN'}
              </p>
              {doorLocked && unlockTimer !== null && (
                <motion.p 
                  key={unlockTimer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono text-destructive/70"
                >
                  Retry in {unlockTimer}s
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${barColor} rounded-full ${glowClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        {percentage >= 80 && (
          <div className="absolute inset-y-0 left-[80%] w-px bg-warning/50" />
        )}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-mono text-muted-foreground">0</span>
        <span className="text-[10px] font-mono text-warning/70">80%</span>
        <span className="text-[10px] font-mono text-muted-foreground">{capacity.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}

