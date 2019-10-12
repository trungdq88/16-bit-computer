const { assembler } = require('../assembler.js');
const { vmTranslator, sharedCode } = require('../vm-translator.js');
const { cpuEmulator } = require('../cpu-emulator.js');
const { Memory } = require('./os/memory.js');
const { ArrayM } = require('./os/array.js');
const { Init } = require('./os/init.js');

describe('end to end tests 2', () => {
  it('memory test', () => {
    const state = cpuEmulator(
      assembler(
        `
${Init}
${Memory}
${ArrayM}

${vmTranslator(
  `
function Sys.init 0
call Memory.init 0
pop temp 0
// call Math.init 0
// pop temp 0
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
function Main.main 4
push constant 8000
push constant 333
call Memory.poke 2
pop temp 0
push constant 8000
call Memory.peek 1
pop local 0
push constant 8001
push local 0
push constant 1
add
call Memory.poke 2
pop temp 0
push constant 3
call Array.new 1
pop local 1
push constant 2
push local 1
add
push constant 222
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8002
push constant 2
push local 1
add
pop pointer 1
push that 0
call Memory.poke 2
pop temp 0
push constant 3
call Array.new 1
pop local 2
push constant 1
push local 2
add
push constant 2
push local 1
add
pop pointer 1
push that 0
push constant 100
sub
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8003
push constant 1
push local 2
add
pop pointer 1
push that 0
call Memory.poke 2
pop temp 0
push constant 500
call Array.new 1
pop local 3
push constant 499
push local 3
add
push constant 2
push local 1
add
pop pointer 1
push that 0
push constant 1
push local 2
add
pop pointer 1
push that 0
sub
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8004
push constant 499
push local 3
add
pop pointer 1
push that 0
call Memory.poke 2
pop temp 0
push local 1
call Array.dispose 1
pop temp 0
push local 2
call Array.dispose 1
pop temp 0
push constant 3
call Array.new 1
pop local 2
push constant 0
push local 2
add
push constant 499
push local 3
add
pop pointer 1
push that 0
push constant 90
sub
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8005
push constant 0
push local 2
add
pop pointer 1
push that 0
call Memory.poke 2
pop temp 0
push local 3
call Array.dispose 1
pop temp 0
push local 2
call Array.dispose 1
pop temp 0
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
    expect(state.RAM.slice(8000, 8006)).toEqual([333, 334, 222, 122, 100, 10]);
  });
});
