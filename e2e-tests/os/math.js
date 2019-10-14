const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.MathM = vmTranslator(...loadFile(__dirname + '/Math.vm'));
