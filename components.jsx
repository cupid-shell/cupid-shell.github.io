/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ============ ICONS ============
const Icon = {
  Search: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>),
  Sun: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>),
  Moon: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Apps: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>),
  Sliders: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>),
  Close: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>),
  Arrow: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>),
  Mail: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>),
  Github: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>),
  Orcid: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM7.37 17.2h-1.4V7.37h1.4V17.2zM6.67 6.1a.82.82 0 1 1 .01-1.64.82.82 0 0 1 0 1.64zM17.43 12.3c0 2.72-1.95 4.9-4.9 4.9H9.07V7.37h3.46c2.95 0 4.9 2.2 4.9 4.93zm-1.42 0c0-2.17-1.37-3.63-3.48-3.63h-2.04v7.25h2.04c2.1 0 3.48-1.45 3.48-3.62z"/></svg>),
  Linkedin: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.1 20H3.6V9H7.1v11zM5.35 7.5a2.02 2.02 0 1 1 0-4.04 2.02 2.02 0 0 1 0 4.04zM20.4 20h-3.5v-5.6c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.7H9.3V9h3.36v1.5h.05c.47-.9 1.6-1.84 3.3-1.84 3.53 0 4.18 2.32 4.18 5.34V20z"/></svg>),
  Download: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Home: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>),
  User: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Folder: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>),
  Code: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
  Book: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>),
  Briefcase: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>),
  MapPin: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Satellite: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/></svg>),
  Thermo: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/></svg>),
  Flame: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.4 0 2.5-1.1 2.5-2.5 0-1-.5-1.5-1-2-.5-.5-1-1.5-1-2.5 0-1.2.3-2.3 1-3.2-1.8 1.6-3.5 3.7-3.5 6.2 0 1 .3 1.5.5 2z"/><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5 2.5 6-4 7-4 2.5-3 0-4 2-4 4 0 3.9 1.8 6 4 6z"/></svg>),
  Globe: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  Sprout: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4C6 8.4 8.4 8.6 9.5 9.4z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>),
  Sparkle: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>),
  Rss: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>),
  Shield: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>),
};

// ============ DATA ============
const PROJECTS = [
  {
    id: 'fire-risk',
    kind: 'Applied tool · Python · Streamlit',
    title: 'Fire-risk web app for urban informal settlements',
    desc: 'An end-to-end Python app that fetches OpenStreetMap data with OSMnx, builds a composite risk model from building density and emergency-vehicle access, and surfaces it through an interactive Streamlit UI.',
    tags: ['Python', 'OSMnx', 'GeoPandas', 'Streamlit'],
    tint: 'butter',
    span: 'span-6',
    viz: 'fire',
    link: 'https://github.com/cupid-shell/Fire-Risk-Analysis-App',
  },
];

const PUBLICATIONS = [
  {
    venue: 'The Geographical Journal · 2025',
    title: 'Urban sprawl in Rangpur City Corporation from 2003 to 2023: a spatiotemporal exploration using geospatial techniques',
    meta: ['Adhikari, A., Ghosh, B.K. & Rahman, M.N.', 'Vol. 191, e12615', 'Wiley / RGS-IBG · Open access', 'Grew out of my B.Sc. dissertation at Begum Rokeya University.'],
    link: 'https://doi.org/10.1111/geoj.12615',
    cover: 'sky',
  },
  {
    venue: 'Theoretical and Applied Climatology · 2025',
    title: 'The effects of socio-economic conditions and land use pattern on land surface temperature and Urban Heat Island at Saint Martin\'s Island in Bangladesh',
    meta: ['Rony, M.R.H., Jannat, F.A., Adhikari, A. et al.', 'Vol. 156, Article 541', 'Springer Nature'],
    link: 'https://doi.org/10.1007/s00704-025-05739-x',
    cover: 'peach',
  },
];

const SKILLS = [
  {
    group: 'GIS & Remote Sensing',
    dot: 'var(--g-blue)',
    icon: 'Satellite',
    intro: 'The core craft — turning pixels into planning evidence.',
    items: ['ArcGIS', 'QGIS', 'Google Earth Engine', 'FRAGSTATS', 'Spatial Analysis', 'Cartography', 'Landsat', 'Sentinel'],
    level: 'Primary',
  },
  {
    group: 'Programming & data',
    dot: 'var(--g-green)',
    icon: 'Code',
    intro: 'Scripting spatial pipelines and statistical workflows.',
    items: ['Python', 'R', 'Streamlit', 'GeoPandas', 'Pandas', 'NumPy', 'OSMnx', 'SPSS'],
    level: 'Primary',
  },
  {
    group: 'Methods',
    dot: 'var(--g-yellow)',
    icon: 'Sparkle',
    intro: 'Techniques I reach for to quantify sprawl, heat, and risk.',
    items: ['Shannon Entropy', 'Landscape Metrics', 'UEII', 'NDVI / NDBI / LST', 'Survey design'],
    level: 'Methods',
  },
  {
    group: 'Office & soft skills',
    dot: 'var(--accent)',
    icon: 'User',
    intro: 'How I ship research with teams and stakeholders.',
    items: ['MS Office', 'Project management', 'Teamwork', 'Analytical thinking', 'Communication'],
    level: 'Everyday',
  },
  {
    group: 'Certifications',
    dot: 'var(--g-red)',
    icon: 'Book',
    intro: 'Targeted study that backs the craft above.',
    items: [
      { name: 'Python Foundation for Spatial Analysis', by: 'Spatial Thoughts' },
      { name: 'Business Analytics with Excel', by: 'Johns Hopkins' },
      { name: 'GIS, Mapping, and Spatial Analysis', by: 'Univ. of Toronto' },
      { name: 'Cartography, Spatial Data Science, GIS for Climate Action', by: 'ESRI MOOC' },
    ],
    level: 'Certifications',
    layout: 'certs',
  },
];

const EXPERIENCE = [
  {
    role: 'Research Assistant',
    place: 'Centre for Urban Studies (CUS), Dhaka',
    date: 'May 2025 — now',
    body: 'Literature reviews on housing policies, informal housing and urban planning; drafting research reports and policy briefs; designing and implementing field surveys in urban communities, from questionnaire development to data-collection management.',
    tags: ['Policy', 'Field surveys', 'Informal housing'],
  },
  {
    role: 'M.Sc. Candidate — Disaster Risk Reduction',
    place: 'Bangladesh University of Engineering & Technology (BUET)',
    date: 'Oct 2024 — now',
    body: 'Coursework across seismic vulnerability, climate adaptation and geospatial methods; thesis in progress. Current CGPA 3.25.',
    tags: ['Thesis in progress'],
  },
  {
    role: 'Research Assistant',
    place: 'Dept. of Geography & Environmental Science, Begum Rokeya University, Rangpur',
    date: 'Jan 2024 — Jun 2024',
    body: 'Designed and executed field surveys — data collection, analysis and interpretation. Produced thematic maps and geospatial visualisations; contributed to drafting research papers for publication.',
    tags: ['Cartography', 'Field surveys'],
  },
  {
    role: 'GIS & Data Analyst — Freelance',
    place: 'Independent',
    date: '2023 — now',
    body: 'Spatial analysis in ArcGIS, QGIS and Google Earth Engine for urban planning and environmental research. Processed Landsat and Sentinel imagery for LULC classification, urban expansion detection and environmental monitoring; integrated primary survey data with geospatial analysis for community planning.',
    tags: ['GEE', 'ArcGIS', 'Landsat'],
  },
  {
    role: 'B.Sc. in Geography & Environmental Science',
    place: 'Begum Rokeya University, Rangpur',
    date: 'Mar 2019 — Jun 2024',
    body: 'CGPA 3.35. Dissertation: “Exploring the spatiotemporal pattern of urban sprawl in Rangpur City using geospatial techniques.”',
    tags: ['Dissertation'],
  },
];

// ============ PROJECT VISUALS (small SVGs) ============
const ProjectViz = ({ kind }) => {
  if (kind === 'sprawl') {
    return (
      <svg viewBox="0 0 760 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        <defs>
          <radialGradient id="sprG" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="currentColor" stopOpacity=".3"/>
            <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {[2003,2013,2023].map((y, i) => (
          <g key={y} transform={`translate(${170 + i*210}, 80)`}>
            <circle r={22 + i*18} fill="url(#sprG)" />
            <circle r={22 + i*18} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" opacity=".55"/>
            <circle r="5" fill="currentColor"/>
            <text y={i*18 + 40} textAnchor="middle" fontSize="13" fill="currentColor" opacity=".8" fontFamily="monospace" fontWeight="500">{y}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'heat') {
    return (
      <svg viewBox="0 0 200 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        {Array.from({length: 10}).map((_, i) => (
          <rect key={i} x={i*20} y="0" width="20" height="170"
            fill="currentColor" opacity={0.08 + (i%5)*0.05}/>
        ))}
        <path d="M0 120 Q50 70 100 100 T200 80" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="100" cy="100" r="4" fill="currentColor"/>
      </svg>
    );
  }
  if (kind === 'fire') {
    return (
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        {Array.from({length: 60}).map((_, i) => {
          const x = (i % 12) * 25 + 10;
          const y = Math.floor(i/12) * 32 + 10;
          const r = 2 + Math.random()*8;
          const op = 0.15 + Math.random()*0.5;
          return <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={op}/>;
        })}
      </svg>
    );
  }
  if (kind === 'map') {
    return (
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        <path d="M0 80 Q60 50 120 70 T240 60 L300 60 L300 170 L0 170Z" fill="currentColor" opacity=".15"/>
        <path d="M0 100 Q60 80 120 95 T240 90 L300 90" stroke="currentColor" fill="none" strokeWidth="1.5"/>
        {[[50,110],[110,95],[180,105],[240,98],[60,140],[160,145],[220,135]].map(([x,y], i) => (
          <g key={i}><circle cx={x} cy={y} r="3" fill="currentColor"/><circle cx={x} cy={y} r="8" fill="none" stroke="currentColor" opacity=".4"/></g>
        ))}
      </svg>
    );
  }
  if (kind === 'frag') {
    return (
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        {Array.from({length: 30}).map((_, i) => {
          const x = (i % 6) * 50 + 5;
          const y = Math.floor(i/6) * 32 + 5;
          const w = 10 + Math.random()*35;
          const h = 8 + Math.random()*22;
          return <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="currentColor" opacity={0.15 + Math.random()*0.35}/>;
        })}
      </svg>
    );
  }
  if (kind === 'atlas') {
    return (
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%'}}>
        {[0,1,2].map(r => (
          <path key={r}
            d={`M0 ${40 + r*40} Q75 ${25 + r*40} 150 ${35 + r*40} T300 ${40 + r*40}`}
            stroke="currentColor" fill="none" strokeWidth="1" opacity={0.6 - r*0.15}/>
        ))}
        <rect x="130" y="65" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="150" y="125" textAnchor="middle" fontSize="9" fill="currentColor" opacity=".7" fontFamily="monospace">23.71°N 90.40°E</text>
      </svg>
    );
  }
  return null;
};

Object.assign(window, { Icon, PROJECTS, PUBLICATIONS, SKILLS, EXPERIENCE, ProjectViz });
