const launches=require('../../../model/launcher.model');
const {getQuery}=require('../../../src/services/query');

   async function httpGetAlllaunches(req,res){
        console.log(`launches.getAlllaunches`);
        const {skip,limit}=getQuery(req.query);
        const launch=await launches.getAlllaunches(skip,limit);
        return res.status(200).json(launch);
    }

   async function httpAddNewLaunch(req,res){
        const launch=req.body;
        if(!launch.mission|| !launch.rocket ||!launch.launchDate||!launch.target){
        
            console.table(req.body);

            return res.status(400).json({
           error: 'Missing Luanch Item',
            });
        }
        launch.launchDate=new Date(launch.launchDate);
        if(isNaN(launch.launchDate)){
            return res.status(400).json({
                error: 'Invalid date item',
                 });
        }
       await launches.addnewLuancher(launch);
        console.log(`post launch`);
        return res.status(200).json(launch);
    }
    
   async function httpAbortLaunch(req,res){
        const launchId=Number(req.params.id);
        const existLaunch=await launches.existLunachId(launchId);

        if(!existLaunch){
            console.log(`something is hPPENING ${launchId}`);
            return res.status(404).json({
                error:'Test not found',
            })
        }
  

        const abort=await launches.abortLaunch(launchId);
        if(abort==true){
            return res.status(200).json({
                ok:true
            })
        }else{
            return res.status(404).json({
                error:'Could not find the flightnumber'
            });
        }
       

        
    }
    module.exports={httpGetAlllaunches,httpAddNewLaunch,httpAbortLaunch};