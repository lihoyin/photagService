const mongoose = require('mongoose');
const {Schema} = mongoose;

const PhotoSchema = mongoose.Schema({
    url: String,
    width: Number,
    height: Number,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', PhotoSchema);
