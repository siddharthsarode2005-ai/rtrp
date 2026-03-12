import { useState } from 'react';
import { Search, UserX, CheckCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MissingPerson } from '@/hooks/useCrowdSimulation';

interface MissingPersonsPanelProps {
  persons: MissingPerson[];
  onAdd: (name: string, description: string) => void;
  onMarkFound: (id: string) => void;
}

export function MissingPersonsPanel({ persons, onAdd, onMarkFound }: MissingPersonsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setShowAdd(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Missing Persons</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(!showAdd)}
          className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <Plus className="w-4 h-4 text-primary" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-background/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (age, clothing, etc.)"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-background/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Alert
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search persons..."
          className="w-full pl-8 pr-2 py-2 text-xs font-mono rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground font-mono text-center py-4">No results found</p>
        )}
        <AnimatePresence>
          {filtered.map(person => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                person.status === 'found' 
                  ? 'border-success/30 bg-success/5' 
                  : 'border-warning/30 bg-warning/5'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {person.status === 'found' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle className="w-4 h-4 text-success" />
                  </motion.div>
                ) : (
                  <UserX className="w-4 h-4 text-warning" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-mono font-semibold text-foreground">{person.name}</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{person.description}</p>
                <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">Last seen: {person.lastSeen}</p>
              </div>
              {person.status === 'searching' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkFound(person.id)}
                  className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                >
                  Found
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
