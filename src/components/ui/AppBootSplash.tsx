"use client";

import { useEffect, useState } from "react";

export function AppBootSplash() {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Start animation shortly after DOM mount
    const startTimer = setTimeout(() => {
      setAnimating(true);
    }, 100);

    // Fade out after formation sequence completes (~2.2s)
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 2200);

    // Completely remove splash overlay after fade out completes
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2700);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  function handleDismiss() {
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!mounted || !visible) return null;

  const spiralPath =
    "M 100.00 142.00 Q 99.47 141.02 99.17 140.55 Q 98.88 140.08 98.55 139.65 Q 98.23 139.21 97.88 138.80 Q 97.53 138.40 97.15 138.03 Q 96.78 137.66 96.39 137.32 Q 96.00 136.99 95.59 136.70 Q 95.18 136.41 94.76 136.16 Q 94.35 135.92 93.92 135.71 Q 93.50 135.51 93.07 135.35 Q 92.65 135.20 92.22 135.09 Q 91.80 134.98 91.38 134.92 Q 90.97 134.86 90.57 134.85 Q 90.17 134.83 89.78 134.87 Q 89.40 134.90 89.04 134.98 Q 88.68 135.06 88.35 135.19 Q 88.02 135.31 87.72 135.48 Q 87.42 135.65 87.16 135.85 Q 86.90 136.06 86.69 136.30 Q 86.47 136.54 86.30 136.82 Q 86.13 137.09 86.01 137.39 Q 85.89 137.70 85.82 138.03 Q 85.76 138.35 85.75 138.70 Q 85.74 139.04 85.79 139.40 Q 85.85 139.76 85.96 140.13 Q 86.07 140.50 86.25 140.87 Q 86.43 141.24 86.67 141.61 Q 86.92 141.97 87.23 142.33 Q 87.53 142.69 87.91 143.03 Q 88.28 143.37 88.72 143.68 Q 89.16 144.00 89.66 144.29 Q 90.17 144.58 90.73 144.83 Q 91.29 145.08 91.92 145.29 Q 92.54 145.50 93.22 145.67 Q 93.90 145.83 94.63 145.94 Q 95.36 146.05 96.14 146.10 Q 96.92 146.15 97.74 146.14 Q 98.56 146.13 99.42 146.05 Q 100.28 145.96 101.18 145.81 Q 102.07 145.65 102.99 145.42 Q 103.90 145.19 104.84 144.88 Q 105.78 144.57 106.72 144.17 Q 107.67 143.78 108.63 143.30 Q 109.58 142.82 110.53 142.26 Q 111.48 141.70 112.42 141.04 Q 113.36 140.39 114.28 139.66 Q 115.20 138.92 116.09 138.10 Q 116.98 137.27 117.84 136.37 Q 118.70 135.46 119.52 134.47 Q 120.33 133.48 121.10 132.41 Q 121.86 131.34 122.57 130.20 Q 123.28 129.06 123.92 127.85 Q 124.57 126.63 125.14 125.35 Q 125.71 124.07 126.20 122.73 Q 126.69 121.39 127.10 120.00 Q 127.51 118.61 127.83 117.17 Q 128.14 115.73 128.37 114.25 Q 128.59 112.77 128.71 111.27 Q 128.84 109.76 128.86 108.23 Q 128.88 106.69 128.80 105.15 Q 128.71 103.60 128.52 102.06 Q 128.33 100.51 128.03 98.96 Q 127.73 97.42 127.32 95.89 Q 126.91 94.36 126.39 92.85 Q 125.87 91.35 125.24 89.88 Q 124.61 88.40 123.88 86.98 Q 123.15 85.55 122.31 84.18 Q 121.48 82.80 120.54 81.49 Q 119.61 80.18 118.58 78.94 Q 117.55 77.70 116.44 76.54 Q 115.32 75.38 114.12 74.31 Q 112.93 73.24 111.65 72.26 Q 110.38 71.29 109.04 70.42 Q 107.70 69.55 106.30 68.79 Q 104.90 68.02 103.45 67.38 Q 102.00 66.73 100.52 66.21 Q 99.03 65.69 97.51 65.29 Q 95.99 64.89 94.46 64.62 Q 92.92 64.35 91.37 64.21 Q 89.83 64.07 88.29 64.07 Q 86.75 64.06 85.22 64.19 Q 83.70 64.32 82.20 64.58 Q 80.70 64.84 79.23 65.23 Q 77.77 65.62 76.36 66.14 Q 74.95 66.66 73.60 67.30 Q 72.25 67.95 70.97 68.72 Q 69.69 69.48 68.49 70.36 Q 67.30 71.24 66.19 72.23 Q 65.09 73.22 64.09 74.32 Q 63.09 75.41 62.20 76.59 Q 61.32 77.78 60.55 79.04 Q 59.79 80.31 59.15 81.66 Q 58.51 83.00 58.01 84.40 Q 57.51 85.81 57.15 87.27 Q 56.79 88.73 56.58 90.22 Q 56.36 91.72 56.30 93.25 Q 56.24 94.77 56.34 96.32 Q 56.43 97.86 56.68 99.40 Q 56.93 100.94 57.34 102.47 Q 57.75 104.01 58.31 105.51 Q 58.88 107.02 59.60 108.49 Q 60.32 109.95 61.19 111.37 Q 62.07 112.78 63.09 114.13 Q 64.12 115.48 65.29 116.76 Q 66.45 118.03 67.76 119.21 Q 69.07 120.39 70.51 121.47 Q 71.95 122.54 73.51 123.51 Q 75.07 124.47 76.75 125.30 Q 78.43 126.14 80.21 126.84 Q 81.99 127.54 83.86 128.09 Q 85.73 128.65 87.69 129.05 Q 89.64 129.45 91.66 129.68 Q 93.68 129.92 95.76 129.99 Q 97.83 130.06 99.95 129.96 Q 102.07 129.86 104.21 129.57 Q 106.35 129.29 108.50 128.83 Q 110.66 128.37 112.80 127.73 Q 114.95 127.08 117.08 126.26 Q 119.21 125.43 121.30 124.42 Q 123.39 123.42 125.44 122.23 Q 127.48 121.05 129.45 119.68 Q 131.43 118.32 133.32 116.79 Q 135.21 115.26 137.01 113.56 Q 138.81 111.87 140.50 110.02 Q 142.18 108.16 143.74 106.16 Q 145.31 104.17 146.73 102.03 Q 148.16 99.89 149.43 97.63 Q 150.71 95.36 151.83 92.99 Q 152.94 90.61 153.89 88.13 Q 154.83 85.65 155.60 83.09 Q 156.37 80.52 156.94 77.88 Q 157.52 75.24 157.91 72.55 Q 158.29 69.86 158.48 67.12 Q 158.66 64.39 158.64 61.63 Q 158.62 58.87 158.40 56.11 Q 158.17 53.35 157.74 50.59 Q 157.31 47.84 156.67 45.12 Q 156.03 42.40 155.18 39.72 Q 154.34 37.04 153.29 34.43 Q 152.24 31.82 151.00 29.28 L 149.75 26.75";

  const letters = ["K", "A", "I", "Z", "E", "N"];

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-500 overflow-hidden"
      style={{
        background: "#050507",
        opacity: closing ? 0 : 1,
        pointerEvents: closing ? "none" : "auto",
        transform: closing ? "scale(1.02)" : "scale(1)",
        filter: closing ? "blur(4px)" : "none",
      }}
      aria-label="Kaizen App Boot Animation - Click or press any key to enter"
      role="button"
      tabIndex={0}
      onKeyDown={handleDismiss}
    >
      {/* Neon radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 45%, rgba(154,76,255,0.18), transparent 70%)",
        }}
      />

      {/* Retro 3D perspective horizon grid */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 opacity-40"
        style={{
          height: "45%",
          backgroundImage:
            "linear-gradient(rgba(255,46,154,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.25) 1px, transparent 1px)",
          backgroundSize: "100% 14%, 8% 100%",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          maskImage: "linear-gradient(to top, black, transparent)",
          transform: "perspective(220px) rotateX(55deg)",
          transformOrigin: "bottom",
        }}
      />

      {/* CRT Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Central Animated Content */}
      <div className="relative z-20 flex flex-col items-center gap-6 max-w-sm px-6">
        {/* Logo Spiral */}
        <div
          style={{ width: "min(46vw, 200px)", aspectRatio: "1/1", position: "relative" }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="bootNeonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="55%" stopColor="#9A4CFF" />
                <stop offset="100%" stopColor="#FF2E9A" />
              </linearGradient>
              <radialGradient id="bootFlareGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="40%" stopColor="#FF2E9A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF2E9A" stopOpacity="0" />
              </radialGradient>
              <filter id="bootGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={spiralPath}
              fill="none"
              stroke="url(#bootNeonGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#bootGlow)"
              style={{
                strokeDasharray: 410,
                strokeDashoffset: animating ? 0 : 410,
                transition: animating
                  ? "stroke-dashoffset 1.45s cubic-bezier(0.65,0,0.35,1)"
                  : "none",
              }}
            />

            <circle
              cx="149.75"
              cy="26.75"
              r="18"
              fill="url(#bootFlareGrad)"
              style={{
                opacity: animating ? 1 : 0,
                transform: animating ? "scale(1)" : "scale(0.2)",
                transformOrigin: "149.75px 26.75px",
                transition: animating
                  ? "opacity 0.45s ease-out 1.3s, transform 0.45s ease-out 1.3s"
                  : "none",
              }}
            />
            <circle
              cx="149.75"
              cy="26.75"
              r="5"
              fill="#FFFFFF"
              style={{
                opacity: animating ? 1 : 0,
                transform: animating ? "scale(1)" : "scale(0.2)",
                transformOrigin: "149.75px 26.75px",
                transition: animating ? "opacity 0.35s ease-out 1.35s" : "none",
              }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          className="flex"
          aria-label="KAIZEN"
          style={{
            fontFamily: "var(--font-audiowide), 'Audiowide', sans-serif",
            fontSize: "clamp(28px, 6vw, 42px)",
            letterSpacing: "0.12em",
            color: "#E9E6FF",
            textShadow:
              "0 0 14px rgba(0,229,255,0.65), 0 0 30px rgba(255,46,154,0.45)",
          }}
        >
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: animating ? 1 : 0,
                transform: animating ? "translateY(0)" : "translateY(12px)",
                transition: animating
                  ? `opacity 0.45s cubic-bezier(.2,.8,.2,1) ${
                      1.4 + i * 0.06
                    }s, transform 0.45s cubic-bezier(.2,.8,.2,1) ${
                      1.4 + i * 0.06
                    }s`
                  : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.24em",
            color: "#8C86B8",
            opacity: animating ? 0.9 : 0,
            transform: animating ? "translateY(0)" : "translateY(6px)",
            transition: animating
              ? "opacity 0.5s ease 1.85s, transform 0.5s ease 1.85s"
              : "none",
            textTransform: "uppercase",
            fontFamily: "var(--font-jetbrains), monospace",
            textAlign: "center",
          }}
        >
          SMALL STEPS. REAL PROGRESS.
        </p>

        {/* Cyberpunk Boot Readout */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
          style={{
            background: "rgba(0, 229, 255, 0.05)",
            border: "1px solid rgba(0, 229, 255, 0.2)",
            opacity: animating ? 1 : 0,
            transition: animating ? "opacity 0.5s ease 1.95s" : "none",
            fontFamily: "var(--font-orbitron), monospace",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ background: "#00E5FF" }}
          />
          <span style={{ color: "#00E5FF", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            SYSTEM ONLINE // INITIALIZING
          </span>
        </div>
      </div>

      {/* Skip Hint */}
      <div
        className="absolute bottom-8 z-20 text-xs tracking-widest uppercase transition-opacity duration-300"
        style={{
          color: "#8C86B8",
          fontSize: "0.65rem",
          fontFamily: "var(--font-orbitron), sans-serif",
          opacity: 0.6,
        }}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}
