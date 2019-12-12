module.exports = class WebSocketServer{

    constructor(server, session){
        const WebSocketServer = require('ws').Server;
        const wss = new WebSocketServer({server});
        const conn = require('./db');
        const bcrypt = require('bcryptjs');

        console.log("Websocket Server starting...")

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

            console.log("WSS CONNECTION INITIALIZED");

            socket.on('message', async data => {
              try {

                data = JSON.parse(data)

                if(data && data.command){

                  switch (data.command) {

                    case 'register':
                      await conn.register(data.firstName, data.lastName, data.password, data.email, data.skill, data.newsletter);
                      console.log(data);
                      console.log("Registration done");
                      break;
                  
                    case 'login':
                      console.log(conn.login());
                      break;

                    case 'registerAdmin':
                      conn.registerAdmin(data.email, data.name);
                      break;

                    case 'update':
                      conn.update();
                      break;

                    default:
                      break;

                  }

                }
                
              } catch (error) {
                console.dir(error)
              }
            });

        })
        
    }

};