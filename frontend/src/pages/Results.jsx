import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Skull, ArrowLeft } from 'lucide-react';

export default function Results() {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ confirmed: [], unconfirmed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Step 1: Trigger the scrapers on your backend (requires JWT token)
        const token = localStorage.getItem('token');
        await axios.get(`http://10.91.245.152:5000/scrape/${keyword}`, {
          headers: { Authorization: token }
        });

        // Step 2: Fetch the compiled results from MongoDB
        const res = await axios.get(`http://10.91.245.152:5000/collect?keyword=${keyword}`);
        
        setData({
          confirmed: res.data.filter(i => i.filter === "official"),
          unconfirmed: res.data.filter(i => i.filter === "media")
        });
      } catch (err) {
        console.error("Transmission Interrupted:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-noir text-sinRed font-mono animate-pulse">
      INTERROGATING SOURCES FOR "{keyword.toUpperCase()}"...
    </div>
  );

  return (
    <div className="min-h-screen bg-noir p-8 font-mono">
      <button 
        onClick={() => navigate('/home')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-all"
      >
        <ArrowLeft size={18} /> RETURN TO STREETS
      </button>

      <header className="mb-16 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Subject: {keyword}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* UNCONFIRMED SECTION (4chan/Reddit) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-sinRed mb-8 border-l-4 border-sinRed pl-4">
            <Skull size={32} />
            <h2 className="text-3xl font-bold uppercase tracking-widest">The Underground</h2>
          </div>
          
          {data.unconfirmed.length > 0 ? data.unconfirmed.map((item) => (
            <div key={item._id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm hover:border-sinRed/50 transition-colors group">
              <span className="text-xs text-sinRed font-bold uppercase tracking-tighter mb-2 block">[ LOW VERACITY SIGNAL ]</span>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-sinRed transition-colors">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{item.content?.substring(0, 200)}...</p>
              <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase">
                <span>Source: {item.source}</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-white underline">Interrogate URL</a>
              </div>
            </div>
          )) : <p className="text-zinc-700 italic">No whispers found in the dark...</p>}
        </section>

        {/* CONFIRMED SECTION (News) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-white mb-8 border-l-4 border-white pl-4">
            <Shield size={32} />
            <h2 className="text-3xl font-bold uppercase tracking-widest">Official Record</h2>
          </div>

          {data.confirmed.length > 0 ? data.confirmed.map((item) => (
            <div key={item._id} className="bg-white text-black p-6 rounded-sm shadow-[8px_8px_0px_#111] hover:translate-x-1 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-black uppercase tracking-tighter mb-2 block border-b border-black/10 pb-1">Verified Report</span>
              <h3 className="text-xl font-black mb-3 leading-tight uppercase">{item.title}</h3>
              <p className="text-zinc-800 text-sm leading-relaxed mb-4 font-sans">{item.content}</p>
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span>Agency: {item.source}</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="bg-black text-white px-3 py-1 hover:bg-zinc-800 transition-colors">View Document</a>
              </div>
            </div>
          )) : <p className="text-zinc-700 italic">The record is clean. For now.</p>}
        </section>
      </div>
    </div>
  );
}