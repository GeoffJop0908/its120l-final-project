import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import ChatBot from 'react-chatbotify';

const MyChatBot = () => {
  let apiKey =
    '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';
  let modelType = 'gpt-3.5-turbo';
  let hasError = false;

  // example openai conversation
  // you can replace with other LLMs such as Google Gemini
  const call_openai = async (params) => {
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // required for testing on browser side, not recommended
      });

      // for streaming responses in parts (real-time), refer to real-time stream example
      const chatCompletion = await openai.chat.completions.create({
        // conversation history is not shown in this example as message length is kept to 1
        messages: [{ role: 'user', content: params.userInput }],
        model: modelType,
      });

      await params.injectMessage(chatCompletion.choices[0].message.content);
    } catch (error) {
      await params.injectMessage(
        'Unable to load model, is your API Key valid?'
      );
      hasError = true;
    }
  };
  const flow = {
    start: {
      message: 'Enter your OpenAI api key and start asking away!',
      path: 'api_key',
      isSensitive: true,
    },
    api_key: {
      message: (params) => {
        apiKey = params.userInput.trim();
        return 'Ask me anything!';
      },
      path: 'loop',
    },
    loop: {
      message: async (params) => {
        await call_openai(params);
      },
      path: () => {
        if (hasError) {
          return 'start';
        }
        return 'loop';
      },
    },
  };
  return (
    <ChatBot
      settings={{
        general: { embedded: true },
        chatHistory: { storageKey: 'example_llm_conversation' },
      }}
      flow={flow}
    />
  );
};

function App() {
  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white flex-col">
      <MyChatBot />
    </div>
  );
}

export default App;
