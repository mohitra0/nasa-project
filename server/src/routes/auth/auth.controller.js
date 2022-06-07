
async function secert(req,res){
    console.log('Prinintg Secert');
    return  res.status(200).send('This is your main Secret');
}
async function logout(req,res){
    console.log('Prinintg logout');
   await req.logout();
    return res.redirct('/');
}

module.exports={secert,logout};