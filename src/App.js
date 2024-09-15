import React, { useState } from "react";

const ProjectItem = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li style={{ marginBottom: "10px" }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        -{" "}
        <span
          style={{ color: "#FF0000", fontSize: "0.9em", marginRight: "5px" }}
        >
          [info]
        </span>
        <a
          href={project.link}
          style={{ color: "#0000FF", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.name}
        </a>
        - {project.description}
      </div>
      {isExpanded && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: project.fullDescription }}></p>
          {project.image && (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <img
                src={project.image}
                alt={project.name}
                style={{ ...(project.imageStyle || { maxWidth: "100%", height: "auto" }), marginTop: "10px" }}
              />
            </a>
          )}
        </div>
      )}
    </li>
  );
};

const App = () => {
  const projects = [
    {
      name: "MimicSpeech",
      link: "https://mimicspeech.com",
      description:
        "A webapp to perfect your accent by mimicking native speakers",
      fullDescription:
        "Personal project designed to help improve accent and listening ability for foreign languages by recording themselves speak over a natural sounding, AI Text to Speech, presenting visual and calculated feedback. Built from scratch using Create React App",
      image: "mimicspeech.png",
    },
    {
      name: "TreeHacks 2024 Opening Ceremony Video",
      link: "https://drive.google.com/file/d/1LIeQEh1OhWNXcOG6xWyoAFTOsiDVgv07/view?usp=sharing",
      description:
        "Directed, filmed, edited, and acted in the opening ceremony video for TreeHacks 10th anniversary",
      fullDescription:
        "Had a blast on this one, so much fun to make! Give it a watch.",
      // please resize the following image to be smaller:
      image: "treehacks.png",
    },
    {
      name: "My Stanford Instagram Takeover",
      link: "https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view",
      description: "Took over the Stanford Instagram for a day!",
      fullDescription:
        "I'm a frosh RA in Wilbur Hall (ARROYO!!) and got to take over the Stanford Instagram for a day! Check out the video!",
      image: "takeover.png",
      imageStyle: { maxWidth: "300px", height: "auto" },

    },
    {
      name: "Joint Detection",
      link: "https://github.com/shanemion/jointdetection",
      description: "CV model for hand joint detection",
      fullDescription:
        "Wanted to get a footing in future smart wearable tech, so created this joint detection CV model and stored appropriate metrics to gather motion data for smart-ring wearable project I'm working on!",
    },
    {
      name: "Loci: Memory Palace",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7217186134391443456/",
      description: "AR/VR app for memory training",
      fullDescription:
        "Memory champions don't remember everything in a cursory manner; they use the Loci technique, storing lists in familiar places. Loci: Memory Palace brings this method to life in the AVP. Walk through virtual environments that feel like home and attach objects to train your memory. Our demo features 50 dad jokes scattered throughout the palace, making memorization fun and effective. <br><br>Check out the <a href='https://github.com/shanemion/Loci' target='_blank' rel='noopener noreferrer'>GitHub</a> for more details.",
      image: "loci.png",
    },
    {
      name: "Pitch to Contact",
      link: "https://pitch-to-contact.web.app/",
      description: "interactive statistics/ml project for cs109",
      fullDescription:
        "An extra-credit project I procrastinated for Stanford's CS109, Probability for Computer Scientists. Made in 11 hours. Utilizes the logistic regression machine learning algorithm on a bunch of pitcher related data. Takes into account pitcher arm slot (release position), with a bunch of other happy things found here: 'release_speed', 'release_spin_rate', 'release_pos_x', 'release_pos_z', 'pfx_x', 'pfx_z', 'plate_x', 'plate_z', 'zone' <br><br>Check out <a href='https://github.com/shanemion/mlbproject' target='_blank' rel='noopener noreferrer'>the GitHub</a>.",
      image: "pitch.png",
    },
    {
      name: "Spotify Looper",
      link: "https://github.com/shanemion/spotifylooper",
      description: "Spotify API project, loop that one OMG part of a really eh song",
      fullDescription:
        "Spotify Looper is a Python project that leverages the Spotify API to create a customizable looping feature for your favorite tracks. The loop's start and end times can be defined manually in the format MM:SS. This application uses the tkinter library to provide a simple and straightforward user interface.",
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
    "Music (<a href='https://open.spotify.com/user/clizme?si=5ce5674e27a74435' target='_blank' rel='noopener noreferrer'>Check out my Spotify!</a>)",
    "Baseball",
    "Language Learning (learning Mandarin!)",
    "Gym/Calisthenics",
    "Nature/Rain/Outdoors",
    "Wearable Tech",
    "AR/VR",
    "Running",
    "Reading",
    "Ethics/Philosophy (<a href='https://nhseb.org/mission' target='_blank' rel='noopener noreferrer'>Ethics Bowl Alum!</a>)",
    "Calvin and Hobbes :)"

  ];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "80px auto",
        fontFamily:
          "Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        lineHeight: 1.6,
        color: "#333",
        fontWeight: "500",
      }}
    >
      <p style={{ fontSize: "24px", marginBottom: "20px" }}>Shane Mion</p>

      <p style={{ marginBottom: "15px" }}>
        I am currently at{" "}
        <a
          href="https://en.valuenex.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0000FF", textDecoration: "none" }}
        >
          VALUENEX
        </a>{" "}
        as a Data Analyst / SWE working on their new and improved visualization product, Radar 2.0. 
      </p>

      <p style={{ marginBottom: "15px" }}>
        I am also a frosh Resident Assistant this year in Wilbur Hall at Stanford University!! Check out the takeover I got to do for the official Stanford instagram <a href="https://drive.google.com/file/d/1UjxB6d0Y-YdUFxoEK_tqRGqgdodJKyca/view" target="_blank" rel="noopener noreferrer" style={{ color: "#0000FF", textDecoration: "none" }}>here</a>!
      </p>

      <p style={{ marginBottom: "15px" }}>
        I just finished interning abroad in Singapore at{" "}
        <a
          href="https://www.advance.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0000FF", textDecoration: "none" }}
        >
          AdvanceAI
        </a>{" "}
        as a Product Manager on a TikTok Shop client project.
      </p>

      <p style={{ marginBottom: "15px" }}>
        I also helped lead{" "}
        <a
          href="https://www.treehacks.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0000FF", textDecoration: "none" }}
        >
          TreeHacks
        </a>{" "}
        - Stanford's annual hackathon and one of the largest in the world.
      </p>

      <p style={{ marginBottom: "15px" }}>
        In addition to PM I've worked in full-stack dev, AR/VR, ML research, data analytics and
        marketing.
      </p>

      <p style={{ marginBottom: "20px", color: "#666" }}>smion@stanford.edu</p>

      <div style={{ marginBottom: "30px" }}>
        <a
          href="https://github.com/shanemion"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: "10px", textDecoration: "none" }}
        >
          [GitHub]
        </a>
        <a
          href="https://www.linkedin.com/in/shanemion/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: "10px", textDecoration: "none" }}
        >
          [LinkedIn]
        </a>
        <a
          href="resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: "10px", textDecoration: "none" }}
        >
          [Resume]
        </a>
      </div>

      <p style={{ fontSize: "16px", marginTop: "30px", marginBottom: "15px" }}>
        Projects (no particular order)
      </p>
      <ul style={{ listStyleType: "none", padding: 0, marginLeft: "20px" }}>
        {projects.map((project, index) => (
          <ProjectItem key={index} project={project} />
        ))}
      </ul>

      <p style={{ fontSize: "16px", marginTop: "30px", marginBottom: "15px" }}>
        Interests
      </p>
      <ul
        style={{
          marginTop: "10px",
          listStyleType: "none",
          paddingLeft: "20px",
        }}
      >
        {interests.map((interest, index) => (
          <li
            key={index}
            style={{ marginBottom: "5px" }}
            dangerouslySetInnerHTML={{ __html: `- ${interest}` }}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
