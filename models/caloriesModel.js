const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//crate schema for calories

const caloriesSchema = new Schema({
    food: {
        type: String,
        required: [true, 'The food text field is required']},
    foodCalories: {
        type: Number,
        required: true
    },
    caloriesLeft: {
        type: Number
    }
})

//create model for calories

const Calories = mongoose.model('calories', caloriesSchema);

module.exports = Calories