import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    let rafId = 0;
    function raf(time: number) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Handle navigation links
    const links = Array.from(document.querySelectorAll(".header ul a")) as HTMLAnchorElement[];
    const onLinkClick = (event: Event) => {
      if (window.innerWidth <= 1024) {
        return;
      }

      event.preventDefault();
      const elem = event.currentTarget as HTMLAnchorElement;
      const section = elem.getAttribute("data-href");
      if (!section || !lenis) {
        return;
      }

      const target = document.querySelector(section) as HTMLElement | null;
      if (!target) {
        return;
      }

      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.15,
      });
    };

    links.forEach((element) => {
      element.addEventListener("click", onLinkClick);
    });

    // Handle resize
    const onResize = () => {
      lenis?.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      links.forEach((element) => {
        element.removeEventListener("click", onLinkClick);
      });
      window.removeEventListener("resize", onResize);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title navbar-ascii" data-cursor="disable">
          <pre>{`         ▄▄                                                   
 ▄█▀▀▀█▄███                                                   
▄██    ▀███                                                   
▀███▄    ███████▄  ▄█▀██▄  ▄█▀██▄ ▀███▄███ ▄█▀██▄ ▀██▀   ▀██▀ 
  ▀█████▄██    ██ ██   ██ ██   ██   ██▀ ▀▀██   ██   ██   ▄█   
▄     ▀████    ██  ▄█████  ▄█████   ██     ▄█████    ██ ▄█    
██     ████    ██ ██   ██ ██   ██   ██    ██   ██     ███     
█▀█████▀████  ████▄████▀██▄████▀██▄████▄  ▀████▀██▄    █      
                                                               `}</pre>
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#projects" href="#projects">
              <HoverLinks text="PROJECTS" />
            </a>
          </li>
          <li>
            <a data-href="#blog" href="#blog">
              <HoverLinks text="BLOG" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
