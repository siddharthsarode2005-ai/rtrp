import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  BarChart3, 
  Camera, 
  Bell, 
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { path: '/', icon: Shield, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/cameras', icon: Camera, label: 'Cameras' },
    { path: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-card/60 backdrop-blur-md border-r border-border/50 flex flex-col items-center py-4 z-40">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <motion.div 
          className="p-2 rounded-lg bg-primary/10 border border-primary/20"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="w-5 h-5 text-primary" />
        </motion.div>
      </Link>

      {/* Nav Items */}
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-colors relative ${
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;

