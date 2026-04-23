/* global React, ReactDOM, Icon, PROJECTS, PUBLICATIONS, SKILLS, EXPERIENCE, ProjectViz */
const { useState, useEffect, useRef, useMemo } = React;

// Tweakable defaults — edited live via the Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "indigo",
  "font": "jakarta",
  "density": "cozy",
  "logoStyle": "letters",
  "pattern": "dots",
  "heroCopy": "Maps that listen to cities.",
  "heroSub": "I'm Avishek Adhikari — an M.Sc. candidate at the Institute of Disaster Prevention and Urban Safety, BUET, and a Research Assistant at the Centre for Urban Studies, Dhaka. I build spatial models that predict how cities grow, heat up, and fragment — so planners can see the risk before it arrives.",
  "theme": "light"
} /*EDITMODE-END*/;

const ACCENTS = {
  indigo: { name: 'Indigo', color: '#6750A4', container: '#EADDFF', onContainer: '#21005D' },
  blue: { name: 'Blue', color: '#1A73E8', container: '#D3E3FD', onContainer: '#001B3F' },
  teal: { name: 'Teal', color: '#00796B', container: '#C8EDE6', onContainer: '#00201C' },
  coral: { name: 'Coral', color: '#C5472A', container: '#FFDAD2', onContainer: '#410000' },
  magenta: { name: 'Magenta', color: '#9B3A7D', container: '#FFD8E9', onContainer: '#3D0025' },
  olive: { name: 'Olive', color: '#556B2F', container: '#DDEAC1', onContainer: '#1A2400' },
  amber: { name: 'Amber', color: '#9A6700', container: '#FFE6A3', onContainer: '#2A1E00' }
};

const FONTS = {
  jakarta: { name: 'Plus Jakarta', display: "'Plus Jakarta Sans', system-ui, sans-serif", body: "'Plus Jakarta Sans', system-ui, sans-serif" },
  dm: { name: 'DM', display: "'DM Sans', system-ui, sans-serif", body: "'DM Sans', system-ui, sans-serif" },
  space: { name: 'Space', display: "'Space Grotesk', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif" },
  serif: { name: 'Serif', display: "'Fraunces', Georgia, serif", body: "'DM Sans', system-ui, sans-serif" },
  mono: { name: 'Mono', display: "'JetBrains Mono', monospace", body: "'DM Sans', system-ui, sans-serif" }
};

const DENSITIES = { compact: 0.7, cozy: 1, spacious: 1.3 };

const NAV_TABS = [
{ id: 'home', label: 'Overview', icon: <Icon.Home /> },
{ id: 'about', label: 'About', icon: <Icon.User /> },
{ id: 'research', label: 'Research', icon: <Icon.Sparkle /> },
{ id: 'work', label: 'Projects', icon: <Icon.Folder /> },
{ id: 'stack', label: 'Stack', icon: <Icon.Code /> },
{ id: 'path', label: 'Path', icon: <Icon.Briefcase /> },
{ id: 'writing', label: 'Writing', icon: <Icon.Book /> },
{ id: 'contact', label: 'Contact', icon: <Icon.Mail /> }];


// ============ LOGO ============
const Logo = ({ style, text = 'avishek' }) => {
  if (style === 'dot') {
    return (
      <span className="brand">
        <span className="brand-dot" />
        <span style={{ fontWeight: 600 }}>{text}</span>
        <span style={{ color: 'var(--on-surface-variant)' }}>.studio</span>
      </span>);

  }
  if (style === 'g') {
    const colors = ['var(--g-blue)', 'var(--g-red)', 'var(--g-yellow)', 'var(--g-blue)', 'var(--g-green)', 'var(--g-red)', 'var(--accent)'];
    return (
      <span className="brand">
        <span className="brand-letters">
          {text.split('').map((ch, i) =>
          <span key={i} style={{ color: colors[i % colors.length] }}>{ch}</span>
          )}
        </span>
      </span>);

  }
  if (style === 'blocks') {
    return (
      <span className="brand">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <rect x="2" y="2" width="11" height="11" rx="3" fill="var(--g-blue)" />
          <rect x="15" y="2" width="11" height="11" rx="3" fill="var(--g-red)" />
          <rect x="2" y="15" width="11" height="11" rx="3" fill="var(--g-yellow)" />
          <rect x="15" y="15" width="11" height="11" rx="3" fill="var(--g-green)" />
        </svg>
        <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>avishek</span>
      </span>);

  }
  // letters
  return (
    <span className="brand">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="var(--accent)" />
        <text x="14" y="19" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--on-accent)" fontFamily="var(--font-display)">A</text>
      </svg>
      <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>avishek</span>
      <span style={{ color: 'var(--on-surface-variant)', fontWeight: 400 }}>/geo</span>
    </span>);

};

// ============ APPBAR ============
const AppBar = ({ onSearch, theme, setTheme, logoStyle, onTweaks }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={'appbar' + (scrolled ? ' scrolled' : '')}>
      <Logo style={logoStyle} />
      <div className="search-pill" onClick={onSearch} role="button" tabIndex={0}>
        <Icon.Search />
        <span>Search projects, papers, places…</span>
        <span className="kbd">/</span>
      </div>
      <div className="appbar-actions">
        <button className="icon-btn" aria-label="Theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Icon.Moon /> : <Icon.Sun />}
        </button>
        <button className="icon-btn" aria-label="Tweaks" onClick={onTweaks}>
          <Icon.Apps />
        </button>
        <div className="avatar-chip" title="Avishek Adhikari">
          <img src="assets/avishek.jpg" alt="" />
        </div>
      </div>
    </div>);

};

// ============ NAV TABS ============
const NavTabs = ({ active, onSelect }) => {
  return (
    <div className="nav-tabs">
      <div className="nav-tabs-inner">
        {NAV_TABS.map((t) =>
        <button key={t.id}
        className={'tab' + (active === t.id ? ' active' : '')}
        onClick={() => onSelect(t.id)}>
            {t.icon}
            {t.label}
          </button>
        )}
      </div>
    </div>);

};

// ============ HERO ============
const renderHeroSub = (text) => {
  if (!text) return null;
  // Phrases to accent — case-insensitive, longest first to avoid nesting
  const phrases = [
  'Institute of Disaster Prevention and Urban Safety, BUET',
  'Institute of Disaster Prevention and Urban Safety',
  'Centre for Urban Studies, Dhaka',
  'Centre for Urban Studies',
  'spatial models that predict',
  'spatial modeling and prediction',
  'spatial modeling',
  'spatial models',
  'BUET'];

  // Tokenise by matching any phrase (first match wins due to order)
  const parts = [];
  let remaining = text;
  let guard = 0;
  while (remaining && guard++ < 200) {
    let bestIdx = -1,bestPhrase = null;
    for (const ph of phrases) {
      const i = remaining.toLowerCase().indexOf(ph.toLowerCase());
      if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {bestIdx = i;bestPhrase = ph;}
    }
    if (bestIdx === -1) {parts.push(remaining);break;}
    if (bestIdx > 0) parts.push(remaining.slice(0, bestIdx));
    parts.push(<mark key={parts.length} className="hero-hl">{remaining.slice(bestIdx, bestIdx + bestPhrase.length)}</mark>);
    remaining = remaining.slice(bestIdx + bestPhrase.length);
  }
  return parts;
};

const Hero = ({ heroCopy, heroSub }) => {
  // Split the hero copy to color-tint key words if short
  const renderTitle = () => {
    const copy = heroCopy || 'Maps that listen to cities.';
    const words = copy.split(' ');
    return words.map((w, i) =>
    <React.Fragment key={i}>
        {i === words.length - 1 ? <span className="accent-word">{w}</span> : w}
        {i < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    );
  };
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="pulse" />
              Available for research collaboration · Dhaka, BD
            </div>
            <h1 className="hero-title">{renderTitle()}</h1>
            <p className="hero-sub" style={{ textAlign: "justify", fontSize: "18px" }}>
              {renderHeroSub(heroSub)}
            </p>
            <div className="hero-ctas">
              <a className="btn btn-filled" href="#work">See the work <Icon.Arrow /></a>
              <a className="btn btn-tonal" href="#writing">Read the papers</a>
              <a className="btn btn-outline" href="mailto:avishek.jidpus@gmail.com"><Icon.Mail /> Get in touch</a>
            </div>
          </div>
          <div className="hero-portrait">
            <div className="orbit o1" />
            <div className="orbit o2" />
            <div className="frame">
              <img src="assets/avishek.jpg" alt="Avishek Adhikari" />
            </div>
            <div className="orbit-chip c1">
              <span className="chip-ico" style={{ background: 'var(--c-sky-bg)', color: 'var(--c-sky-fg)' }}><Icon.Satellite /></span>
              Landsat 8/9
            </div>
            <div className="orbit-chip c2">
              <span className="chip-ico" style={{ background: 'var(--c-peach-bg)', color: 'var(--c-peach-fg)' }}><Icon.Thermo /></span>
              LST
            </div>
            <div className="orbit-chip c3">
              <span className="chip-ico" style={{ background: 'var(--c-butter-bg)', color: 'var(--c-butter-fg)' }}><Icon.Flame /></span>
              Fire risk
            </div>
            <div className="orbit-chip c4">
              <span className="chip-ico" style={{ background: 'var(--c-mint-bg)', color: 'var(--c-mint-fg)' }}><Icon.Sprout /></span>
              NDVI
            </div>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric"><div className="metric-num">4+</div><div className="metric-label">Years in geospatial research</div></div>
          <div className="metric"><div className="metric-num">1</div><div className="metric-label">Featured tool</div></div>
          <div className="metric"><div className="metric-num">2</div><div className="metric-label">Peer-reviewed papers</div></div>
          <div className="metric"><div className="metric-num">20yr</div><div className="metric-label">Time-series on Rangpur</div></div>
        </div>
      </div>
    </section>);

};

// ============ ABOUT ============
const About = () =>
<section id="about">
    <div className="container">
      <span className="section-label"><Icon.User /> About</span>
      <h2 className="section-title">A planner turned <em>cartographer of change</em>.</h2>
      <div className="about-grid">
        <div className="about-card-big">
          <p style={{ textAlign: "left", fontSize: "27px" }}>
            I work where satellite data, urban planning, and fieldwork collide. My research asks how
            cities in the Global South are growing, how they are heating up, and where the quiet
            violence of <span className="hl">spatial fragmentation</span> pushes against sustainable
            development. The tools I build — risk models, interactive maps, reproducible notebooks —
            are meant to put that evidence in planners' hands.
          </p>
        </div>
        <div className="info-card teal">
          <div className="ico-box"><Icon.MapPin /></div>
          <h3>Policy-facing research</h3>
          <p>At the Centre for Urban Studies I co-write policy briefs on housing and informal settlements, and design the field surveys that back them — linking satellite evidence to the decisions planners actually make.</p>
        </div>
        <div className="info-card peach">
          <div className="ico-box"><Icon.Satellite /></div>
          <h3>Remote sensing first</h3>
          <p>Four decades of Landsat, Sentinel-2 and MODIS stitched together in Google Earth Engine.</p>
        </div>
        <div className="info-card butter">
          <div className="ico-box"><Icon.Globe /></div>
          <h3>Geography of risk</h3>
          <p>Fire in informal settlements, Urban Heat Islands on coral islands, flood exposure on deltas.</p>
        </div>
        <div className="info-card sky">
          <div className="ico-box"><Icon.Shield /></div>
          <h3>Disaster risk reduction</h3>
          <p>Current M.Sc. at BUET focused on how cities can be read for hazard, vulnerability and resilience — from seismic risk to climate adaptation.</p>
        </div>
      </div>
    </div>
  </section>;


const RESEARCH_THEMES = [
{
  title: 'Disaster risk & risk-sensitive planning',
  body: 'Reading cities through the exposure / vulnerability / hazard lens — drawing on the Sendai Framework and UN-Habitat guidance to translate spatial evidence into planning decisions.',
  tint: 'butter',
  icon: 'Shield'
},
{
  title: 'Urban growth & LULC change',
  body: 'Multi-decade land-use / land-cover reconstructions, sprawl metrics and fragmentation indicators across rapidly urbanising South Asian cities.',
  tint: 'teal',
  icon: 'Globe'
},
{
  title: 'Urban heat & air pollution',
  body: 'Land Surface Temperature, Urban Heat Island detection and exposure analysis — connecting thermal patterns back to land use and population vulnerability.',
  tint: 'peach',
  icon: 'Flame'
},
{
  title: 'ML & DL for spatial modelling',
  body: 'Machine-learning and deep-learning pipelines for spatial prediction, hazard mapping and classification of satellite imagery, paired with rigorous spatial statistics.',
  tint: 'lilac',
  icon: 'Code'
},
{
  title: 'Climate impact in Bangladesh & South Asia',
  body: 'Grounding IPCC AR6 findings in the Ganges–Brahmaputra delta and beyond — climate adaptation and CBDRM at the scale of cities, neighbourhoods, and field sites.',
  tint: 'sky',
  icon: 'Satellite'
}];


const RESEARCH_METHODS = [
'Spatial analysis',
'Remote sensing (Landsat, Sentinel)',
'Thematic cartography',
'Field surveys',
'Geospatial modelling',
'Machine learning',
'Deep learning',
'Spatial statistics',
'Policy review'];


const RESEARCH_FRAMEWORKS = [
'Sendai Framework',
'IPCC AR6',
'UN-Habitat',
'CBDRM',
'Exposure · Vulnerability · Hazard'];


// ============ RESEARCH ============
const Research = () =>
<section id="research">
    <div className="container">
      <span className="section-label"><Icon.Sparkle /> Research focus</span>
      <h2 className="section-title">What I'm <em>working on</em>.</h2>
      <p className="section-subtitle">Risk-sensitive urban planning, read through satellites and fieldwork — grounded in the vocabulary of the Sendai Framework, IPCC AR6 and UN-Habitat.</p>

      <div className="research-grid">
        {RESEARCH_THEMES.map((t) => {
        const I = Icon[t.icon] || Icon.Sparkle;
        return (
          <article key={t.title} className={`research-card tint-${t.tint}`}>
              <div className="research-ico"><I /></div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </article>);

      })}
      </div>

      <div className="research-meta">
        <div className="research-meta-col">
          <h4><span className="dot" style={{ background: 'var(--g-green)' }} />Methods</h4>
          <div className="skill-chips">
            {RESEARCH_METHODS.map((m) => <span key={m} className="skill-chip">{m}</span>)}
          </div>
        </div>
        <div className="research-meta-col">
          <h4><span className="dot" style={{ background: 'var(--accent)' }} />Frameworks I work in</h4>
          <div className="skill-chips">
            {RESEARCH_FRAMEWORKS.map((m) => <span key={m} className="skill-chip">{m}</span>)}
          </div>
        </div>
        <div className="research-meta-col research-meta-focus">
          <h4><span className="dot" style={{ background: 'var(--g-red)' }} />Regional focus</h4>
          <p>Bangladesh and the wider South Asia — from informal settlements in Dhaka and sprawling secondary cities like Rangpur, to coral islands on the Bay of Bengal and the flood-prone Ganges–Brahmaputra delta.</p>
        </div>
      </div>
    </div>
  </section>;


// ============ FIRE RISK CARD ============
const FireRiskCard = ({ p }) =>
<a
  className={`project featured tint-${p.tint} ${p.span}`}
  href={p.link}
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: 'none', color: 'inherit' }}>
  
    <div className="fr-grid">
      <div className="fr-left">
        <div className="project-head">
          <span className="project-kind">{p.kind}</span>
          <span className="badge-live"><span className="dot-live" /> On GitHub</span>
        </div>
        <h3>{p.title}</h3>
        <p className="fr-lede">
          An end-to-end Python app that pulls OpenStreetMap data with OSMnx, builds a composite risk model
          from building density and emergency-vehicle access, and surfaces it through an interactive Streamlit UI.
        </p>
        <div className="fr-steps">
          <div className="fr-step">
            <span className="fr-num">1</span>
            <div>
              <strong>Fetch</strong>
              <span>OSM buildings, roads &amp; water via OSMnx</span>
            </div>
          </div>
          <div className="fr-step">
            <span className="fr-num">2</span>
            <div>
              <strong>Score</strong>
              <span>Composite risk from density &amp; vehicle access</span>
            </div>
          </div>
          <div className="fr-step">
            <span className="fr-num">3</span>
            <div>
              <strong>Explore</strong>
              <span>Interactive Streamlit UI with dynamic inputs</span>
            </div>
          </div>
        </div>
        <div className="fr-tags-row">
          <div className="project-tags">
            {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <span className="fr-cta">View on GitHub <Icon.Arrow /></span>
        </div>
      </div>
      <div className="fr-right">
        <FireRiskMock />
      </div>
    </div>
  </a>;


const FireRiskMock = () =>
<div className="fr-mock">
    <div className="fr-mock-bar">
      <span className="fr-mock-dot" style={{ background: '#ff5f56' }} />
      <span className="fr-mock-dot" style={{ background: '#ffbd2e' }} />
      <span className="fr-mock-dot" style={{ background: '#27c93f' }} />
      <span className="fr-mock-title">fire-risk.streamlit.app</span>
    </div>
    <div className="fr-mock-body">
      <div className="fr-mock-side">
        <div className="fr-mock-label">Location</div>
        <div className="fr-mock-input">Korail, Dhaka</div>
        <div className="fr-mock-label" style={{ marginTop: 14 }}>Risk layers</div>
        <div className="fr-mock-check"><span className="fr-box on" /> Building density</div>
        <div className="fr-mock-check"><span className="fr-box on" /> Road access</div>
        <div className="fr-mock-check"><span className="fr-box" /> Water proximity</div>
        <div className="fr-mock-legend">
          <div className="fr-legend-title">Risk score</div>
          <div className="fr-legend-bar" />
          <div className="fr-legend-scale"><span>0</span><span>0.5</span><span>1.0</span></div>
        </div>
      </div>
      <div className="fr-mock-map">
        <svg viewBox="0 0 280 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <defs>
            <linearGradient id="frG1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd166" stopOpacity=".9" />
              <stop offset="1" stopColor="#d00000" stopOpacity=".95" />
            </linearGradient>
            <radialGradient id="frG2" cx="0.5" cy="0.5">
              <stop offset="0" stopColor="#d00000" stopOpacity=".85" />
              <stop offset="1" stopColor="#d00000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="frG3" cx="0.5" cy="0.5">
              <stop offset="0" stopColor="#ffba08" stopOpacity=".6" />
              <stop offset="1" stopColor="#ffba08" stopOpacity="0" />
            </radialGradient>
            <pattern id="frGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth=".5" />
            </pattern>
          </defs>
          <rect width="280" height="220" fill="currentColor" fillOpacity=".05" />
          <rect width="280" height="220" fill="url(#frGrid)" />
          {/* roads */}
          <path d="M0 90 L280 70" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" fill="none" />
          <path d="M0 150 L280 170" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" fill="none" />
          <path d="M90 0 L110 220" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" fill="none" />
          <path d="M210 0 L220 220" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" fill="none" />
          {/* water */}
          <path d="M0 200 Q70 180 140 200 T280 200 L280 220 L0 220 Z" fill="currentColor" fillOpacity=".12" />
          {/* heat blobs */}
          <circle cx="150" cy="110" r="70" fill="url(#frG2)" />
          <circle cx="200" cy="60" r="45" fill="url(#frG3)" />
          <circle cx="70" cy="140" r="40" fill="url(#frG3)" />
          {/* footprints */}
          {[...Array(40)].map((_, i) => {
          const x = i * 37 % 260 + 10;
          const y = i * 53 % 180 + 20;
          const w = 6 + i % 4 * 2;
          const h = 5 + i * 3 % 4 * 2;
          const opacity = 0.35 + i * 7 % 6 / 14;
          return <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="currentColor" fillOpacity={opacity} />;
        })}
          {/* hotspot marker */}
          <circle cx="150" cy="110" r="9" fill="url(#frG1)" stroke="#fff" strokeWidth="2" />
          <circle cx="150" cy="110" r="4" fill="#fff" />
        </svg>
      </div>
    </div>
    <div className="fr-mock-stats">
      <div className="fr-stat"><div className="fr-stat-num">4.3k</div><div className="fr-stat-lbl">buildings</div></div>
      <div className="fr-stat"><div className="fr-stat-num">0.82</div><div className="fr-stat-lbl">peak risk</div></div>
      <div className="fr-stat"><div className="fr-stat-num">7</div><div className="fr-stat-lbl">hotspots</div></div>
    </div>
  </div>;


// ============ PROJECTS ============
const Projects = () =>
<section id="work">
    <div className="container-wide">
      <span className="section-label"><Icon.Folder /> Selected work</span>
      <h2 className="section-title">Projects at the seams of <em>data & place</em>.</h2>
      <p className="section-subtitle">An applied tool built to turn geospatial data into something planners can act on.</p>
      <div className="projects-grid">
        {PROJECTS.map((p) => {
        if (p.id === 'fire-risk') return <FireRiskCard key={p.id} p={p} />;
        const Tag = p.link ? 'a' : 'article';
        const extra = p.link ? { href: p.link, target: '_blank', rel: 'noreferrer', style: { textDecoration: 'none', color: 'inherit' } } : {};
        return (
          <Tag key={p.id} className={`project tint-${p.tint} ${p.span}`} {...extra}>
              <div className="project-head">
                <span className="project-kind">{p.kind}</span>
                <span className="project-arrow"><Icon.Arrow /></span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="project-viz"><ProjectViz kind={p.viz} /></div>
            </Tag>);

      })}
      </div>
    </div>
  </section>;


// ============ SKILLS ============
const Skills = () =>
<section id="stack">
    <div className="container">
      <span className="section-label"><Icon.Code /> Stack</span>
      <h2 className="section-title">Tools I actually <em>use every week</em>.</h2>
      <p className="section-subtitle">Not a laundry list — the things that show up in almost every project.</p>
      <div className="skills-grid-v2">
        {SKILLS.filter((s) => s.layout !== 'certs').map((s) => {
        const I = Icon[s.icon] || Icon.Sparkle;
        return (
          <div key={s.group} className="skill-tile" style={{ '--skill-accent': s.dot }}>
              <div className="skill-tile-head">
                <span className="skill-tile-ico"><I /></span>
                <span className="skill-tile-level">{s.level}</span>
              </div>
              <h4 className="skill-tile-title">{s.group}</h4>
              <p className="skill-tile-intro">{s.intro}</p>
              <div className="skill-chips">
                {s.items.map((it) => <span key={it} className="skill-chip">{it}</span>)}
              </div>
            </div>);

      })}
        {SKILLS.filter((s) => s.layout === 'certs').map((s) => {
        const I = Icon[s.icon] || Icon.Book;
        return (
          <div key={s.group} className="skill-tile skill-tile-certs" style={{ '--skill-accent': s.dot }}>
              <div className="skill-tile-head">
                <span className="skill-tile-ico"><I /></span>
                <span className="skill-tile-level">{s.level}</span>
              </div>
              <h4 className="skill-tile-title">{s.group}</h4>
              <p className="skill-tile-intro">{s.intro}</p>
              <div className="cert-list">
                {s.items.map((c, i) =>
              <div key={c.name} className="cert-row">
                    <span className="cert-seal">{String(i + 1).padStart(2, '0')}</span>
                    <div className="cert-body">
                      <div className="cert-name">{c.name}</div>
                      <div className="cert-by">{c.by}</div>
                    </div>
                  </div>
              )}
              </div>
            </div>);

      })}
      </div>
    </div>
  </section>;


// ============ EXPERIENCE ============
const Experience = () =>
<section id="path">
    <div className="container" style={{ maxWidth: 900 }}>
      <span className="section-label"><Icon.Briefcase /> Path</span>
      <h2 className="section-title">How I <em>got here</em>.</h2>
      <div className="timeline">
        {EXPERIENCE.map((e, i) =>
      <div key={i} className="tl-item">
            <div className="tl-head">
              <div>
                <h3 className="tl-role">{e.role}</h3>
                <p className="tl-place">{e.place}</p>
              </div>
              <span className="tl-date">{e.date}</span>
            </div>
            <p className="tl-body">{e.body}</p>
            <div className="tl-tags">
              {e.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
      )}
      </div>
    </div>
  </section>;


// ============ WRITING ============
const Writing = () =>
<section id="writing">
    <div className="container">
      <span className="section-label"><Icon.Book /> Writing</span>
      <h2 className="section-title">Papers, preprints & <em>field notes</em>.</h2>
      <div className="writing-grid">
        {PUBLICATIONS.map((p, i) =>
      <a key={i} className="pub-card" href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="pub-cover" style={{ background: `var(--c-${p.cover}-bg)`, color: `var(--c-${p.cover}-fg)` }}>
              <svg viewBox="0 0 96 128" width="100%" height="100%">
                <rect x="12" y="18" width="72" height="2" fill="currentColor" opacity=".6" />
                <rect x="12" y="28" width="56" height="2" fill="currentColor" opacity=".4" />
                <rect x="12" y="38" width="64" height="2" fill="currentColor" opacity=".4" />
                <rect x="12" y="56" width="72" height="48" fill="currentColor" opacity=".25" />
              </svg>
            </div>
            <div className="pub-body">
              <div className="pub-venue">{p.venue}</div>
              <h3 className="pub-title">{p.title}</h3>
              <div className="pub-meta">
                {p.meta.map((m, j) => <span key={j}>{m}</span>)}
              </div>
            </div>
          </a>
      )}
      </div>
    </div>
  </section>;


// ============ CONTACT ============
const Contact = () =>
<section id="contact" style={{ paddingTop: 20 }}>
    <div className="contact">
      <h2>Let's map<br />something together.</h2>
      <p>Collaborations on urban, climate and disaster risk, or geospatial teaching are always welcome.</p>
      <div className="contact-links icons-only">
        <a className="contact-link" href="mailto:avishek.jidpus@gmail.com" aria-label="Email" title="avishek.jidpus@gmail.com"><Icon.Mail /></a>
        <a className="contact-link" href="https://linkedin.com/in/avishekadhikari" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Icon.Linkedin /></a>
        <a className="contact-link" href="https://github.com/cupid-shell" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Icon.Github /></a>
        <a className="contact-link" href="https://orcid.org/0009-0000-1069-5406" target="_blank" rel="noopener noreferrer" aria-label="ORCID" title="ORCID"><Icon.Orcid /></a>
      </div>
    </div>
  </section>;


// ============ SEARCH ============
const buildSearchIndex = () => {
  const idx = [];
  idx.push({ title: 'Overview', sub: 'Homepage', target: 'home', icon: <Icon.Home /> });
  idx.push({ title: 'About Avishek', sub: 'Bio · research focus', target: 'about', icon: <Icon.User /> });
  PROJECTS.forEach((p) => idx.push({ title: p.title, sub: p.kind, target: 'work', icon: <Icon.Folder /> }));
  PUBLICATIONS.forEach((p) => idx.push({ title: p.title, sub: p.venue, target: 'writing', icon: <Icon.Book /> }));
  EXPERIENCE.forEach((e) => idx.push({ title: e.role, sub: e.place, target: 'path', icon: <Icon.Briefcase /> }));
  SKILLS.forEach((s) => s.items.forEach((it) => {
    const title = typeof it === 'string' ? it : it.name;
    idx.push({ title, sub: s.group, target: 'stack', icon: <Icon.Code /> });
  }));
  idx.push({ title: 'Email', sub: 'avishek.jidpus@gmail.com', target: 'contact', icon: <Icon.Mail /> });
  return idx;
};

const SearchOverlay = ({ open, onClose, onJump }) => {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef();
  const idx = useMemo(buildSearchIndex, []);
  useEffect(() => {if (open) {setQ('');setSel(0);setTimeout(() => inputRef.current?.focus(), 60);}}, [open]);
  const results = useMemo(() => {
    if (!q.trim()) return idx.slice(0, 7);
    const needle = q.toLowerCase();
    return idx.filter((r) => r.title.toLowerCase().includes(needle) || r.sub.toLowerCase().includes(needle)).slice(0, 10);
  }, [q, idx]);
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();else
      if (e.key === 'ArrowDown') {e.preventDefault();setSel((s) => Math.min(s + 1, results.length - 1));} else
      if (e.key === 'ArrowUp') {e.preventDefault();setSel((s) => Math.max(s - 1, 0));} else
      if (e.key === 'Enter' && results[sel]) {onJump(results[sel].target);onClose();}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, sel, onClose, onJump]);
  return (
    <div className={'search-overlay' + (open ? ' open' : '')} onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} value={q} onChange={(e) => {setQ(e.target.value);setSel(0);}} placeholder="Search projects, papers, skills…" />
        <div className="search-results">
          {results.map((r, i) =>
          <div key={i} className={'search-result' + (i === sel ? ' selected' : '')}
          onMouseEnter={() => setSel(i)}
          onClick={() => {onJump(r.target);onClose();}}>
              <div className="r-ico">{r.icon}</div>
              <div><div className="r-title">{r.title}</div><div className="r-sub">{r.sub}</div></div>
            </div>
          )}
          {results.length === 0 && <div className="search-result"><div className="r-sub">No matches</div></div>}
        </div>
      </div>
    </div>);

};

// ============ TWEAKS PANEL ============
const TweaksPanel = ({ open, onClose, state, setState }) => {
  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };
  return (
    <div className={'tweaks-panel' + (open ? ' open' : '')}>
      <div className="tweaks-head">
        <h4>Tweaks</h4>
        <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={onClose} aria-label="Close"><Icon.Close /></button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <div className="tweak-label">Accent color</div>
          <div className="swatches">
            {Object.entries(ACCENTS).map(([k, v]) =>
            <div key={k} className={'swatch' + (state.accent === k ? ' selected' : '')}
            style={{ background: v.color }}
            onClick={() => update({ accent: k })}
            title={v.name} />
            )}
          </div>
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Font family</div>
          <div className="seg">
            {Object.entries(FONTS).map(([k, v]) =>
            <button key={k} className={state.font === k ? 'active' : ''} onClick={() => update({ font: k })}>{v.name}</button>
            )}
          </div>
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Density</div>
          <div className="seg">
            {Object.keys(DENSITIES).map((k) =>
            <button key={k} className={state.density === k ? 'active' : ''} onClick={() => update({ density: k })}>{k}</button>
            )}
          </div>
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Logo style</div>
          <div className="seg">
            {['letters', 'dot', 'g', 'blocks'].map((k) =>
            <button key={k} className={state.logoStyle === k ? 'active' : ''} onClick={() => update({ logoStyle: k })}>{k}</button>
            )}
          </div>
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Background</div>
          <div className="seg">
            {['none', 'dots', 'grid', 'blobs', 'topo'].map((k) =>
            <button key={k} className={state.pattern === k ? 'active' : ''} onClick={() => update({ pattern: k })}>{k}</button>
            )}
          </div>
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Hero headline</div>
          <input className="tweak-input" value={state.heroCopy} onChange={(e) => update({ heroCopy: e.target.value })} />
        </div>
        <div className="tweak-row">
          <div className="tweak-label">Hero sub</div>
          <textarea className="tweak-input" rows="4" value={state.heroSub} onChange={(e) => update({ heroSub: e.target.value })} />
        </div>
      </div>
    </div>);

};

// ============ APP ============
const App = () => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_state');
      if (saved) return { ...TWEAK_DEFAULTS, ...JSON.parse(saved) };
    } catch (e) {}
    return TWEAK_DEFAULTS;
  });
  useEffect(() => {try {localStorage.setItem('portfolio_state', JSON.stringify(state));} catch (e) {}}, [state]);

  const [active, setActive] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Apply theme + tweakables to :root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    const a = ACCENTS[state.accent] || ACCENTS.indigo;
    root.style.setProperty('--accent', a.color);
    root.style.setProperty('--accent-container', a.container);
    root.style.setProperty('--on-accent-container', a.onContainer);
    const f = FONTS[state.font] || FONTS.jakarta;
    root.style.setProperty('--font-display', f.display);
    root.style.setProperty('--font-body', f.body);
    root.style.setProperty('--density', DENSITIES[state.density] || 1);
  }, [state]);

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') {setEditMode(true);setTweaksOpen(true);} else
      if (e.data?.type === '__deactivate_edit_mode') {setEditMode(false);setTweaksOpen(false);}
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Keyboard: '/' opens search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || e.key === 'k' && (e.metaKey || e.ctrlKey)) && !searchOpen) {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Scroll spy
  useEffect(() => {
    const sections = NAV_TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0.1, 0.25, 0.5] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Scroll progress
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app" data-screen-label="Portfolio">
      <div className={`bg-fx pattern-${state.pattern}`} />
      <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />
      <AppBar
        theme={state.theme}
        setTheme={(t) => setState((s) => ({ ...s, theme: t }))}
        onSearch={() => setSearchOpen(true)}
        onTweaks={() => setTweaksOpen((o) => !o)}
        logoStyle={state.logoStyle} />
      
      <NavTabs active={active} onSelect={jump} />
      <Hero heroCopy={state.heroCopy} heroSub={state.heroSub} />
      <About />
      <Research />
      <Projects />
      <Skills />
      <Experience />
      <Writing />
      <Contact />
      <footer className="footer container">
        <div>© 2026 Avishek Adhikari — built with curiosity.</div>
        <div>Dhaka · 23.71°N 90.40°E</div>
      </footer>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onJump={jump} />
      {editMode && <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} state={state} setState={setState} />}
    </div>);

};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);