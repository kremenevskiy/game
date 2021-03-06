const Player = require('./player')
const express = require('express');
const Food = require('./food')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')
const Room = require('./room')
const Vector = require('./vector')
const path = require('path')


const width = 1000;
const height = 1000;

const app = express();
const server = app.listen(process.env.PORT || 3000, 'localhost', listen);

function listen(){
    const host = server.address().address;
    const port = server.address().port;
    console.log("Server listening on http://" + host + ":" + port);
}


app.use(express.static('dist'));


const io = require('socket.io')(server);


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


io.on('connection', newConnection);
function newConnection(socket){
    console.log("New client: " + socket.id);
    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.UPDATE_INPUT, updatePlayer);
    socket.on(Constants.MSG_TYPES.NEW_BULLET, addBullet);
    socket.on(Constants.MSG_TYPES.CANVAS_GET, setCanvasSize);

    // update players
    socket.on(Constants.MSG_TYPES.DAMAGE_ADD, damage_add);
    socket.on(Constants.MSG_TYPES.DAMAGE_DEC, damage_dec);
    socket.on(Constants.MSG_TYPES.HEALTH_ADD, health_add);
    socket.on(Constants.MSG_TYPES.REGEN_ADD, regen_add);
    socket.on(Constants.MSG_TYPES.SPEED_ADD, speed_add);
    socket.on(Constants.MSG_TYPES.RELOAD_ADD, reload_add);
    socket.on(Constants.MSG_TYPES.RANGE_ADD, range_add);

    socket.on('disconnect', onDisconnect);
}




const room = new Room();
room.setup();
function joinGame(username){
    if (username === ""){
        username = "NoName";
    }
    console.log('New player joined the game: \nName: ' +  username + "Socket id: " + this.id);
    room.addPlayer(this, username);
}

// let cnt = 0;
function updatePlayer(update_data){
    // console.log('got new move from player!')
    // console.log(update_data)
    // if (cnt < 3) {
    //     console.log('before player update:')
    //     console.log(room.players[this.id]);
    // }
    const playerId = this.id;
    room.updatePlayer(playerId, update_data);
    // if (cnt < 3) {
    //     console.log('after updating')
    //     console.log(room.players[this.id])
    // }
    // cnt++;
}


function addBullet(dir){
    room.addBullet(this.id, dir);
}

function setCanvasSize(canvas_size) {
    room.updatePlayerCanvas(this.id, canvas_size);
}


function onDisconnect(){
    console.log("Player: " + this.id + " disconnected!");
    room.removePlayer(this);
}


function damage_add(damageData) {
    room.upgradePlayer(this.id, damageData);
}

function damage_dec(damageData) {
    room.upgradePlayer(this.id, damageData);
}

function health_add(healthData) {
    room.upgradePlayer(this.id, healthData);
}

function speed_add(speedData) {
    room.upgradePlayer(this.id, speedData);
}

function regen_add(regenData) {
    room.upgradePlayer(this.id, regenData);
}


function reload_add(reloadData) {
    room.upgradePlayer(this.id, reloadData);
}

function range_add(rangeData) {
    room.upgradePlayer(this.id, rangeData);
}