const PORT =process.env.PORT || 2000;
const fs=require('fs');
const https = require('https');
require('dotenv').config();
const app = require('./app');
const {mongoConnect} = require('./services/mongo');
const {loadData}=require('../model/planets.model');
const {loadLaunch}=require('../model/launcher.model');

const server=https.createServer({  
        key:fs.readFileSync('.././key.pem'),
        cert:fs.readFileSync('.././cert.pem'),
    },app);

async function startserver(){
    await mongoConnect();
    await loadData();
    await loadLaunch();
    server.listen(PORT,()=>{
        console.log(`WHICH ${PORT}`);
        });
        console.log(PORT);
}

startserver();


// to create pesonal certificate      
//openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365