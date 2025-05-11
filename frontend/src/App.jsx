import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fetchAllTasks');
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async () => {
    if (!input.trim()) return;
    await axios.post('http://localhost:5000/addTask', { text: input });
    setInput('');
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <img src="/note-icon.png" alt="Note Icon" className="note-icon" />
        <h1 className="heading">Note App</h1>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New Note..."
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-button">
           <img src="/plus-icon.png" alt="Plus Icon" className="plus-icon" />Add
        </button>
      </div>

      <div className="notes-section">
        <h3>Notes</h3>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className="task-item">{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
