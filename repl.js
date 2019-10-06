const { assembler } = require('./assembler.js');
const { vmTranslator } = require('./vm-translator.js');

console.log(
  assembler(`

`)
);

function c(args) {
  console.log(args);
  return args;
}
