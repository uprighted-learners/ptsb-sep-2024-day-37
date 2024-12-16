const mongoose = require('mongoose');

// Define a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Define a model
module.exports = mongoose.model('User', userSchema);