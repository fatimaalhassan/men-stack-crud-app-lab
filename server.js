/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
 console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on('error', err => {
 console.error('MongoDB connection error:', err);
});

// Models
const Dessert = require('./models/dessert'); 
// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.get('/', (req, res) => {
 res.render('index.ejs');
});

app.get('/desserts', async (req, res) => {
 const allDesserts = await Dessert.find({});
 res.render('desserts/index.ejs', { desserts: allDesserts });
});

app.get('/desserts/new', (req, res) => {
 res.render('desserts/new.ejs');
});
app.get('/desserts/:dessertId/edit', async (req, res) => {
 const dessertId = req.params.dessertId;
 const dessert = await Dessert.findById(dessertId);
 res.render('desserts/edit.ejs', { dessert });
});

app.get('/desserts/:dessertId', async (req, res) => {
 const dessertId = req.params.dessertId;
 const dessert = await Dessert.findById(dessertId);
 res.render('desserts/show.ejs', { dessert });
});

app.post('/desserts', async (req, res) => {
 if (req.body.isReadyToEat === 'on') {
   req.body.isReadyToEat = true;
 } else {
   req.body.isAvailable = false;
 }
 await Dessert.create(req.body);
 res.redirect('/desserts');
});
app.delete('/desserts/:dessertId', async (req, res) => {
 const dessertId = req.params.dessertId;
 await Dessert.findByIdAndDelete(dessertId);
 res.redirect('/desserts?msg="record deleted"');
});
app.put('/desserts/:dessertId', async (req, res) => {
 if (req.body.isReadyToEat === 'on') {
   req.body.isReadyToEat = true;
 } else {
   req.body.isReadyToEat = false;
 }
 const dessertId = req.params.dessertId;
 await Dessert.findByIdAndUpdate(dessertId, req.body);
 res.redirect(`/desserts/${dessertId}`);
});
app.listen(PORT, () => {
 console.log(`Listening on port ${PORT}`);
});

