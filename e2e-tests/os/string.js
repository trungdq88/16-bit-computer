const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.StringM = vmTranslator(...loadFile(__dirname + '/String.vm'));
