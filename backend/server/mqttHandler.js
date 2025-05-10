const mqtt = require('mqtt');
const redisClient = require('./redisClient');
const Task = require('./models/Task');

const MQTT_TOPIC = '/add';
const REDIS_KEY = 'FULLSTACK_TASK_ADITYA';

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
  console.log('MQTT Connected');
  mqttClient.subscribe(MQTT_TOPIC);
});

mqttClient.on('message', async (topic, message) => {
  if (topic === MQTT_TOPIC) {
    const newTask = message.toString();
    let tasks = await redisClient.get(REDIS_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.push(newTask);

    if (tasks.length > 50) {
      await Task.insertMany(tasks.map(text => ({ text })));
      await redisClient.set(REDIS_KEY, JSON.stringify([]));
    } else {
      await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    }
  }
});

module.exports = mqttClient;
