import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Moon, Sun, Mail, Github, Linkedin, FileText } from "lucide-react";

const ProjectItem = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20 hover:-translate-y-1">
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-tight">
            {project.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {project.description}
        </p>
        
        {isExpanded && (
          <div className="mb-6 space-y-6 animate-in fade-in duration-300">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.fullDescription }}></div>
            {project.image && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group/image">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-auto rounded-xl transition-transform duration-300 group-hover/image:scale-[1.02]"
                  style={project.imageStyle}
                />
              </a>
            )}
          </div>
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/btn"
        >
          {isExpanded ? "Show Less" : "Show More"}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const projects = [
    {
      name: "Aetherglass: Teensy Smart Glasses Audio Synth System",
      description: "A wearable smart glasses audio system with cameras, IMU, and mic input from scratch",
      fullDescription: "Designed and built a wearable smart glasses audio system from scratch, owning all hardware, embedded software, and product decisions to map motion, mic input, embedded TinyML CV, and touch into real-time ambient audio effects. Sound demo coming sept when I get home lol, it works!",
      image: "hold.jpeg",
    },
    {
      name: "Robin: An Electronic EP",
      link: "https://drive.google.com/drive/folders/1WAHD1A9JcdC04IjIWpkoEm6IpvZQ-Z9a?usp=sharing",
      description: "Music and electronic sound projects I created as part of Music 101 at Stanford",
      fullDescription: "View the Read me in the google drive folder for more context!",
      image: "ep_cover_copy.JPG",
    },
    {
      name: "Where's Mario",
      link: "https://www.youtube.com/watch?v=AMpYp83kBhQ&list=PLXzeYRsYhNoooF1e_A3DTTCj36sSh4dik&index=3",
      description: "Autonomous driving project for Stanford's ME210",
      fullDescription: "A project for Stanford's ME210, Intro to Mechatronics. Configured multiple Arduino Unos with sensors, motors, and actuators to build an autonomous robot chef. Click to check out the video! (our battery pack came undone lol)",
      image: "wheresmario.jpeg",
    },
    {
      name: "Loci: Memory Palace",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7217186134391443456/",
      description: "AR/VR app for memory training",
      fullDescription: "Memory champions don't remember everything in a cursory manner; they use the Loci technique, storing lists in familiar places. Loci: Memory Palace brings this method to life in the AVP. Walk through virtual environments that feel like home and attach objects to train your memory. Our demo features 50 dad jokes scattered throughout the palace, making memorization fun and effective. <br><br>Check out the <a href='https://github.com/shanemion/Loci' target='_blank' rel='noopener noreferrer'>GitHub</a> for more details.",
      image: "loci.png",
    },
    {
      name: "CribU",
      link: "https://forms.gle/GNRKwJzCa6HeBFBs6",
      description: "Find your next internship roommate from your own school",
      fullDescription: "Stanford internship/full-time roommate matching app. Received 750+ impressions on beta announcement day.",
      image: "cribu.png",
    },
    {
      name: "AirGtr",
      link: "https://github.com/jacobr12/CS231n-project",
      description: "A gesture warping guitar with no physical instrument",
      fullDescription: "CV-based system that maps hand gestures to MIDI for expressive guitar performance with no physical instrument.",
      image: "airgtr.png",
    },
    {
      name: "MimicSpeech",
      link: "https://mimicspeech.com",
      description: "A webapp to perfect your accent by mimicking native speakers",
      fullDescription: "Personal project designed to help improve accent and listening ability for foreign languages by recording themselves speak over a natural sounding, AI Text to Speech, presenting visual and calculated feedback. Built from scratch using Create React App",
      image: "mimicspeech.png",
    },
    {
      name: "TreeHacks 2024 Opening Ceremony Video",
      link: "https://drive.google.com/file/d/1LIeQEh1OhWNXcOG6xWyoAFTOsiDVgv07/view?usp=sharing",
      description: "Directed, filmed, edited, and acted in the opening ceremony video for TreeHacks 10th anniversary",
      fullDescription: "Had a blast on this one, so much fun to make! Give it a watch.",
      image: "opening.png",
    },
    {
      name: "Carbonle",
      link: "https://carbonle.vercel.app/",
      description: "A Wordle for Carbon Emissions per Country",
      fullDescription: "Made for TreeHacks 2025",
      image: "carbonle.png",
    },
    {
      name: "My Stanford Instagram Takeover",
      link: "https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view",
      description: "Took over the Stanford Instagram for a day!",
      fullDescription: "I'm a frosh RA in Wilbur Hall (ARROYO!!) and got to take over the Stanford Instagram for a day! Check out the video!",
      image: "takeover.png",
      imageStyle: { maxWidth: "300px", height: "auto" },
    },
    {
      name: "Joint Detection",
      link: "https://github.com/shanemion/jointdetection",
      description: "CV model for hand joint detection",
      fullDescription: "Wanted to get a footing in future smart wearable tech, so created this joint detection CV model and stored appropriate metrics to gather motion data for smart-ring wearable project I'm working on!",
    },
    {
      name: "Pitch to Contact",
      link: "https://pitch-to-contact.web.app/",
      description: "Interactive statistics/ml project for cs109",
      fullDescription: "An extra-credit project I procrastinated for Stanford's CS109, Probability for Computer Scientists. Made in 11 hours. Utilizes the logistic regression machine learning algorithm on a bunch of pitcher related data. Takes into account pitcher arm slot (release position), with a bunch of other happy things found here: 'release_speed', 'release_spin_rate', 'release_pos_x', 'release_pos_z', 'pfx_x', 'pfx_z', 'plate_x', 'plate_z', 'zone' <br><br>Check out <a href='https://github.com/shanemion/mlbproject' target='_blank' rel='noopener noreferrer'>the GitHub</a>.",
      image: "pitch.png",
    },
    {
      name: "Spotify Looper",
      link: "https://github.com/shanemion/spotifylooper",
      description: "Spotify API project, loop that one OMG part of a really eh song",
      fullDescription: "Spotify Looper is a Python project that leverages the Spotify API to create a customizable looping feature for your favorite tracks. The loop's start and end times can be defined manually in the format MM:SS. This application uses the tkinter library to provide a simple and straightforward user interface.",
      image: "spotify.png",
    },
    { 
      name: "PressHold: Social App",
      description: "UI Social App Mockup for a LinkTree alternative",
      fullDescription: "I like personalizing online personas, so the way this would be used is pasting a link to your profile on a social app (i.e. Instagram or X), and profile visitors would press and hold on your link to open a preview to see more about your interests!",
      image: "presshold.png",
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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="shanepfp.jpeg"
                  alt="Shane Mion"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-gray-900/10 dark:to-white/10"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-light text-gray-900 dark:text-white tracking-tight">
                Shane Mion
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                Product Manager & Developer | CS AI @ Stanford
              </p>
            </div>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent mx-auto"></div>
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
                href="resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-12">About</h2>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                This summer, I'll be a Product Manager Intern at{" "}
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
                I've recently been working on a project to create a wearable smart glasses audio system from scratch, owning all hardware, embedded software, and product decisions to map motion, mic input, embedded TinyML CV, and touch into real-time ambient audio effects.
              </p>

              <p>
                I was previously at{" "}
                <a
                  href="https://www.valuenex.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  VALUENEX
                </a>{" "}
                as a SWE working on their new and improved visualization product, Radar 2.0.
              </p>

              <p>
                I am also a frosh Resident Assistant this year in Wilbur Hall at Stanford University!! Check out the{" "}
                <a
                  href="https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  takeover I got to do for the official Stanford instagram here!
                </a>
              </p>

              <p>
                I interned abroad in Singapore in 2024 at{" "}
                <a
                  href="https://www.advance.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  AdvanceAI
                </a>{" "}
                as a Product Manager on a TikTok Shop client project.
              </p>

              <p>
                I also helped lead{" "}
                <a
                  href="https://www.treehacks.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  TreeHacks
                </a>{" "}
                - Stanford's annual hackathon and one of the largest in the world.
              </p>

              <p>
                In addition to PM I've worked in full-stack dev, AR/VR, ML research, data analytics and marketing.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectItem key={index} project={project} />
            ))}
          </div>
        </section>

        {/* Interests Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
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
        <section className="max-w-4xl mx-auto px-6 py-24">
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
                href="resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;