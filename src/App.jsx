import { useState, useEffect } from "react";

const DARK = {
  bg: "#0a0b0f",
  surface: "#111318",
  card: "#161921",
  border: "#1e2330",
  orange: "#FF5C1A",
  orangeDim: "#FF5C1A18",
  orangeMid: "#FF5C1A44",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  text: "#e8eaf0",
  muted: "#6b7280",
  subtle: "#9ca3af",
  navBg: "#0d0e12",
  inputBg: "#0d0e12",
};

const LIGHT = {
  bg: "#f2f1ed",
  surface: "#e9e8e3",
  card: "#ffffff",
  border: "#dddbd4",
  orange: "#E84A0C",
  orangeDim: "#E84A0C12",
  orangeMid: "#E84A0C38",
  green: "#16a34a",
  yellow: "#ca8a04",
  red: "#dc2626",
  blue: "#2563eb",
  purple: "#9333ea",
  text: "#111111",
  muted: "#6b7280",
  subtle: "#4b5563",
  navBg: "#ffffff",
  inputBg: "#f9f8f5",
};

function ScoreRing({ score, size = 180, stroke = 14, C }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (animated / 1000) * circ;
  useEffect(() => {
    let start = null;
    const duration = 1400;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(animate);
    };
    const t = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(t);
  }, [score]);
  const color = score >= 700 ? C.green : score >= 450 ? C.yellow : C.red;
  const label = score >= 700 ? "STRONG" : score >= 450 ? "AT RISK" : "EXPOSED";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={C.border} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.05s", filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>{animated}</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: size * 0.09, letterSpacing: "0.15em", color: C.muted, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function DimBar({ label, icon, score, color, maxScore = 200, onClick, C }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW((score / maxScore) * 100), 200); }, [score]);
  return (
    <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateX(3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateX(0)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", fontSize: 15, color: C.text }}>{label}</span>
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color, fontWeight: 700 }}>{score}<span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>/{maxScore}</span></span>
      </div>
      <div style={{ height: 5, background: C.border, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 99, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

function Badge({ icon, label, earned, C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 10px", background: earned ? `${C.orange}15` : C.card, border: `1px solid ${earned ? C.orangeMid : C.border}`, borderRadius: 10, minWidth: 70, opacity: earned ? 1 : 0.45 }}>
      <span style={{ fontSize: 22, filter: earned ? "none" : "grayscale(1)" }}>{icon}</span>
      <span style={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", color: earned ? C.orange : C.muted, textAlign: "center" }}>{label}</span>
    </div>
  );
}

function ActionCard({ priority, title, desc, impact, done, onToggle, C }) {
  const pColor = priority === "critical" ? C.red : priority === "high" ? C.orange : C.yellow;
  return (
    <div style={{ background: done ? `${C.green}0a` : C.card, border: `1px solid ${done ? C.green + "55" : C.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.3s" }}>
      <button onClick={onToggle} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? C.green : C.border}`, background: done ? C.green : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>{done ? "✓" : ""}</button>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, letterSpacing: "0.05em", color: done ? C.muted : C.text, textDecoration: done ? "line-through" : "none" }}>{title}</div>
          <span style={{ fontSize: 10, background: `${pColor}22`, color: pColor, padding: "2px 7px", borderRadius: 99, fontFamily: "'Space Mono', monospace", marginLeft: 8, flexShrink: 0 }}>{priority.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
        <div style={{ fontSize: 11, color: C.green, marginTop: 6 }}>+{impact} score pts if fixed</div>
      </div>
    </div>
  );
}

function Tag({ children, color }) {
  return <span style={{ fontSize: 11, background: `${color}20`, color, border: `1px solid ${color}44`, padding: "3px 10px", borderRadius: 99, fontFamily: "'Space Mono', monospace" }}>{children}</span>;
}

function SpecSection({ title, children, C }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, letterSpacing: "0.12em", color: C.orange, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>{title}</div>
      {children}
    </div>
  );
}

function SpecRow({ label, children, C }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
      <div style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", color: C.muted, paddingTop: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.subtle, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

/* ── TRACE Wordmark ── */
function TraceWordmark({ size = "md" }) {
  const cfg = {
    sm: { fontSize: 13, px: 10, py: 5, radius: 7, tagSize: 9, tagPx: 6, tagPy: 2 },
    md: { fontSize: 17, px: 14, py: 7, radius: 9, tagSize: 10, tagPx: 7, tagPy: 3 },
    lg: { fontSize: 28, px: 22, py: 11, radius: 12, tagSize: 12, tagPx: 10, tagPy: 4 },
  };
  const s = cfg[size];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, userSelect: "none" }}>
      {/* Main pill */}
      <div style={{
        background: "#FF5C1A",
        borderRadius: s.radius,
        padding: `${s.py}px ${s.px}px`,
        display: "flex", alignItems: "center",
        boxShadow: "0 2px 16px #FF5C1A55",
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: s.fontSize,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#ffffff",
          lineHeight: 1,
        }}>TRACE</span>
      </div>
      {/* Subdomain tag */}
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: s.tagSize,
        letterSpacing: "0.28em",
        color: "#FF5C1A",
        textTransform: "uppercase",
        fontWeight: 600,
        opacity: 0.85,
      }}>Digital Footprint</span>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const C = dark ? DARK : LIGHT;
  const [screen, setScreen] = useState("onboarding");
  const [scanStep, setScanStep] = useState(0);
  const [actions, setActions] = useState([false, false, false, false, false, false]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const scanSteps = [
    "Scanning data broker databases...",
    "Checking dark web breach records...",
    "Auditing social media exposure...",
    "Mapping dormant accounts...",
    "Analysing password risk...",
    "Calculating TRACE score...",
  ];

  useEffect(() => {
    if (screen === "scanning") {
      let i = 0;
      const t = setInterval(() => {
        i++; setScanStep(i);
        if (i >= scanSteps.length) { clearInterval(t); setTimeout(() => setScreen("dashboard"), 600); }
      }, 700);
      return () => clearInterval(t);
    }
  }, [screen]);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "breakdown", label: "Breakdown" },
    { id: "actions", label: "Fix It Queue" },
    { id: "spec", label: "Product Spec" },
  ];

  const dimData = [
    { label: "TRAIL — Data Broker Exposure", icon: "🌐", score: 98, color: C.red },
    { label: "RISK — Breach & Dark Web", icon: "🔓", score: 112, color: C.orange },
    { label: "ACCOUNTS — Dormant Profiles", icon: "👤", score: 141, color: C.yellow },
    { label: "CONTROL — Privacy Settings", icon: "🛡", score: 163, color: C.blue },
    { label: "EXPOSURE — Public Footprint", icon: "👁", score: 130, color: C.purple },
  ];

  const allActions = [
    { priority: "critical", title: "Your email found in 3 data breaches", desc: "Change passwords for Canva, LinkedIn, and Adobe — all found in public breach dumps.", impact: 45 },
    { priority: "critical", title: "Phone number listed on 14 data broker sites", desc: "Whitepages, Spokeo, BeenVerified and 11 others have your number publicly listed.", impact: 38 },
    { priority: "high", title: "Instagram profile is fully public", desc: "Your Instagram shows your full name, location tag history and tagged photos to anyone.", impact: 28 },
    { priority: "high", title: "12 dormant accounts detected", desc: "Accounts on Tumblr, MySpace (yes really), Foursquare and 9 others still active.", impact: 22 },
    { priority: "medium", title: "LinkedIn shows your phone number", desc: "Your contact info is visible to all LinkedIn members, not just connections.", impact: 14 },
    { priority: "medium", title: "Enable 2FA on Gmail", desc: "Your primary email doesn't have two-factor authentication enabled.", impact: 18 },
  ];

  const doneCount = actions.filter(Boolean).length;
  const scoreBoost = actions.reduce((acc, v, i) => acc + (v ? allActions[i].impact : 0), 0);

  /* ── Theme toggle button ── */
  const ThemeBtn = () => (
    <button onClick={() => setDark(!dark)} style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "7px 12px", cursor: "pointer", fontSize: 15, lineHeight: 1,
      transition: "all 0.2s", color: C.text,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
      title="Toggle light/dark mode"
    >{dark ? "☀️" : "🌙"}</button>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Barlow', sans-serif", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }
        input { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
      `}</style>

      {/* ── ONBOARDING ── */}
      {screen === "onboarding" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
          {/* bg glow */}
          <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 700, height: 350, background: `radial-gradient(ellipse, #FF5C1A14 0%, transparent 70%)`, pointerEvents: "none" }} />

          {/* top-right theme toggle */}
          <div style={{ position: "absolute", top: 20, right: 24 }}><ThemeBtn /></div>

          <div style={{ maxWidth: 480, width: "100%", textAlign: "center", position: "relative" }}>
            {/* Large wordmark on onboarding */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <TraceWordmark size="lg" />
            </div>

            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.08, marginBottom: 14 }}>
              Know your footprint.<br />
              <span style={{ color: C.orange }}>Control your digital life.</span>
            </h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
              You leave ~1,800 digital traces every month. Find out exactly where your data is, how exposed you are, and fix it — with a score that levels up as you get safer.
            </p>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5, fontFamily: "'Space Mono', monospace" }}>your email</div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.text, fontSize: 15, marginBottom: 14, fontFamily: "'Barlow', sans-serif", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.orange} onBlur={e => e.target.style.borderColor = C.border} />
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5, fontFamily: "'Space Mono', monospace" }}>full name</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.text, fontSize: 15, marginBottom: 20, fontFamily: "'Barlow', sans-serif", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.orange} onBlur={e => e.target.style.borderColor = C.border} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
                {["I reuse passwords", "My social is public", "I've clicked dodgy links", "I use public WiFi"].map((q, i) => (
                  <div key={i} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: C.muted, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                    ⚠ {q}
                  </div>
                ))}
              </div>

              <button onClick={() => setScreen("scanning")} style={{ width: "100%", background: C.orange, border: "none", borderRadius: 9, padding: "15px 0", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, letterSpacing: "0.1em", color: "#fff", cursor: "pointer", fontWeight: 600, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                SCAN MY FOOTPRINT →
              </button>
              <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>We only use your data to scan for you. Never sold. GDPR compliant.</div>
            </div>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28 }}>
              {["500+ platforms scanned", "Dark web checked", "Free to start"].map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: C.muted, display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: C.orange }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCANNING ── */}
      {screen === "scanning" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}><TraceWordmark size="md" /></div>
            <div style={{ width: 56, height: 56, border: `3px solid ${C.border}`, borderTopColor: C.orange, borderRadius: "50%", margin: "0 auto 28px", animation: "spin 0.9s linear infinite" }} />
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, marginBottom: 6 }}>Deep scanning the internet...</h2>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 36 }}>This takes about 30 seconds. We're checking everywhere.</p>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: "left" }}>
              {scanSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", opacity: i < scanStep ? 1 : 0.3, transition: "opacity 0.4s" }}>
                  <span style={{ fontSize: 13, minWidth: 18, color: i < scanStep ? C.green : C.muted }}>{i < scanStep ? "✓" : "○"}</span>
                  <span style={{ fontSize: 12, color: i < scanStep ? C.text : C.muted, fontFamily: "'Space Mono', monospace" }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22, height: 4, background: C.border, borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${(scanStep / scanSteps.length) * 100}%`, background: C.orange, borderRadius: 99, transition: "width 0.6s ease" }} />
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN APP ── */}
      {["dashboard", "breakdown", "actions", "spec"].includes(screen) && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px 60px" }}>

          {/* Nav */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 0", marginBottom: 32,
            borderBottom: `2px solid ${C.border}`,
            position: "sticky", top: 0, background: C.bg, zIndex: 10,
          }}>
            {/* TRACE wordmark — prominent, clickable to reset */}
            <button onClick={() => setScreen("onboarding")} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center",
            }}>
              <TraceWordmark size="md" />
            </button>

            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {navItems.map(n => (
                <button key={n.id} onClick={() => setScreen(n.id)} style={{
                  background: screen === n.id ? C.orangeDim : "transparent",
                  border: `1px solid ${screen === n.id ? C.orangeMid : "transparent"}`,
                  borderRadius: 7, padding: "7px 13px", fontSize: 13,
                  color: screen === n.id ? C.orange : C.muted,
                  cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.06em", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (screen !== n.id) { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.border; } }}
                  onMouseLeave={e => { if (screen !== n.id) { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = "transparent"; } }}>
                  {n.label}
                </button>
              ))}
              <div style={{ width: 1, height: 24, background: C.border, margin: "0 6px" }} />
              <ThemeBtn />
            </div>
          </div>

          {/* ── DASHBOARD ── */}
          {screen === "dashboard" && (
            <div className="fade-up">
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start", marginBottom: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <ScoreRing score={644} size={196} C={C} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Space Mono', monospace" }}>out of 1000</div>
                    {scoreBoost > 0 && <div style={{ fontSize: 12, color: C.green, marginTop: 4, fontFamily: "'Space Mono', monospace" }}>+{scoreBoost} pts available</div>}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.01em" }}>
                      You're moderately exposed, {name || "Sid"}.
                    </h2>
                    <p style={{ color: C.muted, fontSize: 14, marginTop: 6, lineHeight: 1.65 }}>
                      Your data appears on 14 broker sites. 3 breach records found. 12 dormant accounts detected. Your score ranks in the <span style={{ color: C.yellow, fontWeight: 600 }}>bottom 38%</span> of users.
                    </p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Broker Sites", value: "14", color: C.red, icon: "🌐" },
                      { label: "Breaches Found", value: "3", color: C.orange, icon: "🔓" },
                      { label: "Dormant Accounts", value: "12", color: C.yellow, icon: "💤" },
                    ].map((s, i) => (
                      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ fontSize: 20 }}>{s.icon}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 26, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setScreen("actions")} style={{ background: C.orange, border: "none", borderRadius: 9, padding: "13px 0", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: "0.08em", color: "#fff", cursor: "pointer", fontWeight: 600, transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    VIEW FIX IT QUEUE ({allActions.length} actions) →
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.14em", color: C.muted, marginBottom: 12, textTransform: "uppercase" }}>TRACE Breakdown</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {dimData.map((d, i) => <DimBar key={i} {...d} C={C} onClick={() => setScreen("breakdown")} />)}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: "0.14em", color: C.muted, marginBottom: 12, textTransform: "uppercase" }}>Your Badges</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { icon: "🔍", label: "First Scan", earned: true },
                    { icon: "🔒", label: "2FA On", earned: false },
                    { icon: "🧹", label: "Broker Clean", earned: false },
                    { icon: "💀", label: "Dark Web Free", earned: false },
                    { icon: "👻", label: "Ghost Mode", earned: false },
                    { icon: "🛡", label: "Fully Locked", earned: false },
                  ].map((b, i) => <Badge key={i} {...b} C={C} />)}
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>🔥 DAY 1 STREAK</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Complete one action daily to protect your score</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {[1,0,0,0,0,0,0].map((a, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: a ? C.orange : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{a ? "🔥" : ""}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BREAKDOWN ── */}
          {screen === "breakdown" && (
            <div className="fade-up">
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Score Breakdown</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Each of the 5 TRACE dimensions contributes up to 200 points.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {dimData.map((d, i) => {
                  const details = [
                    ["Found on Whitepages, Spokeo, MyLife, BeenVerified + 10 more", "3 brokers actively selling your address history", "Phone + address combo listed on 8 sites"],
                    ["Email found in Canva breach (2023)", "LinkedIn breach exposure detected", "Adobe credentials in dark web dump"],
                    ["12 dormant accounts found across social/forum platforms", "2 accounts with your full DOB public", "Old forum posts with personal info visible"],
                    ["Instagram: public profile", "LinkedIn: phone number visible", "Facebook: check-ins are public"],
                    ["Google shows 47 mentions of your name", "Professional info indexable and cross-linkable", "Public content on 6 platforms combined"],
                  ][i];
                  return (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{d.icon}</span>
                          <div>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: "0.06em" }}>{d.label}</div>
                            <div style={{ marginTop: 5 }}>
                              <Tag color={d.score < 100 ? C.red : d.score < 150 ? C.yellow : C.green}>
                                {d.score < 100 ? "CRITICAL" : d.score < 150 ? "NEEDS WORK" : "GOOD"}
                              </Tag>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: d.color }}>{d.score}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>/ 200</div>
                        </div>
                      </div>
                      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 20px", background: C.surface }}>
                        {details.map((item, j) => (
                          <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: j < 2 ? 8 : 0 }}>
                            <span style={{ color: d.color, fontSize: 12, marginTop: 2 }}>▸</span>
                            <span style={{ fontSize: 13, color: C.subtle, lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── FIX IT QUEUE ── */}
          {screen === "actions" && (
            <div className="fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Fix It Queue</h2>
                  <p style={{ color: C.muted, fontSize: 14 }}>Resolve these to improve your TRACE score</p>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: C.green, fontWeight: 700 }}>+{scoreBoost}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>pts available</div>
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: C.text }}>{doneCount} of {allActions.length} fixed</span>
                  <span style={{ fontSize: 13, color: C.orange }}>{Math.round((doneCount / allActions.length) * 100)}% complete</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${(doneCount / allActions.length) * 100}%`, background: C.orange, borderRadius: 99, transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {["all", "critical", "high", "medium"].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} style={{
                    background: activeTab === t ? C.orangeDim : "transparent",
                    border: `1px solid ${activeTab === t ? C.orangeMid : C.border}`,
                    borderRadius: 7, padding: "6px 14px", fontSize: 12,
                    color: activeTab === t ? C.orange : C.muted,
                    cursor: "pointer", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", transition: "all 0.2s"
                  }}>{t}</button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allActions.filter(a => activeTab === "all" || a.priority === activeTab).map((a, i) => {
                  const realI = allActions.indexOf(a);
                  return <ActionCard key={i} {...a} C={C} done={actions[realI]} onToggle={() => { const n = [...actions]; n[realI] = !n[realI]; setActions(n); }} />;
                })}
              </div>
            </div>
          )}

          {/* ── PRODUCT SPEC ── */}
          {screen === "spec" && (
            <div className="fade-up">
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700 }}>Product Specification</h2>
                <Tag color={C.orange}>v0.1 — DRAFT</Tag>
              </div>

              <SpecSection title="Product Vision" C={C}>
                <SpecRow label="Product name" C={C}>TRACE — stands for Trail, Risk, Accounts, Control, Exposure. One word, sharp, memorable.</SpecRow>
                <SpecRow label="One-liner" C={C}>Know your digital footprint. Fix it. Level up your score.</SpecRow>
                <SpecRow label="Target user" C={C}>Privacy-conscious individuals aged 25–45 who are aware of digital risk but overwhelmed by complexity. Secondary: parents protecting families.</SpecRow>
                <SpecRow label="Core promise" C={C}>The fitness app for your digital life — one score, clear causes, actionable fixes, gamified progress.</SpecRow>
                <SpecRow label="Business model" C={C}>Freemium. Free: initial scan + score + top 3 actions. Paid ($7/mo): full action queue, continuous monitoring, automated broker removal, family plan.</SpecRow>
              </SpecSection>

              <SpecSection title="Onboarding Inputs" C={C}>
                <SpecRow label="Required (Step 1)" C={C}>Email address — the primary anchor for breach checks, broker lookups, and account detection across 500+ platforms.</SpecRow>
                <SpecRow label="Required (Step 1)" C={C}>Full name — cross-references data broker profiles, Google search results, and public records.</SpecRow>
                <SpecRow label="Optional (Step 2)" C={C}>Phone number — significantly improves broker scan accuracy and enables carrier breach checks.</SpecRow>
                <SpecRow label="Optional (Step 2)" C={C}>Username(s) — scans social platforms, forums, gaming networks for account presence.</SpecRow>
                <SpecRow label="Optional (Step 2)" C={C}>Location (city) — narrows data broker results to reduce false positives.</SpecRow>
                <SpecRow label="Quick quiz" C={C}>5 behavioural questions (reuse passwords? public socials? public WiFi? clicked suspicious links? use 2FA?) — feeds into initial score before full scan returns.</SpecRow>
              </SpecSection>

              <SpecSection title="TRACE Score Model" C={C}>
                <SpecRow label="T — Trail (200pts)" C={C}>Data broker presence. How many people-search sites list your name, address, phone, relatives. Sources: Whitepages, Spokeo, BeenVerified, MyLife + 80 others.</SpecRow>
                <SpecRow label="R — Risk (200pts)" C={C}>Breach and dark web exposure. Compromised emails, leaked passwords, credential dumps. Sources: HIBP API, dark web databases, paste monitoring.</SpecRow>
                <SpecRow label="A — Accounts (200pts)" C={C}>Dormant and forgotten account sprawl. More unused accounts = more attack surface. Sources: email-based cross-platform lookup, username enumeration on 300+ platforms.</SpecRow>
                <SpecRow label="C — Control (200pts)" C={C}>Privacy settings quality across live accounts. Are your key profiles locked down? Sources: Social media privacy audits, LinkedIn settings, Google account permissions.</SpecRow>
                <SpecRow label="E — Exposure (200pts)" C={C}>Public-facing digital footprint. What strangers/hackers/employers can find. Sources: Google results, indexed posts, image tagging, professional directories.</SpecRow>
                <SpecRow label="Total" C={C}>0–1000. 700+ = Strong. 450–699 = At Risk. Under 450 = Exposed.</SpecRow>
              </SpecSection>

              <SpecSection title="Gamification System" C={C}>
                <SpecRow label="Score progression" C={C}>Score improves in real time as actions are completed. Animated ring reflects gains. Clear before/after benchmarks shown.</SpecRow>
                <SpecRow label="Daily challenges" C={C}>One actionable task per day. Completing it extends your streak. Streak = motivation loop.</SpecRow>
                <SpecRow label="Badges" C={C}>First Scan, 2FA On, Broker Clean, Dark Web Free, Ghost Mode, Fully Locked, 30-day Streak, Family Protector, Score 700+ etc.</SpecRow>
                <SpecRow label="Leaderboard" C={C}>Anonymous percentile ranking. "You're safer than 62% of users." Shareable card (opt-in).</SpecRow>
                <SpecRow label="Level system" C={C}>Levels 1–10 based on score range. Each level unlocks new scan depth or features.</SpecRow>
              </SpecSection>

              <SpecSection title="Tech Architecture" C={C}>
                <SpecRow label="Frontend" C={C}>React / Next.js. Mobile-first PWA. Push notifications for breach alerts.</SpecRow>
                <SpecRow label="Breach data" C={C}>Have I Been Pwned API. Custom dark web monitoring. IntelX API.</SpecRow>
                <SpecRow label="Broker scanning" C={C}>Incogni/DeleteMe API partnerships or custom scrapers with geo-specific broker lists.</SpecRow>
                <SpecRow label="Social scan" C={C}>Graph API where permitted. Puppeteer-based public profile scraping where not. Sherlock-style username enumeration.</SpecRow>
                <SpecRow label="Scoring engine" C={C}>Weighted model. Each sub-dimension scored 0–200 based on issue count × severity. Normalised against cohort for percentile.</SpecRow>
                <SpecRow label="Monitoring" C={C}>Daily re-check of breach DBs. Weekly broker re-scan. Push alert on new exposure detected.</SpecRow>
              </SpecSection>

              <SpecSection title="Competitive Edge" C={C}>
                <SpecRow label="vs. HIBP" C={C}>HIBP checks one thing. TRACE checks five dimensions with a unified score and action queue.</SpecRow>
                <SpecRow label="vs. Incogni/DeleteMe" C={C}>Pure broker-removal. No score, no gamification, no visibility into full footprint.</SpecRow>
                <SpecRow label="vs. Aura" C={C}>Insurance-led, expensive ($12–15/mo), anxiety-driven. TRACE is empowerment-led, affordable, gamified.</SpecRow>
                <SpecRow label="Core moat" C={C}>The gamification loop + unified score + action queue combination doesn't exist in consumer-grade form anywhere today.</SpecRow>
              </SpecSection>

              <div style={{ background: C.orangeDim, border: `1px solid ${C.orangeMid}`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: "0.08em", color: C.orange, marginBottom: 10 }}>NEXT STEPS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    "Lock in the TRACE name — trademark search recommended",
                    "Define MVP: onboarding + breach check + score + top 5 actions",
                    "HIBP API key + one broker removal partner integration",
                    "Build waitlist landing page to validate demand before full build",
                    "Define freemium gate carefully — score free, actions paid"
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.subtle }}>
                      <span style={{ color: C.orange }}>→</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
