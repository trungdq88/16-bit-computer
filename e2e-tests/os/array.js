const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.ArrayM = vmTranslator(...loadFile(__dirname + '/Array.vm'));
