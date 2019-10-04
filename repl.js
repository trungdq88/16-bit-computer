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

@10
D=A
@400 // argument[0] = 10
M=D

${vmTranslator(`
push constant 0    
pop local 0         // initializes sum = 0
label LOOP_START
push argument 0    
push local 0
add
pop local 0	        // sum = sum + counter
push argument 0
push constant 1
sub
pop argument 0      // counter--
push argument 0
if-goto LOOP_START  // If counter > 0, goto LOOP_START
push local 0
`)}


`)
);
