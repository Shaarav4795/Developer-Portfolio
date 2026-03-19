import {
  FaDiscord,
  FaGithub,
  FaXbox,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { MdEmail } from "react-icons/md";
import { useEffect, useRef } from "react";
import HoverLinks from "./HoverLinks";
import { config } from "../config";

const socialIconMap = {
  github: <FaGithub />,
  discord: <FaDiscord />,
  email: <MdEmail />,
  xbox: <FaXbox />,
};

const SocialIcons = () => {
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const cleanups = itemRefs.current.map((item) => {
      if (!item) return () => undefined;

      const link = item.querySelector("a") as HTMLElement | null;
      if (!link) return () => undefined;

      let frameId = 0;
      const state = {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        targetX: 0,
        targetY: 0,
        targetRotate: 0,
        targetScale: 1,
      };

      const animate = () => {
        state.x += (state.targetX - state.x) * 0.16;
        state.y += (state.targetY - state.y) * 0.16;
        state.rotate += (state.targetRotate - state.rotate) * 0.14;
        state.scale += (state.targetScale - state.scale) * 0.18;

        link.style.setProperty("--siX", `${state.x.toFixed(2)}px`);
        link.style.setProperty("--siY", `${state.y.toFixed(2)}px`);
        link.style.setProperty("--siRotate", `${state.rotate.toFixed(2)}deg`);
        link.style.setProperty("--siScale", state.scale.toFixed(3));

        const resting =
          Math.abs(state.x - state.targetX) < 0.08 &&
          Math.abs(state.y - state.targetY) < 0.08 &&
          Math.abs(state.rotate - state.targetRotate) < 0.08 &&
          Math.abs(state.scale - state.targetScale) < 0.01;

        frameId = resting ? 0 : requestAnimationFrame(animate);
      };

      const requestAnimation = () => {
        if (!frameId) {
          frameId = requestAnimationFrame(animate);
        }
      };

      const onPointerEnter = () => {
        state.targetScale = 1.08;
        item.style.setProperty("--siGlow", "18px");
        requestAnimation();
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);

        state.targetX = Math.max(-12, Math.min(12, dx * 0.28));
        state.targetY = Math.max(-12, Math.min(12, dy * 0.22));
        state.targetRotate = Math.max(-8, Math.min(8, dx * 0.22));
        state.targetScale = 1.18;
        item.style.setProperty(
          "--siGlow",
          `${Math.min(28, Math.max(12, Math.hypot(dx, dy) * 0.24)).toFixed(0)}px`
        );
        requestAnimation();
      };

      const onPointerLeave = () => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetRotate = 0;
        state.targetScale = 1;
        item.style.setProperty("--siGlow", "0px");
        requestAnimation();
      };

      item.addEventListener("pointerenter", onPointerEnter);
      item.addEventListener("pointermove", onPointerMove);
      item.addEventListener("pointerleave", onPointerLeave);

      return () => {
        item.removeEventListener("pointerenter", onPointerEnter);
        item.removeEventListener("pointermove", onPointerMove);
        item.removeEventListener("pointerleave", onPointerLeave);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" id="social">
        {config.socialLinks.map((link, index) => {
          const icon = socialIconMap[link.kind as keyof typeof socialIconMap];
          const isEmail = link.kind === "email";

          return (
            <span
              key={link.label}
              className="social-orb"
              data-cursor="icons"
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
            >
              <a
                href={link.href}
                target={isEmail ? undefined : "_blank"}
                rel={isEmail ? undefined : "noopener noreferrer"}
                aria-label={link.label}
              >
                {icon}
              </a>
            </span>
          );
        })}
      </div>
      <a className="resume-button" href={`mailto:${config.contact.email}`}>
        <HoverLinks text="EMAIL" />
        <span>
          <MdEmail />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
