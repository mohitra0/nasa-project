const launchDatabase = require('./launcher.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');
const { options } = require('../src/app');
const launches = new Map;
let DEFAULT_FLIGHT_NUMBER = 100;
// const launcher = {
//     flightNumber: 100, // flight_number
//     mission: "Keplor exploration X", // name
//     Rocket: 'Expansion WOrld', // rocket.name
//     launchDate: new Date('December 27, 2024'), // date_local
//     target: "Kepler-1652 b", // not available
//     customer: "Mohit, thakur", //pauloads.customer for each payload
//     upcoming: true, // upcoming
//     success: true, // success
// }
// launches.set(launcher.flightNumber,launcher);
// saveLaunch(launcher);
const SPACEX_API = 'https://api.spacexdata.com/v4/launches/query';

async function populateDatabase(){
    const response=  await axios.post(SPACEX_API, {
        query: {},
        options: {
            pagination:false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
if(response.status!=200){
    console.log('Problem occur in downloading data');
    throw new Error("Downloading data is not Happening");
}
    const launchdocs=response.data.docs;
    launchdocs.forEach(launchdoc => {
        const payloads=launchdoc['payloads'];
       
        const customers=payloads.flatMap((payload) => {
            return payload['customers'];
        });
        // console.log(customers);
      const launch= {
            flightNumber: launchdoc['flight_number'],
            mission: launchdoc['name'], 
            Rocket: launchdoc['rocket']['name'], 
            launchDate: launchdoc['date_local'], 
            upcoming: launchdoc['upcoming'],
            success: launchdoc['success'], 
            customer:customers,
        }
        // console.log(`${launch.flightNumber} ${launch.mission}`);
        saveLaunch(launch);
    });
}
async function loadLaunch() {
    const firstLunach=await findLuanch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'falconSat'
    });
    if(firstLunach){
        console.log('Luanch Already Exits!');
    }else{
        populateDatabase();
    }
 
}
async function getFlugthNumber() {
    const flightnum = await launchDatabase.findOne().sort('-flightNumber');
    console.log('new flight number is' + flightnum.flightNumber);
    if (!flightnum) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return flightnum.flightNumber + 1;
}
async function addnewLuancher(addnewLaunch) {
    const planet = planets.findOne({
        keplerName: addnewLaunch.target,
    });
    if (!planet) {
        throw new Error('There is no such planet please check');
    }
    const newFlightNumber = await getFlugthNumber();
    const launcher = Object.assign(addnewLaunch, {
        flightNumber: newFlightNumber,
        customer: ["Shaila", "thakur"],
        upcoming: true,
        success: true,
    });
    await saveLaunch(launcher);
    console.log(addnewLaunch);

}
async function getAlllaunches(skip,limit) {
    return await launchDatabase.find({}, {
        '_id': 0,
        '__v': 0,
    }).skip(skip).limit(limit);
}
async function saveLaunch(launch) {
    await launchDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}
async function findLuanch(filter){
   return await launchDatabase.findOne(filter);
}
async function existLunachId(launchId) {
    return await findLuanch({flightNumber: launchId });
}
async function abortLaunch(launchId) {
    const abort = await launchDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });
    console.log(abort + launchId);
    return abort.modifiedCount == 1;
}
module.exports = { getAlllaunches, addnewLuancher, existLunachId, abortLaunch, loadLaunch };