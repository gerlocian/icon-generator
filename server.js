'use strict';

const fs = require('fs');
const express = require('express');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const app = express();

const getIcon = initializeIcons();

const colorPallet = {
    '0': '#F78F28',
    '1': '#2BBCD7',
    '2': '#70618F',
    '3': '#7EC565',
    '4': '#0D3A53',
    '5': '#2042B8',
    '6': '#747C86',
    '7': '#31AFF4',
    '8': '#C83CED',
    '9': '#EC3C28',
    'A': '#F77120',
    'B': '#EBD94D',
    'C': '#4FC623',
    'D': '#01A28A',
    'E': '#FFE600',
    'F': '#DF2B3A'
};

app.get('/icon/:identifier', (req, res) => {
    const hash = createHash(req.params.identifier).match(/.{1,8}/g);
    const colors = selectColors(hash[1], hash[2], hash[3]);
    console.log(colors);

    let icon = getIcon((parseInt(hash[0], 16) % 4) + 1);
    icon = icon.replace('{{color1}}', colors[0]).replace('{{color2}}', colors[1]).replace('{{color3}}', colors[2]);
    console.log(icon);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(Buffer.from(icon));
});

app.listen(3000, () => console.log('listening...'));

function createHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function initializeIcons() {
    const icons = fs.readdirSync(`${__dirname}/icons`).map(readIcon);

    return function (num) {
        return icons[num - 1];
    };

    function readIcon(file) {
        return fs.readFileSync(`${__dirname}/icons/${file}`, { encoding: 'utf8' });
    }
}

function selectColors(hash1, hash2, hash3) {
    let colors = [];
    colors[0] = colorPallet[hash1[0].toUpperCase()];

    let i = 0;
    do {
        colors[1] = colorPallet[hash2[i].toUpperCase()];
        i += 1;
    } while(colors[0] ===  colors[1]);

    let j = 0;
    do {
        colors[2] = colorPallet[hash3[j].toUpperCase()];
        j += 1;
    } while(colors[0] ===  colors[2] || colors[1] === colors[2]);

    return colors;
}