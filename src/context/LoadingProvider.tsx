import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);
let didConsumeReloadIntroThisPageSession = false;
let didScheduleReloadIntroConsumption = false;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading on mobile
    if (window.innerWidth <= 768) return false;
    // Only run intro on home route.
    if (window.location.pathname !== "/") return false;

    // On a hard refresh, run the intro once for this browser page session.
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navEntry?.type === "reload" && !didConsumeReloadIntroThisPageSession) {
      if (!didScheduleReloadIntroConsumption) {
        didScheduleReloadIntroConsumption = true;
        setTimeout(() => {
          didConsumeReloadIntroThisPageSession = true;
        }, 0);
      }
      return true;
    }

    // For regular in-app navigation, run intro only once per tab session.
    if (sessionStorage.getItem("portfolio-intro-seen") === "1") return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  useEffect(() => {
    // If intro is skipped, still initialize landing animations/scroll behavior.
    if (window.location.pathname !== "/" || isLoading) {
      return;
    }

    // If the user has already seen the intro (return visit or navigated back from blog),
    // use silentInit to just activate Lenis + show content without re-running GSAP animations.
    const isReturnVisit = sessionStorage.getItem("portfolio-intro-seen") === "1";

    import("../components/utils/initialFX").then((module) => {
      setTimeout(() => {
        if (isReturnVisit && module.silentInit) {
          module.silentInit();
        } else if (module.initialFX) {
          module.initialFX();
        }
      }, 50);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      sessionStorage.setItem("portfolio-intro-seen", "1");
    }
  }, [isLoading]);

  useEffect(() => {}, [loading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
