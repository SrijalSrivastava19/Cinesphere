import { motion } from 'framer-motion';
import { Plus, Check, Star } from 'lucide-react';
import { useStore } from '../App';

export default function MovieCard({ m, onOpen }) {
  const { watch, toggleWatch } = useStore();
  const on = watch.includes(m.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group glass overflow-hidden"
    >
      <button
        onClick={() => onOpen?.(m)}
        className="block w-full text-left"
      >
        <div className="aspect-[2/3] overflow-hidden relative">
          <img
            src={m.poster}
            alt={m.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Dark gradient for title readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <span className="absolute bottom-3 left-3 right-3 font-display text-sm text-white">
            {m.title}
          </span>
        </div>
      </button>

      <div className="p-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-cyan">
          <Star size={13} />
          {m.rating} · {m.year}
        </span>

        <button
          aria-pressed={on}
          aria-label={
            on ? 'Remove from watchlist' : 'Add to watchlist'
          }
          onClick={() => toggleWatch(m.id)}
          className="p-1.5 border border-white/15 hover:border-pink"
        >
          {on ? (
            <Check size={14} className="text-pink" />
          ) : (
            <Plus size={14} />
          )}
        </button>
      </div>
    </motion.article>
  );
}