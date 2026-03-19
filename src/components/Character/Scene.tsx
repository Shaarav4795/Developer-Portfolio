import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const loadedCharacterRef = useRef<THREE.Object3D | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      let isMounted = true;
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (!isMounted || !gltf) {
          return;
        }

        const animations = setAnimations(gltf);
        let disposeHover: (() => void) | undefined;
        if (hoverDivRef.current) {
          disposeHover = animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        const loadedCharacter = gltf.scene;
        loadedCharacterRef.current = loadedCharacter;
        scene.add(loadedCharacter);
        headBone = loadedCharacter.getObjectByName("spine006") || null;
        screenLight = loadedCharacter.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          if (!isMounted) {
            return;
          }

          setTimeout(() => {
            if (!isMounted) {
              return;
            }

            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });

        if (!isMounted && disposeHover) {
          disposeHover();
        }
      });

      const onResize = () => {
        const loadedCharacter = loadedCharacterRef.current;
        if (!loadedCharacter) {
          return;
        }
        handleResize(renderer, camera, canvasDiv, loadedCharacter);
      };
      window.addEventListener("resize", onResize);

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };

      let isTouchActive = false;
      const onTouchMove = (event: TouchEvent) => {
        if (!isTouchActive) {
          return;
        }
        handleTouchMove(event, (x, y) => (mouse = { x, y }));
      };

      const onTouchStart = () => {
        isTouchActive = true;
      };

      const onTouchEnd = () => {
        isTouchActive = false;
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      let animationFrameId = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        isMounted = false;
        cancelAnimationFrame(animationFrameId);
        progress.clear();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("mousemove", onMouseMove);

        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchmove", onTouchMove);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }

        loadedCharacterRef.current = null;
        scene.clear();
        renderer.dispose();
        if (canvasDiv.current && canvasDiv.current.contains(renderer.domElement)) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
