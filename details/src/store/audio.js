import { create } from 'zustand'

// Legacy audio store removed; keep a noop store to avoid stale imports.
const useAudioStore = create(() => ({}));

export default useAudioStore;
