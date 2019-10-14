const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.Output = vmTranslator(...loadFile(__dirname + '/Output.vm'));
