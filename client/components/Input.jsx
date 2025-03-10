import React, { useState } from 'react';
import axios from 'axios';
import useRecommendationStore from '../src/store/recommendationStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Input() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const setRecommendations = useRecommendationStore(
    (state) => state.setRecommendation
  );

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    if (!query.trim()) return; // Prevent empty search

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
    setQuery('');
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="flex gap-5 bg-none w-[80vw] justify-center"
      transition={{ ease: 'easeInOut' }}
    >
      <input
        type="text"
        placeholder="(e. g. my dog has itchy skin)"
        className="input w-[40%]"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update state on input
      />
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </motion.form>
  );
}
