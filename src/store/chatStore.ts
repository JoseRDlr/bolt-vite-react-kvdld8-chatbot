import { create } from 'zustand'

interface Message {
  text: string
  sender: 'user' | 'bot'
}

interface ChatStore {
  messages: Message[]
  addMessage: (message: Message) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}))