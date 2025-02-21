import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white flex-col">
      <div className="flex gap-1">
        <a href="https://vite.dev" target="_blank" className="size-32">
          <img src={viteLogo} className="size-full" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="size-32">
          <img src={reactLogo} className="size-full" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-zinc-900 text-white rounded-lg p-2 m-0"
        >
          count is {count}
        </button>
      </div>
      <div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="pt-4 text-2xl">Project Initialized by Geoff</p>
    </div>
  );
}

export default App;
