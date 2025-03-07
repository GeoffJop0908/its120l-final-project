import '../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios.get('http://localhost:5000/list').then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };

  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white flex-col">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, key) => (
              <tr key={key}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
