import { create } from "zustand";
import { persist } from "zustand/middleware";

const useIconPositionStore = create(
  persist(
    (set, get) => ({
      // Desktop folder positions: { [folderId]: { x, y } }
      desktopPositions: {},
      
      // Finder item positions: { [locationId]: { [itemId]: { x, y } } }
      finderPositions: {},

      setDesktopPosition: (folderId, x, y) =>
        set((state) => ({
          desktopPositions: {
            ...state.desktopPositions,
            [folderId]: { x, y },
          },
        })),

      getDesktopPosition: (folderId) => get().desktopPositions[folderId],

      setFinderPosition: (locationId, itemId, x, y) =>
        set((state) => ({
          finderPositions: {
            ...state.finderPositions,
            [locationId]: {
              ...state.finderPositions[locationId],
              [itemId]: { x, y },
            },
          },
        })),

      getFinderPosition: (locationId, itemId) =>
        get().finderPositions[locationId]?.[itemId],

      clearAllPositions: () =>
        set({
          desktopPositions: {},
          finderPositions: {},
        }),
    }),
    {
      name: "icon-positions",
    }
  )
);

export default useIconPositionStore;
