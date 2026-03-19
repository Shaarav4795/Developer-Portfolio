import useWindowStore from '#store/window'
import React, { useRef } from 'react'
import gsap from 'gsap'

const WindowControls = ({target, onMinimize, onClose}) => {

  const { closeWindow, toggleMaximizeWindow, minimizeWindow } = useWindowStore();
  const closeRef = useRef(null);
  const minimizeRef = useRef(null);
  const maximizeRef = useRef(null);

  const handleClose = () => {
    if (closeRef.current) {
      gsap.to(closeRef.current, {
        scale: 0.7,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(closeRef.current, {
            scale: 1,
            duration: 0.15,
            ease: 'back.out(3)',
          });
          // Call the onClose callback which triggers the close animation
          if (onClose) {
            onClose();
          } else {
            closeWindow(target);
          }
        }
      });
    }
  };

  const handleMinimize = () => {
    if (minimizeRef.current) {
      gsap.to(minimizeRef.current, {
        scale: 0.7,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(minimizeRef.current, {
            scale: 1,
            duration: 0.15,
            ease: 'back.out(3)',
          });
          // Call the onMinimize callback which triggers the squeeze animation
          if (onMinimize) {
            onMinimize();
          } else {
            minimizeWindow(target);
          }
        }
      });
    }
  };

  const handleMaximize = () => {
    if (maximizeRef.current) {
      gsap.to(maximizeRef.current, {
        scale: 0.7,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(maximizeRef.current, {
            scale: 1,
            duration: 0.15,
            ease: 'back.out(3)',
          });
          toggleMaximizeWindow(target);
        }
      });
    }
  };

  return (
    <div id='window-controls' className='group/controls'>
      <div ref={closeRef} className='close' onClick={handleClose}>
        <svg className='w-full h-full opacity-0 group-hover/controls:opacity-100 transition-opacity' viewBox="0 0 12 12">
          <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div ref={minimizeRef} className='minimize' onClick={handleMinimize}>
        <svg className='w-full h-full opacity-0 group-hover/controls:opacity-100 transition-opacity' viewBox="0 0 12 12">
          <path d="M2.5 6h7" stroke="#995700" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div ref={maximizeRef} className='maximize' onClick={handleMaximize}>
        <svg className='w-full h-full opacity-0 group-hover/controls:opacity-100 transition-opacity' viewBox="0 0 12 12">
          <path d="M6.1 5.9L3.1 2.9M3.1 2.9H5.1M3.1 2.9V4.9M5.9 6.1L8.9 9.1M8.9 9.1H6.9M8.9 9.1V7.1" stroke="#006500" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </div>
  )
}

export default WindowControls