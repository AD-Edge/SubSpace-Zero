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