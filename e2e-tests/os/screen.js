const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.Screen = vmTranslator(...loadFile(__dirname + '/Screen.vm'));
