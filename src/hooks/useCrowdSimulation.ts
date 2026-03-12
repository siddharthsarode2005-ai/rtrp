import { useState, useEffect, useCallback, useRef } from 'react';

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  peopleDetected: number;
  lastCapture?: string;
}

export interface CameraStream {
  cameraId: string;
  stream: MediaStream;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'alert' | 'success';
  message: string;
}

export interface MissingPerson {
  id: string;
  name: string;
  description: string;
  lastSeen: string;
  photo?: string;
  status: 'searching' | 'found';
}

export interface CrowdState {
  totalCount: number;
  capacity: number;
  doorLocked: boolean;
  doorLockDuration: number;
  doorUnlockTimer: number | null;
  cameras: Camera[];
  cameraStreams: { cameraId: string; stream: MediaStream }[];
  activityLog: ActivityLog[];
  missingPersons: MissingPerson[];
  captures: { id: string; cameraId: string; cameraName: string; timestamp: Date; type: 'photo' | 'video' }[];
  isMonitoring: boolean;
  cameraPermission: 'prompt' | 'granted' | 'denied' | 'checking';
}

const defaultCameras: Camera[] = [
  { id: '1', name: 'CAM-01', location: 'Main Entrance', status: 'online', peopleDetected: 0 },
  { id: '2', name: 'CAM-02', location: 'Hall A', status: 'online', peopleDetected: 0 },
  { id: '3', name: 'CAM-03', location: 'Hall B', status: 'online', peopleDetected: 0 },
  { id: '4', name: 'CAM-04', location: 'Exit Gate', status: 'online', peopleDetected: 0 },
];

export function useCrowdSimulation() {
  const [state, setState] = useState<CrowdState>({
    totalCount: 0,
    capacity: 1000,
    doorLocked: false,
    doorLockDuration: 5,
    doorUnlockTimer: null,
    cameras: defaultCameras,
    cameraStreams: [],
    activityLog: [],
    missingPersons: [],
    captures: [],
    isMonitoring: false,
    cameraPermission: 'prompt',
  });

  const addLog = useCallback((type: ActivityLog['type'], message: string) => {
    setState(prev => ({
      ...prev,
      activityLog: [
        { id: Date.now().toString(), timestamp: new Date(), type, message },
        ...prev.activityLog.slice(0, 99),
      ],
    }));
  }, []);

  // Simulate crowd fluctuation - only runs when monitoring is active
  useEffect(() => {
    if (!state.isMonitoring) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        const delta = Math.floor(Math.random() * 21) - 8; // -8 to +12
        const newCount = Math.max(0, Math.min(prev.capacity + 50, prev.totalCount + delta));
        
        // Distribute people across cameras
        const onlineCams = prev.cameras.filter(c => c.status === 'online');
        let remaining = newCount;
        const updatedCameras = prev.cameras.map((cam, i) => {
          if (cam.status === 'offline') return { ...cam, peopleDetected: 0 };
          const isLast = i === prev.cameras.length - 1;
          const share = isLast ? remaining : Math.floor(remaining * (0.15 + Math.random() * 0.4));
          remaining = Math.max(0, remaining - share);
          return { ...cam, peopleDetected: Math.max(0, share) };
        });

        return { ...prev, totalCount: newCount, cameras: updatedCameras };
      });
    }, 500); // Optimized from 1500ms to 500ms for faster real-time updates
    return () => clearInterval(interval);
  }, [state.isMonitoring]);

  // Auto-lock door when capacity reached
  useEffect(() => {
    if (state.totalCount >= state.capacity && !state.doorLocked) {
      setState(prev => ({ ...prev, doorLocked: true, doorUnlockTimer: prev.doorLockDuration }));
      addLog('alert', `CAPACITY REACHED (${state.totalCount}/${state.capacity}) — Door LOCKED`);
    }
  }, [state.totalCount, state.capacity, state.doorLocked, addLog]);

  // Door unlock countdown
  useEffect(() => {
    if (state.doorLocked && state.doorUnlockTimer !== null && state.doorUnlockTimer > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          doorUnlockTimer: (prev.doorUnlockTimer ?? 1) - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.doorLocked && state.doorUnlockTimer === 0 && state.totalCount < state.capacity) {
      setState(prev => ({ ...prev, doorLocked: false, doorUnlockTimer: null }));
      addLog('success', 'Crowd stabilized — Door UNLOCKED');
    } else if (state.doorLocked && state.doorUnlockTimer === 0 && state.totalCount >= state.capacity) {
      // Still over capacity, restart timer
      setState(prev => ({ ...prev, doorUnlockTimer: prev.doorLockDuration }));
      addLog('warning', 'Still over capacity — Door remains LOCKED');
    }
  }, [state.doorLocked, state.doorUnlockTimer, state.totalCount, state.capacity, addLog, state.doorLockDuration]);

  const setCapacity = (capacity: number) => {
    setState(prev => ({ ...prev, capacity }));
    addLog('info', `Capacity updated to ${capacity}`);
  };

  const setDoorLockDuration = (seconds: number) => {
    setState(prev => ({ ...prev, doorLockDuration: seconds }));
    addLog('info', `Door lock duration set to ${seconds}s`);
  };

  const toggleDoorManual = () => {
    setState(prev => {
      const newLocked = !prev.doorLocked;
      return {
        ...prev,
        doorLocked: newLocked,
        doorUnlockTimer: newLocked ? prev.doorLockDuration : null,
      };
    });
    addLog(state.doorLocked ? 'success' : 'alert', `Door manually ${state.doorLocked ? 'UNLOCKED' : 'LOCKED'}`);
  };

  const addCamera = (name: string, location: string) => {
    const id = Date.now().toString();
    setState(prev => ({
      ...prev,
      cameras: [...prev.cameras, { id, name, location, status: 'online', peopleDetected: 0 }],
    }));
    addLog('info', `Camera "${name}" added at ${location}`);
  };

  const removeCamera = (id: string) => {
    setState(prev => ({
      ...prev,
      cameras: prev.cameras.filter(c => c.id !== id),
    }));
    addLog('info', `Camera removed`);
  };

  const captureSnapshot = (cameraId: string, type: 'photo' | 'video') => {
    const cam = state.cameras.find(c => c.id === cameraId);
    if (!cam) return;
    setState(prev => ({
      ...prev,
      captures: [
        { id: Date.now().toString(), cameraId, cameraName: cam.name, timestamp: new Date(), type },
        ...prev.captures,
      ],
    }));
    addLog('info', `${type === 'photo' ? 'Photo' : 'Video'} captured from ${cam.name}`);
  };

  const addMissingPerson = (name: string, description: string) => {
    setState(prev => ({
      ...prev,
      missingPersons: [
        ...prev.missingPersons,
        { id: Date.now().toString(), name, description, lastSeen: 'Not yet detected', status: 'searching' },
      ],
    }));
    addLog('warning', `Missing person alert: ${name}`);
  };

  const markFound = (id: string) => {
    setState(prev => ({
      ...prev,
      missingPersons: prev.missingPersons.map(p => p.id === id ? { ...p, status: 'found' as const } : p),
    }));
    const person = state.missingPersons.find(p => p.id === id);
    if (person) addLog('success', `${person.name} has been FOUND`);
  };

  const toggleMonitoring = async () => {
    setState(prev => {
      const newMonitoring = !prev.isMonitoring;
      if (newMonitoring) {
        // Request camera access when starting detection
        setState(p => ({ ...p, cameraPermission: 'checking' }));
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            // Camera granted - keep stream active for the app
            setState(p => ({ ...p, cameraPermission: 'granted' }));
            addLog('success', 'Detection STARTED - Camera access granted, counting began');
          })
          .catch((err) => {
            console.error('Camera access denied:', err);
            setState(p => ({ ...p, cameraPermission: 'denied' }));
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              addLog('error', 'Camera permission DENIED - Please allow camera access in browser settings');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
              addLog('error', 'No camera found - Please connect a camera');
            } else {
              addLog('error', `Camera error: ${err.message}`);
            }
          });
      } else {
        addLog('warning', 'Detection STOPPED - People counting paused');
      }
      return { ...prev, isMonitoring: newMonitoring };
    });
  };

  // Start camera stream for a specific camera
  const startCameraStream = useCallback(async (cameraId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      setState(prev => ({
        ...prev,
        cameraStreams: [...prev.cameraStreams.filter(s => s.cameraId !== cameraId), { cameraId, stream }]
      }));
      
      return stream;
    } catch (err) {
      console.error('Failed to start camera stream:', err);
      addLog('error', 'Failed to start camera feed');
      return null;
    }
  }, [addLog]);

  // Stop camera stream for a specific camera
  const stopCameraStream = useCallback((cameraId: string) => {
    setState(prev => {
      const streamObj = prev.cameraStreams.find(s => s.cameraId === cameraId);
      if (streamObj) {
        streamObj.stream.getTracks().forEach(track => track.stop());
      }
      return {
        ...prev,
        cameraStreams: prev.cameraStreams.filter(s => s.cameraId !== cameraId)
      };
    });
  }, []);

  // Get stream for a specific camera
  const getCameraStream = useCallback((cameraId: string): MediaStream | null => {
    const streamObj = state.cameraStreams.find(s => s.cameraId === cameraId);
    return streamObj ? streamObj.stream : null;
  }, [state.cameraStreams]);

  // Cleanup all streams on unmount
  useEffect(() => {
    return () => {
      state.cameraStreams.forEach(streamObj => {
        streamObj.stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  return {
    state,
    setCapacity,
    setDoorLockDuration,
    toggleDoorManual,
    addCamera,
    removeCamera,
    captureSnapshot,
    addMissingPerson,
    markFound,
    addLog,
    toggleMonitoring,
    startCameraStream,
    stopCameraStream,
    getCameraStream,
  };
}
