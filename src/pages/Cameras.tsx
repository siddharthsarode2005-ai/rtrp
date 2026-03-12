import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Power, 
  PowerOff,
  Video,
  Eye,
  Settings,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface CameraDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: '1080p' | '4K' | '720p';
  lastSeen: string;
  alerts: number;
}

const Cameras = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([
    { id: '1', name: 'CAM-01', location: 'Main Entrance', status: 'online', resolution: '4K', lastSeen: 'Just now', alerts: 0 },
    { id: '2', name: 'CAM-02', location: 'Hall A', status: 'online', resolution: '1080p', lastSeen: 'Just now', alerts: 2 },
    { id: '3', name: 'CAM-03', location: 'Hall B', status: 'online', resolution: '1080p', lastSeen: 'Just now', alerts: 0 },
    { id: '4', name: 'CAM-04', location: 'Exit Gate', status: 'online', resolution: '4K', lastSeen: 'Just now', alerts: 1 },
    { id: '5', name: 'CAM-05', location: 'Parking Lot', status: 'offline', resolution: '1080p', lastSeen: '2 hours ago', alerts: 0 },
    { id: '6', name: 'CAM-06', location: 'Server Room', status: 'maintenance', resolution: '720p', lastSeen: '1 day ago', alerts: 0 },
  ]);

  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleCameraStatus = (id: string) => {
    setCameras(prev => prev.map(cam => 
      cam.id === id 
        ? { ...cam, status: cam.status === 'online' ? 'offline' : 'online' }
        : cam
    ));
  };

  const deleteCamera = (id: string) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-destructive',
    maintenance: 'bg-warning',
  };

  const statusTextColors = {
    online: 'text-success',
    offline: 'text-destructive',
    maintenance: 'text-warning',
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 rounded-lg bg-primary/10 border border-primary/20"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Camera className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">CAMERAS</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Device Management</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-xs hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Camera
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Cameras', value: cameras.length, icon: Camera },
            { label: 'Online', value: cameras.filter(c => c.status === 'online').length, icon: Eye, color: 'success' },
            { label: 'Offline', value: cameras.filter(c => c.status === 'offline').length, icon: PowerOff, color: 'destructive' },
            { label: 'Alerts', value: cameras.reduce((acc, c) => acc + c.alerts, 0), icon: AlertTriangle, color: 'warning' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
            >
              <stat.icon className={`w-5 h-5 text-${stat.color || 'primary'} mb-2`} />
              <p className="text-2xl font-mono font-bold text-foreground">{stat.value}</p>
              <p className="text-xs font-mono text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {cameras.map((camera, index) => (
              <motion.div
                key={camera.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden ${
                  selectedCamera?.id === camera.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCamera(camera)}
              >
                {/* Camera Preview */}
                <div className="relative h-40 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400')] bg-cover bg-center opacity-30" />
                  <motion.div 
                    className="relative z-10 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Video className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusColors[camera.status]} animate-pulse`} />
                    <span className={`text-[10px] font-mono uppercase ${statusTextColors[camera.status]}`}>
                      {camera.status}
                    </span>
                  </div>

                  {/* Alerts badge */}
                  {camera.alerts > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 px-2 py-1 bg-destructive/80 rounded-full"
                    >
                      <span className="text-[10px] font-mono text-destructive-foreground">
                        {camera.alerts} alerts
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Camera Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-mono font-bold text-foreground">{camera.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                      {camera.resolution}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="font-mono">{camera.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">Last seen: {camera.lastSeen}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); toggleCameraStatus(camera.id); }}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                        camera.status === 'online' 
                          ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                          : 'bg-success/20 text-success hover:bg-success/30'
                      }`}
                    >
                      {camera.status === 'online' ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                      {camera.status === 'online' ? 'Disable' : 'Enable'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); deleteCamera(camera.id); }}
                      className="px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Camera Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 bg-card border border-border rounded-xl"
            >
              <h2 className="text-lg font-mono font-bold text-foreground mb-4">Add New Camera</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Camera Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., CAM-07"
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Warehouse"
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Resolution</label>
                  <select className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="1080p">1080p</option>
                    <option value="4K">4K</option>
                    <option value="720p">720p</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-mono hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono hover:bg-primary/90 transition-colors">
                  Add Camera
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cameras;

