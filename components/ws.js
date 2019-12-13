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

                      if(
                        /^.{1,50}$/.test(data.firstName) &&
                        /^.{1,50}$/.test(data.lastName) &&
                        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/.test(data.password) &&
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) &&
                        data.skill !== "" &&
                        data.newsletter !== "" &&
                        !req.session.loggedin
                        )

                        {

                          const register = await conn.register(data.firstName, data.lastName, data.password, data.email, data.skill, data.newsletter);

                          switch (register.errno) {

                            case 1062:
                              send('registration', {success: false, message: "Email already in use"} )
                              break;

                            case undefined:
                                req.session.loggedin = true;
                              send('registration', {success: true} )
                              break;

                            default:
                              send('registration', {success: false, message: "An error occured"} );
                              break

                          }
                        }

                      else{
                        send('registration', {success: false, message: "You submitted wrong data"} );
                      }

                      break;
                  
                    case 'login':
                      
                      if(data.email && data.password && !req.session.loggedin){
                        console.log("Login")
                        let login = await conn.login(data.email, data.password);
                        
                        let rows = login[0]
                        if (rows.length === 1) {
                          
                          let loggedin = await bcrypt.compare(data.password, rows[0].dtPassword);
                          if (loggedin) {
                            req.session.loggedin = true;
                            send('login', {success: true});
                          }
                          else send('login', {success: false, message: "Invalid credentials"});
                        } 
                        else {
                          send('login', {success: false, message: "Invalid credentials"});
                        }

                      }

                      break;

                    case 'registerAdmin':
                      conn.registerAdmin(data.email, data.name);
                      break;

                    case 'updateUser':
                      
                      conn.updateUser();
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