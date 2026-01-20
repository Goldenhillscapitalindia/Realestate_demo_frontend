import React, { useId } from "react";
import type { HealthIndicator, MarketRadarViewData, TrendCard } from "../types";

export const Gauge: React.FC<{ indicator: HealthIndicator }> = ({ indicator }) => {
  const percentage = Math.min(Math.max(indicator.score / 10, 0), 1);
  const background = `conic-gradient(${indicator.color} ${percentage * 360}deg, rgba(148,163,184,0.15) 0deg)`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-24 w-24 items-center justify-center rounded-full p-2" style={{ background }}>
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-full text-center"
          style={{
            backgroundColor: "#0B1220",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-lg font-semibold" style={{ color: indicator.color }}>
            {indicator.score.toFixed(1)}
          </span>
          {/* <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">AI Score</span> */}
        </div>
      </div>
      <p className="text-xs text-white">{indicator.label}</p>
    </div>
  );
};

export const TrendCardBlock: React.FC<{ trend: TrendCard }> = ({ trend }) => {
  const deltaColor = trend.delta.startsWith("-") ? "#FF5A4A" : "#2ED573";

  return (
    <div
      className="rounded-2xl border border-white/10 p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      }}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-[0.15em]">{trend.label}</span>
        <span style={{ color: deltaColor }}>{trend.delta}</span>
      </div>
      <div className="mt-3 h-12">
        <Sparkline data={trend.data} color={trend.color} />
      </div>
    </div>
  );
};

export const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const gradientId = useId();
  if (!data || data.length < 2) return null;
  const width = 140;
  const height = 40;
  const padding = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#spark-${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      <circle
        cx={points[points.length - 1].split(",")[0]}
        cy={points[points.length - 1].split(",")[1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
};

export const MetricCard: React.FC<{ label: string; value: string; isDelta?: boolean }> = ({
  label,
  value,
  isDelta,
}) => {
  const color = isDelta && value.trim().startsWith("-") ? "#FF5A4A" : "#2ED573";

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold" style={{ color: isDelta ? color : "#E2E8F0" }}>
        {value}
      </p>
    </div>
  );
};

export const NarrativeCard: React.FC<{ text: string }> = ({ text }) => (
  <div className="mt-4 rounded-xl border border-cyan-400/40 bg-[#0B1220] px-4 py-3 text-sm text-slate-300">
    <span className="mr-2 text-cyan-300">*</span>
    {text}
  </div>
);

export const SectionHeading: React.FC<{ label: string; icon: string; accent: string }> = ({
  label,
  icon,
  accent,
}) => (
  <div className="flex items-center gap-2 text-m font-semibold">
    <span className={accent}>{icon}</span>
    <span className="text-slate-100">{label}</span>
  </div>
);

export const OutcomeChart: React.FC = () => (
  <div className="flex items-center justify-center">
    <svg width="260" height="140" viewBox="0 0 260 140">
      <defs>
        <linearGradient id="outcome-up" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2ED573" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2ED573" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="outcome-base" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#21C7D9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#21C7D9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="outcome-down" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5A4A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF5A4A" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="40" y1="70" x2="220" y2="70" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="70" r="4" fill="#38BDF8" />
      <path d="M40 70 C90 68, 130 52, 220 30" stroke="url(#outcome-up)" strokeWidth="3" fill="none" />
      <path d="M40 70 C95 75, 135 72, 220 72" stroke="url(#outcome-base)" strokeWidth="3" fill="none" />
      <path d="M40 70 C95 82, 130 95, 220 110" stroke="url(#outcome-down)" strokeWidth="3" fill="none" />
      <text x="10" y="74" fill="#94A3B8" fontSize="10">
        Now
      </text>
      <text x="230" y="30" fill="#2ED573" fontSize="10">
        Upside
      </text>
      <text x="230" y="112" fill="#FF5A4A" fontSize="10">
        Downside
      </text>
    </svg>
  </div>
);

export const OutcomeCard: React.FC<{
  title: string;
  color: string;
  data: MarketRadarViewData["aiOutcome"]["upside"];
}> = ({ title, color, data }) => (
  <div
    className="rounded-2xl border border-white/10 px-4 py-4 shadow-[0_10px_30px_rgba(2,6,23,0.5)]"
    style={{
      backgroundColor: "#0B1220",
      borderTop: `2px solid ${color}`,
    }}
  >
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
      <span className="text-lg" style={{ color }}>
        ~
      </span>
      <span>{title}</span>
    </div>
    <div className="mt-2 space-y-1 text-xs text-slate-400">
      <div className="flex justify-between">
        <span>Vacancy</span>
        <span className="text-slate-200">{data.vacancy}</span>
      </div>
      <div className="flex justify-between">
        <span>Rent Growth</span>
        <span className="text-slate-200">{data.rentGrowth}</span>
      </div>
      <div className="flex justify-between">
        <span>Absorption Delta</span>
        <span className="text-slate-200">{data.absorptionDelta}</span>
      </div>
    </div>
  </div>
);

export const DecisionCard: React.FC<{ title: string; color: string; items: string[] }> = ({
  title,
  color,
  items,
}) => (
  <div
    className="rounded-2xl border border-white/10 px-5 py-4"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      borderLeft: `2px solid ${color}`,
    }}
  >
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-100">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{ border: `1px solid ${color}` }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </span>
      <span>{title}</span>
    </div>
    <ul className="mt-3 space-y-2 text-xs text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
