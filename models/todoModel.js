const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//crate schema for todo

const TodoScrema = new Schema({
    action: {
        type: String,
        required: [true, 'The todo text field is required'],
    }
})

//create model for todo

const Todo = mongoose.model('todo', TodoScrema);

module.exports = Todo