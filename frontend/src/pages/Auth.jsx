import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Crosshair, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Provide credentials.');
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const url = `http://10.91.245.152:5000${endpoint}`;
      
      const res = await axios.post(url, { username, password });
      
      if (isLogin) {
        // Backend returns: { token: 'Bearer <token>' }
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      } else {
        // Registration successful
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setError('Clearance granted. You may now authenticate.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir p-4 font-mono selection:bg-sinRed selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-4 text-sinRed"
          >
            <ShieldAlert size={48} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">
            CONSPIRE
          </h1>
          <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase">
            Restricted Access Terminal
          </p>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-8 shadow-[8px_8px_0px_rgba(220,38,38,0.2)]"
        >
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b-2 border-zinc-800 pb-2 flex items-center gap-2">
            <Crosshair size={20} className="text-sinRed" />
            {isLogin ? 'Authenticate' : 'Initiate'}
          </h2>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-3 text-sm font-bold uppercase border-l-4 ${error.includes('granted') ? 'bg-green-900/20 text-green-500 border-green-500' : 'bg-sinRed/10 text-sinRed border-sinRed'}`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Operative ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 py-3 px-4 text-white outline-none focus:border-sinRed transition-colors font-mono"
                placeholder="Enter designation..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cipher Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 py-3 px-4 text-white outline-none focus:border-sinRed transition-colors font-mono"
                placeholder="Enter cipher..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-4 mt-8 hover:bg-sinRed hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Access System' : 'Establish Link'
              )}
            </button>
          </form>
        </motion.div>

        {/* Toggle between Login and Register */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            {isLogin ? "No credentials? Request clearance." : "Already an operative? Authenticate."}
          </button>
        </div>

      </div>
    </div>
  );
}
