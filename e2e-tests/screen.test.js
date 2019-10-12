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
  it.only('screen test', () => {
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
function Main.main 0
push constant 0
push constant 220
push constant 511
push constant 220
call Screen.drawLine 4
pop temp 0
push constant 280
push constant 90
push constant 410
push constant 220
call Screen.drawRectangle 4
pop temp 0
push constant 0
call Screen.setColor 1
pop temp 0
push constant 350
push constant 120
push constant 390
push constant 219
call Screen.drawRectangle 4
pop temp 0
push constant 292
push constant 120
push constant 332
push constant 150
call Screen.drawRectangle 4
pop temp 0
push constant 0
not
call Screen.setColor 1
pop temp 0
push constant 360
push constant 170
push constant 3
call Screen.drawCircle 3
pop temp 0
push constant 280
push constant 90
push constant 345
push constant 35
call Screen.drawLine 4
pop temp 0
push constant 345
push constant 35
push constant 410
push constant 90
call Screen.drawLine 4
pop temp 0
push constant 140
push constant 60
push constant 30
call Screen.drawCircle 3
pop temp 0
push constant 140
push constant 26
push constant 140
push constant 6
call Screen.drawLine 4
pop temp 0
push constant 163
push constant 35
push constant 178
push constant 20
call Screen.drawLine 4
pop temp 0
push constant 174
push constant 60
push constant 194
push constant 60
call Screen.drawLine 4
pop temp 0
push constant 163
push constant 85
push constant 178
push constant 100
call Screen.drawLine 4
pop temp 0
push constant 140
push constant 94
push constant 140
push constant 114
call Screen.drawLine 4
pop temp 0
push constant 117
push constant 85
push constant 102
push constant 100
call Screen.drawLine 4
pop temp 0
push constant 106
push constant 60
push constant 86
push constant 60
call Screen.drawLine 4
pop temp 0
push constant 117
push constant 35
push constant 102
push constant 20
call Screen.drawLine 4
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
