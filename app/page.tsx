
"use client";

import { useMemo, useState } from "react";
import content from "../data/trip-content.json";

type Event = { time:string; area:string; title:string; description:string; map:string; transport:string; duration:string; cost:string; booking:string; photo:string; food:string; luggage:string; clothes:string; planB:string; safety:string };
type Day = { iso:string; shortDate:string; weekday:string; title:string; city:string; day:number; route:string; hardTime:string; weather:string; budget:string; food:string; luggage:string; clothes:string; planB:string; events:Event[] };
type Vlog = (typeof content.vlog)[number];
type Tab = "today" | "days" | "tickets" | "budget" | "vlog";
type IconName = "today"|"days"|"ticket"|"budget"|"vlog"|"train"|"walk"|"food"|"place"|"camera"|"map"|"chevron";

const days = content.days as Day[];

const themes = [
  {match:"Interlaken",key:"interlaken",flag:"🇨🇭",code:"INT"}, {match:"Lauterbrunnen",key:"lauterbrunnen",flag:"🇨🇭",code:"LBR"},
  {match:"Zermatt",key:"zermatt",flag:"🇨🇭",code:"ZMT"}, {match:"米兰",key:"milan",flag:"🇮🇹",code:"MIL"},
  {match:"威尼斯",key:"venice",flag:"🇮🇹",code:"VCE"}, {match:"佛罗伦萨",key:"florence",flag:"🇮🇹",code:"FLR"},
  {match:"罗马",key:"rome",flag:"🇮🇹",code:"ROM"},
];

function Icon({name,size=18}:{name:IconName;size?:number}) {
  const paths:Record<IconName,React.ReactNode>={
    today:<><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>, days:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    ticket:<><path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6Z"/><path d="M12 7v2M12 15v2"/></>,
    budget:<><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12h5M7 6V4h10"/></>, vlog:<><rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2Z"/></>,
    train:<><rect x="5" y="3" width="14" height="15" rx="4"/><path d="M8 21l2-3M16 18l2 3M8 8h8M8 13h.01M16 13h.01"/></>, walk:<><circle cx="12" cy="4" r="2"/><path d="m10 22 1-7-3-3 2-5 4 3 3 1M14 22l-3-7"/></>,
    food:<><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c4 2 4 8 0 10"/></>, place:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>, camera:<><path d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3"/></>, map:<><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>, chevron:<path d="m9 18 6-6-6-6"/>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>;
}

function openMap(query:string) { if(query) window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,"_blank","noopener,noreferrer"); }
function eventKind(e:Event):IconName { const s=`${e.title}${e.area}${e.transport}${e.food}${e.photo}`; if(/餐|吃|午餐|晚餐|咖啡|补给|Coop/i.test(s))return"food"; if(/拍|Vlog|口播|镜头/i.test(s))return"camera"; if(/火车|列车|SBB|车站|机场|航班|船|巴士|交通|出发|抵达/i.test(s))return"train"; if(/步行|徒步|逛|散步/i.test(s))return"walk"; return"place"; }
function statusPills(e:Event){ const out:string[]=[]; const s=`${e.booking} ${e.cost} ${e.planB} ${e.safety}`; if(/已购|已付/.test(s))out.push("已购"); if(/免费|CHF0|€0/.test(s))out.push("免费"); if(/预约|提前|必须/.test(s))out.push("需预约"); if(/天气|雨|风|取消|关闭/.test(s))out.push("天气敏感"); if(/Plan B|雨天|替代/.test(s))out.push("雨天替代"); return [...new Set(out)].slice(0,3); }
function cleanNode(s:string){return s.replace(/\([^)]*\)|（[^）]*）/g,"").trim();}
function routeNodes(day:Day){ const raw=day.route.split(/→|➜|—|\+|\/|｜/).map(cleanNode).filter(Boolean); return raw.slice(0,6); }
function matchVlog(e:Event):Vlog|undefined { const hay=`${e.title} ${e.area} ${e.map}`.toLowerCase(); return content.vlog.find(v=>{const loc=v.location.toLowerCase(); return loc.length>1&&(hay.includes(loc)||loc.includes(e.area.toLowerCase())||hay.includes(loc.split(/[（(·]/)[0]));}); }
function Status({value}:{value:string}) { const kind=/已购|已付/.test(value)?"done":/待确认|待定/.test(value)?"check":"pending"; return <span className={`status ${kind}`}>{value}</span>; }

export default function Home(){
  const [dayIndex,setDayIndex]=useState(0),[tab,setTab]=useState<Tab>("today"),[vlogOpen,setVlogOpen]=useState(0); const [spotVlog,setSpotVlog]=useState<Vlog|null>(null);
  const day=days[dayIndex]; const theme=themes.find(t=>day.city.includes(t.match)||day.title.includes(t.match))||themes[dayIndex<4?0:3];
  const dayTickets=useMemo(()=>content.tickets.filter(t=>t.date===day.shortDate||t.date.includes(day.shortDate)),[day.shortDate]);
  const nav:[Tab,string,IconName][]=[["today","今日","today"],["days","行程","days"],["tickets","票务","ticket"],["budget","预算","budget"],["vlog","Vlog","vlog"]];
  return <main className={`app-shell theme-${theme.key}`}>
    <header className="topbar"><div><p className="eyebrow">SEP 27 — OCT 07 · TRAVEL EDITION</p><h1>{content.meta.title}</h1></div><span className="version">V1.5</span></header>
    {tab==="today"&&<>
      <section className="hero-card"><div className="hero-art"/><div className="hero-content"><div className="hero-top"><div><p className="day-kicker">{theme.flag} DAY {day.day} / {days.length} · {day.shortDate} {day.weekday}</p><h2>{day.title}</h2><p className="hero-city">{theme.code} · {day.city}</p></div><span className="live-pill">执行日</span></div><div className="hero-foot"><span>{day.weather}</span><span>{day.budget}</span></div></div></section>
      <div className="day-strip" aria-label="旅行进度">{days.map((d,i)=>{const th=themes.find(t=>d.city.includes(t.match)||d.title.includes(t.match))||themes[i<4?0:3];return <button key={d.iso} className={i===dayIndex?"active":""} onClick={()=>setDayIndex(i)}><small>{th.flag} DAY {i+1}</small><b>{d.shortDate}</b><span>{th.code}</span></button>})}</div>
      <section className="route-ribbon"><div className="route-head"><span><Icon name="map" size={15}/> 今日路线</span><button onClick={()=>openMap(day.city)}>完整地图 ↗</button></div><div className="route-nodes">{routeNodes(day).map((n,i)=><div key={`${n}-${i}`}><i>{i+1}</i><span>{n}</span></div>)}</div></section>
      <section className="section-block timeline-section"><div className="section-heading"><h3>今天怎么走</h3><span>硬时间：{day.hardTime||"无固定预约"}</span></div><div className="timeline">{day.events.map((e,index)=>{const kind=eventKind(e),v=matchVlog(e),pills=statusPills(e);return <article className={`timeline-item kind-${kind}`} key={`${e.time}-${index}`}><time>{e.time}</time><div className="rail"><i><Icon name={kind} size={12}/></i></div><div className="event-card"><div className="event-top"><span className="tag">{e.area}</span>{v&&<button className="vlog-chip" onClick={()=>setSpotVlog(v)}><Icon name="camera" size={13}/>口播</button>}</div><strong>{e.title}</strong><small>{e.transport}{e.duration?` · ${e.duration}`:""}</small><div className="pills">{pills.map(p=><span key={p}>{p}</span>)}{v&&<span className="vlog">Vlog重点</span>}</div><div className="quick-meta"><span>{e.cost||"费用待定"}</span><span>{e.booking||"无票务"}</span></div><details><summary>查看执行详情</summary><p>{e.description}</p>{e.safety&&<p><b>注意：</b>{e.safety}</p>}{e.planB&&<p><b>变化方案：</b>{e.planB}</p>}</details><div className="card-actions">{e.map&&<button onClick={()=>openMap(e.map)}><Icon name="map" size={14}/>Google Maps</button>}</div></div></article>})}</div></section>
      {dayTickets.length>0&&<section className="section-block"><div className="section-heading"><h3>当天票务</h3><span>状态以文档为准</span></div><div className="stack-list">{dayTickets.map((t,i)=><article key={i}><Icon name="ticket"/><div><strong>{t.name}</strong><small>{t.time} · {t.price}</small></div><Status value={t.status}/></article>)}</div></section>}
      <section className="section-block"><div className="section-heading"><h3>现场提示</h3><span>按需展开查看</span></div><div className="notes-grid">{[["吃饭补给",day.food,"food"],["行李",day.luggage,"ticket"],["穿搭",day.clothes,"today"],["Plan B",day.planB,"map"]].map(([a,b,c])=><details key={a}><summary><Icon name={c as IconName}/><span>{a}</span></summary><p>{b}</p></details>)}</div></section>
    </>}
    {tab==="days"&&<section className="page-section"><div className="page-title"><p>TRAVEL JOURNAL</p><h2>9个执行日</h2></div><div className="day-list">{days.map((d,i)=><button key={d.iso} onClick={()=>{setDayIndex(i);setTab("today")}}><time>DAY {i+1}<small>{d.shortDate} {d.weekday}</small></time><div><strong>{d.title}</strong><span>{d.city}</span><p>{d.route}</p></div><Icon name="chevron"/></button>)}</div></section>}
    {tab==="tickets"&&<section className="page-section"><div className="page-title"><p>TICKETS</p><h2>票务状态</h2></div><div className="ticket-list">{content.tickets.map((t,i)=><article key={i}><div className="ticket-date"><Icon name="ticket"/>{t.date}<small>{t.time}</small></div><div><strong>{t.name}</strong><p>{t.price} · {t.reminder}</p>{t.url&&<a href={t.url} target="_blank" rel="noreferrer">官方页面 ↗</a>}</div><Status value={t.status}/></article>)}</div></section>}
    {tab==="budget"&&<section className="page-section"><div className="page-title budget-hero"><p>TRIP BUDGET</p><h2>{content.budgetSummary.recommended}</h2><span>{content.budgetSummary.rates}</span><div className="budget-progress"><i style={{width:"58%"}}/></div><small>已确认费用约占建议预算区间的 51–59%</small></div><div className="budget-icons"><article><Icon name="train"/><span>交通</span></article><article><Icon name="ticket"/><span>门票</span></article><article><Icon name="food"/><span>餐饮</span></article></div><div className="budget-summary"><article><span>基础预算</span><strong>{content.budgetSummary.base}</strong></article><article><span>已确认费用</span><strong>{content.budgetSummary.confirmed}</strong></article></div><div className="budget-list">{content.budget.map((b,i)=><article key={i}><div><strong>{b.name}</strong><small>{b.note}</small></div><div><b>{b.currency} {b.low}{b.high&&b.high!==b.low?`—${b.high}`:""}</b><Status value={b.payment||"未付"}/></div></article>)}</div></section>}
    {tab==="vlog"&&<section className="page-section"><div className="page-title"><p>VLOG FIELD GUIDE</p><h2>37个地点脚本</h2><span>内容来自正式 Vlog Word</span></div><div className="vlog-list">{content.vlog.map((v,i)=><article key={i} className={vlogOpen===i?"open":""}><button onClick={()=>setVlogOpen(vlogOpen===i?-1:i)}><span>{v.group}</span><strong>{v.location}</strong><b>{vlogOpen===i?"−":"+"}</b></button>{vlogOpen===i&&<VlogBody vlog={v}/>}</article>)}</div></section>}
    {spotVlog&&<div className="modal-backdrop" onClick={()=>setSpotVlog(null)}><section className="vlog-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSpotVlog(null)}>×</button><p className="eyebrow">🎥 现场口播</p><h2>{spotVlog.location}</h2><VlogBody vlog={spotVlog}/></section></div>}
    <nav className="bottom-nav" aria-label="主导航">{nav.map(([id,label,icon])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}><i><Icon name={icon}/></i><span>{label}</span></button>)}</nav>
  </main>;
}

function VlogBody({vlog:v}:{vlog:Vlog}){return <div className="vlog-body">{v.background&&<section><h4>背景速懂</h4><p>{v.background}</p></section>}{v.script10&&<section><h4>10秒口播</h4><p>{v.script10}</p></section>}{v.script30&&<section><h4>30秒口播</h4><p>{v.script30}</p></section>}{v.voiceover&&<section><h4>后期旁白</h4><p>{v.voiceover}</p></section>}{v.shots.length>0&&<section><h4>必拍镜头</h4><ul>{v.shots.map((s,j)=><li key={j}>{s}</li>)}</ul></section>}{v.transition&&<section><h4>转场</h4><p>{v.transition}</p></section>}{v.changes.length>0&&<section><h4>现场变化话术</h4>{v.changes.map((s,j)=><p key={j}>{s}</p>)}</section>}</div>}
