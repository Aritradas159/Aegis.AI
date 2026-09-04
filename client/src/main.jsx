import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './lib/api';
import { AlertTriangle, BarChart3, BookOpen, ChevronDown, ChevronRight, ChevronUp, History, Lightbulb, MessageCircle, Send, ShieldCheck, Sparkles, TrendingDown, TrendingUp, WalletCards, X, Zap } from 'lucide-react';
import { Area, AreaChart, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import './styles.css';

function AppShell({ children }) {
  const { t } = useLanguage();
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/dashboard" className="brand"><span className="brand-mark">R</span><span>Risk <b>Copilot</b></span></NavLink>
      <nav className="nav-links">
        <NavLink to="/dashboard">{t('nav_dashboard')}</NavLink>
        <NavLink to="/simulator">{t('nav_simulator')}</NavLink>
        <NavLink to="/learn">{t('nav_learn')}</NavLink>
        <NavLink to="/history">{t('nav_history')}</NavLink>
      </nav>
      <div className="user-actions">
        <LanguageSelector />
      </div>
    </header>
    <main><Outlet /></main>
  </div>;
}

function Landing(){
  const navigate = useNavigate();
  const { t } = useLanguage();
  return <div className="landing">
    <div className="hero-glow"/>
    <div className="landing-nav">
      <NavLink to="/" className="brand"><span className="brand-mark">R</span><span>Risk <b>Copilot</b></span></NavLink>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <LanguageSelector />
        <button className="btn primary" onClick={()=>navigate('/simulator')}>{t('hero_try_sim')} <ChevronRight size={15}/></button>
      </div>
    </div>
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> {t('hero_eyebrow')}</div>
        <h1>{t('hero_title_1')}<span>{t('hero_title_span')}</span>{t('hero_title_2')}</h1>
        <p>{t('hero_desc')}</p>
        <div className="hero-actions">
          <button className="btn primary large" onClick={()=>navigate('/simulator')}>{t('hero_try_sim')} <ChevronRight size={19}/></button>
          <button className="btn ghost large" onClick={()=>navigate('/learn')}>{t('hero_explore_learn')}</button>
        </div>
        <p className="mini-disclaimer"><ShieldCheck size={15}/> {t('hero_disclaimer')}</p>
      </div>
      <div className="hero-card">
        <div className="card-top"><span>{t('risk_snapshot')}</span><span className="live-dot">{t('demo_badge')}</span></div>
        <div className="risk-number">23.4%<small>{t('prob_of_loss')}</small></div>
        <div className="mini-chart"><div className="bars">{[30,46,38,63,56,78,69,92,74,57,43].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div>
        <div className="metric-row">
          <div><small>{t('p5_label')}</small><b>₹72K</b></div>
          <div><small>{t('median_label')}</small><b>₹1.12L</b></div>
          <div><small>{t('p95_label')}</small><b>₹1.48L</b></div>
        </div>
      </div>
    </section>
    <section className="container feature-grid">
      <Feature icon={<BarChart3/>} title={t('feat_monte_title')} text={t('feat_monte_desc')}/>
      <Feature icon={<TrendingDown/>} title={t('feat_loss_title')} text={t('feat_loss_desc')}/>
      <Feature icon={<ShieldCheck/>} title={t('feat_friction_title')} text={t('feat_friction_desc')}/>
      <Feature icon={<BookOpen/>} title={t('feat_bilingual_title')} text={t('feat_bilingual_desc')}/>
    </section>
  </div>;
}
function Feature({icon,title,text}){ return <div className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div> }

function Dashboard(){
  const navigate=useNavigate();
  const { t } = useLanguage();
  const [history,setHistory]=useState([]);
  const [lessonCount,setLessonCount]=useState(5);
  const fmt=n=>`₹${Number(n).toLocaleString('en-IN')}`;

  useEffect(()=>{
    api('/simulations/history').then(d=>{if(Array.isArray(d.simulations))setHistory(d.simulations)}).catch(()=>{});
    api('/learning').then(d=>{if(Array.isArray(d.lessons)&&d.lessons.length)setLessonCount(d.lessons.length)}).catch(()=>{});
  },[]);

  const latest=history[0]||null;

  return <div className="page container dash-page">
    {/* ── Hero ──────────────────────────────────────────────────────── */}
    <div className="dash-hero">
      <div className="dash-hero-copy">
        <div className="eyebrow">{t('dash_welcome_eyebrow')}</div>
        <h1 style={{whiteSpace:'pre-line'}}>{t('dash_welcome_title')}</h1>
        <p>{t('dash_welcome_desc')}</p>
      </div>
      <NavLink to="/simulator" className="btn primary large">{t('dash_run_sim_btn')} <ChevronRight size={19}/></NavLink>
    </div>

    {/* ── Main card grid ────────────────────────────────────────────── */}
    <div className="dash-grid">
      <div className="big-card gradient-card dash-copilot">
        <div className="eyebrow">{t('dash_copilot_eyebrow')}</div>
        <h2 style={{whiteSpace:'pre-line'}}>{t('dash_copilot_title')}</h2>
        <p>{t('dash_copilot_desc')}</p>
        <NavLink to="/simulator" className="btn light">{t('dash_start_scenario')} <ChevronRight size={16}/></NavLink>
      </div>

      <div className="dash-side-cards">
        <div className="stat-card dash-stat">
          <div className="stat-icon"><BarChart3 size={20}/></div>
          <small>{t('dash_simulations_card')}</small>
          {latest?<>
            <strong>{latest.strategy.toUpperCase()} · {fmt(latest.initialInvestment)}</strong>
            <p>{t('dash_loss_probability')}: <b style={{color:latest.probabilityOfLoss>30?'var(--red)':'var(--green)'}}>{latest.probabilityOfLoss}%</b></p>
            <p style={{fontSize:10,color:'#5e7682'}}>{new Date(latest.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
            <NavLink to="/history" className="text-link">{t('dash_view_history')}</NavLink>
          </>:<>
            <strong>{t('dash_run_first')}</strong>
            <p>{t('dash_recent_reports')}</p>
            <NavLink to="/simulator" className="text-link">{t('dash_run_sim_btn')} →</NavLink>
          </>}
        </div>

        <div className="stat-card dash-stat">
          <div className="stat-icon"><BookOpen size={20}/></div>
          <small>{t('dash_learning_card')}</small>
          <strong>{t('dash_micro_lessons', { count: lessonCount })}</strong>
          <p>{t('dash_learning_desc')}</p>
          <NavLink to="/learn" className="text-link">{t('dash_start_learning')}</NavLink>
        </div>
      </div>
    </div>

    {/* ── Recent risk insight ───────────────────────────────────────── */}
    {latest?<div className="dash-section">
      <div className="section-head"><div><div className="eyebrow">{t('dash_recent_risk_eyebrow')}</div><h2>{t('dash_recent_risk_title')}</h2></div><NavLink to="/history" className="btn ghost">{t('dash_view_full_analysis')} <ChevronRight size={16}/></NavLink></div>
      <div className="dash-risk-row">
        <div className="dash-risk-badge" style={{background:latest.probabilityOfLoss>30?'rgba(255,107,107,.12)':'rgba(55,217,139,.12)',borderColor:latest.probabilityOfLoss>30?'rgba(255,107,107,.3)':'rgba(55,217,139,.3)'}}>
          <span style={{color:latest.probabilityOfLoss>30?'var(--red)':'var(--green)',fontSize:28,fontWeight:800}}>{latest.probabilityOfLoss}%</span>
          <small style={{color:'#708690'}}>{t('dash_loss_probability')}</small>
        </div>
        <div className="dash-risk-details">
          <div><small>{t('dash_invested_capital')}</small><b>{fmt(latest.totalInvested||latest.initialInvestment)}</b></div>
          <div><small>{t('dash_median_outcome')}</small><b>{fmt(latest.medianOutcome)}</b></div>
          <div><small>{t('dash_max_drawdown')}</small><b style={{color:'var(--red)'}}>{latest.maxDrawdown}%</b></div>
        </div>
      </div>
    </div>:null}

    {/* ── Explore features ──────────────────────────────────────────── */}
    <div className="dash-section">
      <div className="section-head"><div><h2>Explore Risk Copilot</h2><p>Interactive risk analysis tools designed to build financial literacy.</p></div></div>
      <div className="dash-explore-grid">
        <div className="dash-explore-card">
          <div className="dash-explore-icon"><Zap size={20}/></div>
          <h3>{t('stress_lab_title')}</h3>
          <p>{t('stress_lab_subtitle')}</p>
          <button className="btn ghost" onClick={()=>navigate('/simulator')}>{t('dash_start_scenario')} <ChevronRight size={15}/></button>
        </div>
        <div className="dash-explore-card">
          <div className="dash-explore-icon"><TrendingDown size={20}/></div>
          <h3>{t('bad_timing_title')}</h3>
          <p>{t('bad_timing_subtitle')}</p>
          <button className="btn ghost" onClick={()=>navigate('/simulator')}>{t('dash_start_scenario')} <ChevronRight size={15}/></button>
        </div>
        <div className="dash-explore-card">
          <div className="dash-explore-icon"><BarChart3 size={20}/></div>
          <h3>{t('compare_title')}</h3>
          <p>{t('compare_subtitle')}</p>
          <button className="btn ghost" onClick={()=>navigate('/simulator')}>{t('dash_start_scenario')} <ChevronRight size={15}/></button>
        </div>
      </div>
    </div>

    {/* ── How it works ──────────────────────────────────────────────── */}
    <div className="dash-section">
      <div className="section-head"><div><h2>How it works</h2><p>Learn → Simulate → Understand → Apply</p></div></div>
      <div className="steps"><Step n="01" title="Choose a strategy" text="SIP, F&O or a mixed portfolio."/><Step n="02" title="Run 10,000 scenarios" text="Historical return behavior is resampled to create possible outcomes."/><Step n="03" title="See your downside" text="Probability of loss, drawdown and outcome ranges are shown together."/></div>
    </div>
  </div>;
}
function Step({n,title,text}){return <div className="step"><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></div>}

function Simulator(){
  const { t } = useLanguage();
  const [strategy,setStrategy]=useState('sip');
  const [form,setForm]=useState({initialInvestment:50000,monthlyInvestment:5000,durationYears:5,leverage:3});
  const [result,setResult]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [gate,setGate]=useState(false);
  const [stressScenario,setStressScenario]=useState(null);

  const errors = {
    initialInvestment: (form.initialInvestment === '' || isNaN(Number(form.initialInvestment)) || Number(form.initialInvestment) <= 0) ? 'Must be greater than 0' : '',
    monthlyInvestment: (strategy !== 'fno' && (form.monthlyInvestment === '' || isNaN(Number(form.monthlyInvestment)) || Number(form.monthlyInvestment) < 0)) ? 'Must be 0 or greater' : '',
    durationYears: (form.durationYears === '' || isNaN(Number(form.durationYears)) || Number(form.durationYears) <= 0) ? 'Must be greater than 0' : '',
  };
  const isValid = !errors.initialInvestment && !errors.monthlyInvestment && !errors.durationYears;

  const run=async(customForm, customStrat)=>{
    const f = customForm || form;
    const s = customStrat || strategy;
    const errs = {
      initialInvestment: (f.initialInvestment === '' || isNaN(Number(f.initialInvestment)) || Number(f.initialInvestment) <= 0) ? 'Must be greater than 0' : '',
      monthlyInvestment: (s !== 'fno' && (f.monthlyInvestment === '' || isNaN(Number(f.monthlyInvestment)) || Number(f.monthlyInvestment) < 0)) ? 'Must be 0 or greater' : '',
      durationYears: (f.durationYears === '' || isNaN(Number(f.durationYears)) || Number(f.durationYears) <= 0) ? 'Must be greater than 0' : '',
    };
    if (errs.initialInvestment || errs.monthlyInvestment || errs.durationYears) return;
    setError('');setBusy(true);setStressScenario(null);
    try{
      const data=await api('/simulations',{
        method:'POST',
        body:JSON.stringify({
          ...f,
          initialInvestment:Number(f.initialInvestment),
          monthlyInvestment:Number(f.monthlyInvestment),
          durationYears:Number(f.durationYears),
          leverage:Number(f.leverage),
          strategy:s
        })
      });
      setResult(data)
    }catch(e){setError(e.message)}finally{setBusy(false)}
  };

  return <div className="page container"><div className="page-head"><div><div className="eyebrow">RISK SIMULATOR</div><h1>{t('hero_title_1')}<span>{t('hero_title_span')}</span>{t('hero_title_2')}</h1><p>{t('sim_subtitle')}</p></div><div className="source-note"><span className="live-dot">●</span> {result?.source || 'Historical data path ready'}</div></div>
    <div className="sim-grid">
      <section className="panel">
        <div className="panel-title"><h2>1. {t('sim_strategy_label')}</h2><span>{t('sim_title')}</span></div>
        <div className="strategy-grid">
          {[
            ['sip', t('strategy_sip'), t('strategy_sip_sub'), t('strategy_sip_desc')],
            ['fno', t('strategy_fno'), t('strategy_fno_sub'), t('strategy_fno_desc')],
            ['mixed', t('strategy_mixed'), t('strategy_mixed_sub'), t('strategy_mixed_desc')]
          ].map(([id, title, sub, desc]) => (
            <button key={id} className={`strategy ${strategy===id?'selected':''}`} onClick={()=>{setStrategy(id);setResult(null);setStressScenario(null)}}>
              <div className="strategy-radio">{strategy===id?'✓':''}</div>
              <strong>{title}</strong>
              <small style={{display:'block',color:'var(--green)',marginTop:2}}>{sub}</small>
              <small style={{marginTop:4}}>{desc}</small>
            </button>
          ))}
        </div>
        {strategy==='fno'&&<div className="warning"><ShieldCheck size={20}/><div><b>High-risk scenario</b><p>{t('sim_fno_warning')}</p></div></div>}
        <div className="panel-title second"><h2>2. Set your scenario</h2><span>Use round numbers for a quick demo.</span></div>
        <div className="form-grid">
          <label>
            <span>{t('sim_input_initial')} {errors.initialInvestment && <span style={{color:'var(--red)',fontSize:11,fontWeight:400,marginLeft:6}}>({errors.initialInvestment})</span>}</span>
            <input type="number" min="1" value={form.initialInvestment} onChange={e=>setForm({...form,initialInvestment:e.target.value})}/>
          </label>
          {strategy!=='fno'&&<label>
            <span>{t('sim_input_monthly')} {errors.monthlyInvestment && <span style={{color:'var(--red)',fontSize:11,fontWeight:400,marginLeft:6}}>({errors.monthlyInvestment})</span>}</span>
            <input type="number" min="0" value={form.monthlyInvestment} onChange={e=>setForm({...form,monthlyInvestment:e.target.value})}/>
          </label>}
          <label>
            <span>{t('sim_input_duration')} {errors.durationYears && <span style={{color:'var(--red)',fontSize:11,fontWeight:400,marginLeft:6}}>({errors.durationYears})</span>}</span>
            <input type="number" min="1" max="30" value={form.durationYears} onChange={e=>setForm({...form,durationYears:e.target.value})}/>
          </label>
          {strategy==='fno'&&<label>
            <span>{t('sim_input_leverage')}</span>
            <input type="number" min="1" max="5" step="0.5" value={form.leverage} onChange={e=>setForm({...form,leverage:e.target.value})}/>
          </label>}
        </div>
        {error&&<div className="error-box">{error}</div>}
        <button className="btn primary full large" onClick={()=>isValid&&(strategy==='fno'?setGate(true):run())} disabled={busy||!isValid}>
          {busy ? t('sim_btn_running') : t('sim_btn_run')} <BarChart3 size={19}/>
        </button>
        <p className="legal">{t('sim_disclaimer')}</p>
      </section>

      <section className="panel results-panel">
        {!result ? <EmptyResult/> : <Results result={result} strategy={strategy} form={form} stressScenario={stressScenario} onStressChange={setStressScenario}/>}
      </section>
    </div>

    {gate&&<FrictionGate onClose={()=>setGate(false)} onContinue={()=>{setGate(false);run()}}/>}
    <AiChatPanel strategy={strategy} setStrategy={setStrategy} form={form} result={result} stressScenario={stressScenario} setForm={setForm} onRun={run}/>
  </div>;
}

function EmptyResult(){
  const { t } = useLanguage();
  return <div className="empty-result">
    <div className="empty-icon"><BarChart3/></div>
    <h2>{t('results_empty_title')}</h2>
    <p>{t('results_empty_desc')}</p>
  </div>;
}

function Results({result,strategy,form,stressScenario,onStressChange}){
  const { t } = useLanguage();
  const [tab,setTab]=useState('sim');
  const fmt=n=>`₹${Number(n).toLocaleString('en-IN')}`;
  const isFallback=String(result.source||'').toLowerCase().includes('fallback');

  return <div>
    <div className="result-head"><div><div className="eyebrow">SIMULATION COMPLETE</div><h2>{t('results_title')}</h2></div><span className="pill">{t('results_10k_badge')}</span></div>
    {isFallback&&<div className="fallback-banner"><span>⚠</span> Live Nifty 50 data was unavailable for this run — results use a synthetic sample dataset, not real market history.</div>}
    
    <AiRiskSummary result={result} strategy={strategy} form={form} stressScenario={stressScenario}/>

    <div className="lang-toggle" style={{margin:'16px 0'}}>
      <button className={tab==='sim'?'active':''} onClick={()=>setTab('sim')}>Simulation</button>
      <button className={tab==='scenario'?'active':''} onClick={()=>setTab('scenario')}>Scenario Lab</button>
      <button className={tab==='compare'?'active':''} onClick={()=>setTab('compare')}>Compare</button>
      <button className={tab==='timing'?'active':''} onClick={()=>setTab('timing')}>Bad timing</button>
    </div>

    {tab==='sim'?<div>
      <div className="risk-main">
        <div><span>{t('results_prob_of_loss')}</span><strong>{result.probabilityOfLoss}%</strong></div>
        <div className="risk-meter"><i style={{width:`${Math.min(100,result.probabilityOfLoss)}%`}}/></div>
        <small className="invested-note">{t('dash_invested_capital')}: {fmt(result.totalInvested)}</small>
      </div>

      <div className="metrics">
        <Metric title={t('results_prob_of_profit')} value={`${result.probabilityOfProfit}%`} icon={<TrendingUp/>}/>
        <Metric title={t('results_median_outcome')} value={fmt(result.medianOutcome)} icon={<WalletCards/>}/>
        <Metric title={t('results_max_drawdown')} value={`${result.maxDrawdown}%`} icon={<TrendingDown/>}/>
      </div>

      {result.yearlyBands&&<YearlyFanChart bands={result.yearlyBands} fdPath={result.fdPath} fmt={fmt}/>}

      <div className="chart-card">
        <div className="chart-head">
          <div><b>{t('fan_chart_title')}</b><small>{t('fan_chart_subtitle')}</small></div>
          <div className="range"><span>5th</span>{fmt(result.percentile5)} <span>95th</span>{fmt(result.percentile95)}</div>
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.distribution}>
              <XAxis dataKey="outcome" tickFormatter={v=>`₹${Math.round(v/1000)}k`} hide/>
              <YAxis hide/>
              <Tooltip formatter={(v)=>[v,'scenarios']} labelFormatter={v=>fmt(v)}/>
              <Area type="monotone" dataKey="count" stroke="#37d98b" fill="#37d98b" fillOpacity={0.15}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <RiskBreakdown result={result} strategy={strategy} fmt={fmt}/>

      <div className="insight">
        <Sparkles size={19}/>
        <div>
          <b>{t('results_key_takeaway')}</b>
          <p>{result.probabilityOfLoss < 20 ? 'The simulated downside probability is relatively lower, but outcomes can still vary. Look at the 5th percentile before drawing conclusions.' : 'The simulated downside probability is meaningful. Review drawdown and the lower outcome range before considering the scenario.'}</p>
        </div>
      </div>

      <ExplainMyRisk result={result} strategy={strategy} fmt={fmt}/>
      <AiScenarioInterpreter result={result} strategy={strategy} form={form} stressScenario={stressScenario}/>
      <p className="legal">Source: {result.source}. Simulations are illustrative and do not constitute personalized investment advice.</p>
    </div>:tab==='scenario'?<ScenarioLabPanel form={form} strategy={strategy} fmt={fmt} onStressChange={onStressChange}/>:tab==='compare'?<ComparePanel form={form} fmt={fmt}/>:<BadTimingPanel form={form} fmt={fmt}/>}
  </div>;
}

function YearlyFanChart({bands,fdPath,fmt}){
  const data=bands.map((b,i)=>({year:b.year,p10:b.p10,median:b.median,p90:b.p90,fd:fdPath?.[i]?.balance,band:b.p90-b.p10}));
  return <div className="chart-card" style={{marginBottom:16}}>
    <div className="chart-head"><div><b>Outcome over time</b><small>P10–P90 range vs. median vs. a fixed deposit</small></div></div>
    <div className="chart" style={{height:220}}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c3542"/>
          <XAxis dataKey="year" stroke="#6f8690" fontSize={11}/>
          <YAxis stroke="#6f8690" fontSize={11} tickFormatter={v=>`₹${Math.round(v/1000)}k`}/>
          <Tooltip formatter={(v,name)=>[fmt(v),name]} labelFormatter={y=>`Year ${y}`} contentStyle={{background:'#0d1d2a',border:'1px solid #243d49'}}/>
          <Area dataKey="p10" stackId="band" stroke="none" fill="transparent"/>
          <Area dataKey="band" stackId="band" stroke="none" fill="#37d98b" fillOpacity={0.12} name="P10–P90 range"/>
          <Line type="monotone" dataKey="median" stroke="#37d98b" strokeWidth={2} dot={false} name="Median"/>
          {fdPath&&<Line type="monotone" dataKey="fd" stroke="#ffb84d" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Fixed Deposit (7%)"/>}
          <Legend wrapperStyle={{fontSize:11,color:'#8ea4af',paddingTop:6}}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>;
}

function BadTimingPanel({form,fmt}){
  const [startYear,setStartYear]=useState(2008);
  const [data,setData]=useState(null);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState('');
  const years=[2000,2008,2015,2018,2020];

  const run=async()=>{
    setBusy(true);setErr('');
    try{
      const res=await api('/simulations/bad-timing',{method:'POST',body:JSON.stringify({initialInvestment:Number(form.initialInvestment),monthlyInvestment:Number(form.monthlyInvestment)||0,durationYears:Number(form.durationYears),startYear})});
      setData(res);
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  };
  return <div>
    <h3 style={{margin:'0 0 6px'}}>What if you started right before a crash?</h3>
    <p style={{color:'#8ea4af',fontSize:13,margin:'0 0 16px'}}>Replays the <i>actual</i> historical sequence of returns starting from a chosen year — no randomness, just what really happened.</p>
    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:18}}>
      <label style={{fontSize:12,color:'#c4d2d8',fontWeight:700}}>Start year
        <select value={startYear} onChange={e=>setStartYear(Number(e.target.value))} style={{display:'block',marginTop:6,background:'#081822',color:'#fff',border:'1px solid #29414e',borderRadius:10,padding:'8px 10px'}}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
      </label>
      <button className="btn primary" onClick={run} disabled={busy} style={{marginTop:20}}>{busy?'Replaying…':'Replay history'}</button>
    </div>
    {err&&<div className="error-box">{err}</div>}
    {data&&<div>
      <div className="chart" style={{height:220}}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.path}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c3542"/>
            <XAxis dataKey="actualYear" stroke="#6f8690" fontSize={11}/>
            <YAxis stroke="#6f8690" fontSize={11} tickFormatter={v=>`₹${Math.round(v/1000)}k`}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={y=>`Year ${y}`} contentStyle={{background:'#0d1d2a',border:'1px solid #243d49'}}/>
            <Line type="monotone" dataKey="balance" stroke="#ff6b6b" strokeWidth={2.5} dot={{r:3}}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p style={{color:'#8ea4af',fontSize:13,marginTop:14}}>Starting a SIP in <b>{startYear}</b> and staying invested through {data.path.length} years would have ended at <b style={{color:'#eaf2f7'}}>{fmt(data.path[data.path.length-1].balance)}</b> on {fmt(data.totalInvested)} invested — including whatever crash happened to fall in that window.</p>
      {data.truncated&&<p style={{color:'#ffcb70',fontSize:12,marginTop:8}}>⚠ Only {data.yearsAvailable} year(s) of real historical data are available from {startYear} onward — shown above as-is, not padded with unrelated years.</p>}
      <p className="legal" style={{marginTop:14}}>Source: {data.source}. This replays real historical returns for illustration only and does not constitute personalized investment advice.</p>
    </div>}
  </div>
}
function Metric({title,value,icon}){return <div className="metric"><div className="metric-icon">{icon}</div><small>{title}</small><strong>{value}</strong></div>}

function FrictionGate({onClose,onContinue}){
  const { t } = useLanguage();
  return <div className="modal-backdrop"><div className="friction-modal">
    <button className="close" onClick={onClose}><X/></button>
    <div className="friction-icon"><ShieldCheck/></div>
    <div className="eyebrow">PAUSE → UNDERSTAND → CONTINUE</div>
    <h2>{t('friction_title')}</h2>
    <p>{t('friction_desc')}</p>
    <div className="leverage-box">
      <span>₹10,000 capital</span><b>× 3 leverage</b><span>₹30,000 exposure</span>
    </div>
    <p style={{fontSize:11,color:'#ffcb70',marginBottom:12}}>{t('friction_stat')}</p>
    <NavLink to="/learn" className="text-link">Learn about leverage first →</NavLink>
    <button className="btn primary full" onClick={onContinue} style={{marginTop:14}}>{t('friction_understand_btn')}</button>
    <button className="btn ghost full" onClick={onClose}>{t('friction_cancel_btn')}</button>
  </div></div>;
}

// ── Feature 1: Scenario Lab ─────────────────────────────────────────
function ScenarioLabPanel({form,strategy,fmt,onStressChange}){
  const { t } = useLanguage();
  const presets=[
    {id:'crash',label:t('stress_preset_2008'),desc:'Severe downturn — returns scaled to ~35% of historical with a negative shift.'},
    {id:'decline',label:t('stress_preset_covid'),desc:'Returns reduced to ~60% of historical with a mild negative shift.'},
    {id:'inflationShock',label:t('stress_preset_inflation'),desc:'All real returns reduced by 6 percentage points.'},
    {id:'highVolatility',label:t('stress_preset_boom'),desc:'Return spreads amplified 2.2× — same average, much wider range.'},
    {id:'custom',label:t('stress_preset_custom'),desc:'You choose the return adjustment and volatility multiplier.'},
  ];
  const [selected,setSelected]=useState('crash');
  const [customAdj,setCustomAdj]=useState(-10);
  const [customVol,setCustomVol]=useState(1.5);
  const [data,setData]=useState(null);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState('');

  const run=async()=>{
    setBusy(true);setErr('');
    try{
      const body={
        strategy,
        initialInvestment:Number(form.initialInvestment),
        monthlyInvestment:Number(form.monthlyInvestment)||0,
        durationYears:Number(form.durationYears),
        leverage:Number(form.leverage)||1,
        scenarioType:selected,
      };
      if(selected==='custom') body.custom={returnAdjustment:customAdj/100,volatilityMultiplier:customVol};
      const res=await api('/simulations/scenario',{method:'POST',body:JSON.stringify(body)});
      setData(res);
      if(onStressChange) onStressChange({scenarioType:selected, label:res.scenarioLabel, ...res.stress});
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  };

  const MetricCell=({label,base,stress,pct})=>{
    const worse=pct?(stress>base):(stress<base);
    const better=pct?(stress<base):(stress>base);
    return <div className="scenario-metric-row">
      <span>{label}</span>
      <span>{pct?`${base}%`:fmt(base)}</span>
      <span style={{color:worse?'var(--red)':better?'var(--green)':'inherit'}}>{pct?`${stress}%`:fmt(stress)}</span>
    </div>;
  };

  return <div>
    <h3 style={{margin:'0 0 6px'}}>{t('stress_lab_title')}</h3>
    <p style={{color:'#8ea4af',fontSize:13,margin:'0 0 16px'}}>{t('stress_lab_subtitle')}</p>
    <div className="scenario-presets">
      {presets.map(p=><button key={p.id} className={`scenario-preset ${selected===p.id?'selected':''}`} onClick={()=>{setSelected(p.id);if(onStressChange)onStressChange({scenarioType:p.id, label:p.label})}}>
        <strong>{p.label}</strong><small>{p.desc}</small>
      </button>)}
    </div>
    {selected==='custom'&&<div className="custom-scenario-inputs">
      <label>{t('stress_custom_shock')} <small style={{color:'#8ea4af',fontWeight:400}}>({customAdj>0?'+':''}{customAdj} pp)</small>
        <input type="range" min="-30" max="10" value={customAdj} onChange={e=>setCustomAdj(Number(e.target.value))}/>
      </label>
      <label>{t('stress_custom_vol')} <small style={{color:'#8ea4af',fontWeight:400}}>({customVol}×)</small>
        <input type="range" min="0.5" max="4" step="0.1" value={customVol} onChange={e=>setCustomVol(Number(e.target.value))}/>
      </label>
    </div>}
    {err&&<div className="error-box">{err}</div>}
    <button className="btn primary full" onClick={run} disabled={busy} style={{marginTop:14}}>{busy?t('sim_btn_running'):t('stress_apply')} <Zap size={17}/></button>
    {data&&<div style={{marginTop:20}}>
      <div className="scenario-vs-header"><div><span className="pill">{t('stress_baseline')}</span></div><div className="vs-label">vs.</div><div><span className="pill stress">{data.scenarioLabel}</span></div></div>
      <div className="scenario-table">
        <div className="scenario-metric-row header"><span>Metric</span><span>{t('stress_baseline')}</span><span>{t('stress_stressed')}</span></div>
        <MetricCell label={t('results_prob_of_loss')} base={data.base.probabilityOfLoss} stress={data.stress.probabilityOfLoss} pct/>
        <MetricCell label={t('results_median_outcome')} base={data.base.medianOutcome} stress={data.stress.medianOutcome}/>
        <MetricCell label={t('p5_label')} base={data.base.percentile5} stress={data.stress.percentile5}/>
        <MetricCell label={t('p95_label')} base={data.base.percentile95} stress={data.stress.percentile95}/>
        <MetricCell label={t('results_max_drawdown')} base={data.base.maxDrawdown} stress={data.stress.maxDrawdown} pct/>
        <MetricCell label={t('results_prob_of_profit')} base={data.base.probabilityOfProfit} stress={data.stress.probabilityOfProfit} pct/>
      </div>
      <p className="legal" style={{marginTop:14}}>Source: {data.source}. {data.disclaimer}</p>
    </div>}
  </div>;
}

// ── Feature 2: Portfolio Comparison ─────────────────────────────────
function ComparePanel({form,fmt}){
  const { t } = useLanguage();
  const [data,setData]=useState(null);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState('');

  const run=async()=>{
    setBusy(true);setErr('');
    try{
      const res=await api('/simulations/compare',{method:'POST',body:JSON.stringify({initialInvestment:Number(form.initialInvestment),monthlyInvestment:Number(form.monthlyInvestment)||0,durationYears:Number(form.durationYears),leverage:Number(form.leverage)||3})});
      setData(res);
    }catch(e){setErr(e.message)}finally{setBusy(false)}
  };

  useEffect(()=>{run()},[form]);

  return <div>
    <h3 style={{margin:'0 0 6px'}}>{t('compare_title')}</h3>
    <p style={{color:'#8ea4af',fontSize:13,margin:'0 0 16px'}}>{t('compare_subtitle')}</p>
    {err&&<div className="error-box">{err}</div>}
    {busy&&<p style={{color:'#8ea4af'}}>{t('sim_btn_running')}</p>}
    {data&&<div className="compare-table">
      <div className="compare-row header"><span>{t('compare_col_metric')}</span><span>{t('compare_col_sip')}</span><span>{t('compare_col_mixed')}</span><span>{t('compare_col_fno')}</span></div>
      <div className="compare-row"><span className="compare-label">{t('results_prob_of_loss')}</span><span style={{color:data.sip.probabilityOfLoss>30?'var(--red)':'var(--green)'}}>{data.sip.probabilityOfLoss}%</span><span>{data.mixed.probabilityOfLoss}%</span><span style={{color:'var(--red)'}}>{data.fno.probabilityOfLoss}%</span></div>
      <div className="compare-row"><span className="compare-label">{t('results_median_outcome')}</span><span>{fmt(data.sip.medianOutcome)}</span><span>{fmt(data.mixed.medianOutcome)}</span><span>{fmt(data.fno.medianOutcome)}</span></div>
      <div className="compare-row"><span className="compare-label">{t('p5_label')}</span><span>{fmt(data.sip.percentile5)}</span><span>{fmt(data.mixed.percentile5)}</span><span style={{color:'var(--red)'}}>{fmt(data.fno.percentile5)}</span></div>
      <div className="compare-row"><span className="compare-label">{t('p95_label')}</span><span>{fmt(data.sip.percentile95)}</span><span>{fmt(data.mixed.percentile95)}</span><span style={{color:'var(--green)'}}>{fmt(data.fno.percentile95)}</span></div>
      <div className="compare-row"><span className="compare-label">{t('results_max_drawdown')}</span><span>{data.sip.maxDrawdown}%</span><span>{data.mixed.maxDrawdown}%</span><span style={{color:'var(--red)'}}>{data.fno.maxDrawdown}%</span></div>
      <div className="compare-row"><span className="compare-label">{t('results_prob_of_profit')}</span><span>{data.sip.probabilityOfProfit}%</span><span>{data.mixed.probabilityOfProfit}%</span><span>{data.fno.probabilityOfProfit}%</span></div>
    </div>}
    <p className="legal" style={{marginTop:14}}>All three strategies evaluated using the same 10,000 bootstrap return sequences.</p>
  </div>;
}

// ── Feature 3: Risk Breakdown ───────────────────────────────────────
function RiskBreakdown({result,strategy,fmt}){
  const { t } = useLanguage();
  const d=result.distribution||[];
  if(!d.length) return null;
  const invested=result.totalInvested||1;
  const lossScenarios=d.filter(b=>b.outcome<invested).reduce((s,b)=>s+b.count,0);
  const modScenarios=d.filter(b=>b.outcome>=invested&&b.outcome<invested*1.6).reduce((s,b)=>s+b.count,0);
  const highScenarios=d.filter(b=>b.outcome>=invested*1.6).reduce((s,b)=>s+b.count,0);
  const total=result.iterations||10000;
  const lossPct=((lossScenarios/total)*100).toFixed(1);
  const modPct=((modScenarios/total)*100).toFixed(1);
  const highPct=((highScenarios/total)*100).toFixed(1);

  return <div className="risk-breakdown">
    <div className="chart-head" style={{marginBottom:12}}><div><b>{t('breakdown_title')}</b><small>Out of {total.toLocaleString()} simulated paths</small></div></div>
    <div className="rb-row"><span className="rb-label">{t('breakdown_loss_share')}</span><div className="rb-bar-track"><div className="rb-bar-fill" style={{width:`${lossPct}%`,background:'var(--red)'}}/></div><span className="rb-value" style={{color:'var(--red)'}}>{lossPct}%</span></div>
    <div className="rb-row"><span className="rb-label">{t('breakdown_mod_share')}</span><div className="rb-bar-track"><div className="rb-bar-fill" style={{width:`${modPct}%`,background:'#ffb84d'}}/></div><span className="rb-value" style={{color:'#ffb84d'}}>{modPct}%</span></div>
    <div className="rb-row"><span className="rb-label">{t('breakdown_high_share')}</span><div className="rb-bar-track"><div className="rb-bar-fill" style={{width:`${highPct}%`,background:'var(--green)'}}/></div><span className="rb-value" style={{color:'var(--green)'}}>{highPct}%</span></div>
  </div>;
}

// ── Feature 4: Explain My Risk ───────────────────────────────────────
function ExplainMyRisk({result,strategy,fmt}){
  const { t } = useLanguage();
  const [open,setOpen]=useState(false);
  const lossP=result.probabilityOfLoss;
  const dd=result.maxDrawdown;
  const median=result.medianOutcome;
  const totalInv=result.totalInvested;

  const explainText=()=>{
    const parts=[];
    if(strategy==='fno'){
      parts.push(`You selected F&O with leverage. While the median outcome is ${fmt(median)}, there is a ${lossP}% chance of ending below your invested capital (${fmt(totalInv)}).`);
      parts.push(`The maximum simulated drawdown is ${dd}%, meaning during market stress, your position could have lost more than ${dd>50?'half':'a third'} of its peak value.`);
      parts.push(`F&O leverage works both ways — it magnifies gains in up markets but compounds losses in down markets.`);
    } else if(strategy==='mixed'){
      parts.push(`Your mixed portfolio blends SIP index investing (70%) with a tactical F&O sleeve (30%).`);
      parts.push(`This gives you a ${result.probabilityOfProfit}% probability of positive returns with a median outcome of ${fmt(median)}.`);
      parts.push(`However, the tactical sleeve introduces a max drawdown of ${dd}% — higher than pure SIP, but lower than pure F&O.`);
    } else {
      parts.push(`Your SIP strategy shows a ${result.probabilityOfProfit}% probability of profit over the simulated horizon.`);
      parts.push(`The median simulated outcome is ${fmt(median)} on ${fmt(totalInv)} invested.`);
      parts.push(`Max drawdown of ${dd}% reflects historical market downturns (e.g. 2008, 2020), but regular monthly investments help average out entry prices.`);
    }
    return parts;
  };

  return <div className="chart-card explain-card">
    <button className="btn ghost full" onClick={()=>setOpen(!open)} style={{justifyContent:'space-between',width:'100%'}}>
      <span style={{display:'flex',alignItems:'center',gap:8}}><Lightbulb size={17} color="var(--green)"/> <b>{t('explain_risk_btn')}</b></span>
      {open?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
    </button>
    {open&&<div className="explain-body">
      {explainText().map((p,i)=><p key={i} style={{fontSize:12,lineHeight:1.7,color:'#a8c4b8',margin:'0 0 10px'}}>{p}</p>)}
    </div>}
  </div>;
}

// ── AI Feature: Risk Summary ─────────────────────────────────────────
function AiRiskSummary({result,strategy,form,stressScenario}){
  const { language, t } = useLanguage();
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const cacheKeyRef=useRef(null);

  useEffect(()=>{
    if(!result) return;
    const key=JSON.stringify({
      pL:result.probabilityOfLoss,
      med:result.medianOutcome,
      dd:result.maxDrawdown,
      strategy,
      lang: language,
      stress: stressScenario ? {s:stressScenario.label||stressScenario.scenarioType, pL:stressScenario.probabilityOfLoss, dd:stressScenario.maxDrawdown} : null
    });
    if(key===cacheKeyRef.current && data) return;
    cacheKeyRef.current=key;
    setLoading(true);
    api('/ai/summary',{method:'POST',body:JSON.stringify({simulationResult:result,strategy,form,stressScenario,language})})
      .then(d=>setData(d))
      .catch(()=>setData(null))
      .finally(()=>setLoading(false));
  },[result,strategy,form,stressScenario,language]);

  if(!data && !loading) return null;

  const levelColor = data?.riskLevel === 'High' ? 'var(--red)' : data?.riskLevel === 'Low' ? 'var(--green)' : '#ffb84d';
  const levelBadge = data?.riskLevel === 'High' ? t('ai_level_high') : data?.riskLevel === 'Low' ? t('ai_level_low') : t('ai_level_moderate');

  return <div className="ai-risk-summary">
    <div className="ai-summary-header">
      <div className="ai-summary-badge"><Sparkles size={14}/> {t('ai_summary_badge')}</div>
      {data && <span className="ai-risk-level-tag" style={{color:levelColor,borderColor:levelColor}}>{levelBadge}</span>}
    </div>
    {loading && !data ? (
      <div className="ai-summary-loading"><span className="spinner" style={{width:18,height:18}}/> Analyzing risk profile…</div>
    ) : data ? (
      <>
        <p className="ai-summary-explanation">{data.explanation}</p>
        <div className="ai-summary-grid">
          <div className="ai-summary-col">
            <small style={{color:'var(--red)'}}>⚠ {t('ai_biggest_risk_factor')}</small>
            <p>{data.biggestRiskFactor}</p>
          </div>
          <div className="ai-summary-col">
            <small style={{color:'var(--green)'}}>✓ {t('ai_positive_signal')}</small>
            <p>{data.positiveSignal}</p>
          </div>
          <div className="ai-summary-col">
            <small style={{color:'#ffb84d'}}>⚡ {t('ai_caution')}</small>
            <p>{data.caution}</p>
          </div>
        </div>
      </>
    ) : null}
  </div>;
}

// ── AI Feature: Scenario Interpreter ─────────────────────────────────
function AiScenarioInterpreter({result,strategy,form,stressScenario}){
  const { language, t } = useLanguage();
  const [open,setOpen]=useState(false);
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState('summary');
  const cacheKeyRef=useRef(null);

  const doFetch=()=>{
    const key=JSON.stringify({
      pL:result.probabilityOfLoss,
      med:result.medianOutcome,
      dd:result.maxDrawdown,
      strategy,
      lang: language,
      stress: stressScenario ? {s:stressScenario.label||stressScenario.scenarioType, pL:stressScenario.probabilityOfLoss} : null
    });
    if(key===cacheKeyRef.current&&data) return;
    cacheKeyRef.current=key;
    setLoading(true);
    api('/ai/interpret',{method:'POST',body:JSON.stringify({simulationResult:result,strategy,form,stressScenario,language})})
      .then(d=>setData(d))
      .catch(()=>setData(null))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{
    if(open) doFetch();
  },[open,result,strategy,form,stressScenario,language]);

  return <div className="chart-card ai-interpreter-card" style={{marginTop:14}}>
    <button className="btn ghost full" onClick={()=>setOpen(!open)} style={{justifyContent:'space-between',width:'100%'}}>
      <span style={{display:'flex',alignItems:'center',gap:8}}>
        <Sparkles size={17} color="var(--green)"/>
        <b>{t('ai_interpreter_title')}</b>
      </span>
      {open?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
    </button>
    {open&&<div className="ai-interpreter-body">
      {loading&&!data?<p style={{color:'var(--muted)',fontSize:12}}>Generating structural analysis…</p>:data?<div>
        <div className="lang-toggle" style={{marginBottom:14}}>
          <button className={tab==='summary'?'active':''} onClick={()=>setTab('summary')}>{t('ai_tab_summary')}</button>
          <button className={tab==='assumptions'?'active':''} onClick={()=>setTab('assumptions')}>{t('ai_tab_assumptions')}</button>
          <button className={tab==='catalysts'?'active':''} onClick={()=>setTab('catalysts')}>{t('ai_tab_catalysts')}</button>
        </div>
        {tab==='summary'&&<div>
          <div className="ai-interp-section">
            <AlertTriangle size={16} color="var(--red)" style={{flex:'none',marginTop:2}}/>
            <div>
              <b>{t('ai_biggest_risk')}</b>
              <p>{data.biggestRisk}</p>
            </div>
          </div>
          <div className="ai-interp-section">
            <Lightbulb size={16} color="#ffb84d" style={{flex:'none',marginTop:2}}/>
            <div>
              <b>{t('ai_risk_cause')}</b>
              <p>{data.riskCause}</p>
            </div>
          </div>
          <div className="ai-interp-section">
            <TrendingDown size={16} color="var(--red)" style={{flex:'none',marginTop:2}}/>
            <div>
              <b>{t('ai_worst_case')}</b>
              <p>{data.worstCaseInterpretation}</p>
            </div>
          </div>
        </div>}
        {tab==='assumptions'&&<div className="ai-interp-section">
          <div>
            <b>{t('ai_tab_assumptions')}</b>
            <ul>
              {data.keyAssumptions.map((a,i)=><li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>}
        {tab==='catalysts'&&<div>
          <div className="ai-interp-section">
            <TrendingUp size={16} color="var(--green)" style={{flex:'none',marginTop:2}}/>
            <div>
              <b>{t('ai_improving_factors')}</b>
              <ul>{data.improvementFactors.map((f,i)=><li key={i}>{f}</li>)}</ul>
            </div>
          </div>
          <div className="ai-interp-section">
            <TrendingDown size={16} color="var(--red)" style={{flex:'none',marginTop:2}}/>
            <div>
              <b>{t('ai_worsening_factors')}</b>
              <ul>{data.worseningFactors.map((f,i)=><li key={i}>{f}</li>)}</ul>
            </div>
          </div>
        </div>}
      </div>:<p style={{color:'var(--red)',fontSize:12}}>Failed to generate interpretation.</p>}
    </div>}
  </div>;
}

// ── AI Feature: Copilot Chat & What-If ─────────────────────────────────
function AiChatPanel({strategy,setStrategy,form,result,stressScenario,setForm,onRun}){
  const { language, t } = useLanguage();
  const [open,setOpen]=useState(false);
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const [busy,setBusy]=useState(false);
  const messagesEndRef=useRef(null);

  const scrollToBottom=()=>{messagesEndRef.current?.scrollIntoView({behavior:'smooth'})};
  useEffect(scrollToBottom,[messages]);

  const suggestions=result?[
    t('chat_q1'),
    t('chat_q2'),
    t('chat_q3'),
    t('chat_q4'),
    t('chat_q5'),
    t('chat_q6'),
  ]:[t('results_empty_title')];

  const sendMessage=async(msg)=>{
    if(!msg.trim()||busy) return;
    const userMsg={role:'user',text:msg.trim()};
    setMessages(prev=>[...prev,userMsg]);
    setInput('');
    setBusy(true);
    try{
      const data=await api('/ai/chat',{
        method:'POST',
        body:JSON.stringify({
          message:msg.trim(),
          context:{strategy,form,result,stressScenario},
          language
        })
      });
      setMessages(prev=>[...prev,{role:'ai',text:data.response,suggestedChanges:data.suggestedChanges}]);
    }catch(e){
      setMessages(prev=>[...prev,{role:'ai',text:'Sorry, I couldn\'t process that request. Please try again.'}]);
    }finally{setBusy(false)}
  };

  const applyChange=(change)=>{
    if(!change||!change.field||change.newValue===undefined) return;
    if(change.field === 'strategy') {
      if(setStrategy) setStrategy(change.newValue);
      setMessages(prev=>[...prev,{role:'ai',text:`✅ Applied: **${change.reason}**. Running updated simulation now…`}]);
      if(onRun) onRun(form, change.newValue);
    } else {
      const updatedForm = { ...form, [change.field]: change.newValue };
      setForm(updatedForm);
      setMessages(prev=>[...prev,{role:'ai',text:`✅ Applied: **${change.reason}**. Running updated simulation now…`}]);
      if(onRun) onRun(updatedForm, strategy);
    }
  };

  // Markdown-like rendering for AI responses
  const renderText=(text)=>{
    if(!text) return null;
    return text.split('\n').map((line,i)=>{
      const formatted=line
        .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
        .replace(/\*(.*?)\*/g,'<em>$1</em>')
        .replace(/^• /,'<span style="color:var(--green);margin-right:6px">•</span>');
      if(line.startsWith('• ')||line.startsWith('- ')) return <p key={i} style={{margin:'2px 0',paddingLeft:10}} dangerouslySetInnerHTML={{__html:formatted}}/>;
      if(!line.trim()) return <div key={i} style={{height:6}}/>;
      return <p key={i} style={{margin:'4px 0'}} dangerouslySetInnerHTML={{__html:formatted}}/>;
    });
  };

  return <>
    <button className="ai-chat-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle AI Risk Copilot">
      <MessageCircle size={20}/>
      <span className="ai-chat-label">{t('ai_chat_btn')}</span>
    </button>

    {open&&<div className="ai-chat-panel">
      <div className="ai-chat-header">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Sparkles size={16} color="var(--green)"/>
          <b>{t('ai_chat_header')}</b>
        </div>
        <button className="icon-btn" onClick={()=>setOpen(false)} style={{width:28,height:28}}><X size={15}/></button>
      </div>

      <div className="ai-chat-messages">
        {messages.length===0?(
          <div className="ai-chat-welcome">
            <Sparkles size={28} color="var(--green)" style={{marginBottom:10}}/>
            <b>{t('ai_chat_welcome_title')}</b>
            <p style={{fontSize:12,margin:'8px 0 0',lineHeight:1.6}}>
              {t('ai_chat_welcome_desc')}
            </p>
          </div>
        ):(
          messages.map((m,i)=>(
            <div key={i} className={`ai-chat-message ${m.role}`}>
              <div className="ai-chat-bubble">
                {renderText(m.text)}
              </div>
              {m.suggestedChanges&&m.suggestedChanges.field&&(
                <div className="ai-suggested-change">
                  <div className="ai-change-header">
                    <Zap size={14}/> {t('ai_suggested_change')}
                  </div>
                  <p className="ai-change-reason">{m.suggestedChanges.reason}</p>
                  <button className="btn primary small" onClick={()=>applyChange(m.suggestedChanges)} style={{marginTop:8,padding:'6px 12px',fontSize:11}}>
                    {t('ai_apply_and_run')} →
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        {busy&&<div className="ai-chat-message ai"><div className="ai-chat-bubble ai-typing">Thinking…</div></div>}
        <div ref={messagesEndRef}/>
      </div>

      {messages.length<=2&&(
        <div className="ai-chat-suggestions">
          <small>{t('ai_chat_suggestions_label')}</small>
          {suggestions.map((s,i)=>(
            <button key={i} className="ai-suggestion-chip" onClick={()=>sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="ai-chat-input-area" onSubmit={e=>{e.preventDefault();sendMessage(input)}}>
        <input
          type="text"
          placeholder={t('ai_chat_placeholder')}
          value={input}
          onChange={e=>setInput(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="ai-send-btn" disabled={busy||!input.trim()} title={t('ai_chat_send')}>
          <Send size={15}/>
        </button>
      </form>
    </div>}
  </>;
}

const FALLBACK_LESSONS=[
  {
    id: 'risk',
    title: {
      en: 'Risk is not the same as return',
      ta: 'ஆபத்து என்பது வருமானம் மட்டும் அல்ல',
      hi: 'जोखिम और रिटर्न एक समान नहीं हैं',
      bn: 'ঝুঁকি এবং রিটার্ন একই নয়',
      mr: 'जोखीम आणि परतावा एकसारखे नसतात',
      te: 'రిస్క్ మరియు రాబడి ఒకటి కాదు',
      ur: 'خطرہ اور منافع ایک جیسے نہیں ہیں',
      fr: 'Le risque n’est pas le rendement'
    },
    body: {
      en: 'A higher expected return can come with a wider range of outcomes. Look at downside as well as upside.',
      ta: 'அதிக வருமான வாய்ப்புடன் அதிகமான முடிவு மாறுபாடும் இருக்கலாம். மேல்நோக்கி மட்டுமல்ல, கீழ்நோக்கிய ஆபத்தையும் பாருங்கள்.',
      hi: 'अधिक संभावित रिटर्न के साथ परिणामों की एक विस्तृत श्रृंखला आ सकती है। केवल बढ़त ही नहीं, गिरावट के जोखिम को भी देखें।',
      bn: 'অধিক সম্ভাব্য আয়ের সাথে ফলাফলের ব্যাপক বিস্তার আসতে পারে। কেবল লাভের দিকে নয়, ক্ষতির দিকেও নজর রাখুন।',
      mr: 'अधिक अपेक्षित परताव्यासोबत निकालांची मोठी श्रेणी येऊ शकते. केवळ नफाच नाही, तर तोट्याची जोखीमही पहा.',
      te: 'అధిక ఆశించిన రాబడితో పాటు విస్తృత స్థాయి ఫలితాలు రావచ్చు. లాభాలతో పాటు నష్ట భయాన్ని కూడా చూడండి.',
      ur: 'زیادہ متوقع منافع کے ساتھ نتائج کا وسیع دائرہ آ سکتا ہے۔ صرف اچھے حالات نہیں بلکہ نقصان کے خطرے کو بھی دیکھیں۔',
      fr: 'Un rendement espéré plus élevé s’accompagne d’une plus grande dispersion des résultats. Observez la baisse autant que la hausse.'
    }
  },
  {
    id: 'monte',
    title: {
      en: 'What Monte Carlo means',
      ta: 'Monte Carlo என்றால் என்ன?',
      hi: 'मोंटे कार्लो का क्या अर्थ है',
      bn: 'মন্টে কার্লো কী',
      mr: 'माँटे कार्लो म्हणजे काय',
      te: 'మాంటే కార్లో అంటే ఏమిటి',
      ur: 'مونٹی کارلو کا کیا مطلب ہے',
      fr: 'Que signifie Monte Carlo'
    },
    body: {
      en: 'Instead of one forecast, the model generates thousands of possible scenarios so you can see a range of outcomes.',
      ta: 'ஒரே கணிப்புக்கு பதிலாக, ஆயிரக்கணக்கான சாத்தியமான நிலைகளை உருவாக்கி முடிவுகளின் வரம்பைக் காட்டுகிறது.',
      hi: 'एक भविष्यवाणी के बजाय, मॉडल हज़ारों संभावित परिदृश्य उत्पन्न करता है ताकि आप परिणामों की एक श्रृंखला देख सकें।',
      bn: 'একটি পূর্বাভাসের বদলে, মডেলটি হাজার হাজার সম্ভাব্য পরিস্থিতি তৈরি করে যাতে আপনি ফলাফলের বিস্তার দেখতে পান।',
      mr: 'एका अंदाजाऐवजी, मॉडेल हजारो संभाव्य परिस्थिती तयार करते जेणेकरून तुम्हाला निकालांची श्रेणी पाहता येईल.',
      te: 'ఒకే అంచనాకు బదులుగా, మోడల్ వేలాది సంభావ్య దృశ్యాలను రూపొందిస్తుంది, తద్వారా మీరు ఫలితాల శ్రేణిని చూడవచ్చు.',
      ur: 'ایک پیش گوئی کے بجائے، ماڈل ہزاروں ممکنہ منظر نامے تخلیق کرتا ہے تاکہ آپ نتائج کا مکمل دائرہ کار دیکھ سکیں۔',
      fr: 'Au lieu d’une seule prévision, le modèle génère des milliers de scénarios possibles pour visualiser l’éventail des résultats.'
    }
  },
  {
    id: 'leverage',
    title: {
      en: 'Leverage magnifies outcomes',
      ta: 'Leverage முடிவுகளை பெரிதாக்கும்',
      hi: 'लीवरेज परिणामों को कई गुना बढ़ा देता है',
      bn: 'লিভারেজ ফলাফলকে বহুগুণ বাড়িয়ে তোলে',
      mr: 'लिव्हरेज निकालांना वाढवते',
      te: 'లివరేజ్ ఫలితాలను పెంచుతుంది',
      ur: 'لیوریج نتائج کو بڑھا دیتی ہے',
      fr: 'Le levier amplifie les résultats'
    },
    body: {
      en: 'With leverage, the same market move can create a much larger gain or loss relative to your capital.',
      ta: 'Leverage பயன்படுத்தும்போது, உங்கள் முதலீட்டு மூலதனத்துடன் ஒப்பிடும்போது அதே சந்தை மாற்றம் பெரிய லாபம் அல்லது இழப்பை உருவாக்கலாம்.',
      hi: 'लीवरेज के साथ, बाज़ार का वही उतार-चढ़ाव आपकी पूंजी के अनुपात में बहुत बड़ा लाभ या हानि पैदा कर सकता है।',
      bn: 'লিভারেজ ব্যবহারে বাজারের সাধারণ পরিবর্তনও আপনার মূলধনের তুলনায় বহুগুণ লাভ বা ক্ষতি তৈরি করতে পারে।',
      mr: 'लिव्हरेज वापरताना, बाजारातील समान हालचाल तुमच्या भांडवलाच्या तुलनेत खूप मोठा नफा किंवा तोटा निर्माण करू शकते.',
      te: 'లివరేజ్‌తో, మార్కెట్ యొక్క అదే కదలిక మీ మూలధనంతో పోలిస్తే చాలా పెద్ద లాభాన్ని లేదా నష్టాన్ని సృష్టించగలదు.',
      ur: 'لیوریج کے ساتھ، مارکیٹ کی وہی حرکت آپ کے سرمائے کے مقابلے میں بہت بڑا منافع یا نقصان پیدا کر سکتی ہے۔',
      fr: 'Avec l’effet de levier, une même variation de marché entraîne un gain ou une perte démultiplié par rapport à votre capital.'
    }
  },
  {
    id: 'drawdown',
    title: {
      en: 'Drawdown matters',
      ta: 'Drawdown முக்கியம்',
      hi: 'ड्राडाउन क्यों महत्वपूर्ण है',
      bn: 'ড্রডাউন গুরুত্বপূর্ণ কেন',
      mr: 'ड्रॉडडाउन का महत्त्वाचे आहे',
      te: 'డ్రాడౌన్ ఎందుకు ముఖ్యం',
      ur: 'ڈرا ڈاؤن کیوں اہم ہے',
      fr: 'Le drawdown est déterminant'
    },
    body: {
      en: 'Drawdown measures how far a portfolio can fall from a previous high. It helps make downside easier to understand.',
      ta: 'முன்னைய உயரத்திலிருந்து முதலீடு எவ்வளவு குறையலாம் என்பதை Drawdown காட்டுகிறது.',
      hi: 'ड्राडाउन यह मापता है कि पिछला शिखर छूने के बाद पोर्टफोलियो कितना गिर सकता है। यह जोखिम को समझने में मदद करता है।',
      bn: 'পূর্ববর্তী উচ্চ স্তর থেকে একটি পোর্টফোলিও কতটা নিচে নামতে পারে তা ড্রডাউন দিয়ে পরিমাপ করা হয়।',
      mr: 'मागील सर्वोच्च शिखरावरून पोर्टफोलिओ किती खाली येऊ शकतो हे ड्रॉडडाउन मोजते.',
      te: 'పోర్ట్‌ఫోలియో మునుపటి గరిష్ట స్థాయి నుండి ఎంతవరకు పడిపోగలదో డ్రాడౌన్ కొలుస్తుంది.',
      ur: 'ڈرا ڈاؤن یہ ماپتا ہے کہ پورٹ فولیو اپنی پچھلی بلندی سے کتنا نیچے گر سکتا ہے۔ یہ گراوٹ کو سمجھنا آسان بناتا ہے۔',
      fr: 'Le drawdown mesure la baisse d’un portefeuille depuis son point culminant. Il rend le risque baissier concret et compréhensible.'
    }
  },
  {
    id: 'sip',
    title: {
      en: 'SIP vs a one-time investment',
      ta: 'SIP மற்றும் ஒருமுறை முதலீடு',
      hi: 'SIP बनाम एकमुश्त निवेश',
      bn: 'SIP বনাম এককালীন বিনিয়োগ',
      mr: 'SIP विरूद्ध एकरकमी गुंतवणूक',
      te: 'SIP వర్సెస్ ఒకేసారి పెట్టుబడి',
      ur: 'SIP بمقابلہ یکمشت سرمایہ کاری',
      fr: 'SIP vs investissement unique'
    },
    body: {
      en: 'Regular investing changes the cash-flow pattern and can spread entry points across time. It does not remove market risk.',
      ta: 'தொடர்ச்சியான முதலீடு காலப்போக்கில் முதலீட்டு நுழைவு புள்ளிகளைப் பரப்பலாம்; ஆனால் சந்தை ஆபத்தை நீக்காது.',
      hi: 'नियमित निवेश नकदी प्रवाह के पैटर्न को बदलता है और प्रवेश बिंदुओं को समय के साथ फैलाता है। यह बाज़ार के जोखिम को खत्म नहीं करता।',
      bn: 'নিয়মিত বিনিয়োগ সময়ের সাথে সাথে এন্ট্রি পয়েন্ট ছড়িয়ে দেয়। তবে এটি বাজারের ঝুঁকি পুরোপুরি দূর করে না।',
      mr: 'नियमित गुंतवणूक प्रवेश बिंदू वेगवेगळ्या वेळी पसरवते. यामुळे बाजारातील जोखीम पूर्णपणे नाहीशी होत नाही.',
      te: 'క్రమబద్ధమైన పెట్టుబడి కాలక్రమేణా ప్రవేశ పాయింట్లను విస్తరిస్తుంది. ఇది మార్కెట్ రిస్క్‌ను పూర్తిగా తొలగించదు.',
      ur: 'باقاعدہ سرمایہ کاری کیش فلو کے انداز کو بدلتی ہے اور وقت کے ساتھ ساتھ مختلف پوائنٹس پر رقم لگاتی ہے۔ یہ مارکیٹ کے خطرے کو ختم نہیں کرتی۔',
      fr: 'L’investissement progressif régulier étale les points d’entrée dans le temps. Il lisse la volatilité mais n’élimine pas le risque de marché.'
    }
  }
];

function Learn(){
  const { language, t } = useLanguage();
  const [lessons,setLessons]=useState(FALLBACK_LESSONS);

  useEffect(()=>{
    api('/learning')
      .then(d=>{if(Array.isArray(d.lessons)&&d.lessons.length)setLessons(d.lessons)})
      .catch(()=>{});
  },[]);

  return <div className="page container">
    <div className="page-head">
      <div>
        <div className="eyebrow">{t('learn_eyebrow')}</div>
        <h1>{t('learn_title')}</h1>
        <p>{t('learn_desc')}</p>
      </div>
      <div>
        <LanguageSelector />
      </div>
    </div>
    <div className="lesson-grid">
      {lessons.map((l,i)=>{
        const title = l.title?.[language] || l.title?.en || '';
        const body = l.body?.[language] || l.body?.en || '';
        return (
          <article className="lesson-card" key={l.id}>
            <span>{String(i+1).padStart(2,'0')}</span>
            <h2>{title}</h2>
            <p>{body}</p>
            <NavLink to="/simulator" className="text-link">{t('learn_apply_link')}</NavLink>
          </article>
        );
      })}
    </div>
  </div>;
}

function HistoryPage(){
  const { t } = useLanguage();
  const [items,setItems]=useState([]);
  useEffect(()=>{api('/simulations/history').then(d=>setItems(d.simulations)).catch(()=>{})},[]);
  const fmt=n=>`₹${Number(n).toLocaleString('en-IN')}`;

  return <div className="page container">
    <div className="page-head">
      <div>
        <div className="eyebrow">{t('history_eyebrow')}</div>
        <h1>{t('history_title')}</h1>
        <p>{t('history_desc')}</p>
      </div>
      <NavLink to="/simulator" className="btn primary">{t('history_new_btn')}</NavLink>
    </div>
    <div className="history-list">
      {items.length===0?<div className="empty-history"><History size={40}/><p>{t('history_empty_title')}</p><small>{t('history_empty_desc')}</small></div>:items.map(item=><div key={item.id} className="history-row"><div><b>{item.strategy.toUpperCase()}</b><small>{new Date(item.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</small></div><div><small>{t('dash_invested_capital')}</small><strong>{fmt(item.totalInvested||item.initialInvestment)}</strong></div><div><small>{t('dash_median_outcome')}</small><strong>{fmt(item.medianOutcome)}</strong></div><div><small>{t('history_col_loss')}</small><strong style={{color:item.probabilityOfLoss>30?'var(--red)':'var(--green)'}}>{item.probabilityOfLoss}%</strong></div></div>)}
    </div>
  </div>;
}

function App(){
  return <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>;
}

createRoot(document.getElementById('root')).render(<App />);
