'use strict';

const DEBUG = true
const PORT = 8080
const express = require('express')
const http = require('http')
const app = express()

app.use(express.static('public'));

const server = http.createServer(app);

server.listen(PORT);