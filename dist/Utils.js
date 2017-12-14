"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sleep(ms = 0) {
    return new Promise((r) => setTimeout(r, ms));
}
exports.sleep = sleep;
function randomString(len, bits = 36) {
    let outStr = "";
    let newStr;
    while (outStr.length < len) {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr;
}
exports.randomString = randomString;
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomArbitrary = getRandomArbitrary;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function readableString(length) {
    const VOWELS = "aeiouy".split("");
    const CONSONANTS = "bcdfghjklmnprstvwxz".split("");
    const VOWELS_LENGTH = VOWELS.length;
    const CONSONANTS_LENGTH = CONSONANTS.length;
    let randomstring = "";
    const salt = Math.floor(Math.random() * 2);
    for (let i = length + salt, end = 0 + salt; i > end; i -= 1) {
        if (i % 2 === 0) {
            randomstring += CONSONANTS[Math.floor(Math.random() * CONSONANTS_LENGTH)];
        }
        else {
            randomstring += VOWELS[Math.floor(Math.random() * VOWELS_LENGTH)];
        }
    }
    return randomstring;
}
exports.readableString = readableString;
//# sourceMappingURL=Utils.js.map