const { assembler } = require('../assembler.js');
const { vmTranslator, sharedCode } = require('../vm-translator.js');
const { cpuEmulator } = require('../cpu-emulator.js');
const { Memory } = require('./os/memory.js');
const { ArrayM } = require('./os/array.js');
const { StringM } = require('./os/string.js');
const { MathM } = require('./os/math.js');
const { Screen } = require('./os/screen.js');
const { Init } = require('./os/init.js');

describe('end to end tests 2', () => {
  it('screen test', () => {
    const state = cpuEmulator(
      assembler(
        `
${Init}
${Memory}
${ArrayM}
${StringM}
${MathM}
${Screen}

${vmTranslator(
  `
function Sys.init 0
call Memory.init 0
pop temp 0
call Math.init 0
pop temp 0
call Screen.init 0
pop temp 0
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
function Main.main 0
push constant 10
push constant 10
push constant 10
call Screen.drawCircle 3
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
    // This is a nice circle representation in RAM
    // (took 382057 clock cycles)
    expect(state.RAM.slice(16384, 24576)).toEqual([
      ...new Array(1).fill(32640),
      ...new Array(31).fill(undefined),
      ...new Array(1).fill(65504),
      ...new Array(31).fill(undefined),
      ...new Array(1).fill(-16),
      ...new Array(1).fill(16449),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-8),
      ...new Array(1).fill(16483),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-4),
      ...new Array(1).fill(16519),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-2),
      ...new Array(1).fill(16559),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-2),
      ...new Array(1).fill(16591),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16639),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16671),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16703),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16735),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16767),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16799),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-1),
      ...new Array(1).fill(16831),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-2),
      ...new Array(1).fill(16847),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-2),
      ...new Array(1).fill(16879),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-4),
      ...new Array(1).fill(16903),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-8),
      ...new Array(1).fill(16931),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(-16),
      ...new Array(1).fill(16961),
      ...new Array(30).fill(undefined),
      ...new Array(1).fill(65504),
      ...new Array(31).fill(undefined),
      ...new Array(1).fill(32640),
    ]);
  });
});

function c(args) {
  console.log(args);
  return args;
}
