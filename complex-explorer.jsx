import { useState, useEffect } from "react";
import Markdown from "./Markdown.jsx";
import { Prose } from "./shared-blocks.jsx";
import { colors as COLORS, fonts } from "./theme.js";

import ch0Md from "./content/ch0-why-wrong.md?raw";
import ch1Md from "./content/ch1-cubic.md?raw";
import ch2Md from "./content/ch2-rotation.md?raw";
import chEulerMd from "./content/ch-euler.md?raw";
import ch3Md from "./content/ch3-quaternions.md?raw";
import ch4Md from "./content/ch4-quantum.md?raw";
import ch5Md from "./content/ch5-capstone.md?raw";

// --- split a .md file into # intro / # outro ------------------------------
function splitMd(src) {
  const sections = { intro: "", outro: "" };
  const re = /^#\s+(\w+)\s*$/gim;
  const matches = [...src.matchAll(re)];
  if (matches.length === 0) { sections.intro = src.trim(); return sections; }
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const name = m[1].toLowerCase();
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : src.length;
    sections[name] = src.slice(start, end).trim();
  }
  return sections;
}

const CONTENT = {
  0: splitMd(ch0Md), 1: splitMd(ch1Md), 2: splitMd(ch2Md),
  3: splitMd(chEulerMd), 4: splitMd(ch3Md), 5: splitMd(ch4Md), 6: splitMd(ch5Md),
};

// --- maths helpers ---------------------------------------------------------
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
const m2s = (x, y, w, h, xR, yR) => [
  ((x - xR[0]) / (xR[1] - xR[0])) * w,
  (1 - (y - yR[0]) / (yR[1] - yR[0])) * h,
];

// =============================================================================
// SHARED UI
// =============================================================================
function Slider({ label, value, onChange, min = -3, max = 3, step = 0.1, color = COLORS.cyan, fmt = (v) => v.toFixed(1) }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.muted, width: "100%", minWidth: 0 }}>
      <span style={{ flex: "0 0 auto", color, fontFamily: fonts.mono, fontWeight: 700, fontSize: 12, minWidth: 40 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ flex: "1 1 0", minWidth: 0, accentColor: color, height: 4 }} />
      <span style={{ flex: "0 0 auto", width: 54, textAlign: "right", fontFamily: fonts.mono, fontSize: 12, color: COLORS.text }}>{fmt(value)}</span>
    </label>
  );
}

function SVGCanvas({ width = 360, height = 360, xRange = [-4, 4], yRange = [-4, 4], children, showGrid = true }) {
  const w = width, h = height;
  const grid = [];
  if (showGrid) {
    for (let x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x++) {
      const [sx] = m2s(x, 0, w, h, xRange, yRange);
      grid.push(<line key={`vg${x}`} x1={sx} y1={0} x2={sx} y2={h} stroke={x === 0 ? COLORS.gridAxis : COLORS.grid} strokeWidth={x === 0 ? 1.4 : 0.7} />);
    }
    for (let y = Math.ceil(yRange[0]); y <= Math.floor(yRange[1]); y++) {
      const [, sy] = m2s(0, y, w, h, xRange, yRange);
      grid.push(<line key={`hg${y}`} x1={0} y1={sy} x2={w} y2={sy} stroke={y === 0 ? COLORS.gridAxis : COLORS.grid} strokeWidth={y === 0 ? 1.4 : 0.7} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: w, background: "#1e1f22", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
      {grid}
      {typeof children === "function" ? children(w, h, xRange, yRange) : children}
    </svg>
  );
}

function Arrow({ x1, y1, x2, y2, color, strokeWidth = 2.5, dashed = false, opacity = 1 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1.5) return null;
  const ux = dx / len, uy = dy / len;
  const head = Math.min(11, len * 0.35);
  const px = x2 - ux * head, py = y2 - uy * head;
  const nx = -uy, ny = ux, hw = head * 0.42;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={px} y2={py} stroke={color} strokeWidth={strokeWidth} strokeDasharray={dashed ? "5 4" : "none"} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${px + nx * hw},${py + ny * hw} ${px - nx * hw},${py - ny * hw}`} fill={color} />
    </g>
  );
}

function MathBlock({ children, center = true }) {
  return (
    <div style={{
      background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`, borderRadius: 8,
      padding: "12px 16px", fontFamily: fonts.mono, fontSize: 15, color: COLORS.gold,
      margin: "10px 0", overflowX: "auto", lineHeight: 1.7, textAlign: center ? "center" : "left",
    }}>{children}</div>
  );
}

function Widget({ kicker, children }) {
  return (
    <div style={{ margin: "22px 0", padding: "18px 18px 22px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14 }}>
      {kicker && <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, fontFamily: fonts.mono }}>{kicker}</div>}
      {children}
    </div>
  );
}

function PickRow({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
      {label && <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600, minWidth: 70 }}>{label}</span>}
      {children}
    </div>
  );
}

function PickButton({ active, onClick, color = COLORS.cyan, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 13px", borderRadius: 9, cursor: "pointer", fontFamily: fonts.mono, fontWeight: 700, fontSize: 14,
      border: `1.5px solid ${active ? color : COLORS.border}`,
      background: active ? `${color}22` : COLORS.surfaceLight, color: active ? color : COLORS.text, transition: "all 0.15s",
    }}>{children}</button>
  );
}

// --- Quiz: reveal-able questions ------------------------------------------
function Quiz({ kind, questions }) {
  const [open, setOpen] = useState({});
  const accent = kind === "working" ? COLORS.orange : COLORS.green;
  const title = kind === "working" ? "Working knowledge — try these to actually use it" : "Take-home check";
  const blurb = kind === "working"
    ? "These need pencil, paper, and a bit of fight. They turn knowing-about into using."
    : "If you absorbed the take-homes, you can answer these. Reveal to check.";
  return (
    <div style={{ margin: "18px 0", padding: "16px 18px", borderRadius: 12, background: COLORS.surface, border: `1px solid ${accent}40` }}>
      <div style={{ fontSize: 12, color: accent, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, fontFamily: fonts.mono }}>
        {kind === "working" ? "⚙ " : "✓ "}{title}
      </div>
      <div style={{ fontSize: 13, color: COLORS.muted, margin: "6px 0 12px", fontStyle: "italic" }}>{blurb}</div>
      <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 12 }}>
        {questions.map((q, i) => (
          <li key={i} style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
            <span style={{ fontFamily: fonts.mono }}>{q.q}</span>
            {q.a && (
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                  style={{ fontSize: 12, fontFamily: fonts.mono, color: accent, background: "transparent", border: `1px solid ${accent}55`, borderRadius: 6, padding: "3px 9px", cursor: "pointer" }}>
                  {open[i] ? "Hide answer" : "Show answer"}
                </button>
                {open[i] && (
                  <div style={{ marginTop: 8, padding: "9px 12px", borderRadius: 8, background: `${accent}12`, border: `1px solid ${accent}33`, fontSize: 13.5, color: COLORS.text, lineHeight: 1.65, fontFamily: fonts.mono }}>
                    {q.a}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// =============================================================================
// CH0 — the parabola that never crosses
// =============================================================================
function ParabolaDemo() {
  const [showImag, setShowImag] = useState(false);
  const xR = [-3, 3], yR = [-2, 9];
  const pts = [];
  for (let x = xR[0]; x <= xR[1]; x += 0.1) pts.push(m2s(x, x * x + 1, 320, 300, xR, yR));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const vtx = m2s(0, 1, 320, 300, xR, yR);

  // small complex x-plane inset
  const cxR = [-2, 2], cyR = [-2, 2];
  const o2 = m2s(0, 0, 200, 200, cxR, cyR);
  const pI = m2s(0, 1, 200, 200, cxR, cyR);
  const mI = m2s(0, -1, 200, 200, cxR, cyR);

  return (
    <Widget kicker="The honest picture: where does y = x² + 1 cross?">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <SVGCanvas width={320} height={300} xRange={xR} yRange={yR}>
            <path d={path} fill="none" stroke={COLORS.cyan} strokeWidth={2.5} />
            <circle cx={vtx[0]} cy={vtx[1]} r={4} fill={COLORS.cyan} />
            <text x={vtx[0] + 8} y={vtx[1] - 6} fill={COLORS.cyan} fontSize={12} fontFamily={fonts.mono}>lowest point (0, 1)</text>
          </SVGCanvas>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, lineHeight: 1.6 }}>
            The curve floats <b style={{ color: COLORS.text }}>above</b> the x-axis and never touches it. So "where does it cross?" has the honest answer: <b style={{ color: COLORS.text }}>nowhere real.</b>
          </div>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: 220 }}>
          <button onClick={() => setShowImag((s) => !s)} style={{
            fontFamily: fonts.mono, fontSize: 13, color: COLORS.magenta, background: "transparent",
            border: `1.5px solid ${COLORS.magenta}66`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", marginBottom: 10,
          }}>
            {showImag ? "Hide the textbook's “solutions”" : "So where are x = ±i ?"}
          </button>
          {showImag && (
            <div>
              <SVGCanvas width={200} height={200} xRange={cxR} yRange={cyR}>
                <circle cx={pI[0]} cy={pI[1]} r={5} fill={COLORS.magenta} />
                <circle cx={mI[0]} cy={mI[1]} r={5} fill={COLORS.magenta} />
                <text x={pI[0] + 8} y={pI[1] + 2} fill={COLORS.magenta} fontSize={12} fontFamily={fonts.mono}>+i</text>
                <text x={mI[0] + 8} y={mI[1] + 4} fill={COLORS.magenta} fontSize={12} fontFamily={fonts.mono}>−i</text>
                <text x={o2[0] + 6} y={o2[1] + 14} fill={COLORS.muted} fontSize={10} fontFamily={fonts.mono}>complex x-plane</text>
              </SVGCanvas>
              <div style={{ fontSize: 13, color: COLORS.text, marginTop: 8, lineHeight: 1.6 }}>
                They aren't on the graph at all — they live in a <b style={{ color: COLORS.magenta }}>different plane</b> (complex values of <i>x</i>). That mismatch is exactly why this intro makes {`i`} feel like a fake answer.
              </div>
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}

function Ch0() {
  return (
    <div>
      <Markdown src={CONTENT[0].intro} />
      <ParabolaDemo />
      <Markdown src={CONTENT[0].outro} />
      <Quiz kind="takehome" questions={[
        { q: "Why does opening with x² + 1 = 0 give a misleading impression of imaginary numbers?", a: "It defines i as the “solution” to an equation whose graph never crosses the axis — so i looks like a name invented for an answer that visibly isn't there, i.e. a fake/wrong answer, rather than something useful." },
        { q: "According to the Needham-style view, what should motivate a new kind of number first: a definition, or a use?", a: "A use (utility and geometry). Definitions should come after you see why the object earns its place — here, the real payoff is cubics, then rotation." },
        { q: "Give two reasons textbooks still start with quadratics even though it's pedagogically weak.", a: "Any two of: quadratics appear earlier in the syllabus; the algebra (x = ±i) is a single line; it fits a tidy “number-system closure” narrative; and many teachers don't know the cubic history." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Find a quadratic with no real roots whose “solutions” are x = 2 ± 3i. (Hint: build (x − (2+3i))(x − (2−3i)).)", a: "x² − 4x + 13 = 0. Check: sum of roots 4, product (2)² + (3)² = 13." },
        { q: "The closure story says: naturals→need negatives (subtraction), integers/rationals→need reals, reals→need i. State precisely which operation fails on the reals and is fixed by i.", a: "Taking square roots of negative numbers (more generally, guaranteeing every non-constant polynomial has a root — the Fundamental Theorem of Algebra). i fixes √(−1)." },
      ]} />
    </div>
  );
}

// =============================================================================
// CH1 — the cubic walkthrough
// =============================================================================
function CubicDemo() {
  const [step, setStep] = useState(0);
  const xR = [-5, 5], yR = [-40, 40];
  const pts = [];
  for (let x = xR[0]; x <= xR[1]; x += 0.05) pts.push(m2s(x, x * x * x - 15 * x - 4, 360, 320, xR, yR));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const roots = [4, -2 + Math.sqrt(3), -2 - Math.sqrt(3)];

  const steps = [
    { t: "The answer is sitting right there.", m: "x = 4 works:  4³ = 64  and  15·4 + 4 = 64. ✓\nThe curve y = x³ − 15x − 4 crosses the axis at x = 4 (and two more real spots)." },
    { t: "Cardano's formula for x³ = px + q, with p = 15, q = 4.", m: "x = ∛( 2 + √(4 − 125) ) + ∛( 2 − √(4 − 125) )" },
    { t: "The wall.", m: "4 − 125 = −121.   So the formula demands √−121.\nThe ONLY road to the real answer 4 runs through a negative square root." },
    { t: "Bombelli's nerve: just write it as 11i and keep going.", m: "√−121 = 11i\nx = ∛(2 + 11i) + ∛(2 − 11i)" },
    { t: "The “wild thought”: guess each cube root is simple.", m: "∛(2 + 11i) = 2 + i      (check: (2 + i)³ = 2 + 11i ✓)\n∛(2 − 11i) = 2 − i" },
    { t: "Add them — and watch the imaginary parts cancel.", m: "x = (2 + i) + (2 − i) = 4\nReal answer recovered — unreachable by this formula without i." },
  ];
  const s = steps[step];

  return (
    <Widget kicker="x³ = 15x + 4 — a real root you can only reach through √−121">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 340px", minWidth: 300 }}>
          <SVGCanvas width={360} height={320} xRange={xR} yRange={yR}>
            <path d={path} fill="none" stroke={COLORS.cyan} strokeWidth={2.5} />
            {roots.map((r, i) => {
              const p = m2s(r, 0, 360, 320, xR, yR);
              const hero = Math.abs(r - 4) < 1e-6;
              return (
                <g key={i}>
                  <circle cx={p[0]} cy={p[1]} r={hero ? 6 : 4} fill={hero ? COLORS.gold : COLORS.muted} />
                  {hero && <text x={p[0] + 8} y={p[1] - 8} fill={COLORS.gold} fontSize={13} fontFamily={fonts.mono} fontWeight={700}>x = 4</text>}
                </g>
              );
            })}
          </SVGCanvas>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>Three real roots (gold = the obvious one, x = 4). Nothing imaginary about the answers.</div>
        </div>

        <div style={{ flex: "1 1 300px", minWidth: 280 }}>
          <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: fonts.mono, marginBottom: 4 }}>Step {step + 1} / {steps.length}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{s.t}</div>
          <MathBlock center={false}><span style={{ whiteSpace: "pre-wrap" }}>{s.m}</span></MathBlock>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0} style={{ ...stepBtn, opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
            <button onClick={() => setStep((x) => Math.min(steps.length - 1, x + 1))} disabled={step === steps.length - 1}
              style={{ ...stepBtn, background: COLORS.cyan, color: "#08121a", borderColor: COLORS.cyan, opacity: step === steps.length - 1 ? 0.4 : 1 }}>Next step →</button>
            <button onClick={() => setStep(0)} style={stepBtn}>↺</button>
          </div>
        </div>
      </div>
    </Widget>
  );
}

function Ch1() {
  return (
    <div>
      <Markdown src={CONTENT[1].intro} />
      <CubicDemo />
      <Markdown src={CONTENT[1].outro} />
      <Quiz kind="takehome" questions={[
        { q: "In the equation x³ = 15x + 4, what is special about how the real root x = 4 is obtained via Cardano's formula?", a: "The formula can only reach the real, obvious answer 4 by passing through √(−121) = 11i. Imaginary numbers are an unavoidable intermediate step, even though the final answer is real." },
        { q: "What happens to the imaginary parts by the end of Bombelli's calculation, and what does that show?", a: "They cancel exactly: (2 + i) + (2 − i) = 4. It shows i did essential work mid-calculation yet leaves no trace in the answer — utility, not a fudge." },
        { q: "Name the “irreducible case” and state what is true about it.", a: "The casus irreducibilis: when a cubic has three real roots, it is provably impossible to reach them via Cardano's formula using only real radicals — complex numbers are unavoidable." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Expand (2 + i)³ by hand and confirm it equals 2 + 11i. (Use i² = −1, i³ = −i.)", a: "(2+i)² = 4 + 4i + i² = 3 + 4i. Then (3 + 4i)(2 + i) = 6 + 3i + 8i + 4i² = 6 + 11i − 4 = 2 + 11i. ✓" },
        { q: "For x³ = px + q, the discriminant inside the root is (q/2)² − (p/3)³. Show it is negative for x³ = 15x + 4, and explain why “negative inside” signals three real roots.", a: "(4/2)² − (15/3)³ = 4 − 125 = −121 < 0. A negative value forces √(negative), i.e. genuinely complex intermediate terms — which is exactly the casus irreducibilis, the case of three distinct real roots." },
        { q: "Verify the other two roots of x³ − 15x − 4 are −2 ± √3 by factoring out (x − 4).", a: "x³ − 15x − 4 = (x − 4)(x² + 4x + 1). Quadratic roots: x = (−4 ± √(16 − 4))/2 = −2 ± √3 ≈ −0.27 and −3.73." },
      ]} />
    </div>
  );
}

// =============================================================================
// CH2 — rotation in the plane
// =============================================================================
function RotationDemo() {
  const [zr, setZr] = useState(2);
  const [zi, setZi] = useState(1);
  const [r, setR] = useState(1);
  const [thetaDeg, setThetaDeg] = useState(90);

  const th = (thetaDeg * Math.PI) / 180;
  const wr = r * Math.cos(th), wi = r * Math.sin(th);
  const pr = wr * zr - wi * zi, pi = wr * zi + wi * zr;
  const xR = [-4, 4], yR = [-4, 4], W = 360, H = 360;

  const preset = (rr, dd) => { setR(rr); setThetaDeg(dd); };

  return (
    <Widget kicker="Multiply by w = r∠θ : it scales by r and rotates by θ">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 360px", minWidth: 300 }}>
          <SVGCanvas width={W} height={H} xRange={xR} yRange={yR}>
            {(w, h) => {
              const o = m2s(0, 0, w, h, xR, yR);
              const zp = m2s(zr, zi, w, h, xR, yR);
              const pp = m2s(pr, pi, w, h, xR, yR);
              const rzMag = Math.hypot(zr, zi);
              const rpMag = Math.hypot(pr, pi);
              const cz = m2s(rzMag, 0, w, h, xR, yR)[0] - o[0];
              const cp = m2s(rpMag, 0, w, h, xR, yR)[0] - o[0];
              return (
                <g>
                  <circle cx={o[0]} cy={o[1]} r={Math.abs(cz)} fill="none" stroke={COLORS.green} strokeWidth={0.8} strokeDasharray="3 4" opacity={0.4} />
                  <circle cx={o[0]} cy={o[1]} r={Math.abs(cp)} fill="none" stroke={COLORS.gold} strokeWidth={0.8} strokeDasharray="3 4" opacity={0.4} />
                  <Arrow x1={o[0]} y1={o[1]} x2={zp[0]} y2={zp[1]} color={COLORS.green} />
                  <Arrow x1={o[0]} y1={o[1]} x2={pp[0]} y2={pp[1]} color={COLORS.gold} />
                  <text x={zp[0] + 8} y={zp[1] - 6} fill={COLORS.green} fontSize={13} fontFamily={fonts.mono} fontWeight={700}>z</text>
                  <text x={pp[0] + 8} y={pp[1] - 6} fill={COLORS.gold} fontSize={13} fontFamily={fonts.mono} fontWeight={700}>w·z</text>
                  <text x={W - 70} y={18} fill={COLORS.muted} fontSize={10} fontFamily={fonts.mono}>real →</text>
                  <text x={o[0] + 6} y={14} fill={COLORS.muted} fontSize={10} fontFamily={fonts.mono}>imag ↑</text>
                </g>
              );
            }}
          </SVGCanvas>
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 260 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700, marginBottom: 4 }}>The point z = a + bi</div>
          <Slider label="a (re)" value={zr} onChange={setZr} min={-3} max={3} color={COLORS.green} />
          <Slider label="b (im)" value={zi} onChange={setZi} min={-3} max={3} color={COLORS.green} />
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700, margin: "12px 0 4px" }}>The multiplier w = r∠θ</div>
          <Slider label="r" value={r} onChange={setR} min={0} max={2} color={COLORS.cyan} />
          <Slider label="θ°" value={thetaDeg} onChange={setThetaDeg} min={-180} max={180} step={1} color={COLORS.cyan} fmt={(v) => `${Math.round(v)}°`} />
          <PickRow label="quick:">
            <PickButton onClick={() => preset(1, 90)} color={COLORS.cyan}>× i (90°)</PickButton>
            <PickButton onClick={() => preset(1, 180)} color={COLORS.cyan}>× −1 (180°)</PickButton>
            <PickButton onClick={() => preset(1.4, 45)} color={COLORS.cyan}>1.4∠45°</PickButton>
          </PickRow>
          <MathBlock center={false}>
            <div>w = {round(wr)} {wi >= 0 ? "+" : "−"} {Math.abs(round(wi))} i</div>
            <div>w·z = {round(pr)} {pi >= 0 ? "+" : "−"} {Math.abs(round(pi))} i</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>scaled by r = {round(r)}, rotated by {Math.round(thetaDeg)}°</div>
          </MathBlock>
          <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55 }}>
            Set <b style={{ color: COLORS.cyan }}>× i</b> and look: w·z is z turned a quarter-circle. Do it twice and you've turned 180° = multiply by −1. That's <b style={{ color: COLORS.text }}>i² = −1</b>.
          </div>
        </div>
      </div>
    </Widget>
  );
}

function Ch2() {
  return (
    <div>
      <Markdown src={CONTENT[2].intro} />
      <RotationDemo />
      <Markdown src={CONTENT[2].outro} />
      <Quiz kind="takehome" questions={[
        { q: "Geometrically, what does multiplying by −1 do, and what does multiplying by i do?", a: "Multiplying by −1 rotates the number line 180° about 0. Multiplying by i rotates 90° (a quarter turn) — lifting numbers off the line into the second (imaginary) dimension." },
        { q: "Explain why i² = −1 using rotation, without just quoting the definition.", a: "i is a 90° rotation. Doing it twice (i·i) is two quarter-turns = a 180° turn = multiplying by −1. So i² = −1 follows from geometry." },
        { q: "To multiply two complex numbers using their length-and-angle form, what do you do to the lengths and to the angles?", a: "Multiply the lengths and add the angles. (So multiplying by r∠θ scales by r and rotates by θ.)" },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Without algebra, use rotation to find i³ and i⁴.", a: "Each power adds 90°. i³ = three quarter-turns = 270° = pointing down = −i. i⁴ = full 360° = back to 1." },
        { q: "Compute (1 + i)·(1 + i) two ways: by FOIL, and by length-and-angle (1 + i has length √2 and angle 45°). Confirm they agree.", a: "FOIL: 1 + 2i + i² = 2i. Length-angle: length √2·√2 = 2, angle 45° + 45° = 90°, i.e. 2∠90° = 2i. ✓" },
        { q: "Using e^{iθ} as “rotate by θ,” explain in one sentence why e^{iπ} = −1.", a: "Starting at 1 and rotating by π (180°) lands you at −1, so e^{iπ} = −1." },
      ]} />
    </div>
  );
}

// =============================================================================
// CH3 — quaternions: multiplication table + rotating cube
// =============================================================================
const QNAMES = ["1", "i", "j", "k"];
const QVEC = { "1": [1, 0, 0, 0], "i": [0, 1, 0, 0], "j": [0, 0, 1, 0], "k": [0, 0, 0, 1] };
function qmul(a, b) {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}
function qconj(q) { return [q[0], -q[1], -q[2], -q[3]]; }
function fmtBasis(v) {
  // v is a basis-ish quaternion (one nonzero comp = ±1)
  for (let idx = 0; idx < 4; idx++) {
    if (Math.abs(v[idx]) > 0.5) return (v[idx] < 0 ? "−" : "") + QNAMES[idx];
  }
  return "0";
}
function rotateVec(q, v) {
  const p = [0, v[0], v[1], v[2]];
  const r = qmul(qmul(q, p), qconj(q));
  return [r[1], r[2], r[3]];
}

function QuaternionTable() {
  const [left, setLeft] = useState("i");
  const [right, setRight] = useState("j");
  const prod = qmul(QVEC[left], QVEC[right]);
  const prodRev = qmul(QVEC[right], QVEC[left]);
  const noncommute = fmtBasis(prod) !== fmtBasis(prodRev) && left !== right && left !== "1" && right !== "1";
  return (
    <Widget kicker="Multiplication is non-commutative: ij = k, but ji = −k">
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>left</div>
          <div style={{ display: "flex", gap: 6 }}>{QNAMES.map((n) => <PickButton key={n} active={left === n} onClick={() => setLeft(n)} color={COLORS.cyan}>{n}</PickButton>)}</div>
        </div>
        <div style={{ fontSize: 22, color: COLORS.muted, alignSelf: "flex-end", paddingBottom: 4 }}>×</div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>right</div>
          <div style={{ display: "flex", gap: 6 }}>{QNAMES.map((n) => <PickButton key={n} active={right === n} onClick={() => setRight(n)} color={COLORS.magenta}>{n}</PickButton>)}</div>
        </div>
        <div style={{ fontSize: 22, color: COLORS.muted, alignSelf: "flex-end", paddingBottom: 4 }}>=</div>
        <div style={{ alignSelf: "flex-end" }}>
          <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>product</div>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: COLORS.gold, padding: "6px 16px", border: `1.5px solid ${COLORS.gold}`, borderRadius: 9, minWidth: 50, textAlign: "center" }}>{fmtBasis(prod)}</div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: noncommute ? COLORS.orange : COLORS.muted, lineHeight: 1.6, fontFamily: fonts.mono }}>
        {noncommute
          ? `Swap the order: ${right}·${left} = ${fmtBasis(prodRev)}.  Different sign! Order matters — that's how 3D rotation behaves.`
          : `Try i × j, then j × i. The cyclic rule: i→j→k→i gives +, the reverse gives −.`}
      </div>
    </Widget>
  );
}

const CUBE_V = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE_V.push([x, y, z]);
const CUBE_E = [];
for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) {
  const d = CUBE_V[a].reduce((s, c, i) => s + (c !== CUBE_V[b][i] ? 1 : 0), 0);
  if (d === 1) CUBE_E.push([a, b]);
}
// fixed view tilt so the cube isn't seen flat
const VIEW = (() => { const a = -0.5, s = Math.sin(a / 2); return [Math.cos(a / 2), s, 0.45 * s, 0]; })();

function CubeDemo() {
  const AXES = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1], "diag": [1, 1, 1] };
  const [axisName, setAxisName] = useState("Y");
  const [angle, setAngle] = useState(45);

  const raw = AXES[axisName];
  const norm = Math.hypot(...raw);
  const ax = raw.map((c) => c / norm);
  const th = (angle * Math.PI) / 180, s = Math.sin(th / 2);
  const q = [Math.cos(th / 2), ax[0] * s, ax[1] * s, ax[2] * s];

  const W = 300, H = 280, scale = 52, cx = W / 2, cy = H / 2;
  const proj = CUBE_V.map((v) => {
    let p = rotateVec(q, v);
    p = rotateVec(VIEW, p);
    return { x: cx + p[0] * scale, y: cy - p[1] * scale, z: p[2] };
  });

  return (
    <Widget kicker="Quaternions in action: q = cos(θ/2) + sin(θ/2)·axis  rotates 3D objects">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, background: "#1e1f22", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            {CUBE_E.map(([a, b], i) => {
              const depth = (proj[a].z + proj[b].z) / 2;
              const op = 0.45 + 0.55 * ((depth + 1.8) / 3.6);
              return <line key={i} x1={proj[a].x} y1={proj[a].y} x2={proj[b].x} y2={proj[b].y} stroke={COLORS.cyan} strokeWidth={2} opacity={Math.max(0.2, Math.min(1, op))} strokeLinecap="round" />;
            })}
            {proj.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.6} fill={COLORS.gold} opacity={Math.max(0.3, Math.min(1, 0.45 + 0.55 * ((p.z + 1.8) / 3.6)))} />)}
          </svg>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          <PickRow label="axis:">
            {Object.keys(AXES).map((n) => <PickButton key={n} active={axisName === n} onClick={() => setAxisName(n)} color={COLORS.purple}>{n}</PickButton>)}
          </PickRow>
          <Slider label="θ°" value={angle} onChange={setAngle} min={0} max={360} step={1} color={COLORS.purple} fmt={(v) => `${Math.round(v)}°`} />
          <MathBlock center={false}>
            <div>q = {round(q[0])} + {round(q[1])} i + {round(q[2])} j + {round(q[3])} k</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>|q| = {round(Math.hypot(...q))} (unit) · half-angle = {Math.round(angle / 2)}°</div>
          </MathBlock>
          <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55 }}>
            Apply with v′ = q v q⁻¹. Notice the half-angle: spin θ to <b style={{ color: COLORS.text }}>360°</b> and q reads <b style={{ color: COLORS.text }}>−1</b>, not 1 — you need 720° to truly return.
          </div>
        </div>
      </div>
    </Widget>
  );
}

function Ch3() {
  return (
    <div>
      <Markdown src={CONTENT[4].intro} />
      <QuaternionTable />
      <CubeDemo />
      <Markdown src={CONTENT[4].outro} />
      <Quiz kind="takehome" questions={[
        { q: "What do quaternions do that ordinary complex numbers don't, and what is the defining rule Hamilton carved on the bridge?", a: "They describe rotation in 3D (not just the 2D plane). The rule: i² = j² = k² = ijk = −1." },
        { q: "Quaternion multiplication is non-commutative. Give the value of ij and of ji, and say why this property is appropriate.", a: "ij = k but ji = −k. It's appropriate because 3D rotations themselves don't commute (rotating X-then-Y ≠ Y-then-X), so the algebra must not either." },
        { q: "To rotate by angle θ about a unit axis, what quaternion do you build, and how do you apply it to a vector v?", a: "Build q = cos(θ/2) + sin(θ/2)(aₓ i + a_y j + a_z k); apply it with the sandwich v′ = q v q⁻¹ (and q⁻¹ = conjugate for a unit quaternion)." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Confirm jk = i and kj = −i using the cyclic rule i→j→k→i.", a: "Forward order (j then k follows the cycle) gives +i; reversed (k then j) gives −i." },
        { q: "Build the unit quaternion for a 90° rotation about the z-axis. (cos45° = sin45° = √2/2 ≈ 0.707.)", a: "q = cos45° + sin45°·k = 0.707 + 0.707k (i.e. [0.707, 0, 0, 0.707]). Check |q| = 1." },
        { q: "Why do flight/spacecraft systems prefer quaternions over yaw-pitch-roll Euler angles? Name the specific failure they avoid.", a: "Gimbal lock — when two rotation axes align you lose a degree of freedom and orientation control degrades. Quaternions have no such singularity, interpolate smoothly (slerp), and stay numerically stable." },
      ]} />
    </div>
  );
}

// =============================================================================
// CH4 — quantum: phasor sum / interference
// =============================================================================
function PhasorDemo() {
  const [n, setN] = useState(2);
  const [dPhi, setDPhi] = useState(60);

  const arrows = [];
  let sx = 0, sy = 0;
  for (let k = 0; k < n; k++) {
    const ph = (k * dPhi * Math.PI) / 180;
    arrows.push({ x: sx, y: sy, dx: Math.cos(ph), dy: Math.sin(ph) });
    sx += Math.cos(ph); sy += Math.sin(ph);
  }
  const mag = Math.hypot(sx, sy);
  const prob = mag * mag;
  const maxProb = n * n;

  const W = 340, H = 300, scale = 34, ox = 60, oy = H - 60;
  const toS = (x, y) => [ox + x * scale, oy - y * scale];

  return (
    <Widget kicker="Quantum amplitudes are arrows: add them tip-to-tail, then square the length">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 340px", minWidth: 300 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, background: "#1e1f22", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            {arrows.map((a, i) => {
              const [x1, y1] = toS(a.x, a.y);
              const [x2, y2] = toS(a.x + a.dx, a.y + a.dy);
              return <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} color={COLORS.cyan} strokeWidth={2} opacity={0.85} />;
            })}
            {(() => { const [x1, y1] = toS(0, 0); const [x2, y2] = toS(sx, sy); return <Arrow x1={x1} y1={y1} x2={x2} y2={y2} color={COLORS.gold} strokeWidth={3.5} />; })()}
            {(() => { const [x, y] = toS(sx, sy); return <text x={x + 8} y={y} fill={COLORS.gold} fontSize={13} fontFamily={fonts.mono} fontWeight={700}>sum</text>; })()}
          </svg>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          <Slider label="paths" value={n} onChange={(v) => setN(Math.round(v))} min={2} max={6} step={1} color={COLORS.magenta} fmt={(v) => `${Math.round(v)}`} />
          <Slider label="Δphase" value={dPhi} onChange={setDPhi} min={0} max={360} step={1} color={COLORS.cyan} fmt={(v) => `${Math.round(v)}°`} />
          <PickRow label="try:">
            <PickButton onClick={() => setDPhi(0)} color={COLORS.green}>aligned</PickButton>
            <PickButton onClick={() => { setN(2); setDPhi(180); }} color={COLORS.magenta}>cancel</PickButton>
          </PickRow>
          <MathBlock center={false}>
            <div>|sum| = {round(mag)}</div>
            <div>probability ∝ |sum|² = {round(prob)}</div>
          </MathBlock>
          <div style={{ height: 12, borderRadius: 6, background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`, overflow: "hidden", margin: "6px 0 8px" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (prob / maxProb) * 100)}%`, background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.gold})`, transition: "width 0.1s" }} />
          </div>
          <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55 }}>
            <b style={{ color: COLORS.green }}>Aligned</b> arrows reinforce (bright). <b style={{ color: COLORS.magenta }}>Opposite</b> arrows cancel to near-zero (dark) — interference. Real numbers can only point ± and could never do this.
          </div>
        </div>
      </div>
    </Widget>
  );
}

function Ch4() {
  return (
    <div>
      <Markdown src={CONTENT[5].intro} />
      <PhasorDemo />
      <Markdown src={CONTENT[5].outro} />
      <Quiz kind="takehome" questions={[
        { q: "In Feynman's picture, what is a quantum amplitude, and how do you turn a set of amplitudes into a probability?", a: "An amplitude is a little arrow (a complex number) with a length and a spinning angle (phase). You add the arrows for all the ways an outcome can happen (tip-to-tail), then the probability is the squared length of the resulting arrow, |sum|² (the Born rule)." },
        { q: "Why must amplitudes be complex rather than ordinary (real, positive) probabilities?", a: "Real positive numbers can only accumulate; they can't cancel. Complex arrows can point in any direction, so they can reinforce or cancel — producing interference (the dark bands in the double slit), which is observed." },
        { q: "What role does the i in the Schrödinger equation play physically?", a: "It makes solutions e^{−iEt/ℏ} rotate (a phase spinning at constant rate) instead of grow/decay like a real exponential. That rotation preserves total probability at 100%, keeping states stable." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Two paths, each amplitude of length 1. If their phase difference is 0°, what is the probability (∝|sum|²)? If 180°?", a: "0°: arrows aligned, |sum| = 2, probability ∝ 4. 180°: arrows opposite, |sum| = 0, probability ∝ 0 (total destructive interference)." },
        { q: "Explain why |e^{iθ}| = 1 for every θ, and why that matters for conserving probability over time.", a: "e^{iθ} = cosθ + i sinθ has magnitude √(cos²θ + sin²θ) = 1. Time evolution multiplies the state by such a unit-magnitude phase, so it rotates without changing length — total probability (the squared length) stays fixed." },
        { q: "In the demo with n equal arrows all in phase, the probability is n². With random phases it's about n. In one phrase, what is this contrast called?", a: "Constructive interference (coherent addition, ∝ n²) versus incoherent addition (random phases, ∝ n) — the heart of why coherence matters in optics and QM." },
      ]} />
    </div>
  );
}

// =============================================================================
// CH5 — capstone
// =============================================================================
function Ch5() {
  return (
    <div>
      <Markdown src={CONTENT[6].intro} />
      <Markdown src={CONTENT[6].outro} />
      <Quiz kind="takehome" questions={[
        { q: "In one sentence each, give the role of i in: a cubic, the plane, 3D, and quantum mechanics.", a: "Cubic: an unavoidable bridge to a real root (√−121). Plane: a 90° rotation (so i² = −1). 3D: extended to quaternions for rotating space. QM: the rotating amplitude arrow whose square is probability." },
        { q: "State the single unifying idea of the whole site.", a: "Imaginary numbers are the mathematics of rotation, and rotation shows up everywhere useful — hidden in cubic formulas, explicit in the plane, essential in 3D, and woven into matter via quantum amplitudes." },
        { q: "What is the “Needham principle” for teaching a hard idea?", a: "Lead with utility and geometry; introduce the formal definition only after the idea has shown why it's worth having." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Find √i as a rotation (what angle, halved?), then write it as a + bi.", a: "√i means half of i's 90° rotation = 45°, length 1. So √i = cos45° + i sin45° = (√2/2)(1 + i) ≈ 0.707 + 0.707i. Check: squaring doubles the angle to 90° = i. ✓" },
        { q: "Pick any cubic with an integer root (e.g. x³ = 6x + 9, root x = 3) and check whether Cardano's discriminant (q/2)² − (p/3)³ is positive or negative. What does the sign tell you?", a: "For x³ = 6x + 9: (9/2)² − (6/3)³ = 20.25 − 8 = 12.25 > 0. Positive ⇒ one real root, reachable with real radicals (no casus irreducibilis). Negative would mean three real roots and forced complex intermediates." },
        { q: "Sketch (in words) how a steadily rotating complex arrow e^{iωt} produces a cosine wave, linking page 2 (rotation) to page 4 (oscillation/QM).", a: "Its real part is cos(ωt): as the arrow spins at rate ω, its shadow on the real axis swings back and forth as a cosine. Rotation viewed edge-on is oscillation — the same object underlies AC circuits, waves, and quantum phase." },
      ]} />
    </div>
  );
}

// =============================================================================
// EULER — e^{iθ} on the unit circle, and angle addition
// =============================================================================
function EulerCircleDemo() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTheta((t) => (t + 0.025) % (2 * Math.PI)), 30);
    return () => clearInterval(id);
  }, [playing]);

  const c = Math.cos(theta), s = Math.sin(theta);
  const xR = [-1.5, 1.5], yR = [-1.5, 1.5], W = 280, H = 280;
  const nearPi = Math.abs(((theta % (2 * Math.PI)) - Math.PI)) < 0.06;

  const WW = 320, WH = 190, wxR = [0, 2 * Math.PI], wyR = [-1.25, 1.25];
  const toPath = (fn) => {
    let d = "";
    for (let a = 0; a <= 2 * Math.PI + 0.001; a += 0.05) {
      const p = m2s(a, fn(a), WW, WH, wxR, wyR);
      d += `${d ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)} `;
    }
    return d;
  };
  const curC = m2s(theta, c, WW, WH, wxR, wyR);
  const curS = m2s(theta, s, WW, WH, wxR, wyR);
  const cursorX = m2s(theta, 0, WW, WH, wxR, wyR)[0];

  return (
    <Widget kicker="e^{iθ} rides the unit circle — its shadows are cos θ and sin θ">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <SVGCanvas width={W} height={H} xRange={xR} yRange={yR}>
            {(w, h) => {
              const O = m2s(0, 0, w, h, xR, yR);
              const P = m2s(c, s, w, h, xR, yR);
              const Cx = m2s(c, 0, w, h, xR, yR);
              const Cy = m2s(0, s, w, h, xR, yR);
              const Vt = m2s(c - s, s + c, w, h, xR, yR);
              const Rpix = m2s(1, 0, w, h, xR, yR)[0] - O[0];
              return (
                <g>
                  <circle cx={O[0]} cy={O[1]} r={Math.abs(Rpix)} fill="none" stroke={COLORS.border} strokeWidth={1.5} />
                  <line x1={P[0]} y1={P[1]} x2={Cx[0]} y2={Cx[1]} stroke={COLORS.gold} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                  <line x1={P[0]} y1={P[1]} x2={Cy[0]} y2={Cy[1]} stroke={COLORS.magenta} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                  <circle cx={Cx[0]} cy={Cx[1]} r={3.2} fill={COLORS.gold} />
                  <circle cx={Cy[0]} cy={Cy[1]} r={3.2} fill={COLORS.magenta} />
                  <Arrow x1={O[0]} y1={O[1]} x2={P[0]} y2={P[1]} color={COLORS.cyan} />
                  <Arrow x1={P[0]} y1={P[1]} x2={Vt[0]} y2={Vt[1]} color={COLORS.green} strokeWidth={2} />
                  <text x={P[0] + 8} y={P[1] - 6} fill={COLORS.cyan} fontSize={12} fontFamily={fonts.mono} fontWeight={700}>e^(iθ)</text>
                  <text x={Vt[0] + 4} y={Vt[1] + 4} fill={COLORS.green} fontSize={10} fontFamily={fonts.mono}>velocity = i·pos</text>
                  <text x={Cx[0] - 6} y={Cx[1] + (s >= 0 ? 16 : -8)} fill={COLORS.gold} fontSize={11} fontFamily={fonts.mono}>cos θ</text>
                  <text x={Cy[0] + (c >= 0 ? 6 : -42)} y={Cy[1] + 4} fill={COLORS.magenta} fontSize={11} fontFamily={fonts.mono}>sin θ</text>
                </g>
              );
            }}
          </SVGCanvas>
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 300 }}>
          <Slider label="θ" value={theta} onChange={setTheta} min={0} max={2 * Math.PI} step={0.01} color={COLORS.cyan} fmt={(v) => `${v.toFixed(2)} rad`} />
          <PickRow label="">
            <PickButton onClick={() => setPlaying((p) => !p)} color={COLORS.green}>{playing ? "⏸ pause" : "▶ play"}</PickButton>
            <PickButton onClick={() => { setPlaying(false); setTheta(Math.PI); }} color={COLORS.gold}>θ = π</PickButton>
            <PickButton onClick={() => { setPlaying(false); setTheta(Math.PI / 2); }} color={COLORS.cyan}>θ = π/2</PickButton>
          </PickRow>
          <MathBlock center={false}>
            <div>e^(iθ) = cos θ + i sin θ</div>
            <div>= {round(c)} {s >= 0 ? "+" : "−"} {Math.abs(round(s))} i</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>θ = {round(theta)} rad = {Math.round((theta * 180) / Math.PI)}°</div>
          </MathBlock>
          {nearPi && (
            <div style={{ margin: "6px 0", padding: "8px 12px", borderRadius: 8, background: `${COLORS.gold}18`, border: `1px solid ${COLORS.gold}55`, fontSize: 13, color: COLORS.gold, fontFamily: fonts.mono, fontWeight: 700 }}>
              ★ Half a lap from 1 → you're at −1. That's e^(iπ) = −1.
            </div>
          )}
          <svg viewBox={`0 0 ${WW} ${WH}`} style={{ width: "100%", maxWidth: WW, background: "#1e1f22", borderRadius: 10, border: `1px solid ${COLORS.border}`, marginTop: 6 }}>
            <line x1={0} y1={WH / 2} x2={WW} y2={WH / 2} stroke={COLORS.gridAxis} strokeWidth={1} />
            <path d={toPath(Math.cos)} fill="none" stroke={COLORS.gold} strokeWidth={2} />
            <path d={toPath(Math.sin)} fill="none" stroke={COLORS.magenta} strokeWidth={2} />
            <line x1={cursorX} y1={0} x2={cursorX} y2={WH} stroke={COLORS.text} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
            <circle cx={curC[0]} cy={curC[1]} r={4} fill={COLORS.gold} />
            <circle cx={curS[0]} cy={curS[1]} r={4} fill={COLORS.magenta} />
            <text x={6} y={14} fill={COLORS.gold} fontSize={11} fontFamily={fonts.mono}>cos θ</text>
            <text x={50} y={14} fill={COLORS.magenta} fontSize={11} fontFamily={fonts.mono}>sin θ</text>
          </svg>
        </div>
      </div>
    </Widget>
  );
}

function AngleAddDemo() {
  const [aDeg, setADeg] = useState(50);
  const [bDeg, setBDeg] = useState(30);
  const a = (aDeg * Math.PI) / 180, b = (bDeg * Math.PI) / 180, sum = a + b;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const xR = [-1.4, 1.4], yR = [-1.4, 1.4], W = 260, H = 260;

  return (
    <Widget kicker="Utility: exponents add (e^{iα}·e^{iβ} = e^{i(α+β)}) — so trig identities are free">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <SVGCanvas width={W} height={H} xRange={xR} yRange={yR}>
            {(w, h) => {
              const O = m2s(0, 0, w, h, xR, yR);
              const Rpix = m2s(1, 0, w, h, xR, yR)[0] - O[0];
              const Pa = m2s(ca, sa, w, h, xR, yR);
              const Pb = m2s(cb, sb, w, h, xR, yR);
              const Ps = m2s(Math.cos(sum), Math.sin(sum), w, h, xR, yR);
              return (
                <g>
                  <circle cx={O[0]} cy={O[1]} r={Math.abs(Rpix)} fill="none" stroke={COLORS.border} strokeWidth={1.5} />
                  <Arrow x1={O[0]} y1={O[1]} x2={Pb[0]} y2={Pb[1]} color={COLORS.magenta} strokeWidth={2} />
                  <Arrow x1={O[0]} y1={O[1]} x2={Pa[0]} y2={Pa[1]} color={COLORS.cyan} strokeWidth={2} />
                  <Arrow x1={O[0]} y1={O[1]} x2={Ps[0]} y2={Ps[1]} color={COLORS.gold} strokeWidth={3} />
                  <text x={Pa[0] + 6} y={Pa[1] - 4} fill={COLORS.cyan} fontSize={11} fontFamily={fonts.mono}>α</text>
                  <text x={Pb[0] + 6} y={Pb[1] - 4} fill={COLORS.magenta} fontSize={11} fontFamily={fonts.mono}>β</text>
                  <text x={Ps[0] + 6} y={Ps[1] - 4} fill={COLORS.gold} fontSize={11} fontFamily={fonts.mono}>α+β</text>
                </g>
              );
            }}
          </SVGCanvas>
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 260 }}>
          <Slider label="α°" value={aDeg} onChange={setADeg} min={0} max={180} step={1} color={COLORS.cyan} fmt={(v) => `${Math.round(v)}°`} />
          <Slider label="β°" value={bDeg} onChange={setBDeg} min={0} max={180} step={1} color={COLORS.magenta} fmt={(v) => `${Math.round(v)}°`} />
          <MathBlock center={false}>
            <div style={{ color: COLORS.text }}>cos(α+β) = cos α cos β − sin α sin β</div>
            <div>{round(Math.cos(sum))} = {round(ca)}·{round(cb)} − {round(sa)}·{round(sb)} = {round(ca * cb - sa * sb)}</div>
            <div style={{ color: COLORS.text, marginTop: 6 }}>sin(α+β) = sin α cos β + cos α sin β</div>
            <div>{round(Math.sin(sum))} = {round(sa)}·{round(cb)} + {round(ca)}·{round(sb)} = {round(sa * cb + ca * sb)}</div>
          </MathBlock>
          <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55 }}>
            The famous angle-addition formulas aren't something to memorize — they're just <b style={{ color: COLORS.text }}>e^(iα)·e^(iβ) = e^(i(α+β))</b> with the real and imaginary parts read off separately.
          </div>
        </div>
      </div>
    </Widget>
  );
}

function ChEuler() {
  return (
    <div>
      <Markdown src={CONTENT[3].intro} />
      <EulerCircleDemo />
      <AngleAddDemo />
      <Markdown src={CONTENT[3].outro} />
      <Quiz kind="takehome" questions={[
        { q: "What single rule defines e^{it}, and what does “× i” do geometrically — and how do those two facts force the motion to be a circle?", a: "e^{it} obeys velocity = i × position. Since × i means rotate 90°, the velocity is always perpendicular to the position vector (same length). A velocity always perpendicular to the radius can't change your distance from 0, so you're locked on the unit circle — moving at unit speed." },
        { q: "State Euler's formula and explain why it follows from that circular motion.", a: "e^{iθ} = cos θ + i sin θ. Starting at 1 and moving at unit speed, after “time” θ you've gone arc-length θ around the unit circle, landing at the point (cos θ, sin θ)." },
        { q: "Explain e^{iπ} = −1 in one geometric sentence.", a: "An arc-length of π is exactly half the unit circle, so starting at 1 you end at the diametrically opposite point, −1 — hence e^{iπ} + 1 = 0." },
      ]} />
      <Quiz kind="working" questions={[
        { q: "Use e^{iα}·e^{iβ} = e^{i(α+β)} to derive the formulas for cos(α+β) and sin(α+β).", a: "(cos α + i sin α)(cos β + i sin β) = (cos α cos β − sin α sin β) + i(sin α cos β + cos α sin β). Matching real/imag parts of e^{i(α+β)} = cos(α+β) + i sin(α+β) gives both formulas." },
        { q: "Find all three cube roots of 1 using e^{iθ}, and describe their geometric arrangement.", a: "1 = e^{i·2πk}, so the cube roots are e^{i·2πk/3} for k = 0,1,2: namely 1, −½ + (√3/2)i, −½ − (√3/2)i — three points spaced 120° apart on the unit circle." },
        { q: "Compute d/dt of e^{iωt}, and say in one sentence why this makes complex exponentials nicer than sin/cos for oscillations.", a: "d/dt e^{iωt} = iω·e^{iωt}. Differentiation just becomes multiplication by iω (no switching between sin and cos and tracking signs), which is why AC-circuit, signal, and Fourier analysis all run on e^{iωt} and read off the real part." },
      ]} />
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
const stepBtn = {
  padding: "8px 14px", borderRadius: 9, border: `1px solid ${COLORS.border}`,
  background: COLORS.surfaceLight, color: COLORS.text, fontFamily: fonts.mono,
  fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const btnStyle = {
  padding: "10px 18px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
  background: COLORS.surfaceLight, color: COLORS.text, fontFamily: "inherit",
  fontSize: 14, fontWeight: 700, cursor: "pointer",
};

const chapterData = [
  { num: 0, title: "We Start in the Wrong Place", component: Ch0, color: COLORS.magenta },
  { num: 1, title: "The Cubic That Forced Our Hand", component: Ch1, color: COLORS.cyan },
  { num: 2, title: "Numbers That Love to Rotate", component: Ch2, color: COLORS.gold },
  { num: 3, title: "eⁱᵖ: Euler's Formula", component: ChEuler, color: COLORS.teal },
  { num: 4, title: "Quaternions, Simply", component: Ch3, color: COLORS.purple },
  { num: 5, title: "Why QM Is Built on i", component: Ch4, color: COLORS.green },
  { num: 6, title: "Capstone", component: Ch5, color: COLORS.orange },
];

export default function ComplexExplorer() {
  const [chapter, setChapter] = useState(0);
  const [light, setLight] = useState(false);
  const ch = chapterData[chapter];
  const Comp = ch.component;
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [chapter]);
  useEffect(() => { document.body.classList.toggle("light-mode", light); }, [light]);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text }}>
      <style>{`button:hover { filter: brightness(1.12); }`}</style>

      {/* Header — .docs-header style from styles/reference/custom.css */}
      <header style={{
        padding: "26px 24px 20px", borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.surface, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ flex: "1 1 auto" }}>
          <h1 className="docs-header" style={{ color: COLORS.text, fontSize: "2rem", margin: 0 }}>
            Imaginary Numbers, <span style={{ color: COLORS.cyan }}>the Useful Way</span>
          </h1>
          <div style={{ fontSize: 13.5, color: COLORS.muted, marginTop: 4 }}>
            utility &amp; geometry first — cubics, rotation, Euler, quaternions, quantum
          </div>
        </div>
        {/* light/dark switch — the custom.css toggle */}
        <div className="toggle-container">
          <input id="theme-toggle" type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} />
          <label htmlFor="theme-toggle" aria-label="Toggle light mode" />
        </div>
      </header>

      {/* Chapter nav — .navbar style from styles/reference/custom.css */}
      <nav className="site-navbar">
        {chapterData.map((c, i) => (
          <button key={i} className={i === chapter ? "active" : ""} onClick={() => setChapter(i)}
            style={{ borderBottom: `3px solid ${i === chapter ? "#33C3F0" : "transparent"}` }}>
            {c.num}. {c.title}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "26px 20px 52px" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: ch.color, fontFamily: fonts.mono, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>
            Page {ch.num}
          </span>
          <h2 style={{ fontSize: 25, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>{ch.title}</h2>
        </div>
        <Comp />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setChapter(Math.max(0, chapter - 1))} disabled={chapter === 0} style={{ ...btnStyle, opacity: chapter === 0 ? 0.3 : 1 }}>← Previous</button>
          <button onClick={() => setChapter(Math.min(chapterData.length - 1, chapter + 1))} disabled={chapter === chapterData.length - 1}
            style={{ ...btnStyle, opacity: chapter === chapterData.length - 1 ? 0.3 : 1, background: ch.color + "22", borderColor: ch.color + "55", color: ch.color }}>Next →</button>
        </div>
      </main>
    </div>
  );
}
