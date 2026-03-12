import { useCrowdSimulation } from '@/hooks/useCrowdSimulation';
import { CapacityGauge } from '@/components/CapacityGauge';
import { CameraGrid } from '@/components/CameraGrid';
import { ActivityFeed } from '@/components/ActivityFeed';
import { MissingPersonsPanel } from '@/components/MissingPersonsPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { CapturesList } from '@/components/CapturesList';
import { Shield, Users, Camera, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const {
    state,
    setCapacity,
    setDoorLockDuration,
    toggleDoorManual,
    addCamera,
    removeCamera,
    captureSnapshot,
    addMissingPerson,
    markFound,
    toggleMonitoring,
    startCameraStream,
    stopCameraStream,
    getCameraStream,
  } = useCrowdSimulation();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="p-2 rounded-lg bg-primary/10 border border-primary/20"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">CROWD CONTROL</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Real-Time Monitoring System</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            {state.isMonitoring ? (
              <motion.div 
                className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{state.totalCount.toLocaleString()} occupants</span>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center gap-2 text-xs font-mono text-muted-foreground/50"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-3.5 h-3.5" />
                <span>0 occupants</span>
              </motion.div>
            )}
            <motion.div
              className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
              whileHover={{ scale: 1.05 }}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{state.cameras.filter(c => c.status === 'online').length} cameras</span>
            </motion.div>
            {/* Detection Toggle */}
            <motion.button
              onClick={toggleMonitoring}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-mono text-xs ${
                state.isMonitoring 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' 
                  : 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {state.isMonitoring ? (
                <>
                  <Square className="w-3 h-3" />
                  STOP
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  START
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto p-4 space-y-4 relative z-10">
        {/* Top row: Gauge */}
        <CapacityGauge
          current={state.totalCount}
          capacity={state.capacity}
          doorLocked={state.doorLocked}
          unlockTimer={state.doorUnlockTimer}
        />

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Cameras + Captures */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
            >
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Camera Feeds</h3>
              <CameraGrid
                cameras={state.cameras}
                onCapture={captureSnapshot}
                onRemove={removeCamera}
                startCameraStream={startCameraStream}
                stopCameraStream={stopCameraStream}
                getCameraStream={getCameraStream}
              />
            </motion.div>
            <CapturesList captures={state.captures} />
          </div>

          {/* Right: Settings + Missing + Activity */}
          <div className="space-y-4">
            <SettingsPanel
              capacity={state.capacity}
              doorLockDuration={state.doorLockDuration}
              onCapacityChange={setCapacity}
              onDoorLockDurationChange={setDoorLockDuration}
              onToggleDoor={toggleDoorManual}
              doorLocked={state.doorLocked}
              onAddCamera={addCamera}
            />
            <MissingPersonsPanel
              persons={state.missingPersons}
              onAdd={addMissingPerson}
              onMarkFound={markFound}
            />
            <ActivityFeed logs={state.activityLog} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

