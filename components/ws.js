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
              if(req.session && req.session.loggedin) {
                send('login',{success: true});
              }
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
                        req.session.loggedin !== true
                        )
                        {
                          const register = await conn.register(data.firstName, data.lastName, data.password, data.email, data.skill, data.newsletter);
                          switch (register.errno) {
                            case 1062:
                              send('registration', {success: false, message: "Email already in use"} )
                              break;
                            case undefined:
                              let login = await conn.login(data.email, data.password);
                              let rows = login[0]
                              req.session.loggedin = true;
                              req.session.userID = rows[0].idPerson;
                              req.session.save();
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
                      if(data.email && data.password && req.session.loggedin !== true){
                        console.log("Login")
                        let login = await conn.login(data.email, data.password);
                        let rows = login[0]
                        if (rows.length === 1) {
                          let loggedin = await bcrypt.compare(data.password, rows[0].dtPassword);
                          if (loggedin) {
                            req.session.loggedin = true;
                            req.session.userID = rows[0].idPerson;
                            let admin = await conn.admin(rows[0].idPerson);
                            if(admin[0][0].dtIsGranted) req.session.admin = true
                            req.session.save();
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

                    case 'getLocation':
                      let locations = await conn.getLocations();
                      break;

                    case 'logout' :
                      delete req.session.loggedin;
                      req.session.save();
                      req.session.regenerate(e=>console.log(e));
                      send("logout",{});
                      console.log('Logged out');
                      break;

                    case 'getUserData' :
                      let result = await conn.getUserData(req.session.userID);
                      if(result) {
                        send('userData', result[0]);
                      }
                      break;

                    case 'updateUser' :
                      let update = await conn.updateUser(data, req.session.userID);
                      if(update) {
                        send('updateUser', {message: 'success'});
                      }
                    break;

                    case 'updateTeams':
                      let teams = await conn.updateTeams();
                      if(teams){
                        send('updateTeams', teams[0]);
                      }
                    break;

                    case 'getUsers':
                      let users = await conn.getUsers();
                      if(users){
                        send('getUsers', users[0]);
                      }
                    break;

                    case 'deleteUser':
                      let user = data.userID;
                      if(user){
                        conn.deleteUser(user);
                      }
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