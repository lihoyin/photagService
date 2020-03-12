const R = require('ramda');
const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const userService = require('../services/userService')
const jwtUtils = require('../utils/jwtUtils')
const respUtils = require('../utils/respUtils')

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

auth = async (req, res) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_WEB_CLIENT_ID
        });
        const googleSigninPayload = ticket.getPayload();
        console.log('googleSigninPayload', googleSigninPayload)

        let user = await userService.findOneByEmail(googleSigninPayload.email);
        let isNewUser = R.isNil(user);

        if (isNewUser) {
            user = await userService.createUser(
                googleSigninPayload.name,
                googleSigninPayload.email,
                googleSigninPayload.picture
            )
        }

        return res.send({
            user: respUtils.outputUser(user),
            token: jwtUtils.sign(user.id),
            isNewUser
        });
    } catch (e) {
        return res.status(400).send({
            message: e.toString()
        });
    }
}

module.exports = express.Router()
    .post('/', auth);
