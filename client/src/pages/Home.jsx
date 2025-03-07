import '../App.css';
import { useState, useEffect } from 'react';

const createFetch = () => {
  const fetchMap = {};
  return (url, options) => {
    if (!fetchMap[url]) {
      fetchMap[url] = fetch(url, options).then((res) => res.json());
    }
    return fetchMap[url];
  };
};

const myFetch = createFetch();

export default function Home() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    myFetch('http://localhost:5000/members').then((data) => {
      setData(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white flex-col">
      <h1 className="text-5xl">Hi</h1>
      <div>
        <h2>Members</h2>
        <div>
          {typeof data.members === 'undefined' ? (
            <p>Loading...</p>
          ) : (
            data.members.map((member, i) => <p key={i}>{member}</p>)
          )}
        </div>
      </div>
    </div>
  );
}
