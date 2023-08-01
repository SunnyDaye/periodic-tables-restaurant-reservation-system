const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
 const {HOST, PORT} = process.env;
 


app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });
 
 app.get('/dashboard', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

 app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
 });