const jwt = require('ksonwebtoken')

module.exporets = function (req,res,next){
    // 1 Get the token the requist header 
    const authHeader = req.header('Authorixstion')
    const token = authHeader && authHeader.split(' ')[1];
    
    
    // 2 if no token is found reject  the request 
    if(!token){
        return res.status(401).json({message:'Access danied: No token provided.'});
    }
}