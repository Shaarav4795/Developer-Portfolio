import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light", // dark mode disabled
      setTheme: (theme) => {
        set({ theme: "light" });
        applyTheme("light");
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state) {
          applyTheme("light");
        }
      },
    }
  )
);

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.style.colorScheme = "light";
}

export default useThemeStore;
