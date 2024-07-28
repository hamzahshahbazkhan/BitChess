// const {JWT_SECRET}= require("./config")
// require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken')
const findUsername = (socket) => {
    const token = socket.handshake.headers['authorization'].split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    //console.log(decoded)
    return decoded.username

}


module.exports = { findUsername }