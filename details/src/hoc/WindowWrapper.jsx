import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react';
import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {

  const Wrapped = (props) => {
    const { focusWindow, windows, minimizeWindow, closeWindow, saveWindowPosition } = useWindowStore();
    const resolvedKey = props.windowKeyOverride || windowKey;
    const winState = windows[resolvedKey];

    if (!winState) return null;

    const { isOpen, isMaximized, isMinimized, zIndex, savedPosition, data, cascadeIndex } = winState;
    const isInfoMode = data?.mode === "info" || !!data?.metadata;
    const ref = useRef(null);
    const prevMaximizedRef = useRef(isMaximized);

    // open animation
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      el.style.display = 'block';

      // Apply a cascade offset for newly opened multi-instance windows
      if (!savedPosition && !isMaximized && !isInfoMode && Number.isFinite(cascadeIndex)) {
        const offset = 24 * (cascadeIndex % 6);
        el.style.marginLeft = `${offset}px`;
        el.style.marginTop = `${offset}px`;
      } else {
        el.style.marginLeft = '';
        el.style.marginTop = '';
      }

      // If restoring from minimize and we have saved position, restore it
      if (savedPosition) {
        el.style.top = savedPosition.top;
        el.style.left = savedPosition.left;
        el.style.width = savedPosition.width;
        el.style.height = savedPosition.height;
        if (savedPosition.transform) el.style.transform = savedPosition.transform;
      }

      gsap.fromTo(el, {
        scale: 0.8,
        opacity:0, 
        y: 40,
      },{
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out'
      })
    }, [isOpen]);

    // draggable handling (disable when maximized or closed)
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      if (!isOpen || isMaximized) {
        // ensure any previous Draggable is killed
        Draggable.get(el)?.kill();
        return;
      }

      // Get navbar height for top boundary (typically around 50px)
      const navbarHeight = 50;

      const [ instance ] = Draggable.create(el, {
        onPress: () => focusWindow(resolvedKey),
        trigger: el.querySelector('.window-drag-handle'),
        ignore: "input[type='range'], button, .sliders",
        bounds: {
          top: navbarHeight,
          left: -el.offsetWidth + 100, // Allow partial off-screen left but keep 100px visible
          right: window.innerWidth - 100, // Keep at least 100px visible on right
          bottom: window.innerHeight - 50, // Keep 50px visible at bottom
        },
        onDrag: function() {
          // Recalculate bounds on drag to handle window resize
          const rect = el.getBoundingClientRect();
          if (rect.top < navbarHeight) {
            gsap.set(el, { top: navbarHeight });
          }
        }
      })

      return () => instance.kill();
    }, [isOpen, isMaximized, focusWindow]);

    useLayoutEffect(() => {
      const el = ref.current;
      if(!el) return;

      // visibility based on open state
      el.style.display = isOpen ? 'block' : 'none';

      // Animate fullscreen transitions
      const wasMaximized = prevMaximizedRef.current;
      prevMaximizedRef.current = isMaximized;

      // toggle maximized styles
      if (isMaximized) {
        // save current position/size once
        if (!el.dataset.prevTop) {
          const cs = window.getComputedStyle(el);
          el.dataset.prevTop = cs.top;
          el.dataset.prevLeft = cs.left;
          el.dataset.prevWidth = cs.width;
          el.dataset.prevHeight = cs.height;
          el.dataset.prevPosition = cs.position;
          el.dataset.prevTransform = cs.transform;
          el.dataset.prevMaxWidth = cs.maxWidth;
          el.dataset.prevRight = cs.right;
          el.dataset.prevBottom = cs.bottom;
        }

        // Animate to fullscreen
        if (!wasMaximized) {
          gsap.to(el, {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100dvw',
            height: '100dvh',
            maxWidth: 'none',
            transform: 'none',
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: () => {
              el.style.position = 'fixed';
              el.style.top = '0';
              el.style.left = '0';
              el.style.right = '0';
              el.style.bottom = '0';
              el.style.width = '100dvw';
              el.style.height = '100dvh';
              el.style.maxWidth = 'none';
              el.style.transform = 'none';
            }
          });
        } else {
          // Already maximized, just set styles
          el.style.position = 'fixed';
          el.style.top = '0';
          el.style.left = '0';
          el.style.right = '0';
          el.style.bottom = '0';
          el.style.width = '100dvw';
          el.style.height = '100dvh';
          el.style.maxWidth = 'none';
          el.style.transform = 'none';
        }
      } else {
        // restore to previous size/position if saved
        if (el.dataset.prevTop) {
          const targetStyles = {
            top: el.dataset.prevTop,
            left: el.dataset.prevLeft,
            width: el.dataset.prevWidth,
            height: el.dataset.prevHeight,
            position: el.dataset.prevPosition || 'absolute',
            maxWidth: el.dataset.prevMaxWidth || '',
            transform: el.dataset.prevTransform || '',
            right: '',
            bottom: '',
          };

          // Animate from fullscreen
          if (wasMaximized) {
            gsap.to(el, {
              ...targetStyles,
              duration: 0.35,
              ease: 'power2.inOut',
              onComplete: () => {
                el.style.top = targetStyles.top;
                el.style.left = targetStyles.left;
                el.style.width = targetStyles.width;
                el.style.height = targetStyles.height;
                if (targetStyles.position) el.style.position = targetStyles.position;
                if (targetStyles.maxWidth) el.style.maxWidth = targetStyles.maxWidth;
                if (targetStyles.transform) el.style.transform = targetStyles.transform;
                el.style.right = '';
                el.style.bottom = '';
              }
            });
          } else {
            el.style.top = targetStyles.top;
            el.style.left = targetStyles.left;
            el.style.width = targetStyles.width;
            el.style.height = targetStyles.height;
            if (targetStyles.position) el.style.position = targetStyles.position;
            if (targetStyles.maxWidth) el.style.maxWidth = targetStyles.maxWidth;
            if (targetStyles.transform) el.style.transform = targetStyles.transform;
            el.style.right = '';
            el.style.bottom = '';
          }

          // cleanup
          delete el.dataset.prevTop;
          delete el.dataset.prevLeft;
          delete el.dataset.prevWidth;
          delete el.dataset.prevHeight;
          delete el.dataset.prevPosition;
          delete el.dataset.prevTransform;
          delete el.dataset.prevMaxWidth;
          delete el.dataset.prevRight;
          delete el.dataset.prevBottom;
        } else {
          // reset to auto so component/style sheets can manage sizing/positioning
          el.style.right = '';
          el.style.bottom = '';
          el.style.width = '';
          el.style.height = '';
          el.style.maxWidth = '';
          el.style.transform = '';
        }
        // keep previously dragged top/left as set by Draggable (restored above if existed)
      }
    }, [isOpen, isMaximized]);

    // Minimize with squeeze animation
    const handleMinimize = useCallback(() => {
      const el = ref.current;
      if (!el) return;

      // Save current position before minimizing
      const cs = window.getComputedStyle(el);
      saveWindowPosition(resolvedKey, {
        top: cs.top,
        left: cs.left,
        width: cs.width,
        height: cs.height,
        transform: cs.transform,
      });

      // Get dock position for animation target
      const dock = document.querySelector('#dock');
      const dockRect = dock?.getBoundingClientRect();
      const targetX = dockRect ? dockRect.left + dockRect.width / 2 : window.innerWidth / 2;
      const targetY = dockRect ? dockRect.top : window.innerHeight;

      // Squeeze animation (macOS genie effect simplified)
      gsap.to(el, {
        scaleX: 0.1,
        scaleY: 0.1,
        x: targetX - el.getBoundingClientRect().left - el.offsetWidth / 2,
        y: targetY - el.getBoundingClientRect().top,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          // Reset transform for next open
          gsap.set(el, { scaleX: 1, scaleY: 1, x: 0, y: 0, opacity: 1 });
          minimizeWindow(resolvedKey);
        }
      });
    }, [resolvedKey, minimizeWindow, saveWindowPosition]);

    // Close with animation
    const handleClose = useCallback(() => {
      const el = ref.current;
      if (!el) return;

      gsap.to(el, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(el, { scale: 1, opacity: 1, y: 0 });
          closeWindow(resolvedKey);
        }
      });
    }, [resolvedKey, closeWindow]);


    return (
      <section 
        id={windowKey} 
        data-window-key={resolvedKey}
        data-window-type={windowKey}
        ref={ref} 
        style={{zIndex}} 
        className={`absolute window-root${isInfoMode ? " info-mode" : ""}`}
        onClick={() => focusWindow(resolvedKey)}>
          <Component {...props} windowKey={resolvedKey} windowType={windowKey} onMinimize={handleMinimize} onClose={handleClose} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(
    ${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
}

export default WindowWrapper