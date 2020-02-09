const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: {type: String, index: true},
    picture: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
