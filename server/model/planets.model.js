const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const planets = require('./planets.mongo');
function isHabitatl(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadData() {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '../data/kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitatl(data)) {
                    saveplanet(data);
                }
            }).on('error', (error) => {
                console.log(error);
                reject(error);
            }).on('end',async () => {
                const countPlanet=await planets.find({});
                console.log(`${countPlanet.length}  planets are found for real okay`);
                resolve();
            })
    });

}

async function getAllplanets() {
    return await planets.find({});
}
async function saveplanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true,
        });
    } catch (err) {
        console.log(`could not save data ${err}`)
    }
}
module.exports = {
    loadData,
    getAllplanets,
};