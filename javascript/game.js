var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
let halalKiir = document.querySelector('.halalKiir');
let jatekGomb = document.querySelector('.jatekGomb');
let jatek = true;
let almak = [];
let almakX = [];
let almakY = [];
let vettFelAlmat = false;
let almakSzama = 0;
let elsoAlma = true;
let voltInput = false;
let irany = "fel";
let neFill = false;
let score = 0;
let scoreKiir = document.querySelector('#score');

function delay(mennyi) {
    return new Promise(resolve => setTimeout(resolve, mennyi));
}

let kigyo = [400, 500, 400, 450, 400, 400, 400, 350];
let hossz = 4;

let kigyoNo = false;

function almaGen(){
    if(elsoAlma) almakSzama = document.querySelector('#almakSzama').value;
    else almakSzama = 1;
    elsoAlma = false;
    for (let i = 0; i < almakSzama; i++) {
        let almaX = -1;
        let almaY = -1;
        let kigyoX = [];
        let kigyoY = [];
    
        let seged = true;
        kigyo.forEach(e => {
            if(seged) {
                seged = false;
                kigyoX.push(e/50);
            }
            else {
                seged = true;
                kigyoY.push(e/50);
            };
        });

        AlmakXY();

        let ujra = true;
        while(almaX < 0 || almaY < 0 || ujra){
            ujra = false;
            almaX = Math.floor(Math.random() * 17);
            almaY = Math.floor(Math.random() * 17);
            if(kigyoX.includes(almaX)){
                let index = 0;
                kigyoX.forEach(e => {
                    if(almaX == e && almaY == kigyoY[index]){
                        ujra = true;
                    }
                    index++;
                });
            }

            if(almakX.includes(almaX)){
                let index = 0;
                almakX.forEach(e => {
                    if(almaX == e && almaY == almakY[index]){
                        ujra = true;
                    }
                    index++;
                });
            }
    
        }
        almak.push(almaX*50);
        almak.push(almaY*50);
    
        context.fillStyle = "red";
        context.fillRect(almaX*50, almaY*50, 50, 50);
    }
}

function AlmakXY(){
    let seged = true;
    almak.forEach(e => {
        if(seged) {
            seged = false;
            almakX.push(e/50);
        }
        else {
            seged = true;
            almakY.push(e/50);
        };
    });
}

function KigyoFill(){
    let szinseged = 155;
    for(let i = 0; i < hossz*2; i += 2){
        if(i == hossz*2-2) context.fillStyle = "yellow";
        else {
            context.fillStyle = `rgb(85, ${szinseged}, 75)`
        };
        context.fillRect(kigyo[i], kigyo[i+1], 50, 50)
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
    AlmakXY();
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

        let kovX = kigyo[(hossz*2)-2]+xIrany;
        let kovY = kigyo[(hossz*2)-1]+yIrany;

        let kovX2 = kigyo[(hossz*2)-2];
        let kovY2 = kigyo[(hossz*2)-1];

        let kigyoX = [];
        let kigyoY = [];
    
        let seged = true;
        kigyo.forEach(e => {
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
            //KigyoVissza();
            //KigyoFill();
            halal();
        }

        if((kovX2 == 0 && irany == "bal")||(kovX2 == 800 && irany == "jobb")||(kovY2 == 0 && irany == "fel")||(kovY2 == 800 && irany == "le")){
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

        //alma
        let index = 0;
        almakX.forEach(e => {
            //lefut amikor nem kéne
            if(kovX/50 == e && kovY/50 == almakY[index] && !vettFelAlmat){
                kigyoNo = true;
                vettFelAlmat = true;
                hossz++;
                kigyo.push(almakX[index]*50);
                kigyo.push(almakY[index]*50);
                almak.splice(index,2);
                score++;
                scoreKiir.innerHTML = score;
                almaGen();
            }
            index++;
        });
        
        vettFelAlmat = false;

        if(!kigyoNo){
            kigyo.push(kovX);
            kigyo.push(kovY);
        }
    
        if(kigyoNo) kigyoNo = false;
        else {
            if(jatek && !neFill){
                context.clearRect(kigyo[0], kigyo[1], 50, 50);
    
                context.beginPath();
                context.strokeStyle = 'black';
                context.rect(kigyo[0], kigyo[1], 50, 50);
                context.stroke();
                
                kigyo.splice(0,2)
            }
        };
        if(jatek && !neFill) KigyoFill();

        voltInput = false;
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowLeft' && irany != "jobb" && !voltInput) {
        irany = "bal";
        voltInput = true;
    }
    else if (e.key == 'ArrowDown' && irany != "fel" && !voltInput) {
        irany = "le";
        voltInput = true;
    }
    else if (e.key == 'ArrowRight' && irany != "bal" && !voltInput) {
        irany = "jobb";
        voltInput = true;
    }
    else if (e.key == 'ArrowUp' && irany != "le" && !voltInput) {
        irany = "fel";
        voltInput = true;
    }
});

function UjJatek(){
    jatekGomb.removeEventListener('click', UjJatek);
    Clear();
    almak = [];
    kigyo = [400, 500, 400, 450, 400, 400, 400, 350];
    KigyoFill();
    score = 0;
    scoreKiir.innerHTML = score;
    elsoAlma = true;
    irany = "fel";
    hossz = 4;
    jatek = true;
    Jatek();
}

function Clear(){
    for (let i = 0; i < almak.length; i+=2) {
        context.clearRect(almak[i], almak[i+1], 50, 50);
    
        context.beginPath();
        context.strokeStyle = 'black';
        context.rect(almak[i], almak[i+1], 50, 50);
        context.stroke();
    }

    for (let i = 0; i < kigyo.length; i+=2) {
        context.clearRect(kigyo[i], kigyo[i+1], 50, 50);
    
        context.beginPath();
        context.strokeStyle = 'black';
        context.rect(kigyo[i], kigyo[i+1], 50, 50);
        context.stroke();
    }
}

function halal(){
    halalKiir.innerHTML = "Meghaltál!";
    jatek = false;
    jatekGomb.value = "Új játék";
    jatekGomb.addEventListener('click', UjJatek);
}

function KigyoVissza(){
    console.log(1)
    let seged = true;
    let index = 0;
    kigyo.forEach(e => {
        if(seged) {
            seged = false;
            kigyo[index]-=xIrany;
        }
        else{
            seged = true;
            kigyo[index]-=yIrany;
        };
        index++;
    });
}

jatekGomb.addEventListener('click', Jatek);