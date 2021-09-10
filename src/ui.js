//User interface setup

function InitUI() {
    ProcessTestLetters();
}

//Process Letters and Numbers 
function ProcessTestLetters() {
    console.log("//Need to load " + tl.length + " sprites//");
    for(var i=0; i< tl.length; i++) {
        //decompile
        DecompileDrawSprite(tl[i], 0, 0, 5, cmpIMG);
        ConvertCanvastoImageData(cmpIMG, false); 
    }
}

function ProcessTestLetterImages() {
    for(var i=0; i< blobArr.length; i++) {
        const newImg = new Image();
        newImg.src = URL.createObjectURL(blobArr[i]);

        //set image size 
        newImg.width = tl[i].charAt(0) * 4;
        newImg.height = tl[i].charAt(2) * 4;

        imageArray.push(newImg);
    }
    initProcessing = true;
    console.log("Images generated: " + imageArray.length);
}