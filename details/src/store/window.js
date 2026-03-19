import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

const MULTI_WINDOW_TYPES = new Set(["txtfile", "imgfile"]);

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    nextInstanceId: 1,
    openWindow: (windowKey, data = null) => set((state) => {
      if (MULTI_WINDOW_TYPES.has(windowKey)) {
        const existingInstances = Object.values(state.windows).filter(
          (win) => win?.isInstance && win.baseKey === windowKey
        );
        const cascadeIndex = existingInstances.length;
        const baseConfig = state.windows[windowKey] || {
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          zIndex: INITIAL_Z_INDEX,
          data: null,
          savedPosition: null,
        };
        const instanceKey = `${windowKey}-${state.nextInstanceId++}`;

        state.windows[instanceKey] = {
          ...baseConfig,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: state.nextZIndex++,
          data,
          savedPosition: null,
          isInstance: true,
          baseKey: windowKey,
          cascadeIndex,
        };

        return;
      }

      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = true;
      win.isMinimized = false;
      win.zIndex = state.nextZIndex++;
      // Only set data if provided, otherwise keep existing (for restore from minimize)
      if (data !== null) {
        win.data = data;
      }
    }),
    closeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;

      if (win.isInstance) {
        delete state.windows[windowKey];
        return;
      }

      win.isOpen = false;
      win.isMinimized = false;
      win.isMaximized = false;
      win.zIndex = INITIAL_Z_INDEX;
      win.data = null;
      // Clear saved position on close
      win.savedPosition = null;
    }),
    minimizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isMinimized = true;
      win.isOpen = false;
      // Keep data and zIndex for restoration
      // savedPosition will be set by WindowWrapper before minimizing
    }),
    restoreWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = true;
      win.isMinimized = false;
      win.zIndex = state.nextZIndex++;
    }),
    focusWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.zIndex = state.nextZIndex++;
    }),
    toggleMaximizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isMaximized = !win.isMaximized;
      // bring to front when maximizing
      if (win.isMaximized) {
        win.zIndex = state.nextZIndex++;
      }
    }),
    saveWindowPosition: (windowKey, position) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.savedPosition = position;
    }),
  }))
);

export default useWindowStore;