//  JS13K SUBSPACE ZERO  //
//  By Alex Delderfield  //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, GameObject, Button, Sprite, initPointer, track, bindKeys, Text } = kontra;

//Get components
const { canvas, context } = init();

initPointer();
kontra.initKeys();

//Primary Game State
//0 = Start screen/zone
//1 = Tutorial area
//2 = Game area
//3 = Death 
var gameState = 0;
var stateInit = false;
var preSetup = false;
var initProcessing = false;

var titleObj = null;
var startObj = null;

var cmpIMG = document.getElementById('compileIMG');

//Array for stars
var blocks = [];
var blocksB = [];

var tmX = 10; 
var tmZ = 15;
var tXX = 0 
var tZZ = 0;
var tgX = false; 
var tgZ = false;

/////////////////////////////////////////////////////
//GAME FUNCTIONS
/////////////////////////////////////////////////////

//Create star particles
function CreateStarBlock(array, d, s) {

    let rY = Math.random() * 1 + s; 

    const block = Sprite({
        type: 'block',
        x: Math.floor(Math.random() * (canvas.width*2 - 0)) + 0,
        y: Math.floor(Math.random()* canvas.width) + 1,
        color: 'white',
        width: d,
        height: d,
        dy: rY/1.75,
        dx: -rY,
    });
    array.push(block);
    //console.log(block); 
}

function TitleGlitch() {
    //get a title letter
        if(tgX) {if((Math.floor(tmX))==1 || (Math.floor(tmX))==3 || (Math.floor(tmX))==5){
                ClearTitle(); } }
        if(tmX <= 0) {
            tgX = !tgX;
            if(tgX) { //glitch on
                tXX = Math.floor(Rand(0,12));       
                tmX = Rand(0.3,10);
                //console.log("glitch reset");
            } else { //glitch off
                tmX = Rand(5,10);
                tXX=-1;
                ClearTitle();
            }
        } else {
            tmX -= 0.1;
        }

        if(tgZ) {if((Math.floor(tmZ))==1 || (Math.floor(tmZ))==3 || (Math.floor(tmZ))==5){
                ClearTitle(); } }
        if(tmZ <= 0) {
            tgZ = !tgZ;
            if(tgZ) { //glitch on
                tZZ = Math.floor(Rand(0,12));       
                tmZ = Rand(0.3,10);
                //console.log("glitch reset");
            } else { //glitch off
                tmZ = Rand(5,10);
                tZZ=-1;
                ClearTitle();
            }
        } else {
            tmZ -= 0.1;
        }
}

function ClearTitle() {

    titleObj = null;
    InitTitleObject(tXX,tZZ);

}

//Run on game start
function InitGameState() {
    console.log('Init Game State');
    
    InitTitleObject(-1, -1);
    InitPlayButton();
    InitTxtObj("by alex delderfield for js13k", 130, 300, sm);

    //generate falling stars
    for (let i=0; i < 8; i++) {
        CreateStarBlock(blocks, 4, 2);
        //0.05 for subspace, 2 for normal space ? 
    }
    //generate falling stars below
    for (let i=0; i < 10; i++) {
        CreateStarBlock(blocksB, 2, 0.2);
    }
    
}

/////////////////////////////////////////////////////
//PRIMARY GAME LOOP
/////////////////////////////////////////////////////
const loop = GameLoop({
    update: () => {
        if(gameState == 0) { //Start/Menu

            //kickoff first
            if(!initProcessing && !preSetup) {
                InitPreUI();
                preSetup = true;
                //calls all process functions for graphics
            }
            //kicked off second, once images are generated
            if(!stateInit && initProcessing) {
                InitUI();
                InitGameState();
                stateInit = true;
            }
            //ongoing menu processes
            if(stateInit) {
                TitleGlitch();
            }

        //Star Blocks
        blocks.map(block => {
            block.update();
            if(block.y > canvas.height || block.x < 0) {
                block.y = -block.height;
                block.x = Math.floor(Math.random() * (canvas.width*2 - 0)) + 0;
                //console.log("new coords: " + block.x + ", " + block.y);
            }
        });
        blocksB.map(block => {
            block.update();
            if(block.y > canvas.height || block.x < 0) {
                block.y = -block.height/2;
                block.x = Math.floor(Math.random() * (canvas.width*2 - 0)) + 0;
            }
        });

        }else if (gameState == 1) { //Setup
        }else if (gameState == 2) { //Game
        }else if (gameState == 3) { //Death
        }
    },
    render: () => {
        if(gameState == 0) { //Start/Menu
            blocksB.map(block => block.render());

            //render out each object in the render queue
            renderQueue.ui.forEach(element => {
                element.obj.render();
            });

            if(titleObj) {
                titleObj.render();
            }
            if(startObj) {
                startObj.render();
            }

            blocks.map(block => block.render());

        }else if (gameState == 1) { //Setup
        }else if (gameState == 2) { //Game
        }else if (gameState == 3) { //Death
        }
    }
});

loop.start();

/////////////////////////////////////////////////////
//BUTTONS/INPUT
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//SFX
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//MUSIC
/////////////////////////////////////////////////////