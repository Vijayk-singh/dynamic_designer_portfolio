export const initialProjects = [
  {
    id: "proj-1",
    title: "Cyberpunk Neon Streets - Cinematic Trailer",
    category: "Video Editing",
    description: "A high-octane cinematic teaser exploring neon-drenched dystopian streets. Developed with custom anamorphic color grading (teal & orange), atmospheric sound design, and rhythm-based action cuts to elevate the narrative tone.",
    image: "/images/video_thumb.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    frameType: "video",
    frameStyle: "cinema-viewfinder", // 'cinema-bars' or 'cinema-viewfinder'
    likes: 342,
    views: 12400,
    tools: ["Adobe Premiere Pro", "DaVinci Resolve", "Dehancer", "After Effects"],
    date: "May 2026",
    role: "Lead Editor & Colorist",
    client: "Personal Spec Ad"
  },
  {
    id: "proj-2",
    title: "Quantum Fluid dynamics & Chromatic Loops",
    category: "Motion Graphics",
    description: "An abstract 3D simulation exploring metallic fluid friction, gravity streams, and neon particle turbulence. Features a complex particle setup rendered with Octane, synchronized with a synthetic digital audio beat.",
    image: "/images/motion_thumb.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    frameType: "motion",
    frameStyle: "timeline-workspace", // timeline controls with interactive speed, scrub, and waveform
    likes: 521,
    views: 18900,
    tools: ["Cinema 4D", "Houdini", "Redshift Render", "After Effects"],
    date: "April 2026",
    role: "3D Motion Designer",
    client: "Digital Art Collective"
  },
  {
    id: "proj-3",
    title: "Volt Finance - Mobile Glassmorphism App",
    category: "UI/UX Design",
    description: "A futuristic mobile crypto-wallet dashboard featuring ultra-modern dark glassmorphism styling, glowing gradient graphs, and crisp micro-interactions. Designed with optimal user journeys and thumb-friendly quick actions.",
    image: "/images/ui_design.png",
    frameType: "uiux",
    frameStyle: "iphone-mockup", // renders interactive mobile wrapper
    likes: 418,
    views: 9800,
    tools: ["Figma", "Adobe Illustrator", "Principle", "Spline 3D"],
    date: "March 2026",
    role: "Product & UI/UX Designer",
    client: "Volt Fintech Inc.",
    interactiveData: {
      balance: "$48,765.20",
      change: "+4.8%",
      transactions: [
        { label: "Crypto Buy (BTC)", amount: "+$500.00", date: "Aug 31" },
        { label: "Salary Deposit", amount: "+$4,200.00", date: "Aug 31" },
        { label: "Utility Bill Pay", amount: "-$150.75", date: "Aug 31" }
      ]
    }
  },
  {
    id: "proj-4",
    title: "Bauhaus Centennial - Commemorative Poster",
    category: "Graphic Design",
    description: "An anniversary graphic print layout inspired by the grid-oriented constructivism of the Bauhaus school. Focuses on asymmetrical balance, primary color blocking, and geometric typography.",
    image: "/images/poster_design.png",
    frameType: "graphic",
    frameStyle: "canvas-inspector", // zoom, magnifier, and color swatches
    likes: 289,
    views: 7200,
    tools: ["Adobe Illustrator", "InDesign", "CorelDraw"],
    date: "Jan 2026",
    role: "Graphic Designer",
    client: "Design Museum Berlin",
    swatches: [
      { name: "Bauhaus Red", hex: "#E41C23" },
      { name: "Deep Cobalt", hex: "#1B365D" },
      { name: "Lemon Yellow", hex: "#F2C811" },
      { name: "Cream Canvas", hex: "#EDE9DC" },
      { name: "Charcoal Black", hex: "#111111" }
    ]
  }
];
