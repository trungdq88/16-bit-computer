const { assembler } = require('../assembler.js');
const { vmTranslator, sharedCode } = require('../vm-translator.js');
const { cpuEmulator } = require('../cpu-emulator.js');
const { Memory } = require('./os/memory.js');
const { ArrayM } = require('./os/array.js');
const { StringM } = require('./os/string.js');
const { MathM } = require('./os/math.js');
const { Output } = require('./os/output.js');
const { Init } = require('./os/init.js');

describe('end to end tests 2', () => {
  it('output test', () => {
    const state = cpuEmulator(
      assembler(
        `
${Init}
${Memory}
${ArrayM}
${StringM}
${MathM}
${Output}

${vmTranslator(
  `
function Sys.init 0
call Memory.init 0
pop temp 0
call Math.init 0
pop temp 0
call Output.init 0
pop temp 0
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
function Main.main 0
push constant 11
call String.new 1
push constant 72
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 111
call String.appendChar 2
push constant 32
call String.appendChar 2
push constant 84
call String.appendChar 2
push constant 111
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 121
call String.appendChar 2
push constant 33
call String.appendChar 2
call Output.printString 1
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
    // Print "Hello Tony!" to screen
    // Took 6,129,929 clock cycles (about 6,000,000 cycles are for initialize
    // the letters pixel map
    expect(state.RAM.slice(16384, 24576)).toEqual([
      ...new Array(32).fill(undefined),
      ...new Array(1).fill(51),
      ...new Array(1).fill(3598),
      ...new Array(1).fill(0),
      ...new Array(1).fill(63),
      ...new Array(1).fill(0),
      ...new Array(1).fill(16396),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(51),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(0),
      ...new Array(1).fill(63),
      ...new Array(1).fill(0),
      ...new Array(1).fill(16414),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(51),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(0),
      ...new Array(1).fill(45),
      ...new Array(1).fill(0),
      ...new Array(1).fill(16414),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(30),
      ...new Array(1).fill(7692),
      ...new Array(1).fill(13085),
      ...new Array(1).fill(16414),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(13119),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(16396),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(16179),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(16396),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(819),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(15923),
      ...new Array(1).fill(16384),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(12339),
      ...new Array(1).fill(16652),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(30),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(6195),
      ...new Array(1).fill(16652),
      ...new Array(26).fill(undefined),
      ...new Array(4).fill(0),
      ...new Array(1).fill(3840),
      ...new Array(1).fill(16640),
      ...new Array(26).fill(undefined),
      ...new Array(5).fill(0),
      ...new Array(1).fill(16640),
    ]);
  });
});

function c(args) {
  console.log(args);
  return args;
}
