import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css"

const MISSION_DATA = [
  { start: "2026-03-13", end: "2026-03-15", title: "COGNIZANCE IIT ROORKEE" },
  { start: "2026-05-19", end: "2026-05-20", title: "TECHNOXIAN ZONALS, CHANDIGARH" },
  { start: "2026-06-14", end: "2026-06-20", title: "INTER ORESHNK SOFTWARE DEVELOPMENT CHALLENGE" },
  { start: "2026-08-16", end: "2026-08-22", title: "SIH (SMART INDIA HACKATHON)" },
  { start: "2026-09-13", end: "2026-09-19", title: "IIC 2.0" },
  { start: "2026-10-11", end: "2026-10-17", title: "IIT BOMBAY QUALIFIERS, IIIT DELHI" },
  { start: "2026-12-27", end: "2026-12-31", title: "IIT BOMBAY" },
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const ABSTRACTS_DATA = [
  {
    id: 1,
    title: "MICROMOUSE MAZE SOLVER - NANONAVIGATOR",
    event: "IIT ROORKEE COGNIZANCE",
    year: "2026",
    pdfUrl: "/abstracts/ABSTRACT_NANO_NAVIGATOR_COGNI2054321.pdf",
    previewImage: "/abstracts/pdf1.png",
    description: "LiDAR-based navigation with real-time obstacle detection and path optimization."
  },
  {
    id: 2,
    title: "LINE FOLLOWER BOT - TRAILBLAZE",
    event: "IIT ROORKEE COGNIZNACE",
    year: "2026",
    pdfUrl: "/abstracts/ABSTRACT_TRAILBLAZE_COGNI2054321.pdf",
    previewImage: "/abstracts/pdf2.png",
    description: "LiDAR-based navigation with path optimization."
  },
];

const isDateInRange = (dateStr, event) => dateStr >= event.start && dateStr <= event.end;
const getEventForDate = (dateStr) => MISSION_DATA.find((event) => isDateInRange(dateStr, event));


const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [activeDate, setActiveDate] = useState(null);
  const [missionDetail, setMissionDetail] = useState(null);
  const [loaderFade, setLoaderFade] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const canvasRef = useRef(null);
  const lastScrollY = useRef(0);
  const sceneRef = useRef({});
  const starsContainerRef = useRef(null);

  // Inject CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Loader
  useEffect(() => {
    const t1 = setTimeout(() => setLoaderFade(true), 2800);
    const t2 = setTimeout(() => setLoaderDone(true), 3500);
    const t3 = setTimeout(() => setHeroVisible(true), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Create stars for loader
  useEffect(() => {
    if (!starsContainerRef.current) return;
    const starsContainer = starsContainerRef.current;

    for (let i = 0; i < 25; i++) {
      const star = document.createElement('div');
      const isSuperstar = Math.random() > 0.8;
      star.className = `insignia-star ${isSuperstar ? 'insignia-superstar' : ''}`;

      const angle = Math.random() * Math.PI * 2 + i * 1000;
      const radius = Math.random() * 36;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      star.style.left = x + '%';
      star.style.top = y + '%';

      const baseScale = isSuperstar ? 0.7 : 0.4;
      star.style.transform = `scale(${Math.random() * 0.5 + baseScale})`;
      star.style.animationDelay = (0.8 + Math.random() * 1) + 's';

      if (isSuperstar) {
        star.style.setProperty('--deg', (Math.random() * 180) + 'deg');
      }

      starsContainer.appendChild(star);
    }
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > lastScrollY.current && y > 200);
      setNavScrolled(y > 100);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.GridHelper(400, 100, 0x222222, 0x111111));

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1, 5), new THREE.Vector3(0, -1, -10),
      new THREE.Vector3(5, -1, -20), new THREE.Vector3(-5, -1, -40),
      new THREE.Vector3(0, -1, -60), new THREE.Vector3(8, 2, -80),
      new THREE.Vector3(0, 0, -100), new THREE.Vector3(-10, -1, -120),
      new THREE.Vector3(0, -1, -150), new THREE.Vector3(0, -1, -280),
    ]);
    curve.tension = 0.5;

    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 150, 0.1, 8, false), new THREE.MeshBasicMaterial({ color: 0xFF3B00, wireframe: true, transparent: true, opacity: 0.3 })));
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 150, 0.03, 8, false), new THREE.MeshBasicMaterial({ color: 0xFFAA00 })));

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);
    robotGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.5), new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true })));
    robotGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 1.4), new THREE.MeshBasicMaterial({ color: 0x000000 })));

    const wheels = [];
    [[0.6, 0, 0.5], [-0.6, 0, 0.5], [0.6, 0, -0.5], [-0.6, 0, -0.5]].forEach(p => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true }));
      w.rotation.z = Math.PI / 2; w.position.set(...p); robotGroup.add(w); wheels.push(w);
    });

    sceneRef.current = { curve, robotGroup, wheels, camera };

    let animId;
    const camTarget = new THREE.Vector3();
    function animate() {
      animId = requestAnimationFrame(animate);
      const scrollPos = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const u = Math.min(Math.max(scrollPos / maxScroll, 0.001), 0.999);
      const pos = curve.getPointAt(u);
      const lookPos = curve.getPointAt(Math.min(u + 0.01, 0.999));
      if (pos && lookPos) {
        robotGroup.position.copy(pos);
        robotGroup.lookAt(lookPos);
        camTarget.copy(pos).add(new THREE.Vector3(0, 2, 5));
        camera.position.lerp(camTarget, 0.1);
        camera.lookAt(pos);
      }
      wheels.forEach(w => { w.rotation.x = -scrollPos * 0.05; });
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const changeMonth = (dir) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setActiveDate(null);
    setMissionDetail(null);
  };

  const handleDayClick = (dateStr, event) => {
    setActiveDate(dateStr);
    setMissionDetail(event);
  };

  const sendMail = (tier) => {
    window.location.href = `mailto:teamoreshnk@gmail.com?subject=Inquiry: ${tier}&body=Interested in supporting the mission.`;
  };

  // Calendar cells
  const renderCalendarCells = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="cal-cell empty" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const event = getEventForDate(dateStr);
      let cls = "cal-cell";
      if (event) cls += " has-event";
      if (activeDate === dateStr) cls += " active";
      cells.push(
        <div key={d} className={cls} onClick={event ? () => handleDayClick(dateStr, event) : undefined}>{d}</div>
      );
    }
    return cells;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="noise" />
      <canvas id="webgl-canvas" ref={canvasRef} />
      <div className="app-content">

        {/* Loader */}
        {!loaderDone && (
          <div className={`loader${loaderDone ? " done" : ""}`} style={loaderDone ? { transform: "translateY(-100%)" } : {}}>
            <div className={`insignia${loaderFade ? " fade" : ""}`}>
              <div className="insignia-wrap">
                <div className="insignia-layer">
                  <div className="insignia-circle"></div>
                </div>
                <div className="insignia-layer" ref={starsContainerRef}></div>
                <div className="insignia-layer layer-wing">
                  <svg className="insignia-wing wing-top" viewBox="0 0 486.46 246.22">
                    <path d="m4.6154 246.22-4.6154-2.5641c117.78-66.222 188.21-72.787 274.36-108.85 60.512-25.71 150.84-56.514 212.1-134.8-37.266 59.179-96.206 106.73-96.206 106.73-36.444 22.667-52.368 33.693-121.43 55.415-81.179 27.258-191.33 40.962-264.21 84.073z" />
                  </svg>
                </div>
                <div className="insignia-layer layer-wing" style={{ animationDelay: '0.4s' }}>
                  <svg className="insignia-wing wing-bottom" viewBox="0 0 429.90 364.70">
                    <path d="m429.9 0c-12.841 36.205-30.119 54.618-38.573 64.927-41.584 49.942-111.92 95.189-141.43 115.59-15.248 10.297-94.582 59.883-153.98 104.48-9.505 7.3267-59.188 45.123-95.918 79.706 0.24371-2.6352 0.2691-3.2292 0.15236-5.7222 26.865-23.813 58.913-56.583 94.811-84.275 38.462-28.205 120.52-81.518 150.32-100.85 30.465-20.005 61.127-43.087 88.728-66.783 28.158-61.505 28.589-14.296 95.887-107.06z" />
                  </svg>
                </div>
                <div className="insignia-layer">
                  <div className="insignia-text-container">
                    <span className="char char-0">o</span>
                    <span className="char char-1">r</span>
                    <span className="char char-2">e</span>
                    <span className="char char-3">s</span>
                    <span className="char char-4">h</span>
                    <span className="char char-5">n</span>
                    <span className="char char-6">k</span>
                  </div>
                </div>
                <div className="insignia-layer">
                  <div className="orbit-container">
                    <svg className="orbit-svg" viewBox="0 0 26.458 26.458">
                      <path d="m13.321 0.0089795c7.2581 3e-5 13.142 5.923 13.142 13.229-3.7e-5 7.3062-5.8838 13.229-13.142 13.229-4.2769-1e-3 -8.238-2.0928-10.68-5.5254-0.15284-0.37543-0.019934-0.38219 0.21484-0.0487 1.715 2.4514 6.4286 4.9051 10.465 4.907 6.892 0 12.479-5.6242 12.479-12.562-2e-6 -6.9378-5.587-12.562-12.479-12.562-4.5999 4e-3 -8.8245 2.5556-10.993 6.639-0.53515 1.0687-0.21295 1.964-0.012494 3.0902 0.23944 1.3452-0.1568 2.7747-1.1992 2.6612-1.1087-0.1207-1.2647-1.149-0.99883-2.4718 0.2488-1.238 0.77848-1.8 1.4694-3.2796 2.2247-4.4728 6.7654-7.3 11.734-7.3063z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className={`nav-bar${navHidden ? " nav-hidden" : ""}${navScrolled ? " nav-scrolled" : ""}`}>
          <a href="#" className="logo"><span>ORESHNK</span></a>
          <button className="menu-trigger" onClick={() => setMenuOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6H20M4 12H20M4 18H20" strokeLinecap="round" /></svg>
          </button>
        </nav>

        {/* Full Menu */}
        <div className={`full-menu${menuOpen ? " active" : ""}`} id="fullMenu">
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <ul className="menu-links">
            {[["#", "HOME"], ["#about", "DIRECTIVE"], ["#offerings", "CAPABILITIES"], ["#schedule", "SCHEDULE"], ["#abstracts", "ABSTRACTS"], ["#partners", "PARTNERSHIP"], ["#contact", "COMMAND"]].map(([href, label]) => (
              <li key={label}><a href={href} onClick={() => setMenuOpen(false)}>{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Hero */}
        <section className="hero">
          <div className="container">
            <span className="t-sub">Manipal University Jaipur</span>
            <div className="hero-line"><h1 className={`t-hero${heroVisible ? " visible" : ""}`}>Building</h1></div>
            <div className="hero-line"><h1 className={`t-hero${heroVisible ? " visible" : ""}`} style={{ color: "var(--c-accent)", transitionDelay: "0.1s" }}>The Future</h1></div>
            <div className="hero-line"><h1 className={`t-hero${heroVisible ? " visible" : ""}`} style={{ WebkitTextStroke: "1px rgba(255,255,255,0.6)", color: "transparent", transitionDelay: "0.2s" }}>Robotics</h1></div>
          </div>
        </section>

        {/* About / Directive */}
        <section className="container" id="about">
          <div style={{ maxWidth: 900 }}>
            <span className="t-sub">The Directive</span>
            <p style={{ fontSize: "clamp(1.5rem,4vw,2.8rem)", fontWeight: 300, lineHeight: 1.1 }}>
              Custom hardware. Embedded frameworks. <span style={{ color: "var(--c-accent)", fontWeight: 600 }}>High-performance engineering.</span> We build for the podium.
            </p>
          </div>
        </section>

        {/* Offerings */}
        <section className="container" id="offerings">
          <span className="t-sub">What we can offer</span>
          <div className="offer-grid">
            {[
              { num: "01", title: "Hardware", desc: "Robust mechanical structures designed for high-stress combat and navigation. Precision fabrication for elite performance." },
              { num: "02", title: "Electronics", desc: "Custom PCB design and power management systems optimized for peak efficiency and signal integrity." },
              { num: "03", title: "Embedded", desc: "Low-level programming and real-time control algorithms. High-frequency loops for autonomous responsiveness." },
            ].map(item => (
              <div className="offer-item" key={item.num}>
                <span className="offer-num">{item.num}</span>
                <h3 className="offer-title">{item.title}</h3>
                <p className="offer-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calendar */}
        <section className="calendar-section" id="schedule">
          <div className="container">
            <span className="t-sub">Deployment Schedule</span>
            <h2 className="t-hero" style={{ fontSize: "5vw", marginBottom: 40 }}>Tactical Calendar</h2>
            <div className="calendar-wrapper">
              <div className="cal-main">
                <div className="cal-header">
                  <div className="cal-month">{`${monthNames[currentMonth]} ${currentYear}`.toUpperCase()}</div>
                  <div className="cal-nav">
                    <button className="cal-btn" onClick={() => changeMonth(-1)}>PREV</button>
                    <button className="cal-btn" onClick={() => changeMonth(1)}>NEXT</button>
                  </div>
                </div>
                <div className="cal-grid">
                  {dayLabels.map(l => <div key={l} className="cal-day-label">{l}</div>)}
                  {renderCalendarCells()}
                </div>
              </div>
              <div className="cal-sidebar">
                {missionDetail ? (
                  <>
                    <div className="cal-detail-title-wrapper">
                      <div className="cal-active-indicator"></div>
                      <div className="cal-detail-title">{missionDetail.title}</div>
                    </div>
                    <div className="cal-event-details">
                      <div className="cal-date-range">
                        <div className="cal-date-item">
                          <span className="cal-date-label">START</span>
                          <span className="cal-date-value">{missionDetail.start}</span>
                        </div>
                        <div className="cal-date-separator"></div>
                        <div className="cal-date-item">
                          <span className="cal-date-label">END</span>
                          <span className="cal-date-value">{missionDetail.end}</span>
                        </div>
                      </div>
                      <div className="cal-duration">
                        {missionDetail.start === missionDetail.end
                          ? "ONE DAY EVENT"
                          : `${(new Date(missionDetail.end) - new Date(missionDetail.start)) / (1000 * 60 * 60 * 24) + 1} DAYS`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cal-detail-title">TACTICAL CALENDAR 2026</div>
                    <div className="no-missions">Select any highlighted date to view the event details.</div>
                    <div className="cal-placeholder-info">
                      <div className="placeholder-item">
                        <span className="placeholder-dot"></span>
                        <span>7 major events scheduled</span>
                      </div>
                      <div className="placeholder-item">
                        <span className="placeholder-dot"></span>
                        <span>March to December</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="container" id="partners">
          <span className="t-sub">Partnership</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 30 }}>
            <h2 className="t-hero" style={{ fontSize: "5vw" }}>Support</h2>
            <button className="btn-primary" onClick={() => sendMail("General")}>Sponsor Us</button>
          </div>
          <div className="bento-grid">
            <div className="bento-card wide aura-gold" onClick={() => sendMail("Title")}>
              <span className="bento-tag">Primary Tier</span>
              <h3 className="bento-title">Title Sponsor</h3>
              <p className="bento-desc">Full brand integration, VIP access at all deployments, and featured status in international transmissions.</p>
              <p className="bento-amount">₹50,000+</p>
            </div>
            <div className="bento-card aura-silver" onClick={() => sendMail("Associate")}>
              <span className="bento-tag">Secondary Tier</span>
              <h3 className="bento-title">Associate</h3>
              <p className="bento-desc">Prominent logo placement on Chassis v3 and digital asset branding across all channels.</p>
              <p className="bento-amount">₹25,000+</p>
            </div>
            <div className="bento-card" onClick={() => sendMail("Technical")}>
              <span className="bento-tag">Hardware & Software</span>
              <h3 className="bento-title">Technical Partner</h3>
              <p className="bento-desc">Field-testing opportunities for hardware and direct access to top engineering talent recruitment.</p>
              <p className="bento-amount">Asset Support</p>
            </div>
          </div>
        </section>

        {/* Abstracts */}
        <section className="container" id="abstracts">
          <span className="t-sub">Research & Development</span>
          <h2 className="t-hero" style={{ fontSize: "5vw", marginBottom: 40 }}>Selected Abstracts</h2>
          <div className="abstracts-grid">
            {ABSTRACTS_DATA.map(abstract => (
              <div
                className="abstract-card"
                key={abstract.id}
                style={{ backgroundImage: `url(${abstract.previewImage})` }}
              >
                <div className="abstract-card-overlay"></div>
                <div className="abstract-card-content">
                  <div className="abstract-header">
                    <span className="abstract-tag">{abstract.event} • {abstract.year}</span>
                    <h3 className="abstract-title">{abstract.title}</h3>
                    <p className="abstract-desc">{abstract.description}</p>
                  </div>
                  <div className="abstract-actions">
                    <a href={abstract.pdfUrl} target="_blank" rel="noreferrer" className="abstract-btn preview-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      PREVIEW
                    </a>
                    <a href={abstract.pdfUrl} download className="abstract-btn download-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      DOWNLOAD
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Command */}
        <section className="container" id="contact">
          <span className="t-sub">Command Units</span>
          <div className="members-grid">
            {[
              { name: "Arkadeep Nag", link: "https://www.linkedin.com/in/arkadeepnag", bio: "Systems architect building high-performance software and low-level embedded frameworks. Focused on clean code and robotic autonomy." },
              { name: "Shreyas Raj", link: "https://www.linkedin.com/in/bshreeshreyasraj/", bio: "Hardware specialist focused on power distribution matrices, sensor fusion, and structural mechanical integrity." },
            ].map(m => (
              <div className="member-card" key={m.name}>
                <div className="member-header">
                  <h3 className="member-name">{m.name}</h3>
                  <a href={m.link} target="_blank" rel="noreferrer" className="member-social"><LinkedInIcon /></a>
                </div>
                <p className="member-bio">{m.bio}</p>
              </div>
            ))}
          </div>

          <div className="personnel-section">
            <span className="t-sub" style={{ fontSize: "0.65rem", marginBottom: 30 }}>Operational Personnel</span>
            <div className="personnel-list">
              {[
                { num: "01", name: "Aniket Yadav", link: "https://www.linkedin.com/in/aniket-yadav-ab2a19292/" },
                { num: "02", name: "Aryan Pathak", link: "https://www.linkedin.com/in/aryan-pathak-076676380/" },
                { num: "03", name: "Dhruv Mittal", link: "https://www.linkedin.com/in/dhruv-mittal-69469b36b/" },
                { num: "04", name: "Rahul Konar", link: "https://www.linkedin.com/in/konar-rahul/" },
                { num: "05", name: "Rishi Mittal", link: "https://www.linkedin.com/in/rishi-mittal-280953399/" },
              ].map(p => (
                <a key={p.num} href={p.link} target="_blank" rel="noreferrer" className="personnel-item-link">
                  <span className="personnel-num">{p.num}</span>
                  <span className="personnel-name">{p.name}</span>
                </a>
              ))}
            </div>
          </div>

        </section>

        {/* Current Sponsors */}
        <section className="container sponsors-section" id="sponsors">
          <span className="t-sub">Current Sponsors</span>
          <div className="sponsor-logo-card">
            <img src="https://cdn.universitykart.com//Content/upload/admin/uhjjm31d.wuj.png" alt="Current Sponsor" className="sponsor-logo" />
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem", color: "#444" }}>© 2026 ORESHNK ROBOTICS</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://instagram.com/oreshnk" className="social-link" target="_blank" rel="noreferrer" title="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/oreshnk" className="social-link" target="_blank" rel="noreferrer" title="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href="https://github.com/Team-Oreshnk" className="social-link" target="_blank" rel="noreferrer" title="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}