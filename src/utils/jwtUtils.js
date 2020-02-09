const jwt = require('jsonwebtoken')

const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    function (jwtPayload, done) {
        return done(null, jwtPayload.userId);
    }
));

const jwtAuthenticate = passport.authenticate('jwt', {session: false});

const sign = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

module.exports = {
    sign,
    jwtAuthenticate
}
