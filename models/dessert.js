const mongoose = require('mongoose');

const dessertSchema = new mongoose.Schema({
    name: String,
    reviews: String,
    isReadyToEat: Boolean,
});

const Dessert = mongoose.model('Dessert', dessertSchema);

module.exports = Dessert;