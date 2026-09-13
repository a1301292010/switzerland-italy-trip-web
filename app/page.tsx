"use client";

import { useMemo, useState } from "react";
import content from "../data/trip-content.json";

type Event = { time:string; area:string; title:string; description:string; map:string; transport:string; duration:string; cost:string; booking:string; photo:string; food:string; luggage:string; clothes:string; planB:string; safety:string };
type Day = { iso:string; shortDate:string; weekday:string; title:string; city:string; day:number; route:string; hardTime:string; weather:string; budget:string; food:string; luggage:string; clothes:string; planB:string; events:Event[] };
type Tab = "today" | "days" | "tickets" | "budget" | "vlog";

const days = content.days as Day[];

function openMap(query:string) {
  if (!query) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
}

function Status({value}:{value:string}) {
  const kind = value.includes("已购") || value.includes("已付") ? "done" : value.includes("待确认") || value.includes("待定") ? "check" : "pending";
  return <span className={`status ${kind}`}>{value}</span>;
}

export default function Home() {
  const [dayIndex,setDayIndex]=useState(0);
  const [tab,setTab]=useState<Tab>("today");
  const [vlogOpen,setVlogOpen]=useState(0);
  const day=days[dayIndex];
  const dayTickets=useMemo(()=>content.tickets.filter(t=>t.date===day.shortDate||t.date.includes(day.shortDate)),[day.shortDate]);

  return <main className="app-shell">
    <header className="topbar">
      <div><p className="eyebrow">SEP 27 — OCT 07 · DOCUMENT EDITION</p><h1>{content.meta.title}</h1></div>
      <span className="version">V1.5</span>
    </header>

    {tab==="today" && <>
      <section className="hero-card">
        <div className="hero-top"><div><p className="day-kicker">DAY {String(day.day).padStart(2,"0")} · {day.shortDate} {day.weekday}</p><h2>{day.title}</h2><p className="hero-city">{day.city}</p></div><span className="live-pill">执行日</span></div>
        <div className="hero-route">{day.route}</div>
        <div className="hero-foot"><span>{day.weather}</span><span>{day.budget}</span></div>
      </section>

      <div className="day-strip" aria-label="选择日期">{days.map((d,i)=><button key={d.iso} className={i===dayIndex?"active":""} onClick={()=>setDayIndex(i)}><b>{d.shortDate}</b><span>{d.city.split("·")[0].split("→")[0]}</span></button>)}</div>

      <section className="section-block">
        <div className="section-heading"><h3>当天执行</h3><span>硬时间：{day.hardTime||"无固定预约"}</span></div>
        <div className="plan-summary"><div><span>主线</span><strong>{day.route}</strong><p>{day.planB}</p></div></div>
      </section>

      <section className="section-block timeline-section">
        <div className="section-heading"><h3>时间轴</h3><span>{day.events.length} 个执行块</span></div>
        <div className="timeline">{day.events.map((e,index)=><article className="timeline-item" key={`${e.time}-${index}`}>
          <time>{e.time}</time><div className="rail"><i className={e.booking.includes("已购")||e.booking.includes("必须")?"focus":""}/></div>
          <div className="event-card"><span className="tag">{e.area}</span><strong>{e.title}</strong><small>{e.transport}{e.duration?` · ${e.duration}`:""}</small>
            <p>{e.description}</p><div className="event-meta"><span>费用：{e.cost||"—"}</span><span>票务：{e.booking||"—"}</span></div>
            {e.map&&<button onClick={()=>openMap(e.map)}>Google Maps ↗</button>}
          </div>
        </article>)}</div>
      </section>

      {dayTickets.length>0&&<section className="section-block"><div className="section-heading"><h3>当天票务</h3><span>以状态标签为准</span></div><div className="stack-list">{dayTickets.map((t,i)=><article key={i}><div><strong>{t.name}</strong><small>{t.time} · {t.price}</small></div><Status value={t.status}/></article>)}</div></section>}

      <section className="section-block"><div className="section-heading"><h3>执行提醒</h3><span>来自主 Word 与 Excel</span></div><div className="notes-grid">
        <article><span>吃饭补给</span><strong>{day.food}</strong></article><article><span>行李</span><strong>{day.luggage}</strong></article><article><span>穿搭</span><strong>{day.clothes}</strong></article><article><span>Plan B</span><strong>{day.planB}</strong></article>
      </div></section>

      <section className="ticket-card"><div className="ticket-mark">4</div><div><span>交通票</span><strong>Swiss Travel Pass · 4日二等</strong><small>2026-09-27—09-30 · 待购买</small></div></section>
    </>}

    {tab==="days"&&<section className="page-section"><div className="page-title"><p>完整行程</p><h2>9个执行日</h2></div><div className="day-list">{days.map((d,i)=><button key={d.iso} onClick={()=>{setDayIndex(i);setTab("today")}}><time>{d.shortDate}<small>{d.weekday}</small></time><div><strong>{d.title}</strong><span>{d.city}</span><p>{d.route}</p></div><b>›</b></button>)}</div></section>}

    {tab==="tickets"&&<section className="page-section"><div className="page-title"><p>票务状态</p><h2>已购与待办分开</h2></div><div className="ticket-list">{content.tickets.map((t,i)=><article key={i}><div className="ticket-date">{t.date}<small>{t.time}</small></div><div><strong>{t.name}</strong><p>{t.price} · {t.reminder}</p>{t.url&&<a href={t.url} target="_blank" rel="noreferrer">官方页面 ↗</a>}</div><Status value={t.status}/></article>)}</div></section>}

    {tab==="budget"&&<section className="page-section"><div className="page-title"><p>预算</p><h2>{content.budgetSummary.recommended}</h2><span>{content.budgetSummary.rates}</span></div><div className="budget-summary"><article><span>基础预算</span><strong>{content.budgetSummary.base}</strong></article><article><span>已确认费用</span><strong>{content.budgetSummary.confirmed}</strong></article></div><div className="budget-list">{content.budget.map((b,i)=><article key={i}><div><strong>{b.name}</strong><small>{b.note}</small></div><div><b>{b.currency} {b.low}{b.high&&b.high!==b.low?`—${b.high}`:""}</b><Status value={b.payment||"未付"}/></div></article>)}</div></section>}

    {tab==="vlog"&&<section className="page-section"><div className="page-title"><p>Vlog 拍摄与口播</p><h2>37个地点脚本</h2><span>内容来自正式 Vlog Word</span></div><div className="vlog-list">{content.vlog.map((v,i)=><article key={i} className={vlogOpen===i?"open":""}><button onClick={()=>setVlogOpen(vlogOpen===i?-1:i)}><span>{v.group}</span><strong>{v.location}</strong><b>{vlogOpen===i?"−":"+"}</b></button>{vlogOpen===i&&<div className="vlog-body">{v.route&&<section><h4>对应行程</h4><p>{v.route}</p></section>}{v.background&&<section><h4>背景速懂</h4><p>{v.background}</p></section>}{v.script10&&<section><h4>10秒口播</h4><p>{v.script10}</p></section>}{v.script30&&<section><h4>30秒口播</h4><p>{v.script30}</p></section>}{v.voiceover&&<section><h4>后期旁白</h4><p>{v.voiceover}</p></section>}{v.shots.length>0&&<section><h4>必拍镜头</h4><ul>{v.shots.map((s,j)=><li key={j}>{s}</li>)}</ul></section>}{v.transition&&<section><h4>转场</h4><p>{v.transition}</p></section>}{v.changes.length>0&&<section><h4>现场变化话术</h4>{v.changes.map((s,j)=><p key={j}>{s}</p>)}</section>}</div>}</article>)}</div></section>}

    <nav className="bottom-nav" aria-label="主导航">{[["today","今日"],["days","行程"],["tickets","票务"],["budget","预算"],["vlog","Vlog"]].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id as Tab)}><b>{id==="today"?"◉":id==="days"?"▦":id==="tickets"?"◇":id==="budget"?"¥":"●"}</b><span>{label}</span></button>)}</nav>
  </main>;
}
