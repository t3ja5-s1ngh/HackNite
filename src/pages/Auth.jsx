import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldAlert, Crosshair, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2.0 + 1.0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(161, 161, 170, 0.9)";
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(161, 161, 170, ${0.4 - distance / 400})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen"
    />
  );
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Provide credentials.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

      const res = await axios.post(url, { username, password });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        setIsLogin(true);
        setUsername("");
        setPassword("");
        setError("Clearance granted. You may now authenticate.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Authentication sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-mono selection:bg-sinRed selection:text-white relative overflow-hidden">
      <ParticleNetwork />

      <div className="w-full max-w-md relative z-10 block">
        <div className="text-center mb-16 mt-8 flex flex-col items-center">
          <h1 className="flex items-center text-6xl md:text-8xl font-mono font-black tracking-tight uppercase text-zinc-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all">
            <span>C</span>
            <div className="inline-flex items-center justify-center relative w-[0.85em] h-[0.85em] mx-1 md:mx-1.5">
              <svg
                viewBox="0 0 100 100"
                className="absolute w-full h-full animate-[spin_8s_linear_infinite] origin-center text-[#dc2626] opacity-[0.85] drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                <polygon
                  points="15.36,70 50,10 84.64,70"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>
            <span>NSPIRE</span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-8 shadow-[8px_8px_0px_rgba(220,38,38,0.2)]"
        >
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b-2 border-zinc-800 pb-2">
            {isLogin ? "Authenticate" : "Initiate"}
          </h2>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-3 text-sm font-bold uppercase border-l-4 ${error.includes("granted") ? "bg-green-900/20 text-green-500 border-green-500" : "bg-red-600/10 text-red-600 border-red-600"}`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Operative ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 py-3 px-4 text-white outline-none focus:border-red-600 transition-colors font-mono"
                placeholder="Enter designation..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Cipher Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 py-3 px-4 text-white outline-none focus:border-red-600 transition-colors font-mono"
                placeholder="Enter cipher..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-4 mt-8 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                "Access System"
              ) : (
                "Establish Link"
              )}
            </button>
          </form>
        </motion.div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setUsername("");
              setPassword("");
            }}
            className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            {isLogin
              ? "No credentials? Request clearance."
              : "Already an operative? Authenticate."}
          </button>
        </div>
      </div>
    </div>
  );
}
