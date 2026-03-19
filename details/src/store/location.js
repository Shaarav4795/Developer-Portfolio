import { locations } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_LOCATION = locations.work;

const useLocationStore = create(
  immer((set, get) => ({
    activeLocation: DEFAULT_LOCATION,
    history: [DEFAULT_LOCATION],
    historyIndex: 0,

    setActiveLocation: (location) =>
      set((state) => {
        // Ignore calls without an argument; allow explicit null to clear if intended
        if (typeof location === "undefined") return;
        
        // Only add to history if it's a new location
        if (state.activeLocation?.id !== location?.id) {
          // Remove any forward history when navigating to new location
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(location);
          state.history = newHistory;
          state.historyIndex = newHistory.length - 1;
        }
        
        state.activeLocation = location;
      }),

    goBack: () =>
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex -= 1;
          state.activeLocation = state.history[state.historyIndex];
        }
      }),

    goForward: () =>
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          state.activeLocation = state.history[state.historyIndex];
        }
      }),

    canGoBack: () => get().historyIndex > 0,
    canGoForward: () => get().historyIndex < get().history.length - 1,

    // Navigate to a specific location in the breadcrumb path
    navigateToPath: (location) =>
      set((state) => {
        state.activeLocation = location;
        // Add to history
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(location);
        state.history = newHistory;
        state.historyIndex = newHistory.length - 1;
      }),

    resetActiveLocation: () =>
      set((state) => {
        state.activeLocation = DEFAULT_LOCATION;
        state.history = [DEFAULT_LOCATION];
        state.historyIndex = 0;
      }),
  }))
);

export default useLocationStore;
