var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
let jatek = true;
let irany = "fel";

function delay(mennyi) {
    return new Promise(resolve => setTimeout(resolve, mennyi));
}

let kigyo = [400, 500, 400, 450, 400, 400, 400, 350];
let hossz = 4;

let alma = [];
let kigyoNo = false;

function almaGen(){
    let almaX = 0;
    let almaY = 0;
    let kigyoX = [];
    let kigyoY = [];

    let seged = true;
    kigyo.forEach(e => {
        if(seged) {
            seged = false;
            kigyoX.push(e/50);
        }
        else kigyoY.push(e/50);
    });

    while(almaX == 0 || kigyoX.includes(almaX)) almaX = Math.floor(Math.random() * 16);
    while(almaY == 0 || kigyoY.includes(almaY)) almaY = Math.floor(Math.random() * 16);
    alma[0] = almaX*50;
    alma[1] = almaY*50;

    context.fillStyle = "red";
    context.fillRect(alma[0], alma[1], 50, 50);
}

function KigyoFill(){
    context.fillStyle = "black";
    for(let i = 0; i < hossz*2; i += 2){
        context.fillRect(kigyo[i], kigyo[i+1], 50, 50);
    }
}
KigyoFill();

let xIrany = 0;
let yIrany = 0;

async function Jatek(){
    while(jatek){
        await delay(250);
    
        if(irany == "fel") {
            yIrany = -50;
            xIrany = 0;
        };
        if(irany == "le") {
            yIrany = 50;
            xIrany = 0;
        };
        if(irany == "jobb") {
            xIrany = 50;
            yIrany = 0;
        };
        if(irany == "bal") {
            xIrany = -50;
            yIrany = 0;
        };

        if(alma[0] == kigyo[(hossz*2)-2]+xIrany && alma[1] == kigyo[(hossz*2)-1]+yIrany){
            kigyoNo = true;
            hossz++;
            kigyo.push(alma[0]);
            kigyo.push(alma[1]);
            almaGen();
        }
        else{
            kigyo.push(kigyo[(hossz*2)-2]+xIrany);
            kigyo.push(kigyo[(hossz*2)-1]+yIrany);
        }
    
        if(kigyoNo) kigyoNo = false;
        else {
            context.clearRect(kigyo[0], kigyo[1], 50, 50);
    
            context.beginPath();
            context.strokeStyle = 'black';
            context.rect(kigyo[0], kigyo[1], 50, 50);
            context.stroke();
            
            kigyo.splice(0,2)
        };
        KigyoFill();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowLeft' && irany != "jobb") {
        irany = "bal";
    }
    else if (e.key == 'ArrowDown' && irany != "fel") {
        irany = "le";
    }
    else if (e.key == 'ArrowRight' && irany != "bal") {
        irany = "jobb";
    }
    else if (e.key == 'ArrowUp' && irany != "le") {
        irany = "fel";
    }
});

Jatek();
almaGen();