const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'de', 'ar'];
const msgs = {};

locales.forEach(loc => {
    try {
        const file = fs.readFileSync(path.join(__dirname, 'messages', `${loc}.json`), 'utf-8');
        msgs[loc] = JSON.parse(file);
    } catch (e) {
        console.error(`Error loading ${loc}.json`);
    }
});

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const allKeys = new Set();
locales.forEach(loc => {
    getKeys(msgs[loc]).forEach(k => allKeys.add(k));
});

console.log('--- MISSING KEYS ---');
locales.forEach(loc => {
    const locKeys = new Set(getKeys(msgs[loc]));
    const missing = [...allKeys].filter(k => !locKeys.has(k));
    if (missing.length > 0) {
        console.log(`[${loc.toUpperCase()}] is missing:`, missing);
    } else {
        console.log(`[${loc.toUpperCase()}] has all keys.`);
    }
});

const mojibakeChars = ['Ø', 'Ù', 'Ã', 'Â', '§', '', 'Å'];
console.log('\n--- MOJIBAKE CHECK ---');
locales.forEach(loc => {
    const content = fs.readFileSync(path.join(__dirname, 'messages', `${loc}.json`), 'utf-8');
    let hasMojibake = false;
    mojibakeChars.forEach(char => {
        if (content.includes(char)) {
            console.log(`[${loc.toUpperCase()}] contains mojibake character: ${char}`);
            hasMojibake = true;
        }
    });
    if (!hasMojibake) console.log(`[${loc.toUpperCase()}] is clean from specified mojibake characters.`);
});
