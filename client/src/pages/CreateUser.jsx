import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateUser() {
  const [inputs, setInputs] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/add', inputs).then((res) => {
      console.log(res.data);
    });
    navigate('/');
  };

  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white flex-col">
      <form>
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Input</legend>

          <label className="fieldset-label">Username</label>
          <input
            type="text"
            className="input"
            placeholder="Username"
            onChange={handleChange}
            name="username"
          />

          <label className="fieldset-label">Email</label>
          <input
            type="text"
            className="input"
            placeholder="Email"
            onChange={handleChange}
            name="email"
          />

          <button
            className="btn btn-accent mt-4"
            type="submit"
            name="add"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}
