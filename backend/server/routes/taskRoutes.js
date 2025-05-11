const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const redisClient = require('../redisClient');

const REDIS_KEY = 'FULLSTACK_TASK_ADITYA';

router.post('/addTask', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }

  try {
    let tasks = await redisClient.get(REDIS_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.push(text);

    if (tasks.length > 50) {
      await Task.insertMany(tasks.map(text => ({ text })));
      await redisClient.set(REDIS_KEY, JSON.stringify([]));
    } else {
      await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    }

    res.status(201).json({ message: 'Task added successfully' });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: 'Error adding task' });
  }
});

router.get('/fetchAllTasks', async (req, res) => {
  try {
    let redisTasks = await redisClient.get(REDIS_KEY);
    redisTasks = redisTasks ? JSON.parse(redisTasks) : [];
    const dbTasks = await Task.find({}, 'text');
    const allTasks = [...dbTasks.map(t => t.text), ...redisTasks];
    res.json({ tasks: allTasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

module.exports = router;
