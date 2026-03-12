import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, Video, ImageIcon, Wifi, WifiOff, Trash2, Play, Pause } from 'lucide-react';
import type { Camera } from '@/hooks/useCrowdSimulation';
import { motion } from 'framer-motion';

interface CameraGridProps {
  cameras: Camera[];
  onCapture: (cameraId: string, type: 'photo' | 'video') => void;
  onRemove: (cameraId: string) => void;
  startCameraStream: (cameraId: string) => Promise<MediaStream | null>;
  stopCameraStream: (cameraId: string) => void;
  getCameraStream: (cameraId: string) => MediaStream | null;
}

export function CameraGrid({ cameras, onCapture, onRemove, startCameraStream, stopCameraStream, getCameraStream }: CameraGridProps) {
  const [activeCameras, setActiveCameras] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Toggle camera on/off
  const toggleCamera = useCallback(async (cameraId: string) => {
    if (activeCameras.has(cameraId)) {
      // Turn off camera
      stopCameraStream(cameraId);
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
    } else {
      // Turn on camera
      const stream = await startCameraStream(cameraId);
      if (stream) {
        setActiveCameras(prev => {
          const newSet = new Set(prev);
          newSet.add(cameraId);
          return newSet;
        });
      }
    }
  }, [activeCameras, startCameraStream, stopCameraStream]);

  // Attach stream to video element when active
  useEffect(() => {
    cameras.forEach(cam => {
      if (activeCameras.has(cam.id)) {
        const stream = getCameraStream(cam.id);
        const videoElement = videoRefs.current[cam.id];
        if (stream && videoElement) {
          videoElement.srcObject = stream;
        }
      }
    });
  }, [activeCameras, cameras, getCameraStream]);

  // Cleanup streams when component unmounts
  useEffect(() => {
    return () => {
      activeCameras.forEach(cameraId => {
        stopCameraStream(cameraId);
      });
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {cameras.map((cam, index) => (
        <motion.div
          key={cam.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden group"
        >
          {/* Live camera feed */}
          <div className="relative h-36 bg-gradient-to-br from-muted/30 to-muted/10 scanline flex items-center justify-center overflow-hidden">
            {/* Video element for live stream */}
            {activeCameras.has(cam.id) ? (
              <video
                ref={(el) => { videoRefs.current[cam.id] = el; }}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CameraIcon className="w-10 h-10 text-muted-foreground/30" />
                </motion.div>
              </>
            )}
            
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              {cam.status === 'online' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1"
                >
                  <Wifi className="w-3 h-3 text-success" />
                </motion.div>
              ) : (
                <WifiOff className="w-3 h-3 text-destructive" />
              )}
              <span className="text-[10px] font-mono text-foreground/70">{cam.name}</span>
            </div>
            <motion.div 
              className="absolute top-2 right-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] font-mono text-primary px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
                {cam.peopleDetected} detected
              </span>
            </motion.div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground">
              {cam.location}
            </div>
            {/* Recording indicator */}
            {activeCameras.has(cam.id) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-2 right-2 flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-[10px] font-mono text-destructive">LIVE</span>
              </motion.div>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center gap-1 p-2 border-t border-border/50 bg-card/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCamera(cam.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeCameras.has(cam.id) 
                  ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
            >
              {activeCameras.has(cam.id) ? (
                <>
                  <Pause className="w-3 h-3" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Live
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCapture(cam.id, 'photo')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              <ImageIcon className="w-3 h-3" /> Photo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCapture(cam.id, 'video')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              <Video className="w-3 h-3" /> Video
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (activeCameras.has(cam.id)) {
                  stopCameraStream(cam.id);
                  setActiveCameras(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(cam.id);
                    return newSet;
                  });
                }
                onRemove(cam.id);
              }}
              className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

