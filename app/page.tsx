"use client";

import { useState } from "react";

type PlanKey = "sun" | "rain" | "jump" | "cancel";

const plans: Record<PlanKey, { label: string; title: string; detail: string }> = {
  sun: { label: "晴天", title: "跳伞 → 山谷 → 米伦", detail: "能见度好，按主线推进；下午留足拍摄时间。" },
  rain: { label: "雨天", title: "洞穴瀑布 → 湖畔慢行", detail: "降低户外强度，优先室内与低海拔路线。" },
  jump: { label: "跳伞成功", title: "劳特布龙嫩经典线", detail: "跳伞后前往瀑布与米伦，不再安排高强度项目。" },
  cancel: { label: "跳伞取消", title: "立即切换 First 完整线", detail: "保留次日补跳窗口，今天不空等天气。" },
};

const timeline = [
  { time: "07:10", title: "出发去集合点", meta: "步行 · 预留 20 分钟找路", tag: "交通", map: "OUTDOOR Interlaken Shop" },
  { time: "08:30", title: "跳伞窗口", meta: "OUTDOOR Interlaken · 约 3.5 小时", tag: "重点", map: "Höheweg 95, 3800 Interlaken" },
  { time: "13:20", title: "劳特布龙嫩", meta: "火车 · 到站后步行进山谷", tag: "拍摄", map: "Lauterbrunnen Bahnhof" },
  { time: "15:40", title: "前往米伦", meta: "缆车 + 山地小火车 · 留换乘缓冲", tag: "交通", map: "Grütschalp" },
  { time: "17:00", title: "Allmendhubel", meta: "观景与徒步下行 · 日落前返程", tag: "机位", map: "Allmendhubel" },
];

function openMap(query: string) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
}

export default function Home() {
  const [plan, setPlan] = useState<PlanKey>("sun");
  const [tab, setTab] = useState("today");

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SEP 27 — OCT 05 · 9 DAYS</p>
          <h1>瑞士 → 意大利</h1>
        </div>
        <button className="avatar" aria-label="旅行设置">LH</button>
      </header>

      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="day-kicker">DAY 02 · 9月28日 周一</p>
            <h2>因特拉肯</h2>
          </div>
          <span className="live-pill"><i />今日</span>
        </div>
        <div className="weather-row">
          <span className="weather-icon">☀</span>
          <div><strong>14°</strong><small>体感 12°</small></div>
          <div className="sun-times"><span>日出 07:21</span><span>日落 19:17</span></div>
        </div>
        <div className="hero-foot">
          <span>预计 CHF 48</span><span>·</span><span>山地交通 4 段</span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><h3>今天怎么走</h3><span>根据现场情况切换</span></div>
        <div className="plan-tabs" role="tablist" aria-label="行程方案">
          {(Object.keys(plans) as PlanKey[]).map((key) => (
            <button key={key} role="tab" aria-selected={plan === key} className={plan === key ? "active" : ""} onClick={() => setPlan(key)}>
              <b>{key === "sun" ? "☀" : key === "rain" ? "☂" : key === "jump" ? "✦" : "×"}</b>{plans[key].label}
            </button>
          ))}
        </div>
        <div className="plan-summary">
          <div><span>当前方案</span><strong>{plans[plan].title}</strong><p>{plans[plan].detail}</p></div>
          <button onClick={() => openMap("Interlaken Switzerland")}>打开路线 ↗</button>
        </div>
      </section>

      <section className="section-block timeline-section">
        <div className="section-heading"><h3>今日时间轴</h3><button className="text-button">全部日程</button></div>
        <div className="timeline">
          {timeline.map((item, index) => (
            <article className="timeline-item" key={item.time}>
              <time>{item.time}</time>
              <div className="rail"><i className={index === 1 ? "focus" : ""} /></div>
              <button className="event-card" onClick={() => openMap(item.map)} aria-label={`在地图中打开 ${item.title}`}>
                <span className="tag">{item.tag}</span><strong>{item.title}</strong><small>{item.meta}</small><em>地图 ↗</em>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="ticket-card">
        <div className="ticket-mark">4</div>
        <div><span>交通票</span><strong>Swiss Travel Pass · 4 日</strong><small>已确认 · 9/27–9/30 适用</small></div>
        <b>✓</b>
      </section>

      <section className="notes-grid">
        <article><span>穿搭</span><strong>冲锋衣 + 抓绒</strong><small>高空温差大，随身带薄手套</small></article>
        <article><span>拍摄</span><strong>X-T5 · 16–80</strong><small>瀑布注意水雾，带镜头布</small></article>
      </section>

      <nav className="bottom-nav" aria-label="主导航">
        {[["today","⌂","今天"],["days","▦","日程"],["map","⌖","地图"],["vlog","●","Vlog"]].map(([id, icon, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => { setTab(id); if (id === "map") openMap("Interlaken Switzerland"); }}><b>{icon}</b><span>{label}</span></button>
        ))}
      </nav>
    </main>
  );
}
