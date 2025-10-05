const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    dueTime: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { 
        type: String, 
        enum: ['work', 'personal', 'shopping', 'health', 'study', 'other'], 
        default: 'other' 
    },
    completed: { type: Boolean, default: false },
    subtasks: [subtaskSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
