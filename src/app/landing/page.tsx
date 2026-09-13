"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { CertifiedStatement } from "@/components/ui/CertifiedStatement";

export default function LandingPage() {
  const stopRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dot = entry.target.querySelector(`.${styles.dot}`);
            if (dot) dot.classList.add(styles.lit);
            entry.target.querySelectorAll<HTMLElement>("[data-target]").forEach((el) => {
              el.style.width = el.dataset.target + "%";
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stopRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const addStop = (el: HTMLDivElement | null) => {
    if (el && !stopRefs.current.includes(el)) stopRefs.current.push(el);
  };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Audiowide&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ background: "#08090C", color: "#ECEAF5", fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, lineHeight: 1.55, WebkitFontSmoothing: "antialiased", minHeight: "100vh" }}>

        {/* NAV */}
        <header className={styles.header}>
          <nav className={`${styles.nav} ${styles.wrap}`}>
            <Link className={styles.brand} href="/">
              <svg viewBox="0 0 200 200" width={28} height={28} aria-hidden="true">
                <defs>
                  <linearGradient id="navGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A8E94" />
                    <stop offset="60%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#FF2E9A" />
                  </linearGradient>
                </defs>
                <path d="M100 142c-8 4-13-2-8-8 8-9 20 2 20 12s-13 20-27 16-24-20-19-36 24-27 41-20 27 26 19 43-31 27-51 18" fill="none" stroke="url(#navGrad)" strokeWidth="12" strokeLinecap="round" />
                <circle cx="150" cy="27" r="6" fill="#fff" />
              </svg>
              <span className={styles.brandText}>KAIZEN</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="#how" className={`${styles.navLink} ${styles.navLinksHide}`}>How it works</Link>
              <Link href="#features" className={`${styles.navLink} ${styles.navLinksHide}`}>Features</Link>
              <Link href="/login" className={styles.navCta}>Start your quest</Link>
            </div>
          </nav>
        </header>

        <main id="top">
          {/* HERO */}
          <section className={styles.hero}>
            <div className={`${styles.wrap} ${styles.heroGrid}`}>
              <div>
                <p className={styles.kicker}>a life RPG, not another to-do list</p>
                <h1 className={styles.headline}>
                  Every task is a quest.<br />Every day is a <em className={styles.headlineEm}>level</em>.
                </h1>
                <p className={styles.sub}>
                  Kaizen turns your real tasks into a character sheet. Finish a workout, a chapter, a deep-work block — earn XP and gold instantly, calculated server-side so nothing can be faked.
                </p>
                <div className={styles.ctaRow}>
                  <Link className={styles.btnPrimary} href="/login">Start your quest</Link>
                  <Link className={styles.btnGhost} href="#how">See how it works</Link>
                </div>
                <p className={styles.finePrint}>Free to start, no credit card needed.</p>
              </div>
              <div className={styles.heroMark}>
                <svg viewBox="0 0 200 200" style={{ width: "min(100%, 340px)", height: "auto", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6C7076" />
                      <stop offset="45%" stopColor="#E7E9ED" />
                      <stop offset="70%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="#FF2E9A" />
                    </linearGradient>
                    <radialGradient id="heroFlareGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                      <stop offset="45%" stopColor="#FF2E9A" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#FF2E9A" stopOpacity="0" />
                    </radialGradient>
                    <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.6" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path className={styles.heroSpiral} d="M 100.00 142.00 Q 99.47 141.02 99.17 140.55 Q 98.88 140.08 98.55 139.65 Q 98.23 139.21 97.88 138.80 Q 97.53 138.40 97.15 138.03 Q 96.78 137.66 96.39 137.32 Q 96.00 136.99 95.59 136.70 Q 95.18 136.41 94.76 136.16 Q 94.35 135.92 93.92 135.71 Q 93.50 135.51 93.07 135.35 Q 92.65 135.20 92.22 135.09 Q 91.80 134.98 91.38 134.92 Q 90.97 134.86 90.57 134.85 Q 90.17 134.83 89.78 134.87 Q 89.40 134.90 89.04 134.98 Q 88.68 135.06 88.35 135.19 Q 88.02 135.31 87.72 135.48 Q 87.42 135.65 87.16 135.85 Q 86.90 136.06 86.69 136.30 Q 86.47 136.54 86.30 136.82 Q 86.13 137.09 86.01 137.39 Q 85.89 137.70 85.82 138.03 Q 85.76 138.35 85.75 138.70 Q 85.74 139.04 85.79 139.40 Q 85.85 139.76 85.96 140.13 Q 86.07 140.50 86.25 140.87 Q 86.43 141.24 86.67 141.61 Q 86.92 141.97 87.23 142.33 Q 87.53 142.69 87.91 143.03 Q 88.28 143.37 88.72 143.68 Q 89.16 144.00 89.66 144.29 Q 90.17 144.58 90.73 144.83 Q 91.29 145.08 91.92 145.29 Q 92.54 145.50 93.22 145.67 Q 93.90 145.83 94.63 145.94 Q 95.36 146.05 96.14 146.10 Q 96.92 146.15 97.74 146.14 Q 98.56 146.13 99.42 146.05 Q 100.28 145.96 101.18 145.81 Q 102.07 145.65 102.99 145.42 Q 103.90 145.19 104.84 144.88 Q 105.78 144.57 106.72 144.17 Q 107.67 143.78 108.63 143.30 Q 109.58 142.82 110.53 142.26 Q 111.48 141.70 112.42 141.04 Q 113.36 140.39 114.28 139.66 Q 115.20 138.92 116.09 138.10 Q 116.98 137.27 117.84 136.37 Q 118.70 135.46 119.52 134.47 Q 120.33 133.48 121.10 132.41 Q 121.86 131.34 122.57 130.20 Q 123.28 129.06 123.92 127.85 Q 124.57 126.63 125.14 125.35 Q 125.71 124.07 126.20 122.73 Q 126.69 121.39 127.10 120.00 Q 127.51 118.61 127.83 117.17 Q 128.14 115.73 128.37 114.25 Q 128.59 112.77 128.71 111.27 Q 128.84 109.76 128.86 108.23 Q 128.88 106.69 128.80 105.15 Q 128.71 103.60 128.52 102.06 Q 128.33 100.51 128.03 98.96 Q 127.73 97.42 127.32 95.89 Q 126.91 94.36 126.39 92.85 Q 125.87 91.35 125.24 89.88 Q 124.61 88.40 123.88 86.98 Q 123.15 85.55 122.31 84.18 Q 121.48 82.80 120.54 81.49 Q 119.61 80.18 118.58 78.94 Q 117.55 77.70 116.44 76.54 Q 115.32 75.38 114.12 74.31 Q 112.93 73.24 111.65 72.26 Q 110.38 71.29 109.04 70.42 Q 107.70 69.55 106.30 68.79 Q 104.90 68.02 103.45 67.38 Q 102.00 66.73 100.52 66.21 Q 99.03 65.69 97.51 65.29 Q 95.99 64.89 94.46 64.62 Q 92.92 64.35 91.37 64.21 Q 89.83 64.07 88.29 64.07 Q 86.75 64.06 85.22 64.19 Q 83.70 64.32 82.20 64.58 Q 80.70 64.84 79.23 65.23 Q 77.77 65.62 76.36 66.14 Q 74.95 66.66 73.60 67.30 Q 72.25 67.95 70.97 68.72 Q 69.69 69.48 68.49 70.36 Q 67.30 71.24 66.19 72.23 Q 65.09 73.22 64.09 74.32 Q 63.09 75.41 62.20 76.59 Q 61.32 77.78 60.55 79.04 Q 59.79 80.31 59.15 81.66 Q 58.51 83.00 58.01 84.40 Q 57.51 85.81 57.15 87.27 Q 56.79 88.73 56.58 90.22 Q 56.36 91.72 56.30 93.25 Q 56.24 94.77 56.34 96.32 Q 56.43 97.86 56.68 99.40 Q 56.93 100.94 57.34 102.47 Q 57.75 104.01 58.31 105.51 Q 58.88 107.02 59.60 108.49 Q 60.32 109.95 61.19 111.37 Q 62.07 112.78 63.09 114.13 Q 64.12 115.48 65.29 116.76 Q 66.45 118.03 67.76 119.21 Q 69.07 120.39 70.51 121.47 Q 71.95 122.54 73.51 123.51 Q 75.07 124.47 76.75 125.30 Q 78.43 126.14 80.21 126.84 Q 81.99 127.54 83.86 128.09 Q 85.73 128.65 87.69 129.05 Q 89.64 129.45 91.66 129.68 Q 93.68 129.92 95.76 129.99 Q 97.83 130.06 99.95 129.96 Q 102.07 129.86 104.21 129.57 Q 106.35 129.29 108.50 128.83 Q 110.66 128.37 112.80 127.73 Q 114.95 127.08 117.08 126.26 Q 119.21 125.43 121.30 124.42 Q 123.39 123.42 125.44 122.23 Q 127.48 121.05 129.45 119.68 Q 131.43 118.32 133.32 116.79 Q 135.21 115.26 137.01 113.56 Q 138.81 111.87 140.50 110.02 Q 142.18 108.16 143.74 106.16 Q 145.31 104.17 146.73 102.03 Q 148.16 99.89 149.43 97.63 Q 150.71 95.36 151.83 92.99 Q 152.94 90.61 153.89 88.13 Q 154.83 85.65 155.60 83.09 Q 156.37 80.52 156.94 77.88 Q 157.52 75.24 157.91 72.55 Q 158.29 69.86 158.48 67.12 Q 158.66 64.39 158.64 61.63 Q 158.62 58.87 158.40 56.11 Q 158.17 53.35 157.74 50.59 Q 157.31 47.84 156.67 45.12 Q 156.03 42.40 155.18 39.72 Q 154.34 37.04 153.29 34.43 Q 152.24 31.82 151.00 29.28 L 149.75 26.75" />
                  <circle className={styles.heroFlare} cx="149.75" cy="26.75" r="17" fill="url(#heroFlareGrad)" />
                  <circle className={styles.heroCore} cx="149.75" cy="26.75" r="5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          </section>

          {/* LEVEL PATH */}
          <div className={`${styles.wrap} ${styles.pathSection}`}>

            <div className={styles.stop} ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <h2 className={styles.stopTitle}>To-do lists forget you finished.</h2>
                <p>Checkboxes don&apos;t celebrate. Streak trackers don&apos;t level up. Kaizen borrows the feedback loop games perfected — visible growth, instant reward — and points it at your actual life instead of a fictional one.</p>
              </div>
            </div>

            <div className={styles.stop} id="how" ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <span className={styles.eyebrowNum}>1</span>
                <h2 className={styles.stopTitle}>Log a quest</h2>
                <p>Add a task and tag which stat it trains — Strength for the gym, Intellect for study, Discipline for the boring-but-important stuff.</p>
              </div>
            </div>

            <div className={styles.stop} ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <span className={styles.eyebrowNum}>2</span>
                <h2 className={styles.stopTitle}>Complete it</h2>
                <p>One tap. XP and gold land instantly, calculated on the server — so your progress is real, not just a number you could type in yourself.</p>
              </div>
            </div>

            <div className={styles.stop} ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <span className={styles.eyebrowNum}>3</span>
                <h2 className={styles.stopTitle}>Level up</h2>
                <p>Each level asks for a bit more XP than the last, so early wins come fast and the ones further out actually mean something.</p>
              </div>
            </div>

            {/* FEATURES */}
            <div className={styles.stop} id="features" ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <h2 className={styles.stopTitle}>Built to feel like progress, not paperwork.</h2>
                <div className={styles.featureGrid}>

                  <div className={styles.featureAttrs}>
                    <div>
                      <div className={styles.iconBadge}>
                        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#00E5FF" strokeWidth="1.8"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" /></svg>
                      </div>
                      <h3>Stats that mean something</h3>
                      <p>Every quest trains a stat. Hit the gym enough and Strength climbs. Read enough and Intellect does. Your character sheet ends up describing how you actually spent the week.</p>
                    </div>
                    <div className={styles.attrBars}>
                      {[["Strength", "72"], ["Intellect", "58"], ["Discipline", "84"], ["Creativity", "40"]].map(([label, target]) => (
                        <div key={label} className={styles.attrRow}>
                          <span className={styles.attrLabel}>{label}</span>
                          <div className={styles.attrTrack}><div className={styles.attrFill} data-target={target} /></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.featureCard}>
                    <div className={styles.iconBadge}>
                      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#FF2E9A" strokeWidth="1.8"><path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-2-1-3-1-3s2 1 2 5a5 5 0 01-10 0c0-6 5-6 6-11z" /></svg>
                    </div>
                    <h3>Keep the fire lit</h3>
                    <p>Show up two days running and Kaizen starts counting. Miss a day and it resets — no partial credit, same as it would in any real habit.</p>
                  </div>

                  <div className={styles.featureCard}>
                    <div className={styles.iconBadge}>
                      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#E7E9ED" strokeWidth="1.8"><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9 10.5c0-1 1-1.5 2.5-1.5S14 9.7 14 11c0 2-4 1.7-4 3.7 0 1.1 1 1.8 2.5 1.8s2.5-.6 2.5-1.5" /></svg>
                    </div>
                    <h3>Spend what you earn</h3>
                    <p>Gold buys cosmetic badges, frames, and unlockable themes — including an arcade-neon skin for the whole app once you&apos;ve put in the work.</p>
                  </div>

                </div>
              </div>
            </div>

            {/* SCREEN PREVIEW */}
            <div className={styles.stop} ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={styles.stopBody}>
                <h2 className={styles.stopTitle}>Your character sheet, always current.</h2>
                <p>No refresh needed — the moment you complete a quest, the whole sheet updates.</p>
                <div className={styles.device} style={{ marginTop: 26 }}>
                  <div className={styles.screen}>
                    <div className={styles.screenTop}>
                      <span className={styles.lvlBadge}>LV 14</span>
                      <span className={styles.gold}>
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#E7E9ED" strokeWidth="1.8"><circle cx="12" cy="12" r="8" /></svg>
                        1,240 gold
                      </span>
                    </div>
                    <div className={styles.xpTrack}><div className={styles.xpFill} data-target="66" /></div>
                    <div className={styles.streak}>
                      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#FF2E9A" strokeWidth="1.8"><path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-2-1-3-1-3s2 1 2 5a5 5 0 01-10 0c0-6 5-6 6-11z" /></svg>
                      9-day streak
                    </div>
                    <div className={styles.attrBars}>
                      {[["Strength", "70"], ["Intellect", "55"], ["Discipline", "88"]].map(([label, target]) => (
                        <div key={label} className={`${styles.attrRow}`} style={{ marginBottom: 10 }}>
                          <span className={styles.attrLabel}>{label}</span>
                          <div className={styles.attrTrack}><div className={styles.attrFill} data-target={target} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FINAL CTA */}
            <div className={styles.stop} id="start" ref={addStop}>
              <div className={styles.stopRail}><div className={styles.dot} /></div>
              <div className={`${styles.stopBody} ${styles.final}`}>
                <div className={styles.sparkWrap}>
                  <svg viewBox="0 0 40 40" width={44} height={44} aria-hidden="true">
                    <defs>
                      <radialGradient id="finalFlare" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="45%" stopColor="#FF2E9A" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#FF2E9A" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="20" cy="20" r="18" fill="url(#finalFlare)" />
                    <circle cx="20" cy="20" r="5" fill="#fff" />
                  </svg>
                </div>
                <h2 className={styles.finalTitle}>Your next level starts today.</h2>
                <p className={styles.finalSub}>Bring your own tasks. Kaizen brings the progression system.</p>
                <div className={styles.finalCtaRow}>
                  <Link className={styles.btnPrimary} href="/login">Start your quest — it&apos;s free</Link>
                </div>
              </div>
            </div>

          </div>
        </main>

        <footer className={styles.footer}>
          <div className={`${styles.wrap} ${styles.footRow}`}>
            <div className={styles.footBrand}>
              <svg viewBox="0 0 200 200" width={22} height={22} aria-hidden="true">
                <path d="M100 142c-8 4-13-2-8-8 8-9 20 2 20 12s-13 20-27 16-24-20-19-36 24-27 41-20 27 26 19 43-31 27-51 18" fill="none" stroke="#8A8E94" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <span className={styles.footBrandText}>KAIZEN</span>
            </div>
            <p className={styles.footTagline}>small steps. real progress.</p>
            <div className={styles.footLinks}>
              <a href="#" className={styles.footLink}>GitHub</a>
              <a href="#" className={styles.footLink}>Docs</a>
              <a href="#" className={styles.footLink}>Contact</a>
            </div>
          </div>
          <div className="flex justify-center mt-8 pb-4 text-center">
            <CertifiedStatement />
          </div>
        </footer>

      </div>
    </>
  );
}
