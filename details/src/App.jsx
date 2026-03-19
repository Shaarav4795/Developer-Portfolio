import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Analytics } from '@vercel/analytics/react'
import { NavBar, Welcome, Dock, Home } from '#components';
import useWindowStore from '#store/window'

const Finder = lazy(() => import('./windows/Finder.jsx'))
const Terminal = lazy(() => import('./windows/Terminal.jsx'))
const Text = lazy(() => import('./windows/Text.jsx'))
const Image = lazy(() => import('./windows/Image.jsx'))
const Contact = lazy(() => import('./windows/Contact.jsx'))
const Photos = lazy(() => import('./windows/Photos.jsx'))
const Trash = lazy(() => import('./windows/Trash.jsx'))

gsap.registerPlugin(Draggable);

const App = () => {
  const { windows } = useWindowStore();
  const [eagerMount, setEagerMount] = useState(false);
  const [systemScreen, setSystemScreen] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const instanceEntries = Object.entries(windows).filter(([, win]) => win?.isInstance);
  const instanceMap = {
    txtfile: Text,
    imgfile: Image,
  };
  useEffect(() => {
    const saved = localStorage.getItem('wallpaperUrl');
    if (saved) {
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${saved}')`
      );
    }
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  useEffect(() => {
    if (!systemScreen || (systemScreen.mode !== 'lock' && systemScreen.mode !== 'logout')) {
      return;
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [systemScreen]);

  const handleSystemAction = (action) => {
    if (action === 'restart' || action === 'shutdown' || action === 'lock' || action === 'logout') {
      setSystemScreen({ mode: action });
      setTimeout(() => {
        window.location.reload();
      }, 3500);
      return;
    }
  };

  const lockScreenDate = useMemo(() => dayjs(now).format('ddd, D MMM'), [now]);
  const lockScreenTime = useMemo(() => dayjs(now).format('HH:mm'), [now]);

  useEffect(() => {
    const start = () => {
      setEagerMount(true);
      // warm the import cache so subsequent mounts don't suspend
      import('./windows/Finder.jsx');
      import('./windows/Terminal.jsx');
      import('./windows/Text.jsx');
      import('./windows/Image.jsx');
      import('./windows/Contact.jsx');
      import('./windows/Photos.jsx');
      import('./windows/Trash.jsx');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(start);
    } else {
      setTimeout(start, 100);
    }
  }, []);
  return (
    <>
      <main>
        <NavBar onSystemAction={handleSystemAction} />
        <Welcome />
        <Dock />
        {eagerMount ? (
          <>
            <Suspense fallback={null}><Terminal /></Suspense>
            <Suspense fallback={null}><Image /></Suspense>
            <Suspense fallback={null}><Text /></Suspense>
            <Suspense fallback={null}><Finder /></Suspense>
            <Suspense fallback={null}><Contact /></Suspense>
            <Suspense fallback={null}><Photos /></Suspense>
            <Suspense fallback={null}><Trash /></Suspense>
            {instanceEntries.map(([key, win]) => {
              const InstanceComponent = instanceMap[win.baseKey];
              if (!InstanceComponent) return null;
              return (
                <Suspense fallback={null} key={key}>
                  <InstanceComponent windowKeyOverride={key} />
                </Suspense>
              );
            })}
          </>
        ) : null}
        <Home />
      </main>
      {systemScreen && (systemScreen.mode === 'restart' || systemScreen.mode === 'shutdown') && (
        <div className="system-overlay system-overlay--power" role="status" aria-live="polite">
          <div className="system-power-center">
            <img src="/images/logo.svg" alt="Apple" className="system-power-logo" />
            <div className="system-power-bar" aria-hidden="true">
              <span className="system-power-bar__fill" />
            </div>
          </div>
        </div>
      )}
      {systemScreen && (systemScreen.mode === 'lock' || systemScreen.mode === 'logout') && (
        <div
          className="system-overlay system-overlay--lock"
          role="dialog"
          aria-label="Locked screen"
          onClick={() => setSystemScreen(null)}
        >
          <div className="lock-screen-top">
            <div className="lock-pill">
              <span className="lock-pill-icon" aria-hidden="true">🔒</span>
            </div>
          </div>
          <div className="lock-screen-center">
            <p className="lock-screen-date">{lockScreenDate}</p>
            <h1 className="lock-screen-time">{lockScreenTime}</h1>
            <div className="lock-screen-status">
              <span>Sleep</span>
              <span>•</span>
              <span>16°</span>
            </div>
          </div>
          <p className="lock-screen-hint">Press to unlock</p>
        </div>
      )}
      <Analytics />
    </>
  )
}

export default App
