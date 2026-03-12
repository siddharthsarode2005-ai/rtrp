import type { ActivityLog } from '@/hooks/useCrowdSimulation';
import { AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityFeedProps {
  logs: ActivityLog[];
}

const iconMap = {
  info: <Info className="w-3.5 h-3.5 text-primary" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-warning" />,
  alert: <ShieldAlert className="w-3.5 h-3.5 text-destructive" />,
  success: <CheckCircle className="w-3.5 h-3.5 text-success" />,
};

const typeColors = {
  info: 'border-primary/20 bg-primary/5',
  warning: 'border-warning/20 bg-warning/5',
  alert: 'border-destructive/20 bg-destructive/5',
  success: 'border-success/20 bg-success/5',
};

export function ActivityFeed({ logs }: ActivityFeedProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 h-full"
    >
      <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Activity Log</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {logs.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground font-mono text-center py-4"
          >
            No activity yet...
          </motion.p>
        )}
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg border ${typeColors[log.type]} hover:bg-muted/50 transition-colors cursor-default`}
            >
              <motion.div 
                className="mt-0.5 shrink-0"
                whileHover={{ scale: 1.1 }}
              >
                {iconMap[log.type]}
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-foreground/90 break-words">{log.message}</p>
                <p className="font-mono text-muted-foreground text-[10px] mt-0.5">
                  {log.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

