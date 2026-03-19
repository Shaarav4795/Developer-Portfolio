import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import BlogPosts from "./BlogPosts";
import SEO from "./SEO";
import setSplitText from "./utils/splitText";
import { config } from "../config";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  useEffect(() => {
    let cancelled = false;
    let rafId: number | null = null;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Scroll to section stored by BlogPost "Back to Home" button
    const returnSection = sessionStorage.getItem("return-scroll-to");
    if (returnSection) {
      let attempts = 0;
      const attemptScroll = () => {
        if (cancelled) {
          return;
        }

        const target = document.getElementById(returnSection);
        if (target) {
          sessionStorage.removeItem("return-scroll-to");
          const offset = 110;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          const targetTop = Math.max(top, 0);
          window.scrollTo({ top: targetTop, left: 0, behavior: "smooth" });
          return;
        }

        attempts += 1;
        if (attempts <= 180) {
          rafId = requestAnimationFrame(attemptScroll);
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      rafId = requestAnimationFrame(attemptScroll);
      return () => {
        cancelled = true;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }

    // Fallback: scroll to URL hash if present (e.g. from BlogIndex back link)
    const hash = window.location.hash;
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    rafId = requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      const offset = 110;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      const finalTop = Math.max(targetTop, 0);
      window.scrollTo({ top: finalTop, left: 0, behavior: "smooth" });
    });

    return () => {
      cancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const homeTitle = `${config.developer.fullName} | ${config.developer.title}`;
  const homeDescription = config.developer.description;

  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: config.developer.fullName,
      jobTitle: `${config.developer.title} / ${config.developer.secondaryTitle}`,
      url: "https://shaarav.xyz/",
      image: `https://shaarav.xyz${config.developer.photo}`,
      sameAs: config.socialLinks.map((link) => link.href)
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${config.developer.fullName} Portfolio`,
      url: "https://shaarav.xyz/",
      description: homeDescription
    }
  ];

  return (
    <div className="container-main">
      <SEO
        title={homeTitle}
        description={homeDescription}
        image={config.developer.photo}
        keywords={[
          "Shaarav Arya",
          "frontend developer portfolio",
          "React developer",
          "three.js portfolio",
          "Python developer"
        ]}
        structuredData={homeStructuredData}
      />
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <BlogPosts />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
