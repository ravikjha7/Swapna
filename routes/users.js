const express = require('express');
const router = express.Router();
const catchAsync = require('./../utils/catchAsync');
const passport = require('passport');
const users = require('./../controllers/users');

router.route('/register')
    .get(users.renderNewForm)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', catchAsync(users.logout));

module.exports = router;