import { create } from 'zustand';

const useRecommendationStore = create((set) => ({
  recommendations: [],
  setRecommendation: (recommendationList) =>
    set(() => ({
      recommendations: recommendationList, // Create a new array with the existing messages and the new message
    })),
}));

export default useRecommendationStore;
