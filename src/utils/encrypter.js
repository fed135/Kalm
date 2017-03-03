/**
 * Password protected buffer encryption
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

function mapKeyIn(key) {
    const seed = Number(toUint8(key).join(''));
    const list = new Array(256);
    const dict = new Array(256);

    for (let i = 0; i < 256; i++) {
        const temp = list[i] || i;
        const rand = (seed % (i+1) + i) % 256;
        list[i] = list[rand] || rand;
        list[rand] = temp;
    }

    list.forEach((val, index) => dict[val] = index);

    return dict;
}

function mapKeyOut(key) {
    const seed = Number(toUint8(key).join(''));
    const dict = new Array(256);

    for (let i = 0; i < 256; i++) {
        const temp = dict[i] || i;
        const rand = (seed % (i+1) + i) % 256;
        dict[i] = dict[rand] || rand;
        dict[rand] = temp;
    }

    return dict;
}

function toUint8(str) {
    return str.toString()
        .split('')
        .map(char => char.charCodeAt(0));
}

function byteIn(keyMap, val, index) {
    return keyMap[val];
}

function byteOut(keyMap, val, index) {
    return keyMap[val];
}

function encrypt(bytes, key) {
    if (typeof bytes === 'string') bytes = toUint8(bytes);
    return bytes.map(byteIn.bind(null, mapKeyIn(String(key))));
}


function decrypt(bytes, key) {
    return bytes.map(byteOut.bind(null, mapKeyOut(String(key))));
}

/* Exports -------------------------------------------------------------------*/

module.exports = { encrypt, decrypt };