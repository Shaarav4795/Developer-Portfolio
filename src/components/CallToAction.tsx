import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link to="/projects" className="cta-btn cta-btn-play" data-cursor="disable">
          View Projects →
        </Link>
        
        <a 
          href={`mailto:${config.contact.email}`}
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Email Me →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
