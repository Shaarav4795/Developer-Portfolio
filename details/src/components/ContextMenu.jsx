import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu on screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const adjustedX = Math.min(x, window.innerWidth - rect.width - 10);
      const adjustedY = Math.min(y, window.innerHeight - rect.height - 10);
      menuRef.current.style.left = `${Math.max(10, adjustedX)}px`;
      menuRef.current.style.top = `${Math.max(10, adjustedY)}px`;
    }
  }, [x, y]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[180px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 select-none"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div
              key={index}
              className="h-px bg-gray-200 dark:bg-gray-700 my-1 mx-2"
            />
          );
        }

        return (
          <button
            key={index}
            className={`w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 transition-colors ${
              item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
            }`}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="w-4">{item.icon}</span>}
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="ml-auto text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>,
    document.body
  );
};

export default ContextMenu;
