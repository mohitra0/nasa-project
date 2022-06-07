const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const helmet = require('helmet');
const { verify } = require('crypto');
const expressSession = require('express-session');
const express = require('express');
const cors = require('cors');
const api = require('./routes/api')
const path = require('path');


const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY1: process.env.COOKIE_KEY1,
   COOKIE_KEY2: process.env.COOKIE_KEY2
}
const AUTH_OPTION = {
    clientID: config.CLIENT_ID,   
    clientSecret: config.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}
passport.serializeUser((user,done)=>{
    done(null,user.id);
    
});
passport.deserializeUser((obj,done)=>{
    // User.findById(id).then(user=>{
    //     done(null,obj);
    // });
  
    done(null,obj);
});
const app = express();
app.use(helmet());
app.use(expressSession({
    name:'session',
    maxAge:1000*60*60*24,
    secret:[config.COOKIE_KEY1,config.COOKIE_KEY2]
}));
app.use(passport.initialize());
app.use(passport.session());

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    done(null, profile);
  }
console.log(AUTH_OPTION.clientSecret);
passport.use(new Strategy(
    AUTH_OPTION,
    verifyCallback
));
 
// var whitelist = ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:8000']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
function checkLogin(req, res, next) {
    console.log('Current user',req.user);
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: "You must login",
        })
    }
    next();
}

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['email'],
  }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: true,
    }),
    (req, res) => {
        console.log('Google called us back!');
    }
);

app.get('/failure', (req, res) => {
    return res.send('Failed to log in!');
});

app.get('/auth/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });  

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', checkLogin, api);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});




module.exports = app;