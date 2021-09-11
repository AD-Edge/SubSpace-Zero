//Simple utility functions
function componentToHex(comp) {
    var hex = (parseInt(comp).toString(16)).toUpperCase();
    console.log("decimal " + comp + ", to hex: " + hex);
    //return hex.length == 1 ? "0" + hex : hex;
    return hex;
}

function rgbToHex(rgb) {
    var a = rgb.split(",");
    
    var b = a.map(function(x){                      //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length==1) ? "0"+x : x; //Add zero if we get only one character
    });
    //b = "0x"+b.join("");
    b = "#"+b.join("");
        
    return b;
}

function hexToBinary(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

//Lerp
function Lerp() {

}

//Random gen
function Rand(min, max) {
    return Math.random() * (max - min) + min;
}


//Takes in Area for location 0,0 & local isometric point
//Finds GLOBAL (screen) location of points xC/yC
function ConvertISOToScreenPos(area, xL, yL) {

    //calculate x offset into isometric
    var xGlb = area.x + (xL-yL) * isoX;
    //calculate y offset into isometric
    var yGlb = area.y + (xL+yL) * isoY;
    
    return [xGlb, yGlb];

}
//Takes in area for location 0,0 and global point
//Finds LOCAL (isometric) location of point
function ConvertScreenToISOPos(area, GlX, GlY) {

    //calculate x
    var xLoc = ((GlY - area.y) / isoY + (GlX - area.x) / isoX) / 2;
    //calculate y
    var yLoc = ((GlY - area.y) / isoY - (GlX - area.x) / isoX) / 2;
    
    return [xLoc, yLoc];

}