//Render Queue functions for kontraJS render loop
let rQ = {
    ui: [],
    bg: [],
    sp: []

};

function addRQUI(obj) {
    rQ.ui.push({obj});
}
function addRQBG(obj) {
    rQ.bg.push({obj});
}
function addRQSP(obj) {
    rQ.sp.push({obj});
}

function clearUI() {
    rQ.ui.length = 0;
    rQ.ui = [];
}