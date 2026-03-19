import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
  whiteIcon?: boolean;
}

const techStack: TechItem[][] = [
  [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://python.org" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", url: "https://react.dev" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "Swift", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg", url: "https://swift.org" },
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg", url: "https://vite.dev" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", url: "https://nodejs.org" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", url: "https://tailwindcss.com" },
  ],
  [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", url: "https://git-scm.com" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", url: "https://github.com", whiteIcon: true },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", url: "https://figma.com" },
    { name: "SwiftUI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg", url: "https://developer.apple.com/xcode/swiftui/" },
    { name: "REST APIs", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg", url: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
  ],
];

const TechStackNew = () => {
  return (
    <div className="techstack-new">
      <div className="techstack-backdrop"></div>

      <div className="techstack-content">
        <h2>Tech Stack</h2>
        
        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img 
                    src={tech.icon} 
                    alt={tech.name} 
                    loading="lazy" 
                    style={tech.whiteIcon ? { filter: 'brightness(0) invert(1)' } : {}}
                  />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
