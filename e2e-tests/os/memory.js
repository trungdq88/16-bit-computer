const { vmTranslator } = require('../../vm-translator.js');
const { loadFile } = require('../utils.js');

exports.Memory = vmTranslator(...loadFile(__dirname + '/Memory.vm'));
