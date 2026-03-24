/*
 * 验货宝产品洞察决策平台 — 主页
 * 设计哲学：高端报告风（Premium Report）
 * 米白底色 + 深炭文字，买家蓝 / 卖家橙红双色系，琥珀橙警示色
 * 布局：左侧固定导航 + 右侧单页滚动叙事
 */

import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ReferenceLine,
} from "recharts";
import {
  monthlyNPS, tradeNPS, dissatisfyDrivers, radarData,
  userVoices, productDirections, keyMetrics,
} from "@/lib/data";

// ── 颜色常量 ──────────────────────────────────────────────────
const BUYER_COLOR = "oklch(0.45 0.14 240)";
const SELLER_COLOR = "oklch(0.55 0.18 25)";
const NEUTRAL_COLOR = "oklch(0.65 0.15 55)";
const BUYER_HEX = "#2563EB";
const SELLER_HEX = "#C2410C";
const NEUTRAL_HEX = "#D97706";

// ── 计数动画 Hook ─────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const startVal = 0;
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((startVal + (target - startVal) * eased).toFixed(1)));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [target, duration, start]);
  return value;
}

// ── 滚动入场 Hook ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── 指标卡片 ─────────────────────────────────────────────────
function MetricCard({ label, value, unit = "", color, sub }: {
  label: string; value: number; unit?: string; color: string; sub?: string;
}) {
  const { ref, inView } = useInView();
  const animated = useCountUp(value, 1000, inView);
  const isNeg = value < 0;
  return (
    <div ref={ref} className={`bg-white rounded-xl p-5 shadow-sm border-t-[3px] ${color}`}>
      <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{label}</div>
      <div className={`nps-number ${isNeg ? "text-seller" : "text-buyer"}`}>
        {isNeg ? "" : "+"}{animated.toFixed(1)}<span className="text-lg ml-1 font-normal">{unit}</span>
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── 自定义 Tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value > 0 ? "+" : ""}{p.value}
        </p>
      ))}
    </div>
  );
}

// ── 用户原声卡 ────────────────────────────────────────────────
function VoiceCard({ text, month, sentiment, role }: {
  text: string; month: string; sentiment: string; role: "buyer" | "seller";
}) {
  const cls = role === "buyer" ? "quote-buyer" : "quote-seller";
  const icon = sentiment === "positive" ? "😊" : sentiment === "negative" ? "😤" : "🤔";
  return (
    <div className={`${cls} text-sm text-gray-700 leading-relaxed`}>
      <span className="mr-1">{icon}</span>「{text}」
      <span className="text-xs text-gray-400 ml-2">{month}</span>
    </div>
  );
}

// ── 导航项 ────────────────────────────────────────────────────
const navItems = [
  { id: "hero", label: "概览" },
  { id: "dilemma", label: "核心困境" },
  { id: "seller", label: "卖家需求" },
  { id: "buyer", label: "买家需求" },
  { id: "radar", label: "满意度" },
  { id: "voices", label: "用户原声" },
  { id: "directions", label: "演进方向" },
];

// ── 主组件 ────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "seller">("all");
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [voiceTab, setVoiceTab] = useState<"seller" | "buyer">("seller");

  // 滚动监听
  useEffect(() => {
    const handler = () => {
      const sections = navItems.map(n => document.getElementById(n.id));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 图表数据过滤
  const chartData = monthlyNPS.map(d => ({
    month: d.month,
    ...(roleFilter !== "seller" && { "买家 NPS": d.buyer }),
    ...(roleFilter !== "buyer" && { "卖家 NPS": d.seller }),
    ...(roleFilter === "all" && { "综合 NPS": d.combined }),
  }));

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.008 75)" }}>
      {/* ── 移动端顶部导航 ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ background: "oklch(0.2 0.02 240)" }}>
        <div>
          <div className="text-xs font-semibold" style={{ color: "oklch(0.65 0.15 55)" }}>闲鱼验货宝</div>
          <div className="text-white text-sm font-bold">产品洞察决策平台</div>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {navItems.slice(0, 4).map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="px-2 py-1 text-xs rounded whitespace-nowrap transition-all"
              style={{
                background: activeSection === item.id ? "oklch(0.65 0.15 55)" : "oklch(1 0 0 / 10%)",
                color: activeSection === item.id ? "oklch(0.18 0.015 60)" : "oklch(0.7 0.02 240)",
              }}>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── 左侧固定导航 ── */}
      <nav className="fixed left-0 top-0 h-full w-[200px] z-40 hidden lg:flex flex-col"
        style={{ background: "oklch(0.2 0.02 240)" }}>
        <div className="p-6 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <div className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.65 0.15 55)" }}>
            闲鱼验货宝
          </div>
          <div className="text-white font-bold text-sm leading-tight">产品洞察<br />决策平台</div>
          <div className="text-xs mt-2" style={{ color: "oklch(0.6 0.02 240)" }}>2025 年度报告</div>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-6 py-3 text-sm transition-all duration-200 ${
                activeSection === item.id
                  ? "font-semibold border-r-2"
                  : "hover:opacity-80"
              }`}
              style={{
                color: activeSection === item.id ? "oklch(0.65 0.15 55)" : "oklch(0.7 0.02 240)",
                borderRightColor: activeSection === item.id ? "oklch(0.65 0.15 55)" : "transparent",
                background: activeSection === item.id ? "oklch(1 0 0 / 5%)" : "transparent",
              }}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 text-xs" style={{ color: "oklch(0.45 0.02 240)" }}>
          数据来源：2025年2-12月<br />NPS 调研问卷<br />n ≈ 9,700
        </div>
      </nav>

      {/* ── 主内容区 ── */}
      <main className="lg:ml-[200px]">

        {/* ── Hero 区 ── */}
        <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden pt-14 lg:pt-0">
          <div className="absolute inset-0 z-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663320155905/ar53BQAS2hiViNJD8uYMHm/hero-bg-ZVbZa7bfzAmPj7yXqBcJjz.webp"
              alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "oklch(0.97 0.008 75 / 0.55)" }} />
          </div>
          <div className="relative z-10 container py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                style={{ background: "oklch(0.65 0.15 55 / 0.12)", color: "oklch(0.5 0.15 55)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                2025 年度产品洞察报告 · 数据截至 12 月
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.18 0.015 60)" }}>
                验货宝的<br />
                <span style={{ color: NEUTRAL_HEX }}>零和困境</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                基于 9,700+ 份真实 NPS 问卷，深度解析买卖双方的核心需求鸿沟，
                为产品演进提供数据驱动的决策依据。
              </p>

              {/* 核心指标行 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="买家 NPS 均值" value={keyMetrics.buyerAvgNPS} color="card-buyer-bar" sub="全年 2-12 月" />
                <MetricCard label="卖家 NPS 均值" value={keyMetrics.sellerAvgNPS} color="card-seller-bar" sub="全年 2-12 月" />
                <MetricCard label="买卖家差距" value={keyMetrics.gap} color="card-neutral-bar" sub="平均剪刀差" />
                <div className="bg-white rounded-xl p-5 shadow-sm border-t-[3px] border-gray-200">
                  <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">调研总量</div>
                  <div className="nps-number text-gray-700">9.7<span className="text-lg ml-1 font-normal">K</span></div>
                  <div className="text-xs text-gray-400 mt-1">有效问卷</div>
                </div>
              </div>

              <button onClick={() => scrollTo("dilemma")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "oklch(0.35 0.12 240)" }}>
                深入洞察 ↓
              </button>
            </div>
          </div>
        </section>

        {/* ── 核心困境 ── */}
        <section id="dilemma" className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: NEUTRAL_HEX }}>
                01 · 核心困境
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                验货宝的「零和博弈」
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                当前产品机制在某种程度上陷入了零和博弈：买家通过验货宝获得了「排雷」的保障，
                但这种保障的成本和风险绝大部分由卖家承担。
                <strong className="text-gray-800"> 特别是交易失败时，卖家 NPS 暴跌 80 分，买家 NPS 却依然为正。</strong>
              </p>

              {/* 角色筛选器 */}
              <div className="flex gap-2 mb-8">
                {[
                  { key: "all", label: "全部视角" },
                  { key: "buyer", label: "买家视角" },
                  { key: "seller", label: "卖家视角" },
                ].map(opt => (
                  <button key={opt.key}
                    onClick={() => setRoleFilter(opt.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      roleFilter === opt.key ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={roleFilter === opt.key ? {
                      background: opt.key === "buyer" ? BUYER_HEX : opt.key === "seller" ? SELLER_HEX : NEUTRAL_HEX
                    } : {}}>
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* 趋势图 */}
              <div className="bg-gray-50 rounded-xl p-6 mb-10">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                  2025 年 2-12 月 NPS 月度趋势
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="4 4" />
                    {(roleFilter === "all" || roleFilter === "buyer") && (
                      <Line type="monotone" dataKey="买家 NPS" stroke={BUYER_HEX}
                        strokeWidth={2.5} dot={{ r: 4, fill: BUYER_HEX }} />
                    )}
                    {(roleFilter === "all" || roleFilter === "seller") && (
                      <Line type="monotone" dataKey="卖家 NPS" stroke={SELLER_HEX}
                        strokeWidth={2.5} dot={{ r: 4, fill: SELLER_HEX }} />
                    )}
                    {roleFilter === "all" && (
                      <Line type="monotone" dataKey="综合 NPS" stroke={NEUTRAL_HEX}
                        strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 交易结果分层 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    卖家：交易结果 vs NPS
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">交易成功 vs 未成交（6-11月）</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={tradeNPS} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#d1d5db" />
                      <Bar dataKey="sellerSuccess" name="成交" fill={BUYER_HEX} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="sellerOther" name="未成交" fill={SELLER_HEX} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    买家：交易结果 vs NPS
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">交易成功 vs 未成交（6-11月）</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={tradeNPS} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#d1d5db" />
                      <Bar dataKey="buyerSuccess" name="成交" fill={BUYER_HEX} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="buyerOther" name="未成交" fill={NEUTRAL_HEX} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 关键洞察框 */}
              <div className="mt-8 p-6 rounded-xl border-l-4 border-amber-400"
                style={{ background: "oklch(0.65 0.15 55 / 0.06)" }}>
                <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 mb-2">关键洞察</div>
                <p className="text-gray-700 leading-relaxed">
                  卖家交易成功时 NPS 为 <strong className="text-buyer">+17 ~ +24</strong>（优秀），
                  交易失败时 NPS 暴跌至 <strong className="text-seller">-40 ~ -67</strong>（极差），
                  差距高达 <strong>80 分</strong>。
                  而买家恰好相反——验完货不买反而更满意（花小钱「排雷」成功）。
                  这是当前产品机制最核心的结构性失衡。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 卖家需求 ── */}
        <section id="seller" className="py-20" style={{ background: "oklch(0.97 0.008 75)" }}>
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: SELLER_HEX }}>
                02 · 卖家需求洞察
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                从「被动防御」到<br />
                <span style={{ color: SELLER_HEX }}>渴望公平</span>
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                卖家是二手交易的供给侧。数据显示，卖家对验货宝的体验已处于「忍耐临界点」。
                他们不是不愿意为服务付费，而是无法接受不公平的风险分担规则。
              </p>

              {/* 不满意原因图 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                  卖家贬损者不满意原因（n=1,191，6-11月）
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={dissatisfyDrivers}
                    layout="vertical"
                    margin={{ top: 5, right: 30, bottom: 5, left: 110 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} unit="%" domain={[0, 80]} />
                    <YAxis type="category" dataKey="reason" tick={{ fontSize: 12, fill: "#374151" }} width={110} />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <Bar dataKey="sellerPct" name="卖家贬损者占比" fill={SELLER_HEX} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 三大痛点卡片 */}
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "沉没成本厌恶",
                    pct: "72.5%",
                    desc: "贬损者提及「费用过高」，本质是对「交易失败还要倒贴」的极度不满",
                    need: "风险可控的成本分担机制",
                    icon: "💸",
                  },
                  {
                    title: "瑕疵放大镜恐惧",
                    pct: "40.1%",
                    desc: "贬损者认为「验货结果不准确」，核心是放大瑕疵给买家提供压价把柄",
                    need: "客观符合二手常识的检验标准",
                    icon: "🔍",
                  },
                  {
                    title: "资产安全担忧",
                    pct: "22.8%",
                    desc: "贬损者提及「损坏/丢失物品」，担心好机变坏机、配件丢失或被拆修",
                    need: "全链路资产安全保障",
                    icon: "🔒",
                  },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm card-seller-bar">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold font-mono mb-1" style={{ color: SELLER_HEX }}>
                      {item.pct}
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">{item.title}</div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
                    <div className="text-xs font-semibold px-2 py-1 rounded"
                      style={{ background: "oklch(0.55 0.18 25 / 0.08)", color: SELLER_HEX }}>
                      需求本质：{item.need}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 买家需求 ── */}
        <section id="buyer" className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: BUYER_HEX }}>
                03 · 买家需求洞察
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                从「表面排雷」到<br />
                <span style={{ color: BUYER_HEX }}>深度避坑</span>
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                买家整体满意度较高，但需求正在向更深层次演进。
                他们不再满足于「验外观」，而是要求「验暗病」——
                陀螺仪、烧屏、主板翻修、电池健康度。
              </p>

              {/* 不满意原因图 */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                  买家贬损者不满意原因（n=764，6-11月）
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={dissatisfyDrivers}
                    layout="vertical"
                    margin={{ top: 5, right: 30, bottom: 5, left: 110 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} unit="%" domain={[0, 60]} />
                    <YAxis type="category" dataKey="reason" tick={{ fontSize: 12, fill: "#374151" }} width={110} />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <Bar dataKey="buyerPct" name="买家贬损者占比" fill={BUYER_HEX} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 三大痛点卡片 */}
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "暗病零容忍",
                    pct: "45.3%",
                    desc: "贬损者认为「验货不准确」，核心是功能性故障（陀螺仪、烧屏、翻修）验不出",
                    need: "深度功能与核心部件排雷",
                    icon: "🩺",
                  },
                  {
                    title: "售后维权无力",
                    pct: "32.1%",
                    desc: "贬损者对「客服处理」不满，「验错包赔」落地难，举证繁琐，客服推诿",
                    need: "兜底的履约保障与极速通道",
                    icon: "⚠️",
                  },
                  {
                    title: "报告深度不足",
                    pct: "38.9%",
                    desc: "贬损者认为「报告不够详细」，希望能圈出瑕疵、提供爱思截图、电池健康",
                    need: "透明可交互的验货过程",
                    icon: "📋",
                  },
                ].map(item => (
                  <div key={item.title} className="bg-gray-50 rounded-xl p-5 shadow-sm card-buyer-bar">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold font-mono mb-1" style={{ color: BUYER_HEX }}>
                      {item.pct}
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">{item.title}</div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
                    <div className="text-xs font-semibold px-2 py-1 rounded"
                      style={{ background: "oklch(0.45 0.14 240 / 0.08)", color: BUYER_HEX }}>
                      需求本质：{item.need}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 五维度满意度 ── */}
        <section id="radar" className="py-20" style={{ background: "oklch(0.97 0.008 75)" }}>
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: NEUTRAL_HEX }}>
                04 · 五维度满意度
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                买卖家体验的<br />
                <span style={{ color: NEUTRAL_HEX }}>全维度对比</span>
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                在 1-5 分的满意度评价中，买家在所有五个维度上的打分均高于卖家。
                卖家最低分出现在「验货准确性」（3.22）和「验货时效」（3.25），
                这两项是改进的核心抓手。
              </p>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: "#374151" }} />
                      <PolarRadiusAxis angle={90} domain={[2.5, 4.5]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                      <Radar name="买家" dataKey="buyer" stroke={BUYER_HEX} fill={BUYER_HEX} fillOpacity={0.15} strokeWidth={2} />
                      <Radar name="卖家" dataKey="seller" stroke={SELLER_HEX} fill={SELLER_HEX} fillOpacity={0.15} strokeWidth={2} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {radarData.map(d => (
                    <div key={d.dimension} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{d.dimension}</span>
                        <div className="flex gap-3 text-xs font-mono">
                          <span style={{ color: BUYER_HEX }}>买 {d.buyer.toFixed(2)}</span>
                          <span style={{ color: SELLER_HEX }}>卖 {d.seller.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-gray-400">买家</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="h-2 rounded-full transition-all duration-700"
                              style={{ width: `${((d.buyer - 1) / 4) * 100}%`, background: BUYER_HEX }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-gray-400">卖家</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="h-2 rounded-full transition-all duration-700"
                              style={{ width: `${((d.seller - 1) / 4) * 100}%`, background: SELLER_HEX }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 用户原声 ── */}
        <section id="voices" className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: NEUTRAL_HEX }}>
                05 · 用户原声
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                他们真实说了什么
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                数据背后是真实的人。这些原声来自 2025 年 6-11 月的开放文本问卷，
                未经修改，直接反映了用户的情绪与诉求。
              </p>

              {/* Tab 切换 */}
              <div className="flex gap-2 mb-6">
                {[
                  { key: "seller", label: "卖家原声", color: SELLER_HEX },
                  { key: "buyer", label: "买家原声", color: BUYER_HEX },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => setVoiceTab(tab.key as any)}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={voiceTab === tab.key
                      ? { background: tab.color, color: "white" }
                      : { background: "#f3f4f6", color: "#6b7280" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {userVoices[voiceTab].map((v, i) => (
                  <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <VoiceCard {...v} role={voiceTab} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 产品演进方向 ── */}
        <section id="directions" className="py-20" style={{ background: "oklch(0.97 0.008 75)" }}>
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: NEUTRAL_HEX }}>
                06 · 产品演进方向
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                四个关键重构
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                从「单向保护买家」向「平衡买卖双方利益、促成高效交易」转型。
                点击每个方向查看具体行动项。
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {productDirections.map(dir => {
                  const isActive = activeDirection === dir.id;
                  const borderColor = dir.color === "seller" ? SELLER_HEX : BUYER_HEX;
                  const bgColor = dir.color === "seller"
                    ? "oklch(0.55 0.18 25 / 0.04)"
                    : "oklch(0.45 0.14 240 / 0.04)";
                  return (
                    <div key={dir.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
                      style={{ borderTop: `3px solid ${borderColor}` }}
                      onClick={() => setActiveDirection(isActive ? null : dir.id)}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{dir.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{dir.title}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded"
                                  style={{ background: dir.priority === "P0" ? "oklch(0.55 0.18 25 / 0.1)" : "oklch(0.45 0.14 240 / 0.1)",
                                    color: dir.priority === "P0" ? SELLER_HEX : BUYER_HEX }}>
                                  {dir.priority}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">{dir.subtitle}</div>
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm transition-transform duration-300"
                            style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{dir.description}</p>
                        <div className="mt-3 text-xs font-medium px-2 py-1 rounded inline-block"
                          style={{ background: bgColor, color: borderColor }}>
                          预期影响：{dir.impact}
                        </div>
                      </div>

                      {/* 展开的行动项 */}
                      {isActive && (
                        <div className="border-t border-gray-100 p-5" style={{ background: bgColor }}>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            具体行动项
                          </div>
                          <ul className="space-y-2">
                            {dir.actions.map((action, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                                  style={{ background: borderColor }}>
                                  {i + 1}
                                </span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 结语 */}
              <div className="mt-12 p-8 rounded-xl text-center"
                style={{ background: "oklch(0.2 0.02 240)" }}>
                <div className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
                  验货宝的终极目标
                </div>
                <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  只有当卖家觉得「公平、不亏钱」，买家觉得「专业、能避坑」时，
                  验货宝才能真正成为闲鱼生态的护城河，
                  而不是买卖双方互相博弈的角斗场。
                </p>
                <div className="mt-6 flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold font-mono" style={{ color: BUYER_HEX }}>+12.1</div>
                    <div className="text-xs text-gray-400 mt-1">买家 NPS 均值</div>
                  </div>
                  <div className="text-4xl text-gray-600 self-center">→</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold font-mono" style={{ color: NEUTRAL_HEX }}>+30?</div>
                    <div className="text-xs text-gray-400 mt-1">改进后目标</div>
                  </div>
                  <div className="text-4xl text-gray-600 self-center">|</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold font-mono" style={{ color: SELLER_HEX }}>-10.2</div>
                    <div className="text-xs text-gray-400 mt-1">卖家 NPS 均值</div>
                  </div>
                  <div className="text-4xl text-gray-600 self-center">→</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold font-mono" style={{ color: NEUTRAL_HEX }}>+10?</div>
                    <div className="text-xs text-gray-400 mt-1">改进后目标</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-8 border-t border-gray-200 bg-white">
          <div className="container text-center text-xs text-gray-400">
            <p>验货宝产品洞察决策平台 · 数据来源：2025年2-12月 NPS 调研问卷 · n ≈ 9,700</p>
            <p className="mt-1">仅供内部产品决策参考使用</p>
          </div>
        </footer>

      </main>
    </div>
  );
}
