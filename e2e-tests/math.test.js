const { assembler } = require('../assembler.js');
const { vmTranslator, sharedCode } = require('../vm-translator.js');
const { cpuEmulator } = require('../cpu-emulator.js');
const { Memory } = require('./os/memory.js');
const { ArrayM } = require('./os/array.js');
const { Init } = require('./os/init.js');
const { MathM } = require('./os/math.js');

describe('end to end tests 2', () => {
  it('math test', () => {
    const state = cpuEmulator(
      assembler(
        `
${Init}
${Memory}
${ArrayM}
${MathM}

${vmTranslator(
  `
function Sys.init 0
call Memory.init 0
pop temp 0
call Math.init 0
pop temp 0
// call Screen.init 0
// pop temp 0
// call Output.init 0
// pop temp 0
// call Keyboard.init 0
// pop temp 0
call Main.main 0
pop temp 0
call Sys.halt 0
pop temp 0
push constant 0
return
function Sys.halt 0
break
label WHILE_EXP0
push constant 0
not
not
if-goto WHILE_END0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Sys.wait 1
push argument 0
push constant 0
lt
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 1
call Sys.error 1
pop temp 0
label IF_FALSE0
label WHILE_EXP0
push argument 0
push constant 0
gt
not
if-goto WHILE_END0
push constant 50
pop local 0
label WHILE_EXP1
push local 0
push constant 0
gt
not
if-goto WHILE_END1
push local 0
push constant 1
sub
pop local 0
goto WHILE_EXP1
label WHILE_END1
push argument 0
push constant 1
sub
pop argument 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Sys.error 0
break
push constant 3
call String.new 1
push constant 69
call String.appendChar 2
push constant 82
call String.appendChar 2
push constant 82
call String.appendChar 2
call Output.printString 1
pop temp 0
push argument 0
call Output.printInt 1
pop temp 0
call Sys.halt 0
pop temp 0
push constant 0
return
  `,
  'Sys.vm'
)}

${vmTranslator(
  `
function Main.main 1
push constant 8000
pop local 0
push constant 0
push local 0
add
push constant 2
push constant 3
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 1
push local 0
add
push constant 0
push local 0
add
pop pointer 1
push that 0
push constant 30
neg
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 2
push local 0
add
push constant 1
push local 0
add
pop pointer 1
push that 0
push constant 100
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 3
push local 0
add
push constant 1
push constant 2
push local 0
add
pop pointer 1
push that 0
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 4
push local 0
add
push constant 3
push local 0
add
pop pointer 1
push that 0
push constant 0
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 5
push local 0
add
push constant 9
push constant 3
call Math.divide 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 6
push local 0
add
push constant 18000
neg
push constant 6
call Math.divide 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 7
push local 0
add
push constant 32766
push constant 32767
neg
call Math.divide 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8
push local 0
add
push constant 9
call Math.sqrt 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 9
push local 0
add
push constant 32767
call Math.sqrt 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 10
push local 0
add
push constant 345
push constant 123
call Math.min 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 11
push local 0
add
push constant 123
push constant 345
neg
call Math.max 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 12
push local 0
add
push constant 27
call Math.abs 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 13
push local 0
add
push constant 32767
neg
call Math.abs 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
return
  `,
  'Main.vm'
)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );
    expect(state.RAM.slice(8000, 8014)).toEqual([
      6,
      -180,
      -18000,
      -18000,
      0,
      3,
      -3000,
      -0,
      3,
      181,
      123,
      123,
      27,
      32767,
    ]);
  });
});
