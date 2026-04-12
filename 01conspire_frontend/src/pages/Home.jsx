import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eyeBtn from '../assets/eye.jpeg';

const TerminalLogBackground = () => {
  const [logs, setLogs] = useState([]);
  const usernameRef = useRef("OPERATIVE");

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username || payload.id) {
          usernameRef.current = (payload.username || payload.id).toUpperCase();
        } else if (payload.sub) {
          usernameRef.current = payload.sub.toUpperCase();
        }
      }
    } catch(e) {}
    
    const initial = [];
    const now = new Date();
    for (let i = 40; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 1500);
      initial.push(`[${t.toISOString().split('T')[1].slice(0,11)}] SYSTEM_INIT | ${usernameRef.current} | ESTABLISHED_SECURE_LINK`);
    }
    setLogs(initial);

    const msgs = [
      "SCANNING_NODE_SECTOR_7G",
      "MONITORING_GLOBAL_FEED",
      "HANDSHAKE_SUCCESS_SSL",
      "DECRYPTING_NOISY_CHANNEL",
      "AWAITING_INPUT_COMMAND",
      "HEARTBEAT_ACK",
      "PARSING_CIPHER_TEXT",
      "NETWORK_TRAFFIC_ANALYSIS"
    ];

    const interval = setInterval(() => {
      setLogs(prev => {
        const t = new Date().toISOString().split('T')[1].slice(0,11);
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const newLog = `[${t}] ${msg} | ${usernameRef.current} | STATUS_OK`;
        return [...prev.slice(-50), newLog];
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 flex items-end font-mono">
      <div className="w-full text-[9px] md:text-xs text-[#dc2626] opacity-[0.25] p-4 flex flex-col gap-1 select-none pointer-events-none whitespace-nowrap leading-none mix-blend-screen">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
    </div>
  );
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [showTop10, setShowTop10] = useState(false);
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://10.12.89.152:5000/trending', {
          headers: { Authorization: token }
        });
        if (res.data && res.data.topics) {
          setTrending(res.data.topics);
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search) {
      navigate(`/search/${search}`);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-black selection:bg-sinRed selection:text-white relative overflow-hidden"
    >
      <TerminalLogBackground />

      {/* Top action bar */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="flex items-center gap-2 text-sinRed/80 hover:text-sinRed hover:tracking-widest transition-all duration-300 font-bold uppercase text-sm tracking-widest px-4 py-2 bg-black/40 border border-zinc-800/50 hover:border-sinRed/50 rounded-full backdrop-blur-sm"
        >
          <LogOut size={16} /> ABORT SESSION
        </button>
      </div>

      {/* Search Section */}
      <div className="flex flex-col items-center w-full max-w-3xl gap-8 transition-all duration-500 z-10 relative">
        
        <div className="flex flex-col items-center mb-2 relative">
          <h1 className="text-6xl md:text-8xl font-mono font-black tracking-tighter uppercase text-zinc-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all cursor-default relative">
            <span className="opacity-90">CONSPIRE</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[110%] h-[6px] bg-sinRed/80 shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>
          </h1>
          <p className="text-sinRed text-[10px] tracking-[0.5em] md:tracking-[0.8em] font-mono mt-8 opacity-80 uppercase text-center bg-black/60 px-4 py-1 border border-zinc-800 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            Intelligence Aggregator
          </p>
        </div>

        <div className="relative w-full group mt-4">
          <div className="absolute inset-0 bg-sinRed/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 rounded-full"></div>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-sinRed transition-colors z-10" size={24} />
          <input 
            type="text"
            placeholder="investigate..."
            className="relative w-full bg-black/50 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-zinc-800/80 py-6 pl-16 pr-8 rounded-full text-xl md:text-2xl text-white outline-none focus:border-sinRed/80 focus:bg-black/80 transition-all duration-300 font-mono z-10 placeholder:text-zinc-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="flex gap-8">
          <button 
            onClick={() => setShowTop10(!showTop10)}
            className="rounded-full overflow-hidden hover:scale-110 transition-transform duration-300 border-2 border-zinc-800 hover:border-sinRed w-16 h-16 shadow-lg shadow-black/50"
            title="Bird's Eye View"
          >
            <img src={eyeBtn} alt="Bird's Eye View" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Bird's Eye View Panel */}
      <AnimatePresence>
        {showTop10 && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800/80 pt-16 pb-12 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="px-12 mb-6 flex justify-between items-end">
              <h3 className="text-[#dc2626] font-mono font-bold tracking-widest text-2xl uppercase">BIRD'S EYE VIEW</h3>
              <button 
                onClick={() => setShowTop10(false)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-bold text-sm tracking-widest px-4 py-2 border border-zinc-800 hover:border-white rounded-full bg-black/50"
              >
                <X size={16} /> RETURN TO TERMINAL
              </button>
            </div>
            
            <div className="flex gap-8 overflow-x-auto px-12 pb-8 no-scrollbar snap-x">
              {trending.map((topic, i) => (
                <motion.div 
                  key={topic.link || i}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative min-w-[320px] h-[400px] bg-black border-2 border-zinc-900 hover:border-[#dc2626]/50 flex flex-col justify-end cursor-pointer group snap-center overflow-hidden transition-colors"
                  onClick={() => navigate(`/search/${topic.title}`)}
                >
                  {topic.imageUrl && (
                    <img 
                      src={topic.imageUrl} 
                      alt={topic.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-opacity duration-500 grayscale group-hover:grayscale-0 mix-blend-luminosity"
                    />
                  )}
                  {/* Terminal Header Text Style Number */}
                  <span className="absolute top-4 right-6 text-2xl font-mono font-black select-none text-zinc-800 group-hover:text-[#dc2626] transition-colors duration-500 z-10">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  
                  <div className="z-20 text-left p-6 w-full bg-black/80 border-t border-zinc-900 group-hover:border-[#dc2626]/30 backdrop-blur-sm transition-colors">
                    <p className="text-lg font-bold tracking-tight text-zinc-300 group-hover:text-white transition-colors line-clamp-3">{topic.title}</p>
                    <div className="h-1 w-0 group-hover:w-full bg-sinRed transition-all duration-500 mt-4" />
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