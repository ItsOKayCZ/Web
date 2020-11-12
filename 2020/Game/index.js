const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 8080;

app.use(express.static('static'));

app.use('/scanner', (req, res, next) => {
    res.sendFile(__dirname + '/static/scanner.html');
})

io.on('connection', (socket) => {
})

http.listen(PORT, () => {
    console.log('Listening on PORT ' + PORT);
})