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
  it('string test', () => {
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
function Main.main 2
push constant 0
call String.new 1
pop local 0
push local 0
call String.dispose 1
pop temp 0
push constant 6
call String.new 1
pop local 0
push local 0
push constant 97
call String.appendChar 2
pop local 0
push local 0
push constant 98
call String.appendChar 2
pop local 0
push local 0
push constant 99
call String.appendChar 2
pop local 0
push local 0
push constant 100
call String.appendChar 2
pop local 0
push local 0
push constant 101
call String.appendChar 2
pop local 0
push constant 16
call String.new 1
push constant 110
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 119
call String.appendChar 2
push constant 44
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 112
call String.appendChar 2
push constant 112
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 100
call String.appendChar 2
push constant 67
call String.appendChar 2
push constant 104
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call Output.printString 1
pop temp 0
call Output.println 0
pop temp 0
push constant 6
call String.new 1
pop local 1
push local 1
push constant 12345
call String.setInt 2
pop temp 0
push constant 8
call String.new 1
push constant 115
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 73
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 1
call Output.printString 1
pop temp 0
call Output.println 0
pop temp 0
push local 1
push constant 32767
neg
call String.setInt 2
pop temp 0
push constant 8
call String.new 1
push constant 115
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 73
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 1
call Output.printString 1
pop temp 0
call Output.println 0
pop temp 0
push constant 8
call String.new 1
push constant 108
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 103
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 104
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call String.length 1
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push constant 11
call String.new 1
push constant 99
call String.appendChar 2
push constant 104
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 65
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 91
call String.appendChar 2
push constant 50
call String.appendChar 2
push constant 93
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
push constant 2
call String.charAt 2
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push local 0
push constant 2
push constant 45
call String.setCharAt 3
pop temp 0
push constant 18
call String.new 1
push constant 115
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 67
call String.appendChar 2
push constant 104
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 65
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 40
call String.appendChar 2
push constant 50
call String.appendChar 2
push constant 44
call String.appendChar 2
push constant 39
call String.appendChar 2
push constant 45
call String.appendChar 2
push constant 39
call String.appendChar 2
push constant 41
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call Output.printString 1
pop temp 0
call Output.println 0
pop temp 0
push local 0
call String.eraseLastChar 1
pop temp 0
push constant 15
call String.new 1
push constant 101
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 115
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 76
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 115
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 67
call String.appendChar 2
push constant 104
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call Output.printString 1
pop temp 0
call Output.println 0
pop temp 0
push constant 3
call String.new 1
push constant 52
call String.appendChar 2
push constant 53
call String.appendChar 2
push constant 54
call String.appendChar 2
pop local 0
push constant 10
call String.new 1
push constant 105
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 86
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 117
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call String.intValue 1
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push constant 6
call String.new 1
push constant 45
call String.appendChar 2
push constant 51
call String.appendChar 2
push constant 50
call String.appendChar 2
push constant 49
call String.appendChar 2
push constant 50
call String.appendChar 2
push constant 51
call String.appendChar 2
pop local 0
push constant 10
call String.new 1
push constant 105
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 86
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 117
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
push local 0
call String.intValue 1
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push constant 11
call String.new 1
push constant 98
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 99
call String.appendChar 2
push constant 107
call String.appendChar 2
push constant 83
call String.appendChar 2
push constant 112
call String.appendChar 2
push constant 97
call String.appendChar 2
push constant 99
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
call String.backSpace 0
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push constant 13
call String.new 1
push constant 100
call String.appendChar 2
push constant 111
call String.appendChar 2
push constant 117
call String.appendChar 2
push constant 98
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 81
call String.appendChar 2
push constant 117
call String.appendChar 2
push constant 111
call String.appendChar 2
push constant 116
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
call String.doubleQuote 0
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push constant 9
call String.new 1
push constant 110
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 119
call String.appendChar 2
push constant 76
call String.appendChar 2
push constant 105
call String.appendChar 2
push constant 110
call String.appendChar 2
push constant 101
call String.appendChar 2
push constant 58
call String.appendChar 2
push constant 32
call String.appendChar 2
call Output.printString 1
pop temp 0
call String.newLine 0
call Output.printInt 1
pop temp 0
call Output.println 0
pop temp 0
push local 1
call String.dispose 1
pop temp 0
push local 0
call String.dispose 1
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
    /*
    Print the following content to screen:

      new,appendChar: abcde
      setInt: 12345
      sentInt: -32767
      length: 5
      chatAt[2]: 99
      setCharAt(2,'-'): ab-de
      eraseLastChar: ab-d
      intValue: 456
      intValue: -32123
      backSpace: 129
      doubleQuote: 34
      newLine: 128

    Took 8,757,235 clock cycles
    */
    expect(state.RAM.slice(16384, 24576)).toEqual([
      ...new Array(32).fill(undefined),
      ...new Array(4).fill(0),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(796),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(16384),
      ...new Array(21).fill(undefined),
      ...new Array(4).fill(0),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(822),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(16384),
      ...new Array(21).fill(undefined),
      ...new Array(4).fill(0),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(803),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(16384),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(7709),
      ...new Array(1).fill(51),
      ...new Array(1).fill(7694),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(15389),
      ...new Array(1).fill(6915),
      ...new Array(1).fill(7438),
      ...new Array(1).fill(12),
      ...new Array(1).fill(3854),
      ...new Array(1).fill(15390),
      ...new Array(1).fill(16414),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13080),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(14083),
      ...new Array(1).fill(14104),
      ...new Array(1).fill(0),
      ...new Array(1).fill(6936),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(16435),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(16179),
      ...new Array(1).fill(51),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(16179),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(16447),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(819),
      ...new Array(1).fill(63),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(819),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13091),
      ...new Array(1).fill(795),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(16387),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3135),
      ...new Array(1).fill(7963),
      ...new Array(1).fill(13087),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13110),
      ...new Array(1).fill(795),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(16691),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(3090),
      ...new Array(1).fill(822),
      ...new Array(1).fill(7683),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(13084),
      ...new Array(1).fill(1846),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(16670),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(768),
      ...new Array(1).fill(3),
      ...new Array(6).fill(0),
      ...new Array(1).fill(16640),
      ...new Array(21).fill(undefined),
      ...new Array(10).fill(0),
      ...new Array(1).fill(16640),
      ...new Array(21).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7684),
      ...new Array(1).fill(1024),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7692),
      ...new Array(1).fill(4126),
      ...new Array(1).fill(16703),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13070),
      ...new Array(1).fill(6195),
      ...new Array(1).fill(16643),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12303),
      ...new Array(1).fill(7216),
      ...new Array(1).fill(16643),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(3087),
      ...new Array(1).fill(3869),
      ...new Array(1).fill(12),
      ...new Array(1).fill(6156),
      ...new Array(1).fill(6704),
      ...new Array(1).fill(16671),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(6428),
      ...new Array(1).fill(16944),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(16134),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1548),
      ...new Array(1).fill(16176),
      ...new Array(1).fill(16944),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(792),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(12),
      ...new Array(1).fill(780),
      ...new Array(1).fill(6192),
      ...new Array(1).fill(16944),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3126),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(6195),
      ...new Array(1).fill(16947),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(7708),
      ...new Array(1).fill(7219),
      ...new Array(1).fill(0),
      ...new Array(1).fill(16191),
      ...new Array(1).fill(15390),
      ...new Array(1).fill(16926),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(16896),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(16896),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7684),
      ...new Array(1).fill(1024),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(16158),
      ...new Array(1).fill(16156),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(12595),
      ...new Array(1).fill(12550),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(12336),
      ...new Array(1).fill(12291),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(3087),
      ...new Array(1).fill(3869),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(12312),
      ...new Array(1).fill(12291),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7168),
      ...new Array(1).fill(6156),
      ...new Array(1).fill(6175),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(16134),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12351),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(3123),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(792),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(3123),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(3126),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13056),
      ...new Array(2).fill(3123),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(7708),
      ...new Array(1).fill(7219),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(3135),
      ...new Array(1).fill(3102),
      ...new Array(25).fill(undefined),
      ...new Array(7).fill(0),
      ...new Array(25).fill(undefined),
      ...new Array(7).fill(0),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(14),
      ...new Array(1).fill(0),
      ...new Array(1).fill(772),
      ...new Array(1).fill(0),
      ...new Array(1).fill(17471),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(0),
      ...new Array(1).fill(774),
      ...new Array(1).fill(0),
      ...new Array(1).fill(17411),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(774),
      ...new Array(1).fill(12),
      ...new Array(1).fill(17411),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(7692),
      ...new Array(1).fill(13085),
      ...new Array(1).fill(6927),
      ...new Array(1).fill(12),
      ...new Array(1).fill(17439),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(14086),
      ...new Array(1).fill(0),
      ...new Array(1).fill(17456),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(16140),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(0),
      ...new Array(1).fill(17456),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(780),
      ...new Array(1).fill(15923),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(12),
      ...new Array(1).fill(17712),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(12339),
      ...new Array(1).fill(13110),
      ...new Array(1).fill(12),
      ...new Array(1).fill(17715),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13084),
      ...new Array(1).fill(0),
      ...new Array(1).fill(17694),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(2).fill(0),
      ...new Array(1).fill(17664),
      ...new Array(27).fill(undefined),
      ...new Array(4).fill(0),
      ...new Array(1).fill(17664),
      ...new Array(27).fill(undefined),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1036),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(30),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(17694),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1566),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(24),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(17715),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(12294),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(17715),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(6942),
      ...new Array(1).fill(7438),
      ...new Array(1).fill(3891),
      ...new Array(1).fill(6150),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(17971),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(14131),
      ...new Array(1).fill(14104),
      ...new Array(1).fill(1599),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(24),
      ...new Array(1).fill(15872),
      ...new Array(1).fill(17982),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(1542),
      ...new Array(1).fill(24),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(17968),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(795),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(774),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(17968),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(795),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(17944),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(1846),
      ...new Array(1).fill(7219),
      ...new Array(1).fill(16158),
      ...new Array(1).fill(30),
      ...new Array(1).fill(3584),
      ...new Array(1).fill(17934),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(17920),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(17920),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7172),
      ...new Array(1).fill(3),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(6148),
      ...new Array(1).fill(30),
      ...new Array(1).fill(12),
      ...new Array(1).fill(1548),
      ...new Array(1).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(18176),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13830),
      ...new Array(1).fill(3),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(51),
      ...new Array(1).fill(12),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(18176),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(8966),
      ...new Array(1).fill(3),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(1542),
      ...new Array(1).fill(48),
      ...new Array(1).fill(6),
      ...new Array(1).fill(6150),
      ...new Array(1).fill(12),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(18176),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(783),
      ...new Array(1).fill(3611),
      ...new Array(1).fill(13085),
      ...new Array(1).fill(1551),
      ...new Array(1).fill(24),
      ...new Array(1).fill(0),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(12),
      ...new Array(1).fill(3854),
      ...new Array(1).fill(15360),
      ...new Array(1).fill(18206),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(774),
      ...new Array(1).fill(6199),
      ...new Array(1).fill(16183),
      ...new Array(1).fill(1542),
      ...new Array(1).fill(12),
      ...new Array(1).fill(0),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(0),
      ...new Array(1).fill(6936),
      ...new Array(1).fill(13824),
      ...new Array(1).fill(18227),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(16134),
      ...new Array(1).fill(774),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(1542),
      ...new Array(1).fill(6),
      ...new Array(1).fill(16128),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(13119),
      ...new Array(1).fill(18239),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(792),
      ...new Array(1).fill(8966),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(1542),
      ...new Array(1).fill(3),
      ...new Array(1).fill(0),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(18179),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13878),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(13059),
      ...new Array(1).fill(3126),
      ...new Array(1).fill(3123),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(18227),
      ...new Array(20).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(7196),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(13063),
      ...new Array(1).fill(6172),
      ...new Array(1).fill(3135),
      ...new Array(1).fill(0),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(18462),
      ...new Array(20).fill(undefined),
      ...new Array(5).fill(0),
      ...new Array(1).fill(1536),
      ...new Array(5).fill(0),
      ...new Array(1).fill(18432),
      ...new Array(20).fill(undefined),
      ...new Array(11).fill(0),
      ...new Array(1).fill(18432),
      ...new Array(20).fill(undefined),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7172),
      ...new Array(1).fill(3),
      ...new Array(2).fill(0),
      ...new Array(1).fill(3),
      ...new Array(1).fill(18480),
      ...new Array(22).fill(undefined),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13830),
      ...new Array(1).fill(3),
      ...new Array(2).fill(0),
      ...new Array(1).fill(3),
      ...new Array(1).fill(18480),
      ...new Array(22).fill(undefined),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(8966),
      ...new Array(1).fill(3),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3),
      ...new Array(1).fill(18480),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(7454),
      ...new Array(1).fill(7694),
      ...new Array(1).fill(798),
      ...new Array(1).fill(7694),
      ...new Array(1).fill(783),
      ...new Array(1).fill(3611),
      ...new Array(1).fill(3101),
      ...new Array(1).fill(3584),
      ...new Array(1).fill(15),
      ...new Array(1).fill(18492),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(14131),
      ...new Array(1).fill(13080),
      ...new Array(1).fill(819),
      ...new Array(1).fill(13080),
      ...new Array(1).fill(774),
      ...new Array(1).fill(6199),
      ...new Array(1).fill(55),
      ...new Array(1).fill(6144),
      ...new Array(1).fill(27),
      ...new Array(1).fill(18486),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(13119),
      ...new Array(1).fill(1566),
      ...new Array(1).fill(831),
      ...new Array(1).fill(1566),
      ...new Array(1).fill(774),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(51),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(16179),
      ...new Array(1).fill(18739),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(771),
      ...new Array(1).fill(6171),
      ...new Array(1).fill(8963),
      ...new Array(1).fill(6171),
      ...new Array(1).fill(8966),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(6912),
      ...new Array(1).fill(51),
      ...new Array(1).fill(18739),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(819),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13878),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(6912),
      ...new Array(1).fill(51),
      ...new Array(1).fill(18739),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(1822),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(16158),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(7196),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(7),
      ...new Array(1).fill(13824),
      ...new Array(1).fill(30),
      ...new Array(1).fill(18718),
      ...new Array(22).fill(undefined),
      ...new Array(9).fill(0),
      ...new Array(1).fill(18688),
      ...new Array(22).fill(undefined),
      ...new Array(9).fill(0),
      ...new Array(1).fill(18688),
      ...new Array(22).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13060),
      ...new Array(1).fill(3584),
      ...new Array(2).fill(0),
      ...new Array(1).fill(16144),
      ...new Array(1).fill(18716),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3072),
      ...new Array(2).fill(0),
      ...new Array(1).fill(792),
      ...new Array(1).fill(18694),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12),
      ...new Array(1).fill(796),
      ...new Array(1).fill(18947),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7438),
      ...new Array(1).fill(13071),
      ...new Array(1).fill(3086),
      ...new Array(1).fill(7707),
      ...new Array(1).fill(12),
      ...new Array(1).fill(7962),
      ...new Array(1).fill(18947),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12313),
      ...new Array(1).fill(18975),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(7686),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(16155),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12351),
      ...new Array(1).fill(18995),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(7686),
      ...new Array(1).fill(3099),
      ...new Array(1).fill(795),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12312),
      ...new Array(1).fill(18995),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(3126),
      ...new Array(1).fill(3099),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13080),
      ...new Array(1).fill(18995),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(3100),
      ...new Array(2).fill(7734),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7740),
      ...new Array(1).fill(18974),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(18944),
      ...new Array(25).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(1).fill(19200),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13060),
      ...new Array(1).fill(3584),
      ...new Array(2).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(7710),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3072),
      ...new Array(2).fill(0),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(3635),
      ...new Array(1).fill(13107),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(3888),
      ...new Array(1).fill(12336),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(7438),
      ...new Array(1).fill(13071),
      ...new Array(1).fill(3086),
      ...new Array(1).fill(7707),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(12312),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(13062),
      ...new Array(1).fill(3096),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7168),
      ...new Array(1).fill(3084),
      ...new Array(1).fill(7180),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(7686),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(16155),
      ...new Array(1).fill(0),
      ...new Array(1).fill(12351),
      ...new Array(1).fill(3078),
      ...new Array(1).fill(12294),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(7686),
      ...new Array(1).fill(3099),
      ...new Array(1).fill(795),
      ...new Array(1).fill(12),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(12291),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(3126),
      ...new Array(1).fill(3099),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(12),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(3123),
      ...new Array(1).fill(13107),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(3100),
      ...new Array(2).fill(7734),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(16191),
      ...new Array(1).fill(7743),
      ...new Array(24).fill(undefined),
      ...new Array(8).fill(0),
      ...new Array(24).fill(undefined),
      ...new Array(8).fill(0),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(3),
      ...new Array(1).fill(768),
      ...new Array(1).fill(30),
      ...new Array(2).fill(0),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(7710),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(3),
      ...new Array(1).fill(768),
      ...new Array(1).fill(51),
      ...new Array(2).fill(0),
      ...new Array(1).fill(3584),
      ...new Array(1).fill(13107),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(3),
      ...new Array(1).fill(768),
      ...new Array(1).fill(51),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(3840),
      ...new Array(1).fill(13104),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(3599),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(7686),
      ...new Array(1).fill(7694),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(13080),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(6171),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(13084),
      ...new Array(1).fill(13080),
      ...new Array(1).fill(51),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(15884),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(3843),
      ...new Array(1).fill(13104),
      ...new Array(1).fill(798),
      ...new Array(1).fill(63),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(12294),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(3843),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(795),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(12291),
      ...new Array(25).fill(undefined),
      ...new Array(2).fill(6963),
      ...new Array(1).fill(7987),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(3123),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(6195),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(13854),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(798),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(30),
      ...new Array(1).fill(16128),
      ...new Array(1).fill(3647),
      ...new Array(25).fill(undefined),
      ...new Array(2).fill(0),
      ...new Array(1).fill(768),
      ...new Array(4).fill(0),
      ...new Array(25).fill(undefined),
      ...new Array(7).fill(0),
      ...new Array(25).fill(undefined),
      ...new Array(1).fill(48),
      ...new Array(1).fill(768),
      ...new Array(1).fill(14),
      ...new Array(1).fill(30),
      ...new Array(1).fill(1024),
      ...new Array(1).fill(0),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(19728),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(48),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12),
      ...new Array(1).fill(51),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(0),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(19992),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(48),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12),
      ...new Array(1).fill(51),
      ...new Array(1).fill(1536),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(19996),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(7740),
      ...new Array(1).fill(3867),
      ...new Array(1).fill(7692),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(3870),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(19994),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13110),
      ...new Array(1).fill(6939),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(51),
      ...new Array(1).fill(7168),
      ...new Array(1).fill(19993),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(16140),
      ...new Array(1).fill(6963),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(63),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(20031),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(780),
      ...new Array(1).fill(6975),
      ...new Array(1).fill(1587),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(12288),
      ...new Array(1).fill(19992),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13083),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(6971),
      ...new Array(1).fill(13875),
      ...new Array(1).fill(3123),
      ...new Array(1).fill(13056),
      ...new Array(1).fill(19992),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(7734),
      ...new Array(1).fill(7710),
      ...new Array(1).fill(13854),
      ...new Array(1).fill(7198),
      ...new Array(1).fill(30),
      ...new Array(1).fill(7680),
      ...new Array(1).fill(20028),
      ...new Array(24).fill(undefined),
      ...new Array(3).fill(0),
      ...new Array(1).fill(48),
      ...new Array(3).fill(0),
      ...new Array(1).fill(20224),
      ...new Array(24).fill(undefined),
      ...new Array(7).fill(0),
      ...new Array(1).fill(20224),
      ...new Array(24).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(7710),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(12),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3584),
      ...new Array(1).fill(13107),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(0),
      ...new Array(1).fill(768),
      ...new Array(1).fill(0),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(3840),
      ...new Array(1).fill(13104),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(7709),
      ...new Array(1).fill(819),
      ...new Array(1).fill(7438),
      ...new Array(1).fill(3102),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(13080),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(819),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(51),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(7692),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(16179),
      ...new Array(1).fill(819),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(63),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(13062),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(819),
      ...new Array(1).fill(9023),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(3075),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(13059),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(13107),
      ...new Array(1).fill(13119),
      ...new Array(1).fill(13068),
      ...new Array(1).fill(3123),
      ...new Array(1).fill(3072),
      ...new Array(1).fill(13107),
      ...new Array(26).fill(undefined),
      ...new Array(1).fill(7731),
      ...new Array(1).fill(16146),
      ...new Array(1).fill(13086),
      ...new Array(1).fill(30),
      ...new Array(1).fill(16128),
      ...new Array(1).fill(7743),
      ...new Array(26).fill(undefined),
      ...new Array(6).fill(0),
      ...new Array(26).fill(undefined),
      ...new Array(6).fill(0),
    ]);
  });
});

function c(args) {
  console.log(args);
  return args;
}
