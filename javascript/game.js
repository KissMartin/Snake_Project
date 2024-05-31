var canvas = document.getElementById('gameCanvas');
window.context = canvas.getContext('2d');
let halalKiir = document.querySelector('.halalKiir');
let jatekGomb = document.querySelector('.jatekGomb');
window.jatek = true;
window.hossz = 4;
window.almaMax = (canvas.width/50) * (canvas.height/50) - window.hossz;
let felvettAlmak = 0;
let voltInput = false;
window.irany = "fel";
let neFill = false;
let score = 0;
let scoreKiir = document.querySelector('#score');

function delay(mennyi) {
    return new Promise(resolve => setTimeout(resolve, mennyi));
}

window.kigyo = [400, 500, 400, 450, 400, 400, 400, 350];



window.alma = [];
let kigyoNo = false;

function almaGen(inputX = null, inputY = null){
    let almaX = -1;
    let almaY = -1;
    let kigyoX = [];
    let kigyoY = [];

    let seged = true;
    window.kigyo.forEach(e => {
        if(seged) {
            seged = false;
            kigyoX.push(e/50);
        }
        else kigyoY.push(e/50);
    });

    if(inputX == null || inputY == null){
        while(almaX < 0 || kigyoX.includes(almaX)) almaX = Math.floor(Math.random() * 17);
        while(almaY < 0 || kigyoY.includes(almaY)) almaY = Math.floor(Math.random() * 17);
    }
    else{
        almaX = inputX;
        almaY = inputY;
    }
    window.alma[0] = almaX*50;
    window.alma[1] = almaY*50;

    window.context.fillStyle = "red";
    window.context.fillRect(window.alma[0], window.alma[1], 50, 50);
}

function KigyoFill(){
    let szinseged = 155;
    for(let i = 0; i < window.hossz*2; i += 2){
        if(i == window.hossz*2-2) window.context.fillStyle = "yellow";
        else {
            window.context.fillStyle = `rgb(85, ${szinseged}, 75)`
        };
        window.context.fillRect(window.kigyo[i], window.kigyo[i+1], 50, 50)
        szinseged += 25
        if(szinseged == 280) szinseged = 155;
    }
}
KigyoFill();

let xIrany = 0;
let yIrany = 0;

async function Jatek(){
    jatekGomb.removeEventListener('click',Jatek);
    almaGen();
    while(window.jatek){
        await delay(250);
    
        if(window.irany == "fel") {
            yIrany = -50;
            xIrany = 0;
        };
        if(window.irany == "le") {
            yIrany = 50;
            xIrany = 0;
        };
        if(window.irany == "jobb") {
            xIrany = 50;
            yIrany = 0;
        };
        if(window.irany == "bal") {
            xIrany = -50;
            yIrany = 0;
        };

        let kovX = window.kigyo[(window.hossz*2)-2]+xIrany;
        let kovY = window.kigyo[(window.hossz*2)-1]+yIrany;

        let kovX2 = window.kigyo[(window.hossz*2)-2];
        let kovY2 = window.kigyo[(window.hossz*2)-1];

        let kigyoX = [];
        let kigyoY = [];
    
        let seged = true;
        window.kigyo.forEach(e => {
            if(seged) {
                seged = false;
                kigyoX.push(e);
            }
            else{
                seged = true;
                kigyoY.push(e);
            };
        });

        //halal
        if(kovX2 == -50 || kovX2 == 850 || kovY2 == -50 || kovY2 == 850){
            halal();
        }

        if((kovX2 == 0 && window.irany == "bal")||(kovX2 == 800 && window.irany == "jobb")||(kovY2 == 0 && window.irany == "fel")||(kovY2 == 800 && window.irany == "le")){
            neFill = true;
        }
        else neFill = false;

        if(kigyoX.includes(kovX)){
            let index = 0;
            kigyoX.forEach(e => {
                if(kovX == e && kovY == kigyoY[index]){
                    halal();
                }
                index++;
            });
        }

        if(window.alma[0] == window.kigyo[(window.hossz*2)-2]+xIrany && window.alma[1] == window.kigyo[(window.hossz*2)-1]+yIrany){
            kigyoNo = true;
            window.hossz++;
            window.kigyo.push(window.alma[0]);
            window.kigyo.push(window.alma[1]);
            score++;
            scoreKiir.innerHTML = score;
            felvettAlmak++;
            almaGen();
        }

        if(!kigyoNo){
            window.kigyo.push(kovX);
            window.kigyo.push(kovY);
        }
    
        if(kigyoNo) kigyoNo = false;
        else {
            if(window.jatek && !neFill){
                window.context.clearRect(window.kigyo[0], window.kigyo[1], 50, 50);
    
                window.context.beginPath();
                window.context.strokeStyle = 'black';
                window.context.rect(window.kigyo[0], window.kigyo[1], 50, 50);
                window.context.stroke();
                
                window.kigyo.splice(0,2)
            }
        };
        if(window.jatek && !neFill) KigyoFill();

        if(almaMax == felvettAlmak){
            halalKiir.innerHTML = "Nyertél";
            window.jatek = false;
        }

        voltInput = false;
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowLeft' && window.irany != "jobb" && !voltInput) {
        window.irany = "bal";
        voltInput = true;
    }
    else if (e.key == 'ArrowDown' && window.irany != "fel" && !voltInput) {
        window.irany = "le";
        voltInput = true;
    }
    else if (e.key == 'ArrowRight' && window.irany != "bal" && !voltInput) {
        window.irany = "jobb";
        voltInput = true;
    }
    else if (e.key == 'ArrowUp' && window.irany != "le" && !voltInput) {
        window.irany = "fel";
        voltInput = true;
    }
});

function UjJatek(){
    jatekGomb.removeEventListener('click', UjJatek);
    Clear();
    window.alma = [];
    window.kigyo = [400, 500, 400, 450, 400, 400, 400, 350];
    KigyoFill();
    score = 0;
    scoreKiir.innerHTML = score;
    window.irany = "fel";
    window.hossz = 4;
    window.jatek = true;
    Jatek();
}

function Clear(){
    for (let i = 0; i < window.kigyo.length; i+=2) {
        window.context.clearRect(window.kigyo[i], window.kigyo[i+1], 50, 50);
    
        window.context.beginPath();
        window.context.strokeStyle = 'black';
        window.context.rect(window.kigyo[i], window.kigyo[i+1], 50, 50);
        window.context.stroke();
    }

    window.context.clearRect(window.alma[0], window.alma[1], 50, 50);
    
    window.context.beginPath();
    window.context.strokeStyle = 'black';
    window.context.rect(window.alma[0], window.alma[1], 50, 50);
    window.context.stroke();
    
    window.kigyo.splice(0,2)
}

function halal(){
    halalKiir.innerHTML = "Meghaltál!";
    window.jatek = false;
    jatekGomb.value = "Új játék";
    jatekGomb.addEventListener('click', UjJatek);
}

function KigyoVissza(){
    console.log(1)
    let seged = true;
    let index = 0;
    window.kigyo.forEach(e => {
        if(seged) {
            seged = false;
            window.kigyo[index]-=xIrany;
        }
        else{
            seged = true;
            window.kigyo[index]-=yIrany;
        };
        index++;
    });
}

jatekGomb.addEventListener('click', Jatek);