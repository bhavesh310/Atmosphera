import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GeoLocation } from '../../types/weather';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  onSearch: (query: string) => void;
  results: GeoLocation[];
  loading: boolean;
  locationName?: string;
  accentColor: string;
}

export default function SearchBar({ onSelect, onSearch, results, loading, locationName, accentColor }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val);
    }, 350);
  }, [onSearch]);

  const handleSelect = useCallback((loc: GeoLocation) => {
    setQuery(loc.name);
    setOpen(false);
    onSelect(loc);
  }, [onSelect]);

  useEffect(() => {
    if (results.length === 0) setOpen(false);
    else setOpen(true);
  }, [results]);

  return (
    <div className="relative flex flex-col items-center" style={{ minWidth: 260 }}>
      <div className="flex items-center gap-2 w-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="opacity-40 shrink-0" style={{ color: accentColor }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          className="search-underline font-mono-custom text-sm tracking-widest w-full"
          placeholder={locationName || 'SEARCH CITY...'}
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          style={{ '--accent-color': accentColor } as React.CSSProperties}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && (
          <svg className="animate-spin shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: accentColor }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full glass-panel rounded-lg overflow-hidden z-50"
            style={{ minWidth: 260 }}
          >
            {results.map((loc) => (
              <button
                key={loc.id}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group"
                onMouseDown={() => handleSelect(loc)}
              >
                <div>
                  <span className="font-mono-custom text-xs tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    {loc.name}
                  </span>
                  {loc.admin1 && (
                    <span className="font-mono-custom text-xs ml-2 opacity-50" style={{ color: 'var(--text-muted)' }}>
                      {loc.admin1}
                    </span>
                  )}
                </div>
                <span className="font-mono-custom text-xs opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                  {loc.country_code}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
