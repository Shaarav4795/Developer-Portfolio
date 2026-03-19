import { lazy, Suspense, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
import { LoadingProvider } from "./context/LoadingProvider";

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    let rafId: number | null = null;

    const resetScrollRoots = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const scrollRoots = document.querySelectorAll<HTMLElement>(
        ".main-body, .blog-post-page, .blog-index-page, .myworks-page"
      );
      scrollRoots.forEach((element) => {
        element.scrollTop = 0;
      });
    };

    // Preserve explicit section return/hash behavior only on the home route.
    if (pathname === "/") {
      const returnSection = sessionStorage.getItem("return-scroll-to");
      if (returnSection || hash) {
        return () => {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
          }
        };
      }
    }

    resetScrollRoots();
    rafId = requestAnimationFrame(resetScrollRoots);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [pathname, hash]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <RouteScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <LoadingProvider>
              <Suspense>
                <MainContainer>
                  <Suspense>
                    <CharacterModel />
                  </Suspense>
                </MainContainer>
              </Suspense>
            </LoadingProvider>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <MyWorks />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <BlogIndex />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <BlogPost />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
