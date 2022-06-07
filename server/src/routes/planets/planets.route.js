const express=require('express');
const gettAllPlanets=require('./planets.controller');
const planetrouter=express.Router();
planetrouter.get('/',gettAllPlanets.httpgetAllPlanets);
module.exports=planetrouter;