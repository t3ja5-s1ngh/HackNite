import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [search, setSearch] = useState('');
  const [showTop10, setShowTop10] = useState(false);
  const navigate = useNavigate();

  // Mock Top 10 data for testing
  const trending = ["CORRUPTION", "RED_ROOM", "HEIST", "MAFIA", "VAULT", "SYNDICATE", "NOIR", "GHOST", "ECHO", "SHADOW"];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search) {
      navigate(`/search/${search}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-noir selection:bg-sinRed selection:text-white">
      {/* Search Section */}
      <div className="flex flex-col items-center w-full max-w-2xl gap-8 transition-all duration-500">
        <div className="relative w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-sinRed transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Search for sin..."
            className="w-full bg-zinc-900/50 border-2 border-zinc-800 py-5 pl-14 pr-6 rounded-full text-xl outline-none focus:border-sinRed/50 focus:bg-zinc-900 transition-all font-mono"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <button 
          onClick={() => setShowTop10(!showTop10)}
          className="flex items-center gap-3 text-zinc-500 hover:text-white hover:tracking-widest transition-all duration-300 font-bold uppercase text-sm tracking-widest"
        >
          <Eye size={18} /> BIRD'S EYE VIEW
        </button>
      </div>

      {/* Netflix-Style Top 10 Panel */}
      <AnimatePresence>
        {showTop10 && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-black via-noir to-transparent pt-20 pb-12"
          >
            <div className="px-12 mb-6">
              <h3 className="text-zinc-500 font-bold tracking-tighter text-2xl">TOP 10 TRENDING</h3>
            </div>
            
            <div className="flex gap-8 overflow-x-auto px-12 pb-8 no-scrollbar snap-x">
              {trending.map((word, i) => (
                <motion.div 
                  key={word}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="relative min-w-[280px] h-[400px] bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer group snap-center"
                  onClick={() => navigate(`/search/${word}`)}
                >
                  {/* The Big Background Number */}
                  <span className="absolute -left-10 bottom-[-20px] text-[12rem] font-black leading-none select-none transition-colors duration-500 text-transparent group-hover:text-sinRed/10" style={{ WebkitTextStroke: '2px #3f3f46' }}>
                    {i + 1}
                  </span>
                  
                  <div className="z-10 text-center">
                    <p className="text-2xl font-black tracking-[0.2em] group-hover:text-white transition-colors uppercase">{word}</p>
                    <div className="h-1 w-0 group-hover:w-full bg-sinRed transition-all duration-500 mt-2 mx-auto" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}