const R = require('ramda');

const outputUser = (user) => {
    return R.pick(['_id', 'name', 'picture'], user)
}

module.exports = {
    outputUser: outputUser
}
