
const {getAllplanets}=require('../../../model/planets.model');
async function httpgetAllPlanets(req,res){
    console.log(`${(await getAllplanets()).at(1)['keplerName']}something is happening in plaent route`);
    return  res.status(200).json(await getAllplanets());
}

module.exports={httpgetAllPlanets};