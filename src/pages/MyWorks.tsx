import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { config } from "../config";
import "./MyWorks.css";

const MyWorks = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleBackToHome = () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    sessionStorage.setItem("return-scroll-to", "projects");
    navigate("/");
  };

  const totalProjects = config.projects.length;

  return (
    <div className="myworks-page">
      <SEO
        title="Projects | Shaarav Arya"
        description="Explore selected projects by Shaarav Arya across web, iOS, Python, automation, and AI-assisted product tooling."
        image={config.projects[0]?.image || config.developer.photo}
        keywords={[
          "Shaarav Arya projects",
          "React projects",
          "SwiftUI app developer",
          "Python automation projects",
          "portfolio case studies"
        ]}
      />
      <div className="myworks-noise"></div>
      <div className="myworks-header">
        <button type="button" onClick={handleBackToHome} className="back-button" data-cursor="disable">
          ← Back to Home
        </button>
        <div className="myworks-kicker">Projects</div>
        <h1>
          Built to be <span>useful</span>
        </h1>
        <p>
          A sharper view of the tools, experiments, and product ideas I have shipped so far.
        </p>
        <div className="myworks-summary">
          <div>
            <strong>{totalProjects}</strong>
            <span>featured builds</span>
          </div>
          <div>
            <strong>Web, iOS, Python</strong>
            <span>main focus areas</span>
          </div>
        </div>
      </div>

      <div className="myworks-list">
        {config.projects.map((project, index) => (
          <article
            className={`project-panel ${index % 2 === 1 ? "project-panel-reverse" : ""}`}
            key={project.id}
            data-cursor="disable"
          >
            <div className="project-panel-visual">
              <div className="project-panel-number">0{index + 1}</div>
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-panel-copy">
              <div className="project-panel-topline">
                <span className="project-panel-category">{project.category}</span>
                <span className="project-panel-index">Project {index + 1}</span>
              </div>
              <h2>{project.title}</h2>
              <p className="project-panel-description">{project.description}</p>
              <div className="project-panel-tags">
                {project.technologies.split(",").map((item) => (
                  <span key={`${project.id}-${item.trim()}`}>{item.trim()}</span>
                ))}
              </div>
              <div className="project-panel-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live Site
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    Repository
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
