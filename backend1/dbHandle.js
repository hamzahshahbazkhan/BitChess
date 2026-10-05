// const {JWT_SECRET}= require("./config")
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_dev_only';

const jwt = require('jsonwebtoken')
const findUsername = (socket) => {
    const tokenFromAuth = socket.handshake.auth?.token;
    const authHeader = socket.handshake.headers?.['authorization'];
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromAuth || tokenFromHeader;
    if (!token) {
        throw new Error('Missing token');
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    //console.log(decoded)
    return decoded.username

}


module.exports = { findUsername }