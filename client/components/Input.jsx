import React, { useState } from 'react';
import axios from 'axios';
import useRecommendationStore from '../src/store/recommendationStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMiniSparkles, HiChatBubbleLeftRight } from 'react-icons/hi2';
import useModeStore from '../src/store/modeStore';
import { cn } from '../lib/utils';
import useChatStore from '../src/store/chatStore';

export default function Input() {
  const currentMode = useModeStore((state) => state.currentMode);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const addMessage = useChatStore((state) => state.addMessage);

  const setRecommendations = useRecommendationStore(
    (state) => state.setRecommendation
  );

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    if (!query.trim()) return; // Prevent empty search

    if (currentMode == 'recommend') {
      axios
        .post('http://localhost:5000/recommendations', { query: query })
        .then((res) => {
          console.log(res.data);
          setRecommendations(res.data);
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error);
        });
      navigate('/recommendations');
    } else {
      addMessage({ content: query, user: 'Human' });

      axios
        .post('http://localhost:5000/chat', { prompt: query })
        .then((res) => {
          console.log(res.data);
          addMessage({ content: res.data, user: 'AI' });
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error);
        });
      navigate('/chat');
    }
    setQuery('');
  };

  return (
    <motion.div
      layout
      transition={{ ease: 'easeInOut' }}
      className="flex flex-col items-center gap-3 w-[30%]"
    >
      <form
        onSubmit={handleSubmit}
        className="flex gap-5 bg-none justify-between w-full"
      >
        <input
          type="text"
          placeholder="(e. g. my dog has itchy skin)"
          className="input flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update state on input
        />
        <button type="submit" className="btn btn-success">
          Send
        </button>
      </form>
      {/* toggle */}
      <Toggle />
    </motion.div>
  );
}

function Toggle() {
  const currentMode = useModeStore((state) => state.currentMode);
  const setMode = useModeStore((state) => state.setMode);
  const navigate = useNavigate();

  return (
    <div className="join">
      <button
        className={cn('join-item btn', {
          'btn-success': currentMode == 'recommend',
        })}
        onClick={() => {
          setMode('recommend');
          navigate('/');
        }}
      >
        <HiMiniSparkles className="size-4" />
      </button>
      <button
        className={cn('join-item btn', {
          'btn-success': currentMode == 'chat',
        })}
        onClick={() => {
          setMode('chat');
          navigate('/');
        }}
      >
        <HiChatBubbleLeftRight className="size-4" />
      </button>
    </div>
  );
}
