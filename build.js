const fs = require('fs');
const { assembler } = require('./assembler.js');
const { vmTranslator } = require('./vm-translator.js');

const folder = process.argv.slice(-1)[0];

let source = vmTranslator('call Main.main');

fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    if (file.endsWith('.vm')) {
      source +=
        vmTranslator(fs.readFileSync(folder + '/' + file, 'utf-8'), file) +
        '\n';
    }
  });
  console.log(source);
});
