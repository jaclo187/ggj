'use strict';

const DEBUG = true
const PORT = 8080
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.status(200).json({Status:"All OK!"})
})

app.listen(PORT);