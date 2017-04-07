import _moment_tz_ from 'moment-timezone';
import _lodash_ from 'lodash';
import _numeral_ from 'numeral';

let moment: typeof _moment_tz_;
moment = (_moment_tz_ === undefined) ? require('moment-timezone') : _moment_tz_;

let _: typeof _lodash_;
_ = (_lodash_ === undefined) ? require('lodash') : _lodash_;

let numeral: typeof _numeral_;
numeral = (_numeral_ === undefined) ? require('numeral') : _numeral_;

export { moment, _, numeral };
