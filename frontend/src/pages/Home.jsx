import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import cityBg from '../assets/city.jpeg';
import eyeBtn from '../assets/eye.jpeg';

export default function Home() {
  const [search, setSearch] = useState('');
  const [showTop10, setShowTop10] = useState(false);
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://10.91.245.152:5000/trending', {
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
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-noir selection:bg-sinRed selection:text-white relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${cityBg})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Search Section */}
      <div className="flex flex-col items-center w-full max-w-2xl gap-8 transition-all duration-500 z-10 relative">
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

        <div className="flex gap-8">
          <button 
            onClick={() => setShowTop10(!showTop10)}
            className="rounded-full overflow-hidden hover:scale-110 transition-transform duration-300 border-2 border-zinc-800 hover:border-sinRed w-16 h-16 shadow-lg shadow-black/50"
            title="Bird's Eye View"
          >
            <img src={eyeBtn} alt="Bird's Eye View" className="w-full h-full object-cover" />
          </button>
          
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="flex items-center gap-3 text-sinRed/80 hover:text-sinRed hover:tracking-widest transition-all duration-300 font-bold uppercase text-sm tracking-widest"
          >
            <LogOut size={18} /> ABORT SESSION
          </button>
        </div>
      </div>

      {/* Netflix-Style Top 10 Panel */}
      <AnimatePresence>
        {showTop10 && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-black via-noir to-transparent pt-20 pb-12 z-50"
          >
            <div className="px-12 mb-6 flex justify-between items-end">
              <h3 className="text-zinc-500 font-bold tracking-tighter text-2xl">TOP 10 TRENDING</h3>
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
                  className="relative min-w-[320px] h-[400px] bg-zinc-900 border border-zinc-800 flex flex-col justify-end cursor-pointer group snap-center overflow-hidden"
                  onClick={() => navigate(`/search/${topic.title}`)}
                >
                  {topic.imageUrl && (
                    <img 
                      src={topic.imageUrl} 
                      alt={topic.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    />
                  )}
                  {/* The Big Background Number */}
                  <span className="absolute -left-5 top-[-40px] text-[10rem] font-black leading-none select-none transition-colors duration-500 text-transparent group-hover:text-sinRed/30 z-10" style={{ WebkitTextStroke: '2px #3f3f46' }}>
                    {i + 1}
                  </span>
                  
                  <div className="z-20 text-left p-6 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
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