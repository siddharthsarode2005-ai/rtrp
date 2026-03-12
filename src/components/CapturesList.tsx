import type { CrowdState } from '@/hooks/useCrowdSimulation';
import { Camera, Image, Video } from 'lucide-react';

interface CapturesListProps {
  captures: CrowdState['captures'];
}

export function CapturesList({ captures }: CapturesListProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Captures & Recordings</h3>
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {captures.length === 0 && (
          <p className="text-xs text-muted-foreground font-mono text-center py-4">No captures yet. Use camera controls to capture.</p>
        )}
        {captures.map(cap => (
          <div key={cap.id} className="flex items-center gap-2 px-2.5 py-2 rounded bg-muted/50 border border-border">
            {cap.type === 'photo' ? (
              <Image className="w-3.5 h-3.5 text-primary shrink-0" />
            ) : (
              <Video className="w-3.5 h-3.5 text-accent shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono text-foreground truncate">
                {cap.type === 'photo' ? 'Snapshot' : 'Recording'} — {cap.cameraName}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                {cap.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-secondary">
              {cap.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
