"use strict";

const IP = "127.0.0.1";
const PORT = 8081;

//const { ENGINE_METHOD_PKEY_ASN1_METHS } = require("constants");
const express = require("express");
const app = express();
app.use(express.static("public"));

// socket.io initialization
const http = require("http");
const socketIo = require("socket.io");
const webServer = http.Server(app);
const io = socketIo(webServer);
let gameMod = require("./GameModule.js");


const gewonnen = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

let board = [
    "","","",
    "","","",
    "","",""
]

//Nachrichten an die beiden Spieler
const allMsg = {
    win: "Spiel beendet: gewonnen hat Spieler ",
    draw: "Das Spiel endet unentschieden!",
    msgX1: "Sie sind Spieler X.",
    msgX2: " -Bitte warten Sie auf Ihren Gegner!",
    msgO1: "Sie sind Spieler O.",
    msgBegin: ["Zwei Spieler verbunden.", "Das Spiel kann beginnen!", "Spieler X beginnt."],
    nextTurn: " ist an der Reihe.",
    wrong: "Dieses Feld ist bereits besetzt.",
    wrongTurn: "Sie sind nicht an der Reihe.",
    toLate: "Es sind schon genug Spieler vorhanden!"
}

let player = [];
let currentClick = '';
let currentClicker = '';
let must = '';






// log incoming connection
io.on("connection", socket => {
    console.log(
     `new client (${socket.id}) connected from ${socket.conn.remoteAddress}`
    );
    player.push(socket.id);

    socket.on('disconnect', function() {
        let bye = socket.id;
        player.splice(player.indexOf(socket.id), 1);
        console.log(bye + " has left");
    });

const playerX = player[0];
const playerO = player[1];

const hello = (playerX, playerO) => {
//massages emit to client(s)
io.to(playerX).emit("messagex1", allMsg.msgX1);
io.to(playerX).emit("messagex2", allMsg.msgX2);
io.to(playerO).emit("messageO1", allMsg.msgO1);

if(player.length === 2) {
    io.emit("messageBegin", allMsg.msgBegin);
}

if(player.length >= 3) {
    const noPlayer = player.slice(2);
    noPlayer.map(() => {socket.emit("toLate", allMsg.toLate)});
    }
};


        hello(playerX, playerO);

        function move(clicked) {
            currentClick = clicked.clicked;
            currentClicker = socket.id;
            must = clicked.must;
            console.log(`Es hat gerade ${currentClicker} auf ${currentClick} geklickt.`);
            console.log(must);
            
            
        };
        function fillBoard() {
            if(board[currentClick] == "") {
                board[currentClick] = `${must}`;
                console.log(board);
                io.emit("klickBack", {
                    cell:currentClick,
                    board: board,
                    toggleMust: must,
                    msg: allMsg.nextTurn
                });
                console.log(must);
                
            }else{
                    socket.emit("vollesFeld", {
                    msg: allMsg.wrong
                    });
            };
        }

        function sayNo() {
            socket.emit("notUrTurn", {
                msg: allMsg.wrongTurn
                });
        }

        function checkMove() {
            console.log("zeile 134 ",(typeof must),currentClicker,playerX);
            if(must == "x" && currentClicker == playerX) {
                console.log("treffer X");
                fillBoard();
            }
            if(must === "o" && currentClicker === playerO) {
                console.log("treffer O");
                fillBoard();
            }
            if(must === "x" && currentClicker === playerO) {
                console.log("Nein-treffer O");
                sayNo();
            }
            if(must === "o" && currentClicker === playerX) {
                console.log("nein-treffer X");
                sayNo();
            }
        };
        function isWin(move) {
            return gewonnen.some(komb => {
              return komb.every(index => {
                return board[index].includes(move)
              })})};
        
        function isDraw(board) {
            if(!board.includes('')){
                //console.log(allMsg.draw);
                return true;
            }
        };

        function vorbei(unentschieden) {
            if (unentschieden) {
                io.emit("draw", {
                    msg: allMsg.draw
                });
              };
         
        };
        const checkWin = () => {
            console.log(must);
            
            if (isWin(must)) {
                io.emit("ende", {
                    winner: must,
                    msg: allMsg.win
                    });
              } else if (isDraw(board)) {
                vorbei(true);
              } else {
                return;
                }
                
        };

        socket.on("klick", (clicked) => {

        move(clicked);
        checkMove();
        checkWin();
        });
        

 
});


webServer.listen(PORT, IP, () => {
    console.log(`Server rennt auf http://${IP}:${PORT}/`);
});
