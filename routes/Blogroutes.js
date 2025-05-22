const express = require('express');
const router = express.Router();
const Otp = require('../models/Otp');
const Post = require('../models/Post');

router.post('/add-blog', async (req, res) => {
    try {
        const { title, author, date, excerpt } = req.body;
        const newBlog = new Post({ title, author, date, excerpt });
        await newBlog.save();
        res.status(200).json({ message: 'Blog added successfully' });
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ error: 'Failed to add blog. Try again later.' });
    }
});

router.post('/delete-blog', async (req, res) => {
    try {
        const { id } = req.body;
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Failed to delete blog. Try again later.' });
    }
});

router.post('/likes', async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Post.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        blog.likes += 1;
        await blog.save();
        res.status(200).json({ message: 'Likes updated successfully' });
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ error: 'Failed to update likes. Try again later.' });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Post.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs. Try again later.' });
    }
});

router.get('/blog/blog-by-slug/:slug', async (req, res) => {
  try {
    const blog = await Post.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;