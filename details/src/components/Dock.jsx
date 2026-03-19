import { dockApps, locations } from '#constants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import ContextMenu from './ContextMenu';

function useDockItemSize(
  mouseX,
  baseItemSize,
  magnification,
  distance,
  ref,
  spring
) {
  const mouseDistance = useTransform(mouseX, (val) => {
    if (typeof val !== 'number' || Number.isNaN(val)) return 0;
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );

  return useSpring(targetSize, spring);
}

function DockItem({
  iconSrc,
  label,
  onClick,
  onContextMenu,
  mouseX,
  baseItemSize,
  magnification,
  distance,
  spring,
  disabled,
  showIndicator,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);
  const size = useDockItemSize(
    mouseX,
    baseItemSize,
    magnification,
    distance,
    ref,
    spring
  );
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (value) =>
      setShowLabel(value === 1)
    );
    return () => unsubscribe();
  }, [isHovered]);

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      className="dock-icon relative inline-flex items-center justify-center overflow-visible"
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-haspopup="true"
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-center">
        <img
          src={iconSrc}
          alt={label}
          loading="lazy"
          className={disabled ? 'opacity-60' : ''}
        />
      </div>
      {showIndicator && (
        <div className="absolute -bottom-1.5 w-1 h-1 bg-black rounded-full" />
      )}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute -top-7 left-1/2 w-fit whitespace-pre rounded-md border border-white/40 bg-white/90 px-2 py-1 text-[11px] font-medium text-black shadow-lg backdrop-blur-md"
            style={{ x: '-50%' }}
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Dock = () => {
  const { openWindow, closeWindow, restoreWindow, minimizeWindow, windows } =
    useWindowStore();
  const { setActiveLocation } = useLocationStore();
  const [contextMenu, setContextMenu] = useState(null);

  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const magnification = 70;
  const distance = 200;
  const panelHeight = 64;
  const dockHeight = 256;
  const baseItemSize = 50;
  const spring = { mass: 0.1, stiffness: 150, damping: 12 };

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );

  const animatedHeight = useSpring(
    useTransform(isHovered, [0, 1], [panelHeight, maxHeight]),
    spring
  );

  const toggleApp = (app) => {
    if (!app.canOpen) return;

    // Special case: Trash icon should open Finder focused on Trash
    if (app.action === 'trash') {
      // Ensure Finder window opens and switch Finder to Trash location
      openWindow('finder');
      setActiveLocation(locations.trash);
      return;
    }

    // Special case: Finder icon should open Finder focused on Work
    if (app.id === 'finder') {
      const finderWin = windows['finder'];
      if (finderWin?.isMinimized) {
        restoreWindow('finder');
      } else {
        openWindow('finder');
      }
      setActiveLocation(locations.work);
      return;
    }

    const win = windows[app.id];

    if (!win) {
      console.log(`Window not found for app: ${app.id}`);
      return;
    }

    // If minimized, restore the window
    if (win.isMinimized) {
      restoreWindow(app.id);
    } else if (win.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }
  };

  const handleContextMenu = (e, app) => {
    e.preventDefault();
    e.stopPropagation();

    const win = windows[app.id];
    const isOpen = win?.isOpen;
    const isMinimized = win?.isMinimized;

    const menuItems = [];

    if (app.canOpen) {
      if (isMinimized) {
        // App is minimized - show "Show" to restore it
        menuItems.push({
          label: 'Show',
          onClick: () => {
            restoreWindow(app.id);
            setContextMenu(null);
          },
        });
      } else if (isOpen) {
        // App is open and visible - show "Hide" to minimize
        menuItems.push({
          label: 'Hide',
          onClick: () => {
            minimizeWindow(app.id);
            setContextMenu(null);
          },
        });
      } else {
        // App is closed - show "Open"
        menuItems.push({
          label: 'Open',
          onClick: () => {
            toggleApp(app);
            setContextMenu(null);
          },
        });
      }
    }

    if (isOpen || isMinimized) {
      menuItems.push({
        label: 'Quit',
        onClick: () => {
          closeWindow(app.id);
          setContextMenu(null);
        },
      });
    }

    if (menuItems.length > 0) {
      menuItems.push({ type: 'separator' });
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: menuItems,
    });
  };

  return (
    <section id="dock">
      <motion.div
        style={{ height: animatedHeight }}
        className="mx-2 flex max-w-full items-center"
      >
        <motion.div
          onMouseMove={({ pageX }) => {
            isHovered.set(1);
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className="dock-container absolute bottom-2 left-1/2 -translate-x-1/2 transform flex items-end gap-3 w-fit pb-2.5 pt-2.5"
          style={{ height: panelHeight }}
          role="toolbar"
          aria-label="Application dock"
        >
          {dockApps.map(({ id, name, icon, canOpen, action }) => (
            <DockItem
              key={id}
              iconSrc={`/images/${icon}`}
              label={name}
              onClick={() => toggleApp({ id, canOpen, action })}
              onContextMenu={(e) =>
                handleContextMenu(e, { id, canOpen, action, name })
              }
              mouseX={mouseX}
              baseItemSize={baseItemSize}
              magnification={magnification}
              distance={distance}
              spring={spring}
              disabled={!canOpen}
              showIndicator={
                windows[id]?.isOpen || windows[id]?.isMinimized
              }
            />
          ))}
        </motion.div>
      </motion.div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </section>
  );
};

export default Dock;