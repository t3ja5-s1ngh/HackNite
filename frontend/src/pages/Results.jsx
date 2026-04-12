import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Skull, Terminal, AlertTriangle, Fingerprint, Eye, Activity, Link, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import cityBg from '../assets/city.jpeg';
import triangleLoading from '../assets/triangle_loading.jpeg';

export default function Results() {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ confirmed: [], unconfirmed: [] });
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  // Terminal scramble effect
  useEffect(() => {
    if (!loading) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iterations = 0;
    const interval = setInterval(() => {
      setLoadingText("INTERROGATING SOURCES".split('').map((l, i) => {
        if(i < iterations) return l;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      iterations += 1/3;
      if (iterations >= "INTERROGATING SOURCES".length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.get(`http://10.12.89.152:5000/scrape/${keyword}`, {
          headers: { Authorization: token }
        });

        const res = await axios.get(`http://10.12.89.152:5000/collect?keyword=${keyword}`);
        
        setData({
          confirmed: res.data.filter(i => i.filter === "official"),
          unconfirmed: res.data.filter(i => i.filter === "media")
        });
      } catch (err) {
        console.error("Transmission Interrupted:", err);
      } finally {
        // Enforce a minimum immersive loading sequence 
        setTimeout(() => setLoading(false), 3000);
      }
    };
    fetchData();
  }, [keyword]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div 
        className="h-screen flex flex-col items-center justify-center bg-noir text-sinRed font-mono relative overflow-hidden selection:bg-sinRed selection:text-white"
        style={{ backgroundImage: `url(${cityBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
        
        <div className="relative z-20 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 mb-8 rounded-xl overflow-hidden border-2 border-sinRed/30 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
          >
            <img src={triangleLoading} alt="Loading Sequence" className="w-full h-full object-cover mix-blend-screen" />
          </motion.div>
          
          <h2 className="text-2xl md:text-5xl font-black tracking-widest text-center h-12">
            {loadingText}
          </h2>
          <p className="mt-6 text-zinc-500 tracking-[0.5em] uppercase text-xs md:text-sm animate-pulse">Running sequence for: {keyword}</p>
          <div className="w-64 h-1 bg-zinc-900 mt-12 overflow-hidden">
            <div className="h-full bg-sinRed animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir font-mono relative pb-20 pt-8 px-4 md:px-12 selection:bg-sinRed selection:text-white">
      {/* Background & Scanlines */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${cityBg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)' }}
      ></div>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-overlay border-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-16">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 px-4 py-2 border border-transparent hover:border-zinc-700 transition-all rounded mb-8 group uppercase text-xs tracking-widest font-bold w-max"
          >
            <span className="text-sinRed group-hover:animate-pulse">{"<~>"}</span> ABORT & RETURN TO TERMINAL
          </button>
          
          <div className="border-b border-zinc-800/80 pb-8 flex items-end justify-between">
            <div>
              <p className="text-sinRed text-sm tracking-[0.3em] font-bold uppercase mb-2">Target Acquired</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white shadow-black drop-shadow-md break-all">"{keyword}"</h1>
            </div>
            <div className="hidden md:flex flex-col items-end opacity-50 text-xs text-zinc-400">
              <span className="flex items-center gap-2"><Fingerprint size={12}/> ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              <span>NODE: SECTOR-7G</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* UNCONFIRMED SECTION (Underground) */}
          <section>
            <div className="flex items-center gap-4 text-sinRed mb-8 border-l-4 border-sinRed pl-4 bg-gradient-to-r from-sinRed/10 to-transparent py-2">
              <Skull size={32} />
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-widest">The Underground</h2>
                <p className="text-[10px] sm:text-xs text-sinRed/70 uppercase tracking-widest">Unverified Chatter / Anomaly Detected</p>
              </div>
            </div>
            
            {data.unconfirmed.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                {data.unconfirmed.map((item) => (
                  <motion.div variants={itemVariants} key={item._id} className="relative bg-zinc-900/80 border border-zinc-800 p-6 hover:bg-zinc-900 hover:border-sinRed/80 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-300 group overflow-hidden flex flex-col">
                    {/* Decorative side accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-sinRed transition-colors z-20"></div>
                    
                    {/* Visual Watermark */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-8xl font-black text-black/40 pointer-events-none tracking-widest whitespace-nowrap z-0 select-none">
                        RESTRICTED
                      </div>
                    </div>

                    <div className="relative z-10 flex-col flex h-full">
                      {/* Removed Thumbnail */}

                      <div className="flex justify-between items-start mb-4">
                        <span className="flex items-center gap-2 text-[10px] sm:text-xs text-sinRed font-bold uppercase tracking-tighter bg-sinRed/10 px-2 py-1 border border-sinRed/20">
                          <AlertTriangle size={12} /> THREAT: HIGH
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase font-black flex items-center gap-1"><Activity size={10}/> {item.source}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-sinRed transition-colors leading-tight">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-sans line-clamp-3">{item.content}</p>
                      
                      <div className="mt-auto flex justify-between items-center text-xs">
                        <div className="flex gap-2">
                          <div className="w-1 h-3 bg-sinRed/50 animate-pulse"></div>
                          <div className="w-1 h-3 bg-sinRed/30 animate-pulse delay-75"></div>
                          <div className="w-1 h-3 bg-sinRed/10 animate-pulse delay-150"></div>
                        </div>
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-sinRed hover:text-white uppercase font-bold tracking-widest flex items-center gap-2 group-hover:underline bg-sinRed/10 hover:bg-sinRed/20 px-4 py-2 border border-sinRed/20 transition-colors">
                          Trace Source <Link size={12}/>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
               <div className="border border-zinc-800 border-dashed p-8 text-center text-zinc-600 uppercase font-black tracking-widest">
                 No anomalies detected.
               </div>
            )}
          </section>

          {/* CONFIRMED SECTION (Official Record) */}
          <section>
            <div className="flex items-center gap-4 text-blue-400 mb-8 border-l-4 border-blue-400 pl-4 bg-gradient-to-r from-blue-400/10 to-transparent py-2">
              <Shield size={32} />
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-widest text-white">Official Record</h2>
                <p className="text-[10px] sm:text-xs text-blue-400/70 uppercase tracking-widest">Verified Press / Secure Channels</p>
              </div>
            </div>

            {data.confirmed.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                {data.confirmed.map((item) => (
                  <motion.div variants={itemVariants} key={item._id} className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 group shadow-[8px_8px_0px_#09090b] hover:shadow-[12px_12px_0px_#09090b] hover:-translate-y-1 hover:-translate-x-1 overflow-hidden flex flex-col">
                    
                    {/* Visual Watermark */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-7xl font-black text-white/5 pointer-events-none tracking-widest whitespace-nowrap z-0 select-none border-y-8 border-white/5 py-4">
                        CONFIRMED DECRYPT
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex-col flex h-full">
                      {/* Removed Thumbnail */}

                      <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                        <span className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-widest">
                          <Eye size={14}/> CLEARANCE: PUBLIC
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase font-black bg-white/10 px-2 py-1">{item.source}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-white leading-tight uppercase font-sans tracking-tight group-hover:text-blue-300 transition-colors">{item.title}</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-sans line-clamp-3">{item.content}</p>
                      
                      <div className="mt-auto flex justify-end">
                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-blue-500 hover:text-white text-zinc-300 px-4 py-2 uppercase font-bold tracking-widest text-xs transition-colors border border-white/5 text-shadow-sm">
                          <FileText size={14} /> Access Document
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="border border-white/10 border-dashed p-8 text-center text-zinc-600 uppercase font-black tracking-widest">
                The record is clean.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}