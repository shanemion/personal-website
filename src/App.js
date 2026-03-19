import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Moon, Sun, Mail, Github, Linkedin, FileText, Calendar, ExternalLink, ArrowUpDown } from "lucide-react";

const ParticleBorder = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let startTime = null;

    const PAD = 8;
    const R = 16;
    const DURATION = 8000;
    const TRAIL_SAMPLES = 60;
    const TRAIL_DIST = 0.065;
    const LUT_N = 1024;

    const resize = () => {
      const pr = canvas.parentElement.getBoundingClientRect();
      canvas.width = (pr.width + PAD * 2) * dpr;
      canvas.height = (pr.height + PAD * 2) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const getPoint = (t, w, h) => {
      const topL = w - 2 * R, rightL = h - 2 * R, botL = w - 2 * R, leftL = h - 2 * R;
      const arcL = (Math.PI / 2) * R;
      const total = topL + rightL + botL + leftL + 4 * arcL;
      let d = (((t % 1) + 1) % 1) * total;
      if (d < topL) return { x: PAD + R + d, y: PAD };
      d -= topL;
      if (d < arcL) { const a = -Math.PI/2 + (d/arcL)*Math.PI/2; return { x: PAD+w-R+Math.cos(a)*R, y: PAD+R+Math.sin(a)*R }; }
      d -= arcL;
      if (d < rightL) return { x: PAD + w, y: PAD + R + d };
      d -= rightL;
      if (d < arcL) { const a = (d/arcL)*Math.PI/2; return { x: PAD+w-R+Math.cos(a)*R, y: PAD+h-R+Math.sin(a)*R }; }
      d -= arcL;
      if (d < botL) return { x: PAD + w - R - d, y: PAD + h };
      d -= botL;
      if (d < arcL) { const a = Math.PI/2+(d/arcL)*Math.PI/2; return { x: PAD+R+Math.cos(a)*R, y: PAD+h-R+Math.sin(a)*R }; }
      d -= arcL;
      if (d < leftL) return { x: PAD, y: PAD + h - R - d };
      d -= leftL;
      const a = Math.PI+(d/arcL)*Math.PI/2;
      return { x: PAD+R+Math.cos(a)*R, y: PAD+R+Math.sin(a)*R };
    };

    let cachedW = 0, cachedH = 0, lut = null;

    const buildLUT = (w, h) => {
      const topL = w-2*R, rightL = h-2*R, botL = w-2*R, leftL = h-2*R;
      const arcL = (Math.PI/2)*R;
      const lengths = [topL, arcL, rightL, arcL, botL, arcL, leftL, arcL];
      const total = lengths.reduce((a,b)=>a+b, 0);
      const bounds = [0];
      let acc = 0;
      for (const l of lengths) { acc += l; bounds.push(acc / total); }

      const speed = new Float64Array(LUT_N);
      for (let i = 0; i < LUT_N; i++) {
        const t = i / LUT_N;
        let si = 0;
        for (let j = 0; j < lengths.length; j++) { if (t < bounds[j+1]) { si = j; break; } }
        const isLine = si % 2 === 0;
        if (!isLine) { speed[i] = 1; continue; }
        const local = (t - bounds[si]) / (bounds[si+1] - bounds[si]);
        speed[i] = 0.35 + 0.65 * Math.sin(Math.PI * local);
      }

      const cumul = new Float64Array(LUT_N + 1);
      for (let i = 0; i < LUT_N; i++) cumul[i+1] = cumul[i] + speed[i];
      const totalC = cumul[LUT_N];
      const table = new Float64Array(LUT_N + 1);
      for (let i = 0; i <= LUT_N; i++) table[i] = cumul[i] / totalC;
      return table;
    };

    const sampleLUT = (rawT) => {
      const t = ((rawT % 1) + 1) % 1;
      let lo = 0, hi = LUT_N;
      while (lo < hi) { const m = (lo+hi)>>1; if (lut[m] < t) lo = m+1; else hi = m; }
      if (lo === 0) return 0;
      const f = (t - lut[lo-1]) / (lut[lo] - lut[lo-1] || 1e-10);
      return (lo - 1 + f) / LUT_N;
    };

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawT = (elapsed % DURATION) / DURATION;
      const pr = canvas.parentElement.getBoundingClientRect();
      const w = pr.width, h = pr.height;

      if (w !== cachedW || h !== cachedH) { lut = buildLUT(w,h); cachedW = w; cachedH = h; }

      ctx.clearRect(0, 0, w + PAD*2, h + PAD*2);

      const easedT = sampleLUT(rawT);

      for (let i = TRAIL_SAMPLES; i >= 0; i--) {
        const offset = (i / TRAIL_SAMPLES) * TRAIL_DIST;
        const trailEased = sampleLUT(((rawT - offset) % 1 + 1) % 1);
        const p = getPoint(trailEased, w, h);
        const progress = 1 - i / TRAIL_SAMPLES;
        const radius = 3.2 * Math.pow(progress, 1.3);
        const alpha = Math.pow(progress, 2.2) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
      }

      const head = getPoint(easedT, w, h);
      ctx.beginPath();
      ctx.arc(head.x, head.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{ top: '-8px', left: '-8px', width: 'calc(100% + 16px)', height: 'calc(100% + 16px)', zIndex: 10 }}
    />
  );
};

const CATEGORIES = ["All", "PM", "Full-Stack", "Hardware", "CV", "Audio", "Robotics", "XR"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "recent", label: "Recent" },
  { value: "domain", label: "By Domain" },
];

const ProjectItem = ({ project, featured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const roleColors = {
    PM: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    SWE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Research: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Creative: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Hardware: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    Robotics: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Audio: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    CV: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    XR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Full-Stack": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div 
      className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20 hover:-translate-y-1 cursor-pointer ${featured ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Thumbnail Preview */}
      {project.image && (
        <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={project.image}
            alt={project.name}
            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${project.imageStyle?.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            style={project.imageStyle}
          />
          {featured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6">
        {/* Title + External Link */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
            </a>
          )}
        </div>

        {/* Metadata Row */}
        {(project.role || project.tech || project.outcome) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.role && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[project.role] || roleColors.SWE}`}>
                {project.role}
              </span>
            )}
            {project.tech && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {project.tech}
              </span>
            )}
            {project.outcome && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {project.outcome}
              </span>
            )}
          </div>
        )}

        <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
          {project.description}
        </p>
        
        {isExpanded && (
          <div className="mb-4 space-y-4 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.fullDescription }}></div>
            {project.video && (
              <div className="w-full rounded-xl overflow-hidden">
                <iframe
                  src={project.video}
                  className="w-full aspect-video rounded-xl"
                  allow="autoplay"
                  allowFullScreen
                  title={project.name}
                ></iframe>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {isExpanded ? "Show Less" : "Show More"}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {project.categories && (
            <div className="flex gap-1">
              {project.categories.slice(0, 2).map((cat, i) => (
                <span key={i} className="text-xs text-gray-400 dark:text-gray-500">
                  {cat}{i === 0 && project.categories.length > 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // SEO: Update document title and meta description
  useEffect(() => {
    document.title = "Shane Mion - AI Systems, Robotics & Healthcare | Stanford CS";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Shane Mion builds AI systems that connect perception, reasoning, and real-world decision-making. CS (AI) @ Stanford, TreeHacks Grand Prize Winner, former PM @ TikTok. Working on robotics, healthcare tech, and XR.');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projects = [
    {
      name: "Reachy Mini Ouija Board",
      description: "An immersive, AI-powered installation that reimagines the Ouija board as a robotic interface, where a motorized table and expressive robot spell out eerie responses to spoken questions.",
      fullDescription: "Blending hardware, sound design, and AI, the project explores how humans form emotional connections to \"lost\" or deprecated intelligent systems. <br><br><strong>🎥 <a href='https://docs.google.com/document/d/1pDZs6lGY-g5zpCYlL2hRtLJ-xzpNgP6HBfQaALIDmME/edit?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>See videos from our exhibit & full writeup →</a></strong>",
      link: "https://docs.google.com/document/d/1pDZs6lGY-g5zpCYlL2hRtLJ-xzpNgP6HBfQaALIDmME/edit?usp=sharing",
      image: "reachy.JPEG",
      role: "SWE",
      tech: "Robotics, AI, Sound Design, Motors",
      outcome: "Interactive Installation",
      categories: ["Robotics", "Hardware", "Software", "Art"],
      featured: true
    },
    {
      name: "Pico 4: Mixed Reality 'Times Square'",
      description: "A mixed reality project using See Through on the Pico 4 to create a 'Times Square' experience.",
      fullDescription: "A mixed reality project using See Through on the Pico 4 to create a 'Times Square' experience. Project involves snapping multiple browser tabs to real-life surfaces (e.g. snap to walls, flush against tables, maybe even laptop screens). Then, interact with the surfaces as if they were a screen. <br><br><strong>📹 <a href='https://drive.google.com/file/d/1tHDpeJ5FF2q-eFo_fsniYJAGQDQJ8JoZ/view' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Click the video to view the demo →</a></strong>",
      link: "https://drive.google.com/file/d/1tHDpeJ5FF2q-eFo_fsniYJAGQDQJ8JoZ/view",
      image: "timessquare.png",
      role: "XR",
      tech: "Pico 4, See Through",
      outcome: "Demo",
      categories: ["XR"],
      featured: true,
    },
    {
      name: "The Trolley Problem, as Seen by a Robot",
      description: "An artistic robotics vignette exploring AI decision-making using computer vision and ethical philosophy",
      fullDescription: "A creative exploration of how vision models and automated systems influence life-or-death decisions, using a Stretch robot to symbolically represent the trolley problem. The robot uses computer vision to detect humans on each track, aggregates confidence scores, and makes decisions based on probabilistic assessments—mirroring how modern military systems use vision models in surveillance and targeting pipelines. Built as a state machine to demonstrate how these decisions are constantly being \"made\" in the real world. The project combines Stretch's dextrous control and vision input with artistic expression to confront the unsettling reality of how AI systems quantify uncertainty and perceived threat, implicitly influencing outcomes involving human lives. <br><br><strong>📹 <a href='https://docs.google.com/presentation/d/1vJSCqMeFdonOv7iClOtSASlHQYyT4aMbv5gw0zUchcE/edit?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Watch the Demo Video & Presentation →</a></strong>",
      link: "https://docs.google.com/presentation/d/1vJSCqMeFdonOv7iClOtSASlHQYyT4aMbv5gw0zUchcE/edit?usp=sharing",
      image: "trolley.png",
      role: "Research",
      tech: "Stretch Robot, CV",
      outcome: "Demo",
      categories: ["Robotics", "CV"],
      featured: false,
    },
    {
      name: "ALERT: Audio-Visual Log Event Recognition Toolkit",
      description: "A toolkit for uploading, transcribing, and detecting events in long audio/video files",
      fullDescription: "Created with Mario Sumali. A full-stack application for parsing long audio and video files to identify key moments of interest. Built with React + TypeScript frontend, FastAPI backend, OpenAI Whisper for transcription, PyTorch for event detection, PostgreSQL database, and Celery + Redis for async task processing. Features a searchable web UI where users can upload files, view detected moments (gunshots, silence, motion, etc.), and filter by event type. <br><br><strong>📹 <a href='https://drive.google.com/file/d/1_x9oDATdkwZkX9DBiATogCMXNlO4-Uzl/view?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Watch the Demo Video →</a></strong><br><br>Check out the <a href='https://github.com/mariosumali/ALERT' target='_blank' rel='noopener noreferrer'>GitHub</a> for more details.",
      link: "https://drive.google.com/file/d/1_x9oDATdkwZkX9DBiATogCMXNlO4-Uzl/view?usp=sharing",
      image: "alert.png",
      role: "PM",
      tech: "React, FastAPI, PyTorch",
      outcome: "Demo",
      categories: ["PM", "Full-Stack", "CV", "Audio"],
      featured: false,
    },
    {
      name: "Speed Racer: Thunderhead Raceway Ray-Traced Render",
      description: "Blender Cycles recreation of Speed Racer's Thunderhead Raceway using custom-modeled car and track",
      fullDescription: "A physically based recreation of a scene from <em>Speed Racer (2008)</em>, inspired by the Thunderhead Raceway sequence. We modeled the Mach 6 race car and track geometry from scratch using plane-and-fill techniques and a Nurbs-path-driven track, then applied custom UV unwrapped materials for the forged-steel track, car paint, and decals. The scene showcases ray-traced reflections, glossy surfaces, neon track lighting, and motion blur to capture the film's ultra-stylized, 400 mph aesthetic. <br><br>The writeup details how we met the ray tracing, geometry, and texturing requirements, what assets were built vs. downloaded, and how we used tutorials for glowy lights and car modeling. <br><br><strong>📄 <a href='https://docs.google.com/document/d/1nrKUophbQIyzXnlH5sRgKmX8vNr_RB2FRojOtaVUddg/edit?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Read the Speed Racer Project Writeup →</a></strong>",
      link: "https://docs.google.com/document/d/1nrKUophbQIyzXnlH5sRgKmX8vNr_RB2FRojOtaVUddg/edit?usp=sharing",
      image: "speed_racer.png",
      role: "Creative",
      tech: "Blender, Cycles",
      outcome: "Render",
      categories: ["XR"],
      featured: true,
    },
    {
      name: "Cleo: A Smart Wearable with Embedded AMOLED Display Applications",
      description: "Embedded applications for T5-E1 Touch AMOLED device with animated displays",
      fullDescription: "Embedded applications for the T5-E1 Touch AMOLED 1.75 device. Built two applications: Spiral Display (animated spiral pattern using digit characters with touch interaction) and Particle Name (dynamic particle-based display of \"SHANE\" with wave motion and touch interaction). Developed using TuyaOpen SDK and C/C++. <br><br><strong>📂 <a href='https://github.com/sutyazz/Martian-Project' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>View the project on GitHub →</a></strong>",
      link: "https://github.com/sutyazz/Martian-Project",
      image: "cleo.jpg",
      video: "https://drive.google.com/file/d/1A1-TINn06BsAWFJfNKR5uzaCKOWz9e8O/preview",
      role: "SWE",
      tech: "C/C++, TuyaOpen SDK",
      outcome: "Demo",
      categories: ["Hardware"],
    },
    {
      name: "Aetherglass: Teensy Smart Glasses Audio Synth System",
      description: "A wearable smart glasses audio system with cameras, IMU, and mic input from scratch",
      fullDescription: "Designed and built a wearable smart glasses audio system from scratch, owning all hardware, embedded software, and product decisions to map motion, mic input, embedded TinyML CV, and touch into real-time ambient audio effects. Sound demo coming sept when I get home lol, it works! <br><br><strong>📂 <a href='https://github.com/shanemion/smartglasses' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>View the project on GitHub →</a></strong>",
      link: "https://github.com/shanemion/smartglasses",
      image: "hold.jpeg",
      role: "PM",
      tech: "Teensy, TinyML",
      outcome: "Prototype",
      categories: ["Hardware", "Audio", "CV"],
      featured: true,
    },
    {
      name: "Robin: An Electronic EP",
      link: "https://drive.google.com/drive/folders/1WAHD1A9JcdC04IjIWpkoEm6IpvZQ-Z9a?usp=sharing",
      description: "Music and electronic sound projects I created as part of Music 101 at Stanford",
      fullDescription: "View the Read me in the google drive folder for more context! <br><br><strong>🎵 <a href='https://drive.google.com/drive/folders/1WAHD1A9JcdC04IjIWpkoEm6IpvZQ-Z9a?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Listen to the EP on Google Drive →</a></strong>",
      image: "ep_cover_copy.JPG",
      role: "Creative",
      tech: "Ableton, Sound Design",
      outcome: "EP Released",
      categories: ["Audio"],
    },
    {
      name: "Where's Mario",
      link: "https://www.youtube.com/watch?v=AMpYp83kBhQ&list=PLXzeYRsYhNoooF1e_A3DTTCj36sSh4dik&index=3",
      description: "Autonomous driving project for Stanford's ME210",
      fullDescription: "A project for Stanford's ME210, Intro to Mechatronics. Configured multiple Arduino Unos with sensors, motors, and actuators to build an autonomous robot chef. (Our battery pack came undone lol) <br><br><strong>🎥 <a href='https://www.youtube.com/watch?v=AMpYp83kBhQ&list=PLXzeYRsYhNoooF1e_A3DTTCj36sSh4dik&index=3' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Watch the demo video →</a></strong>",
      image: "wheresmario.jpeg",
      role: "PM",
      tech: "Arduino, Sensors",
      outcome: "Demo",
      categories: ["PM", "Robotics", "Hardware"],
    },
    {
      name: "Loci: Memory Palace",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7217186134391443456/",
      description: "AR/VR app for memory training",
      fullDescription: "Memory champions don't remember everything in a cursory manner; they use the Loci technique, storing lists in familiar places. Loci: Memory Palace brings this method to life in the AVP. Walk through virtual environments that feel like home and attach objects to train your memory. Our demo features 50 dad jokes scattered throughout the palace, making memorization fun and effective. <br><br><strong>📱 <a href='https://www.linkedin.com/feed/update/urn:li:activity:7217186134391443456/' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>See the demo on LinkedIn →</a></strong> | <a href='https://github.com/shanemion/Loci' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline;'>GitHub</a>",
      image: "loci.png",
      role: "PM",
      tech: "Unity, Apple Vision Pro",
      outcome: "Demo",
      categories: ["PM", "XR"],
    },
    {
      name: "CribU",
      link: "https://forms.gle/GNRKwJzCa6HeBFBs6",
      description: "Find your next internship roommate from your own school",
      fullDescription: "Stanford internship/full-time roommate matching app. Received 750+ impressions on beta announcement day. <br><br><strong>📝 <a href='https://forms.gle/GNRKwJzCa6HeBFBs6' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Sign up for CribU →</a></strong>",
      image: "cribu.png",
      role: "PM",
      tech: "React, Firebase",
      outcome: "750+ Users",
      categories: ["PM", "Full-Stack"],
    },
    {
      name: "AirGtr",
      link: "https://github.com/jacobr12/CS231n-project",
      description: "A gesture warping guitar with no physical instrument",
      fullDescription: "CV-based system that maps hand gestures to MIDI for expressive guitar performance with no physical instrument. <br><br><strong>📂 <a href='https://github.com/jacobr12/CS231n-project' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>View the project on GitHub →</a></strong>",
      image: "airgtr.png",
      role: "Research",
      tech: "Python, CV, MIDI",
      outcome: "Paper",
      categories: ["CV", "Audio"],
    },
    {
      name: "MimicSpeech",
      link: "https://mimicspeech.com",
      description: "A webapp to perfect your accent by mimicking native speakers",
      fullDescription: "Personal project designed to help improve accent and listening ability for foreign languages by recording themselves speak over a natural sounding, AI Text to Speech, presenting visual and calculated feedback. Built from scratch using Create React App. <br><br><strong>🌐 <a href='https://mimicspeech.com' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Try MimicSpeech now →</a></strong>",
      image: "mimicspeech.png",
      role: "PM",
      tech: "React, TTS API",
      outcome: "Shipped",
      categories: ["PM", "Full-Stack", "Audio"],
    },
    {
      name: "TreeHacks 2024 Opening Ceremony Video",
      link: "https://drive.google.com/file/d/1LIeQEh1OhWNXcOG6xWyoAFTOsiDVgv07/view?usp=sharing",
      description: "Directed, filmed, edited, and acted in the opening ceremony video for TreeHacks 10th anniversary",
      fullDescription: "Had a blast on this one, so much fun to make! Give it a watch. <br><br><strong>🎬 <a href='https://drive.google.com/file/d/1LIeQEh1OhWNXcOG6xWyoAFTOsiDVgv07/view?usp=sharing' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Watch the opening ceremony video →</a></strong>",
      image: "opening.png",
      role: "Creative",
      tech: "Video Production",
      outcome: "1K+ Views",
      categories: ["PM"],
    },
    {
      name: "Carbonle",
      link: "https://carbonle.vercel.app/",
      description: "A Wordle for Carbon Emissions per Country",
      fullDescription: "Made for TreeHacks 2025. <br><br><strong>🎮 <a href='https://carbonle.vercel.app/' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Play Carbonle now →</a></strong>",
      image: "carbonle.png",
      role: "SWE",
      tech: "Next.js, Vercel",
      outcome: "Hackathon",
      categories: ["Full-Stack"],
    },
    {
      name: "My Stanford Instagram Takeover",
      link: "https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view",
      description: "Took over the Stanford Instagram for a day!",
      fullDescription: "My junior year, I was a frosh RA in Wilbur Hall (ARROYO!!) and got to take over the Stanford Instagram for a day! <br><br><strong>📹 <a href='https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Watch the takeover video →</a></strong>",
      image: "takeover1.png",
      imageStyle: { objectFit: "contain" },
      role: "Creative",
      tech: "Content Creation",
      outcome: "10K+ Reach",
      categories: ["PM"],
    },
    {
      name: "Joint Detection",
      link: "https://github.com/shanemion/jointdetection",
      description: "CV model for hand joint detection",
      fullDescription: "Wanted to get a footing in future smart wearable tech, so created this joint detection CV model and stored appropriate metrics to gather motion data for smart-ring wearable project I'm working on! <br><br><strong>📂 <a href='https://github.com/shanemion/jointdetection' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>View the project on GitHub →</a></strong>",
      image: "joint_graph.png",
      imageStyle: { objectFit: "contain" },
      role: "Research",
      tech: "Python, OpenCV",
      outcome: "Model",
      categories: ["CV", "Hardware"],
    },
    {
      name: "Pitch to Contact",
      link: "https://pitch-to-contact.web.app/",
      description: "Interactive statistics/ml project for cs109",
      fullDescription: "An extra-credit project I procrastinated for Stanford's CS109, Probability for Computer Scientists. Made in 11 hours. Utilizes the logistic regression machine learning algorithm on a bunch of pitcher related data. Takes into account pitcher arm slot (release position), with a bunch of other happy things found here: 'release_speed', 'release_spin_rate', 'release_pos_x', 'release_pos_z', 'pfx_x', 'pfx_z', 'plate_x', 'plate_z', 'zone' <br><br><strong>🌐 <a href='https://pitch-to-contact.web.app/' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>Try the interactive app →</a></strong> | <a href='https://github.com/shanemion/mlbproject' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline;'>GitHub</a>",
      image: "pitch.png",
      role: "Research",
      tech: "Python, ML",
      outcome: "Shipped",
      categories: ["Full-Stack", "CV"],
    },
    {
      name: "Spotify Looper",
      link: "https://github.com/shanemion/spotifylooper",
      description: "Spotify API project, loop that one OMG part of a really eh song",
      fullDescription: "Spotify Looper is a Python project that leverages the Spotify API to create a customizable looping feature for your favorite tracks. The loop's start and end times can be defined manually in the format MM:SS. This application uses the tkinter library to provide a simple and straightforward user interface. <br><br><strong>📂 <a href='https://github.com/shanemion/spotifylooper' target='_blank' rel='noopener noreferrer' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>View the project on GitHub →</a></strong>",
      image: "spotify.png",
      role: "SWE",
      tech: "Python, Spotify API",
      outcome: "Shipped",
      categories: ["Full-Stack", "Audio"],
    },
    { 
      name: "PressHold: Social App",
      description: "UI Social App Mockup for a LinkTree alternative",
      fullDescription: "I like personalizing online personas, so the way this would be used is pasting a link to your profile on a social app (i.e. Instagram or X), and profile visitors would press and hold on your link to open a preview to see more about your interests!",
      image: "presshold.png",
      role: "PM",
      tech: "Figma, UI/UX",
      outcome: "Mockup",
      categories: ["PM"],
    }
  ];

  const interests = [
    "Music (<a href='https://open.spotify.com/user/clizme?si=5ce5674e27a74435' target='_blank' rel='noopener noreferrer'>Check out my Spotify and my own EP above!</a>)",
    "Instrument Creation and Sound Synthesis",
    "Producing and Songwriting",
    "Baseball and Basketball",
    "Language Learning (learning Mandarin!)",
    "Gym/Calisthenics",
    "Nature/Rain/Outdoors",
    "Wearable Technology and Robotics!!!",
    "AR/VR...",
    "Running",
    "Reading",
    "Ethics/Philosophy (<a href='https://nhseb.org/mission' target='_blank' rel='noopener noreferrer'>Ethics Bowl Alum!</a>)",
    "Calvin and Hobbes :)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/30 dark:from-gray-950 dark:via-gray-900/80 dark:to-gray-800/20 transition-colors duration-500">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900 dark:text-white">Shane Mion</div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('about')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</button>
              <button onClick={() => scrollToSection('projects')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Projects</button>
              <button onClick={() => scrollToSection('interests')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Interests</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</button>
              <a 
                href="https://calendly.com/shanemion/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule Chat
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <img
                  src="shanepfp.jpeg"
                  alt="Shane Mion"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-gray-900/10 dark:to-white/10"></div>
              </div>

              {/* Name, Title, Links */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div>
                  <h1 className="text-4xl font-light text-gray-900 dark:text-white tracking-tight text-center sm:text-left">
                    Shane Mion
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light mt-1 text-center sm:text-left">
                  building across AI, robotics, and product.
                  </p>
                  <p className="text-med text-gray-600 dark:text-gray-400 mt-2 text-center sm:text-left">
                    CS (AI) @ Stanford · prev PM @ TikTok 
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                  <a
                    href="mailto:smion@stanford.edu"
                    className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>smion@stanford.edu</span>
                  </a>
                  <a
                    href="https://github.com/shanemion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/shanemion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1UQWmvfHImD8bnoCvgm1cKPse1pJPJWxev-kxOBJJlX4/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Resume</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>
        </section>

        {/* TreeHacks 2026 Showcase */}
        <section className="max-w-4xl mx-auto px-6 py-3">
          <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20">
            <ParticleBorder />

            {/* 3-column media grid - hide images on mobile, only show video */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 sm:mb-4">
              {/* Image 1 - Hidden on mobile */}
              <div className="hidden sm:block relative overflow-hidden rounded-xl aspect-video bg-gray-100 dark:bg-gray-800">
                <img
                  src="shepherd-1.png"
                  alt="Shepherd Smart Cane"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">Image 1</div>';
                  }}
                />
              </div>
              
              {/* Image 2 - Hidden on mobile */}
              <div className="hidden sm:block relative overflow-hidden rounded-xl aspect-video bg-gray-100 dark:bg-gray-800">
                <img
                  src="shepherd-2.jpg"
                  alt="Shepherd Smart Cane - Stage selfie"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">Image 2</div>';
                  }}
                />
              </div>
              
              {/* YouTube Video Thumbnail - Smaller on mobile */}
              <a
                href="https://www.youtube.com/watch?v=nJ5YjK1-0c0"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden rounded-xl aspect-video bg-gray-100 dark:bg-gray-800 group/video sm:col-span-1 mx-auto w-full max-w-xs sm:max-w-none"
              >
                <img
                  src="https://img.youtube.com/vi/nJ5YjK1-0c0/maxresdefault.jpg"
                  alt="Shepherd Demo Video"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/video:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">Video Thumbnail</div>';
                  }}
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl transform transition-transform group-hover/video:scale-110">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            
            {/* Caption with Devpost link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">TreeHacks 2026 Grand Prize</span> -{" "}
              <span className="font-medium text-gray-900 dark:text-white">Shepherd</span>, a smart cane for the blind:{" "}
              <a
                href="https://devpost.com/software/raising-cane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors border-b border-blue-600/30 hover:border-blue-600"
              >
                Devpost
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-12">About</h2>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                I am currently building! Reach out if you're interested in learning more.
              </p>
              <p>
                This quarter I am joining the Stanford Robotics Center as a researcher with the{" "}
                <a
                  href="https://src.stanford.edu/soar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  SOAR Lab
                </a>{" "}
                working on Human-Robot Interaction and autonomous navigation systems for assistive robotics.
              </p>
              <p>
                Last quarter I took{" "}
                <a
                  href="https://robots-and-arts.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  CS334: Robots and Arts,
                </a>{" "}
                where I learned about Human-Robot Interaction and created an interactive, immersive installation with{" "}
                <a
                  href="https://docs.google.com/document/d/1pDZs6lGY-g5zpCYlL2hRtLJ-xzpNgP6HBfQaALIDmME/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                   Reachy Mini and an Ouija Board.
                </a>
                </p>
                <p>
                I also built a Mixed Reality{" "}
                <a
                  href="https://drive.google.com/file/d/1tHDpeJ5FF2q-eFo_fsniYJAGQDQJ8JoZ/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  "Times Square" experience
                </a>

                 {" "}with the Pico 4 allowing me to turn my walls and tables into scrollable screens.
              </p>
              <p>
                Last summer, I was a Product Manager Intern at{" "}
                <a
                  href="https://www.tiktok.com/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  TikTok
                </a>{" "}
                in Seattle focused on driving long-term CSP e-commerce business development by leveraging the power of recommendation and personalization.
              </p>


          
              <p>
                I also helped lead{" "}
                <a
                  href="https://www.treehacks.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  TreeHacks 10
                </a>{" "}
                - Stanford's annual hackathon and one of the largest in the world.
              </p>

              <p>
                I'm interested in building products that bring extensions to the human experience, whether on the software, hardware, or product side, and am always learning new ways to do so!
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white">Projects</h2>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Projects */}
          {activeFilter === "All" && sortBy === "featured" && (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Featured Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {projects.filter(p => p.featured).map((project, index) => (
                  <ProjectItem key={`featured-${index}`} project={project} featured={true} />
                ))}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">All Projects</h3>
            </>
          )}

          {/* All Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects
              .filter(project => {
                if (activeFilter === "All") return !(activeFilter === "All" && sortBy === "featured" && project.featured);
                return project.categories?.includes(activeFilter);
              })
              .sort((a, b) => {
                if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                if (sortBy === "domain") return (a.categories?.[0] || "").localeCompare(b.categories?.[0] || "");
                return 0; // recent - maintain order
              })
              .map((project, index) => (
                <ProjectItem key={index} project={project} />
              ))}
          </div>
        </section>

        {/* Interests Section */}
        <section id="interests" className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-12">Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((interest, index) => (
              <div
                key={index}
                className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: interest }}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white">Let's Connect</h2>
            
            <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5" />
              <span>smion@stanford.edu</span>
            </div>
            
            <div className="flex justify-center gap-8">
              <a
                href="https://github.com/shanemion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/shanemion/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <Linkedin className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://docs.google.com/document/d/1UQWmvfHImD8bnoCvgm1cKPse1pJPJWxev-kxOBJJlX4/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Resume</span>
              </a>
            </div>
            
            {/* Calendly CTA */}
            <div className="pt-4">
              <a
                href="https://calendly.com/shanemion/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule a Quick Chat</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
