const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ebre_auth',
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
});

module.exports = sessionConfig;
