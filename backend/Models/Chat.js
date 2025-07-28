const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    sessionId: { type: String, required: true },
    prompt: String,
    response: String,
    jsx: String,
    css: String,
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel;
