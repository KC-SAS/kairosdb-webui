const VOWELS = 'aeiou'.split('');
const CONSONANTS = 'bcdfghjklmnprstvwxyz'.split('');
const VOWELS_LENGTH = VOWELS.length;
const CONSONANTS_LENGTH = CONSONANTS.length;

export function metricnames(length:number): string[] {
    let randomArray = new Array<string>(length);
    for (let i = 0; i<length; i++) {
        randomArray[i] = metricname(6);
    }
    return randomArray;
};

function metricname(length:number):string {
    let randomstring = '';
    let salt = Math.floor(Math.random() * 2);
    for (let i = length + salt, end = 0 + salt; i > end; i -= 1) {
        if (i % 2 === 0) {
            randomstring += CONSONANTS[Math.floor(Math.random() * CONSONANTS_LENGTH)];
        } else {
            randomstring += VOWELS[Math.floor(Math.random() * VOWELS_LENGTH)];
        }
    }
    return randomstring;
};