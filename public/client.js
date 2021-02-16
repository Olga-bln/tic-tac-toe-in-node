"use strict";
//Helfer
const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));
const $on = (el, ev, fn) => {
    Array.isArray(el) ? el.forEach(o => $on(o, ev, fn)) :
        el.addEventListener(ev, fn);
    return el;
}
//Socket-ini
const socket = io.connect(); 
const handle = document.getElementById('handle');
let inner = handle.innerHTML;
const zelle = $$('div.cell');




//Aus der Dom
const msgAll = document.getElementById('pAll');
const msgPlayer = document.getElementById('player');
const msgRest = document.getElementById('errmsg');
const ende = document.getElementById('over');

console.log(inner);
const clickhandle = () => {
    let chosen = event.srcElement.id;
   
   socket.emit("klick", {
       clicked: chosen,
       must: inner
   });
};
//Listeners
const noPlayer = () => {
    socket.on("toLate", (message) => {
        msgRest.textContent =  message + "\n";
    });
}
const takeGame = () => {
          socket.on("messagex1", (message) => {
            msgPlayer.textContent =  message + "\n";
        });
          socket.on("messagex2", (message) => {
            msgAll.textContent =  message;
        });
          socket.on("messageO1", (message) => {
            msgPlayer.textContent = message;
        });
        socket.on("messageBegin", (message) => {
            
            msgAll.textContent = message + "\n";
            $on(zelle, "click", clickhandle);
        });
        
        socket.on("vollesFeld", (message) => {
            msgAll.textContent = message.msg;
        });
        socket.on("nichtDran", (message) => {
            msgAll.textContent = message.msg;
         });
         
        socket.on("ende", (message) => {
            msgAll.textContent = message.msg + (message.winner).toUpperCase();
            ende.classList.remove('invisible');
        });
        socket.on("draw", (message) => {
            msgAll.textContent = message.msg;
            ende.classList.remove('invisible');
        });
        socket.on("notUrTurn", (message) => {
            msgAll.textContent = message.msg;
        });
        socket.on("klickBack", (geklickt) => {
            
            document.getElementById(geklickt.cell).classList.add(geklickt.toggleMust);
            
            if(inner === "x" && geklickt.toggleMust == "x") {
                msgAll.textContent = "O" + geklickt.msg + "\n";
                handle.textContent = "o";
                inner = "o";
            }

            if(inner === "o" && geklickt.toggleMust == "o") {
                msgAll.textContent = "X" + geklickt.msg + "\n";
                handle.textContent = "x";
                inner = "x";
            }
            
           
        });
        
        
        socket.on("zugGemacht", (geklickt) => {
            document.getElementById(geklickt.feld).classList.add(geklickt.move); 
            document.getElementById(geklickt.feld).removeEventListener("click",clickhandle);
            msgAll.textContent = geklickt.msg + "\n";
           
        });

};



//Aufrufe

noPlayer();
takeGame();
