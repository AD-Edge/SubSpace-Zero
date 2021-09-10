//Render Queue functions for kontraJS render loop

let renderQueue = {
    ui: [],
    background: [],
    sprite: []

};

function addToRenderQueueUI(obj) {
    renderQueue.ui.push({obj});
}
function addToRenderQueueBG(obj) {
    renderQueue.background.push({obj});
}
function addToRenderQueueSPR(obj) {
    renderQueue.sprite.push({obj});
}