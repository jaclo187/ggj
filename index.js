'use strict';

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
      path: '/', //nodejaclo/',
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

app.use(helmet.noSniff())

app.get("/projects", (req, res) => {
  res.sendFile(__dirname + "/public/projects.html");
});

app.get("/participant", (req, res) => {
  res.sendFile(__dirname + "/public/participant.html");
});

const logger = (req, res, next) => {
  console.log("Loaded")
  console.log(req.session)
  next()
} 

if(DEBUG) app.use(logger)

app.use('/', express.static('public'));

const server = http.createServer(app);

const WebSocketServer = require('./components/ws.js')
const wss = new WebSocketServer(server, sess);

server.listen(PORT);