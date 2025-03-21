import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [], // Initialize an empty array to store chat messages
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { content: message.content, user: message.user, timestamp: Date.now },
      ], // Create a new array with the existing messages and the new message
    })),
  clearMessages: () => set({ messages: [] }), // Function to clear all messages
  setIsLoading: (mode) => set({ isLoading: mode }),
}));

export default useChatStore;
