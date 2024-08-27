const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// Create an instance of Express
const app = express();

// Set up EJS templating engine
app.set('view engine', 'ejs');

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB 
mongoose.connect('mongodb://localhost:27017/dynamic-blog-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a Blog Model
const Blog = mongoose.model('Blog', blogSchema);

// Routes 
app.get('/', async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render('home', { blogs });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    content: req.body.content
  });
  await newBlog.save();
  res.redirect('/');
});

app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render('blogs', { blogs });
});

// Edit Route
app.get('/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render('edit', { blog });
  } catch (err) {
    console.error('Error getting blog for editing:', err);
    res.redirect('/blogs'); // Redirect to the blog list
  }
});

app.post('/edit/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content
    });
    res.redirect('/blogs');
  } catch (err) {
    console.error('Error updating blog:', err);
    res.redirect('/blogs');
  }
});

// Delete Route
app.get('/delete/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.redirect('/blogs');
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});