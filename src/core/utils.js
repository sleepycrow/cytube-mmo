//GUTTABLE: function for clamping numbers
//Make sure to replace all occurences if you do!
export function clampNum(num, min, max){
    return Math.min(Math.max(num, min), max);
}