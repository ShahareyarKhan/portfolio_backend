
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: String,
    author: String,
    date: String,
    excerpt: String,
    likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);
