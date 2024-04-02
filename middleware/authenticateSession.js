const session = require('express-session');
const express = require('express');
const app = express();
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

const authenticateSession = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateSession;
