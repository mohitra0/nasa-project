const express = require('express');
const planetrouter = require('./planets/planets.route');
const launcherrouter = require('./launcher/launcher.router');
const authrouter = require('./auth/auth.router');

const api=express.Router();
console.log('Api inside');
api.use('/secret',authrouter);
// api.use('/auth',authrouter);
api.use('/planets',planetrouter);
api.use('/launches',launcherrouter);

module.exports=api;