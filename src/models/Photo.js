const mongoose = require('mongoose');
const {Schema} = mongoose;

const TagSchema = mongoose.Schema({
    name: String,
    relativity: Number,
    reviewerCount: Number,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
});

const PhotoSchema = mongoose.Schema({
    url: String,
    width: Number,
    height: Number,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [TagSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', PhotoSchema);
