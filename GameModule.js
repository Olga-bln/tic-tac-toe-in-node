
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



