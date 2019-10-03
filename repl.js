const { assembler } = require('./assembler.js');
const { vmTranslator } = require('./vm-translator.js');

console.log(
  assembler(`
@256
D=A
@SP
M=D

@300
D=A
@LCL
M=D

@400
D=A
@ARG
M=D

@3000
D=A
@THIS
M=D

@3010
D=A
@THAT
M=D

// // Set local[2] to some thing
// @16
// D=A
// @302 // local[2] = 16
// M=D
//
// @15
// D=A
// @307 // local[7] = 15
// M=D

${vmTranslator(`
push constant 111
push constant 333
push constant 888
pop static 8
pop static 3
pop static 1
push static 3
push static 1
sub
push static 8
add
`)}


`)
);
