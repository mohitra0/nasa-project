const express = require('express');
const authrouter=express.Router();
const getSecret=require('./auth.controller');
console.log('router inside');
authrouter.get('/logout',getSecret.logout);
authrouter.get('/',getSecret.secert);
// authrouter.get('/',getSecret.logout);

module.exports=authrouter;
