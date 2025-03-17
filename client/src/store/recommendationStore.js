import { create } from 'zustand';

const useRecommendationStore = create((set) => ({
  recommendations: [],
  isLoading: false,
  setRecommendation: (recommendationList) =>
    set(() => ({
      recommendations: recommendationList, // Create a new array with the existing messages and the new message
    })),
  setIsLoading: (mode) => set({ isLoading: mode }),
}));

export default useRecommendationStore;
