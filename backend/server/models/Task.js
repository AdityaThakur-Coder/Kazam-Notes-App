const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
