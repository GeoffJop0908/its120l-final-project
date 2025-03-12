import { create } from 'zustand';

const useModeStore = create((set) => ({
  currentMode: 'recommend', // Initialize an empty array to store chat messages
  setMode: (mode) =>
    set(() => ({
      currentMode: mode,
    })),
}));

export default useModeStore;
