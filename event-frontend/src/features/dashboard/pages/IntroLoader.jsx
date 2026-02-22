import { useEffect, useState } from "react";

export default function IntroLoader({ onFinish }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    // Phases: idle -> entry -> drawing -> glow -> exit
    const t1 = setTimeout(() => setPhase("entry"), 100);
    const t2 = setTimeout(() => setPhase("drawing"), 800);
    const t3 = setTimeout(() => setPhase("glow"), 3800);
    const t4 = setTimeout(() => setPhase("exit"), 5500);
    const t5 = setTimeout(() => onFinish?.(), 6700);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <>
      <div className={`intro-container ${phase}`}>
        {/* Background Ambient Glows */}
        <div className="bg-glow blob-1" />
        <div className="bg-glow blob-2" />

        <div className="content-box">
          <svg viewBox="0 0 1000 300" className="main-logo">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="telugu-text"
            >
              వేధిక
            </text>
          </svg>

          <div className="divider-line" />
          
          <div className="branding-footer">
            <span className="subtitle">NEXT-GEN COLLABORATION</span>
            <div className="loading-bar">
              <div className="progress-fill" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --bg-dark: #030712;
          --accent: #818cf8;
        }

        .intro-container {
          position: fixed;
          inset: 0;
          background: var(--bg-dark);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          overflow: hidden;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Ambient Background Blobs */
        .bg-glow {
          position: absolute;
          width: 40vw;
          height: 40vw;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0;
          transition: opacity 2s ease;
        }
        .blob-1 { top: -10%; left: -10%; background: rgba(99, 102, 241, 0.15); }
        .blob-2 { bottom: -10%; right: -10%; background: rgba(236, 72, 153, 0.1); }
        .entry .bg-glow { opacity: 1; }

        /* Layout & Responsiveness */
        .content-box {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 20px;
          perspective: 1000px;
        }

        .main-logo {
          width: 600px;
          max-width: 85vw;
          filter: drop-shadow(0 0 0px rgba(129, 140, 248, 0));
          transition: all 1.5s ease;
        }

        .telugu-text {
          font-family: 'Inter', system-ui, sans-serif; /* Fallback to system for Telugu */
          font-size: 180px;
          font-weight: 800;
          fill: transparent;
          stroke: url(#logoGrad);
          stroke-width: 1.5;
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          transition: fill 1.2s ease, stroke 1.2s ease;
        }

        /* Drawing Animation */
        .drawing .telugu-text {
          animation: drawPath 3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        /* Glow & Solid Phase */
        .glow .telugu-text {
          fill: white;
          stroke: transparent;
          filter: url(#glow);
        }

        /* Divider & Subtitle */
        .divider-line {
          width: 0px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          margin: 20px 0;
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .drawing .divider-line { width: 300px; }

        .branding-footer {
          opacity: 0;
          transform: translateY(10px);
          transition: all 1s ease 0.5s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .drawing .branding-footer { opacity: 1; transform: translateY(0); }

        .subtitle {
          color: #94a3b8;
          letter-spacing: 0.4em;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .loading-bar {
          width: 120px;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          width: 0%;
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }
        .drawing .progress-fill {
          animation: progress 4s linear forwards;
        }

        /* Exit Animation */
        .exit {
          opacity: 0;
          pointer-events: none;
          transform: scale(1.05);
        }

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @media (max-width: 640px) {
          .telugu-text { font-size: 140px; }
          .drawing .divider-line { width: 200px; }
          .subtitle { font-size: 10px; letter-spacing: 0.3em; }
        }
      `}</style>
    </>
  );
}