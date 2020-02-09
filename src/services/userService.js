const User = require('../models/User')

exports.createUser = async (name, email, picture) => {
    return User.create({name, email, picture})
}

exports.findOneByEmail = async (email) => {
    return User.findOne({email}).exec()
};
