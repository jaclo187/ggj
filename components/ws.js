module.exports = class WebSocketServer{

    constructor(server, session){
        const WebSocketServer = require('ws').Server;
        const wss = new WebSocketServer({server});
        const conn = require('./db');
        const bcrypt = require('bcryptjs');

        wss.on('connection', (socket, req) => {
            const send = (msg, options) => {
              const obj = {};
              Object.assign(obj, {msg: msg}, options);
              socket.send(JSON.stringify(obj));
            };
      
            session(req, {}, ()=> {
              if(req.session && req.session.loggedin) send('login',{success: true});
            });
      
            socket.on('error', err => {
              console.dir(err);
            });

            console.log("WSS INITIALIZED")
            console.log(req);

        })
        
    }

};