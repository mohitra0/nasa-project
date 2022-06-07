const express = require('express');
const launchrouter=express.Router();
const getAlllaunches=require('./launcher.controller');
console.log('router inside');
launchrouter.post('/',getAlllaunches.httpAddNewLaunch);
launchrouter.get('/',getAlllaunches.httpGetAlllaunches);
launchrouter.delete('/:id',getAlllaunches.httpAbortLaunch);

module.exports=launchrouter;
