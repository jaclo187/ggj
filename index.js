'use strict';

// ----- CONSTANTS AND PARAMETERS -----

const DEBUG = true
const PORT = 8080
const express = require('express')
const http = require('http')
const app = express()
const helmet = require('helmet')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const MySQLSessionOpts = require(__dirname + '/components/mysql_options.js').mysqlSessionOpts;
const sessionStore = new MySQLStore(MySQLSessionOpts);
const sessionOpts = {
    cookie: {
      path: '/',
      domain: "192.168.132.238",
      secure: false,
      expires: new Date(Date.now() + 86400000),
      httpOnly: true 
    },
    secret: 'moxqksyo',
    resave: false,
    saveUninitialized: true,
    name: 'test1.sid',
    key: 'globalgamejam',
    store: sessionStore,
    secure: true
};
const sess = session(sessionOpts);

// ----- MIDDLEWARE -----

app.use(sess);
app.use(helmet.noSniff())

// ----- ROUTING -----

app.get("/projects", (req, res) => {
  res.sendFile(__dirname + "/public/projects.html");
});

app.get("/participant", (req, res) => {
  if(req.session.loggedin) res.sendFile(__dirname + "/public/participant.html");
  else res.redirect('/');
});

app.get("/admin", (req, res) => {
  if(req.session.admin) res.sendFile(__dirname + "/public/admin.html");
  else res.redirect('/');
});


// ----- DEBUGGING ------

const logger = (req, res, next) => {
  //console.log("Loaded")
  //console.log(req.session)
  //console.log(req.connection.remoteAddress)
  next()
} 

if(DEBUG) app.use(logger);

// ----- STATIC ROUTING -----

app.use('/', express.static('public'));

// ----- SOCKET SERVER SETUP -----

const server = http.createServer(app);
const WebSocketServer = require('./components/ws.js')
const wss = new WebSocketServer(server, sess);

server.listen(PORT);