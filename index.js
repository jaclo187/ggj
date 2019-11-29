'use strict';

const DEBUG = true
const PORT = 8080
const express = require('express')
const http = require('http')
const app = express()
const helmet = require('helmet')

app.use(helmet.noSniff())
app.use(express.static('public'));

const logger = (req, res, next) => {
    console.log("Loaded")
    next()
} 

if(DEBUG) app.use(logger)

const server = http.createServer(app);

server.listen(PORT);