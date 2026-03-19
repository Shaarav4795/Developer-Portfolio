import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react';
import { navIcons, navLinks, locations } from "#constants";
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';

const NavBar = ({ onSystemAction }) => {

  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [showAboutMac, setShowAboutMac] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const appleButtonRef = useRef(null);
  const appleMenuRef = useRef(null);

  const handleNavLinkClick = (type, action) => {
    if (!type) return;

    // Ensure Finder opens at Work instead of Trash by default
    if (type === 'finder') {
      if (action === 'about') {
        setActiveLocation(locations.about);
      } else if (action === 'work') {
        setActiveLocation(locations.work);
      } else {
        setActiveLocation(locations.work);
      }
    }

    openWindow(type);
  };

  const handleIconClick = ({ type, action }) => {
    if (!type) return;
    
    openWindow(type);
    
    // If action is specified, perform it (e.g., "about" opens About me location)
    if (action === 'about') {
      setActiveLocation(locations.about);
    }
  }

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAppleMenuAction = (action) => {
    setIsAppleMenuOpen(false);
    if (action === 'about') {
      setShowAboutMac(true);
      return;
    }
    if (onSystemAction) {
      onSystemAction(action);
      return;
    }
    showToast('Action unavailable in this demo.');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appleMenuRef.current &&
        !appleMenuRef.current.contains(event.target) &&
        appleButtonRef.current &&
        !appleButtonRef.current.contains(event.target)
      ) {
        setIsAppleMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAppleMenuOpen(false);
        setShowAboutMac(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-pill nav-pill-left">
          <button
            ref={appleButtonRef}
            className="apple-button"
            onClick={() => setIsAppleMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isAppleMenuOpen}
            aria-label="Apple menu"
          >
            <img src="/images/logo.svg" alt="Apple" className="apple-icon" />
          </button>
          <p className="nav-title">Shaarav's Portfolio</p>
          <ul className="nav-links">
            {navLinks.map(({ name, id, type, action }) => (
              <li key={id} onClick={() => handleNavLinkClick(type, action)}>
                <p className="nav-link">{name}</p>
              </li>
            ))}
          </ul>

          {isAppleMenuOpen && (
            <div ref={appleMenuRef} className="apple-menu" role="menu">
              <button className="apple-menu-item" onClick={() => handleAppleMenuAction('about')} role="menuitem">
                About This Mac
              </button>
              <div className="apple-menu-separator" />
              <button className="apple-menu-item" onClick={() => handleAppleMenuAction('restart')} role="menuitem">
                Restart
              </button>
              <button className="apple-menu-item" onClick={() => handleAppleMenuAction('shutdown')} role="menuitem">
                Shut Down
              </button>
              <div className="apple-menu-separator" />
              <button className="apple-menu-item" onClick={() => handleAppleMenuAction('lock')} role="menuitem">
                Lock Screen
              </button>
              <button className="apple-menu-item" onClick={() => handleAppleMenuAction('logout')} role="menuitem">
                Log Out Shaarav
              </button>
            </div>
          )}
        </div>

        <div className="nav-pill nav-pill-right">
          <ul className="nav-icons">
            {navIcons.map(({ id, img, type, action }) => (
              <li key={id} onClick={() => handleIconClick({ type, action })}>
                <img
                  src={img}
                  className={`icon-hover ${type ? 'cursor-pointer' : ''}`}
                  alt={`icon-${id}`}
                />
              </li>
            ))}
          </ul>
          <time className="nav-time">
            {dayjs().format('ddd MMM D h:mm A')}
          </time>
        </div>
      </nav>

      {toastMessage && (
        <div className="system-toast" role="status">
          {toastMessage}
        </div>
      )}

      {showAboutMac && (
        <div className="about-mac-overlay" onClick={() => setShowAboutMac(false)}>
          <div className="about-mac-card" onClick={(e) => e.stopPropagation()}>
            <div className="about-mac-header">
              <div className="about-mac-controls">
                <span className="control-dot close" onClick={() => setShowAboutMac(false)} />
                <span className="control-dot" />
                <span className="control-dot" />
              </div>
            </div>
            <div className="about-mac-content">
              <div className="about-mac-hero">
                <svg viewBox="0 0 240 160" className="about-mac-illustration" aria-hidden="true">
                  <rect x="32" y="22" width="176" height="104" rx="10" fill="#4FA3FF" stroke="#1B1B1B" strokeWidth="6" />
                  <rect x="24" y="126" width="192" height="12" rx="6" fill="#2B2B2B" />
                  <rect x="60" y="132" width="120" height="6" rx="3" fill="#1C1C1C" />
                  <rect x="104" y="20" width="32" height="8" rx="4" fill="#1B1B1B" />
                </svg>
              </div>
              <h2>MacBook Pro</h2>
              <p className="about-mac-subtitle">14-inch, Nov 2024</p>
              <div className="about-mac-specs">
                <div>
                  <span>Chip</span>
                  <strong>Apple M4</strong>
                </div>
                <div>
                  <span>Memory</span>
                  <strong>16 GB</strong>
                </div>
                <div>
                  <span>Serial number</span>
                  <strong>1234567890</strong>
                </div>
                <div>
                  <span>macOS</span>
                  <strong>Tahoe</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
