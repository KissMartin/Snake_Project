var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
let jatek = true;
let irany = "fel";

function delay(mennyi) {
    return new Promise(resolve => setTimeout(resolve, mennyi));
}

let kigyo = [400, 500, 400, 450, 400, 400, 400, 350];
let hossz = 4;

function KigyoFill(){
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
    
        kigyo.push(kigyo[(hossz*2)-2]+xIrany);
        kigyo.push(kigyo[(hossz*2)-1]+yIrany);

        context.clearRect(kigyo[0], kigyo[1], 50, 50);
    
        context.beginPath();
        context.strokeStyle = 'black';
        context.rect(kigyo[0], kigyo[1], 50, 50);
        context.stroke();
    
        kigyo.splice(0,2);
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