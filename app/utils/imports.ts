import mom from 'moment-timezone';
import lod from 'lodash';
import num from 'numeral';

let moment : typeof mom;
if(mom===undefined) {
    moment = require('moment-timezone');
} 
else {
    moment = mom;
}

let _ : typeof lod;
if(lod===undefined) {
    _ = require('lodash');
} 
else {
    _ = lod;
}

let numeral : typeof num;
if(num===undefined) {
    numeral = require('numeral');
} 
else {
    numeral = num;
}

export { moment, _, numeral };


