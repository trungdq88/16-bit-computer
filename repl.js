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
break
push constant 10
break
pop local 0
break
push constant 21
break
push constant 22
break
pop argument 2
break
pop argument 1
break
push constant 36
break
pop this 6
break
push constant 42
break
push constant 45
break
pop that 5
break
pop that 2
break
push constant 510
break
pop temp 6
break
push local 0
break
push that 5
break
add
break
push argument 1
break
sub
break
push this 6
break
push this 6
break
add
break
sub
break
push temp 6
break
add
`)}


`)
);
