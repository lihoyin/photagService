const mongoose = require('mongoose');
const {Schema} = mongoose;

const PhotoSchema = mongoose.Schema({
    url: String,
    width: Number,
    height: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', PhotoSchema);
