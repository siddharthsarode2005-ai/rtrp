import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  Filter,
  Search,
  Trash2,
  Eye
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  camera?: string;
  read: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'error', title: 'Capacity Exceeded', message: 'Main Entrance has exceeded maximum capacity (100%)', timestamp: new Date(), read: false, camera: 'CAM-01' },
    { id: '2', type: 'warning', title: 'High Crowd Density', message: 'Hall A approaching 80% capacity', timestamp: new Date(Date.now() - 300000), read: false, camera: 'CAM-02' },
    { id: '3', type: 'info', title: 'Camera Online', message: 'CAM-03 has come back online', timestamp: new Date(Date.now() - 600000), read: true, camera: 'CAM-03' },
    { id: '4', type: 'success', title: 'Missing Person Found', message: 'Ahmed Al-Rashid was detected at Main Entrance', timestamp: new Date(Date.now() - 900000), read: true },
    { id: '5', type: 'warning', title: 'Unusual Activity', message: 'Unusual crowd pattern detected in Hall B', timestamp: new Date(Date.now() - 1200000), read: true, camera: 'CAM-03' },
    { id: '6', type: 'error', title: 'Camera Offline', message: 'CAM-05 has gone offline', timestamp: new Date(Date.now() - 7200000), read: true, camera: 'CAM-05' },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || !alert.read;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const typeConfig = {
    warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
    info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
    success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
    error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
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
              <Bell className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">ALERTS</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Notifications & Warnings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              {alerts.filter(a => !a.read).length} unread
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-3 py-1.5 text-xs font-mono text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Mark all read
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Alerts', value: alerts.length, icon: Bell },
            { label: 'Unread', value: alerts.filter(a => !a.read).length, icon: Eye, color: 'primary' },
            { label: 'Warnings', value: alerts.filter(a => a.type === 'warning').length, icon: AlertTriangle, color: 'warning' },
            { label: 'Errors', value: alerts.filter(a => a.type === 'error').length, icon: XCircle, color: 'destructive' },
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <div className="flex gap-2">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                  filter === f 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => {
              const config = typeConfig[alert.type];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border ${config.border} ${config.bg} p-4 ${
                    !alert.read ? 'ring-1 ring-primary/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-2 rounded-lg ${config.bg} ${config.color}`}
                    >
                      <config.icon className="w-5 h-5" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-mono font-bold text-foreground">{alert.title}</h3>
                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                        {alert.camera && (
                          <span className="px-2 py-0.5 bg-muted/50 rounded">{alert.camera}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.read && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markAsRead(alert.id)}
                          className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-mono text-muted-foreground">No alerts found</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;

