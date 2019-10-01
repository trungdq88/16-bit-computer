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

// Set local[2] to some thing
@16
D=A
@302 // local[2] = 16
M=D

@15
D=A
@307 // local[7] = 15
M=D

// Put value at local[2] to the stack

${vmTranslator('push local 2')}
${vmTranslator('push local 7')}

`)
);
