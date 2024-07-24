const {JWT_SECRET}= require("./config")
const jwt = require('jsonwebtoken')
const findUsername=(socket)=>{
    const token = socket.handshake.headers['authorization'].split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log(decoded)
    return decoded.username

}


module.exports={findUsername}