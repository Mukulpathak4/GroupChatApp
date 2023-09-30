const jwt = require("jsonwebtoken");
exports.generateWebToken=(id,name,groupId=1)=>{
    return jwt.sign({id:id,name:name,groupId:groupId},process.env.TOKEN_SECRET);
}