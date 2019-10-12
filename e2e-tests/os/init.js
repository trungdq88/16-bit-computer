const { vmTranslator } = require('../../vm-translator.js');

exports.Init = vmTranslator(
  `
set RAM[0] 256,
set RAM[1] 300,
set RAM[2] 400,
set RAM[3] 3000,
set RAM[4] 3010,
call Sys.init 0
  `
);
