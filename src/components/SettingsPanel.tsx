import { useState } from 'react';
import { Settings, Sliders, DoorOpen, Timer, Plus } from 'lucide-react';

interface SettingsPanelProps {
  capacity: number;
  doorLockDuration: number;
  onCapacityChange: (v: number) => void;
  onDoorLockDurationChange: (v: number) => void;
  onToggleDoor: () => void;
  doorLocked: boolean;
  onAddCamera: (name: string, location: string) => void;
}

export function SettingsPanel({
  capacity,
  doorLockDuration,
  onCapacityChange,
  onDoorLockDurationChange,
  onToggleDoor,
  doorLocked,
  onAddCamera,
}: SettingsPanelProps) {
  const [showAddCam, setShowAddCam] = useState(false);
  const [camName, setCamName] = useState('');
  const [camLocation, setCamLocation] = useState('');

  const handleAddCam = () => {
    if (camName.trim() && camLocation.trim()) {
      onAddCamera(camName.trim(), camLocation.trim());
      setCamName('');
      setCamLocation('');
      setShowAddCam(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Settings</h3>
      </div>

      {/* Capacity */}
      <div>
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
          <Sliders className="w-3.5 h-3.5" /> Max Capacity
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={100}
            max={5000}
            step={50}
            value={capacity}
            onChange={e => onCapacityChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
          />
          <input
            type="number"
            value={capacity}
            onChange={e => onCapacityChange(Number(e.target.value))}
            className="w-20 px-2 py-1 text-xs font-mono rounded bg-background border border-border text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Door lock duration */}
      <div>
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
          <Timer className="w-3.5 h-3.5" /> Door Lock Duration (seconds)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={doorLockDuration}
            onChange={e => onDoorLockDurationChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
          />
          <input
            type="number"
            value={doorLockDuration}
            onChange={e => onDoorLockDurationChange(Number(e.target.value))}
            className="w-20 px-2 py-1 text-xs font-mono rounded bg-background border border-border text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Manual door control */}
      <div>
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
          <DoorOpen className="w-3.5 h-3.5" /> Manual Door Control
        </label>
        <button
          onClick={onToggleDoor}
          className={`w-full px-3 py-2 text-xs font-mono font-bold rounded transition-colors ${
            doorLocked
              ? 'bg-success/20 text-success hover:bg-success/30 border border-success/30'
              : 'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30'
          }`}
        >
          {doorLocked ? 'UNLOCK DOOR' : 'LOCK DOOR'}
        </button>
      </div>

      {/* Add Camera */}
      <div>
        <button
          onClick={() => setShowAddCam(!showAddCam)}
          className="flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Camera
        </button>
        {showAddCam && (
          <div className="mt-2 space-y-2 p-3 rounded bg-muted/50 border border-border">
            <input
              value={camName}
              onChange={e => setCamName(e.target.value)}
              placeholder="Camera name (e.g. CAM-05)"
              className="w-full px-2 py-1.5 text-xs font-mono rounded bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              value={camLocation}
              onChange={e => setCamLocation(e.target.value)}
              placeholder="Location (e.g. Parking Lot)"
              className="w-full px-2 py-1.5 text-xs font-mono rounded bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleAddCam}
              className="w-full px-3 py-1.5 text-xs font-mono rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
