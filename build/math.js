export function randomInt(min, max) {
    let numberofNums = max - min + 1;
    return Math.floor(Math.random() * numberofNums) + min;
}
export function randomCell() {
    //need random number from 0 to 800 (17 values)
    let x = randomInt(0, 15) * 50;
    let y = randomInt(0, 15) * 50;
    return [x, y];
}
export function arrayNumbersEqual(arr1, arr2) {
    if (arr1 == null || arr2 == null) {
        return (arr1 == null) && (arr2 == null);
    }
    if (arr1.length != arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i])
            return false;
    }
    return true;
}
