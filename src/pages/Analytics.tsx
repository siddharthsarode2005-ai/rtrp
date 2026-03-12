import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Camera, 
  AlertTriangle, 
  Shield,
  Activity,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';

const Analytics = () => {
  const [stats] = useState({
    totalVisitors: 12453,
    peakHour: '14:00 - 15:00',
    averageStayTime: '45 min',
    alertsTriggered: 23,
    camerasActive: 4,
    detectionAccuracy: 98.5,
  });

  const [hourlyData] = useState([
    { hour: '6AM', count: 120 },
    { hour: '8AM', count: 450 },
    { hour: '10AM', count: 680 },
    { hour: '12PM', count: 890 },
    { hour: '2PM', count: 1020 },
    { hour: '4PM', count: 850 },
    { hour: '6PM', count: 620 },
    { hour: '8PM', count: 340 },
  ]);

  const [locationData] = useState([
    { location: 'Main Entrance', percentage: 35 },
    { location: 'Hall A', percentage: 25 },
    { location: 'Hall B', percentage: 20 },
    { location: 'Exit Gate', percentage: 15 },
    { location: 'Parking', percentage: 5 },
  ]);

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
              <BarChart3 className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">ANALYTICS</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Data Insights & Reports</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-6 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Visitors Today', value: stats.totalVisitors.toLocaleString(), icon: Users, color: 'primary', trend: '+12%' },
            { label: 'Peak Hour', value: stats.peakHour, icon: Clock, color: 'warning', trend: null },
            { label: 'Avg Stay Time', value: stats.averageStayTime, icon: Activity, color: 'success', trend: null },
            { label: 'Alerts Triggered', value: stats.alertsTriggered.toString(), icon: AlertTriangle, color: 'destructive', trend: '-8%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                {stat.trend && (
                  <span className={`text-xs font-mono ${stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-mono font-bold text-foreground">{stat.value}</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Hourly Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Hourly Traffic</h3>
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {hourlyData.map((item, index) => (
                <motion.div
                  key={item.hour}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.count / 1020) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary/80 to-primary/20 rounded-t-md relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono">{item.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {hourlyData.map(item => (
                <span key={item.hour} className="text-[10px] font-mono text-muted-foreground">{item.hour}</span>
              ))}
            </div>
          </motion.div>

          {/* Location Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Location Distribution</h3>
            </div>
            <div className="space-y-3">
              {locationData.map((item, index) => (
                <motion.div
                  key={item.location}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-foreground">{item.location}</span>
                    <span className="font-mono text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">System Performance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Active Cameras', value: `${stats.camerasActive}/4`, icon: Camera },
              { label: 'Detection Accuracy', value: `${stats.detectionAccuracy}%`, icon: TrendingUp },
              { label: 'System Uptime', value: '99.9%', icon: Activity },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <metric.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-xl font-mono font-bold text-foreground">{metric.value}</p>
                <p className="text-xs font-mono text-muted-foreground">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;

