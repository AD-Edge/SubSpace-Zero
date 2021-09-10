//  JS13K SUBSPACE ZERO  //
//  By Alex Delderfield  //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Button, Sprite, initPointer, track, bindKeys, Text } = kontra;

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

var cmpIMG = document.getElementById('compileIMG');

/////////////////////////////////////////////////////
//GAME FUNCTIONS
/////////////////////////////////////////////////////


//Run on game start
function InitGameState() {


}

/////////////////////////////////////////////////////
//PRIMARY GAME LOOP
/////////////////////////////////////////////////////
const loop = GameLoop({
    update: () => {
        if(gameState == 0) { //Start-Menu
            if(stateInit == false) {
                InitUI();
                InitGameState();
                stateInit = true;
            }
        }else if (gameState == 1) { //Setup
        }else if (gameState == 2) { //Game
        }else if (gameState == 3) { //Death
        }
    },
    render: () => {

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