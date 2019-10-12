const { assembler } = require('./assembler.js');
const { vmTranslator, sharedCode } = require('./vm-translator.js');
const { cpuEmulator } = require('./cpu-emulator.js');

describe('end to end tests', () => {
  it('fibonacci', () => {
    function findNthFibonacci(n) {
      return cpuEmulator(
        assembler(
          `
${vmTranslator(`
set sp 261,
  `)}

${vmTranslator(
  `
function Sys.init 0
push constant ${n}
call Main.fibonacci 1
break
  `,
  'Sys.vm'
)}
${vmTranslator(
  `
function Main.fibonacci 0
push argument 0
push constant 2
lt
if-goto IF_TRUE
goto IF_FALSE
label IF_TRUE
push argument 0
return
label IF_FALSE
push argument 0
push constant 2
sub
call Main.fibonacci 1
push argument 0
push constant 1
sub
call Main.fibonacci 1
add
return
  `,
  'Main.vm'
)}

${sharedCode()}

`,
          { renderUnlabeled: true }
        )
      );
    }

    const case1 = findNthFibonacci(1);
    expect(case1.RAM[0]).toBe(262);
    expect(case1.RAM[261]).toBe(1);

    const case2 = findNthFibonacci(2);
    expect(case2.RAM[0]).toBe(262);
    expect(case2.RAM[261]).toBe(1);

    const case3 = findNthFibonacci(3);
    expect(case3.RAM[0]).toBe(262);
    expect(case3.RAM[261]).toBe(2);

    const case4 = findNthFibonacci(4);
    expect(case4.RAM[0]).toBe(262);
    expect(case4.RAM[261]).toBe(3);

    const case5 = findNthFibonacci(5);
    expect(case5.RAM[0]).toBe(262);
    expect(case5.RAM[261]).toBe(5);

    const case6 = findNthFibonacci(11);
    expect(case6.RAM[0]).toBe(262);
    expect(case6.RAM[261]).toBe(89);
  });

  it('nested call', () => {
    const state = cpuEmulator(
      assembler(
        `
${vmTranslator(`
set RAM[0] 261,
set RAM[1] 261,
set RAM[2] 256,
set RAM[3] -3,
set RAM[4] -4,
set RAM[5] -1, // test results
set RAM[6] -1,
set RAM[256] 1234, // fake stack frame from call Sys.init
set RAM[257] -1,
set RAM[258] -2,
set RAM[259] -3,
set RAM[260] -4,

set RAM[261] -1, // Initialize stack to check for local segment
set RAM[262] -1, // being cleared to zero.
set RAM[263] -1,
set RAM[264] -1,
set RAM[265] -1,
set RAM[266] -1,
set RAM[267] -1,
set RAM[268] -1,
set RAM[269] -1,
set RAM[270] -1,
set RAM[271] -1,
set RAM[272] -1,
set RAM[273] -1,
set RAM[274] -1,
set RAM[275] -1,
set RAM[276] -1,
set RAM[277] -1,
set RAM[278] -1,
set RAM[279] -1,
set RAM[280] -1,
set RAM[281] -1,
set RAM[282] -1,
set RAM[283] -1,
set RAM[284] -1,
set RAM[285] -1,
set RAM[286] -1,
set RAM[287] -1,
set RAM[288] -1,
set RAM[289] -1,
set RAM[290] -1,
set RAM[291] -1,
set RAM[292] -1,
set RAM[293] -1,
set RAM[294] -1,
set RAM[295] -1,
set RAM[296] -1,
set RAM[297] -1,
set RAM[298] -1,
set RAM[299] -1,

function Sys.init 0
push constant 4000	// test THIS and THAT context save
pop pointer 0
push constant 5000
pop pointer 1
call Sys.main 0
pop temp 1
label LOOP
break

// Sys.main()
//
// Sets locals 1, 2 and 3, leaving locals 0 and 4 unchanged to test
// default local initialization to 0.  (RAM set to -1 by test setup.)
// Calls Sys.add12(123) and stores return value (135) in temp 0.
// Returns local 0 + local 1 + local 2 + local 3 + local 4 (456) to confirm
// that locals were not mangled by function call.

function Sys.main 5
push constant 4001
pop pointer 0
push constant 5001
pop pointer 1
push constant 200
pop local 1
push constant 40
pop local 2
push constant 6
pop local 3
push constant 123
call Sys.add12 1
pop temp 0
push local 0
push local 1
push local 2
push local 3
push local 4
add
add
add
add
return

// Sys.add12(int n)
//
// Returns n+12.

function Sys.add12 0
push constant 4002
pop pointer 0
push constant 5002
pop pointer 1
push argument 0
push constant 12
add
return
  `)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );

    expect(state.RAM[0]).toBe(261);
    expect(state.RAM[1]).toBe(261);
    expect(state.RAM[2]).toBe(256);
    expect(state.RAM[3]).toBe(4000);
    expect(state.RAM[4]).toBe(5000);
    expect(state.RAM[5]).toBe(135);
    expect(state.RAM[6]).toBe(246);
  });

  it('simple function', () => {
    const state = cpuEmulator(
      assembler(
        `
${vmTranslator(`
set RAM[0] 317,
set RAM[1] 317,
set RAM[2] 310,
set RAM[3] 3000,
set RAM[4] 4000,
set RAM[310] 1234,
set RAM[311] 37,
set RAM[312] 1000,
set RAM[313] 305,
set RAM[314] 300,
set RAM[315] 3010,
set RAM[316] 4010,

// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/FunctionCalls/SimpleFunction/SimpleFunction.vm

// Performs a simple calculation and returns the result.
function SimpleFunction.test 2
push local 0
push local 1
add
not
push argument 0
add
push argument 1
sub
return
  `)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );

    expect(state.RAM[0]).toBe(311);
    expect(state.RAM[1]).toBe(305);
    expect(state.RAM[2]).toBe(300);
    expect(state.RAM[3]).toBe(3010);
    expect(state.RAM[4]).toBe(4010);
    expect(state.RAM[310]).toBe(1196);
  });

  it('static test', () => {
    const state = cpuEmulator(
      assembler(
        `
${vmTranslator(`
set sp 261,
  `)}
${vmTranslator(
  `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/FunctionCalls/StaticsTest/Sys.vm

// Tests that different functions, stored in two different 
// class files, manipulate the static segment correctly. 
function Sys.init 0
push constant 6
push constant 8
call Class1.set 2
pop temp 0 // Dumps the return value
push constant 23
push constant 15
call Class2.set 2
pop temp 0 // Dumps the return value
call Class1.get 0
call Class2.get 0
break
  `,
  'Sys.vm'
)}
${vmTranslator(
  `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/FunctionCalls/StaticsTest/Class1.vm

// Stores two supplied arguments in static[0] and static[1].
function Class1.set 0
push argument 0
pop static 0
push argument 1
pop static 1
push constant 0
return

// Returns static[0] - static[1].
function Class1.get 0
push static 0
push static 1
sub
return
  `,
  'Class1.vm'
)}
${vmTranslator(
  `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/FunctionCalls/StaticsTest/Class2.vm

// Stores two supplied arguments in static[0] and static[1].
function Class2.set 0
push argument 0
pop static 0
push argument 1
pop static 1
push constant 0
return

// Returns static[0] - static[1].
function Class2.get 0
push static 0
push static 1
sub
return
  `,
  'Class2.vm'
)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );

    expect(state.RAM[0]).toBe(263);
    expect(state.RAM[261]).toBe(-2);
    expect(state.RAM[262]).toBe(8);
  });

  it('basic loop', () => {
    const state = cpuEmulator(
      assembler(
        `
${vmTranslator(`
set RAM[0] 256,
set RAM[1] 300,
set RAM[2] 400,
set RAM[400] 3,
  `)}
${vmTranslator(
  `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/ProgramFlow/BasicLoop/BasicLoop.vm

// Computes the sum 1 + 2 + ... + argument[0] and pushes the 
// result onto the stack. Argument[0] is initialized by the test 
// script before this code starts running.
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
break
  `
)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );

    expect(state.RAM[0]).toBe(257);
    expect(state.RAM[256]).toBe(6);
  });

  it('fibonacci series', () => {
    const state = cpuEmulator(
      assembler(
        `
${vmTranslator(`
set RAM[0] 256,
set RAM[1] 300,
set RAM[2] 400,
set RAM[400] 10,
set RAM[401] 3000,

// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/08/ProgramFlow/FibonacciSeries/FibonacciSeries.vm

// Puts the first argument[0] elements of the Fibonacci series
// in the memory, starting in the address given in argument[1].
// Argument[0] and argument[1] are initialized by the test script 
// before this code starts running.

push argument 1
pop pointer 1           // that = argument[1]

push constant 0
pop that 0              // first element in the series = 0
push constant 1
pop that 1              // second element in the series = 1

push argument 0
push constant 2
sub
pop argument 0          // num_of_elements -= 2 (first 2 elements are set)

label MAIN_LOOP_START

push argument 0
if-goto COMPUTE_ELEMENT // if num_of_elements > 0, goto COMPUTE_ELEMENT
goto END_PROGRAM        // otherwise, goto END_PROGRAM

label COMPUTE_ELEMENT

push that 0
push that 1
add
pop that 2              // that[2] = that[0] + that[1]

push pointer 1
push constant 1
add
pop pointer 1           // that += 1

push argument 0
push constant 1
sub
pop argument 0          // num_of_elements--

goto MAIN_LOOP_START

label END_PROGRAM
break
  `)}

${sharedCode()}

`,
        { renderUnlabeled: true }
      )
    );

    expect(state.RAM.slice(3000, 3010)).toEqual([
      0,
      1,
      1,
      2,
      3,
      5,
      8,
      13,
      21,
      34,
    ]);
  });

  it('hello world with OS', () => {
    const state = cpuEmulator(
      c(
        assembler(
          `
${vmTranslator(`call Sys.init 0`)}

${vmTranslator(
  `
function Array.new 0
push argument 0
push constant 0
gt
not
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 2
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 0
call Memory.alloc 1
return
function Array.dispose 0
push argument 0
pop pointer 0
push pointer 0
call Memory.deAlloc 1
pop temp 0
push constant 0
return
  `,
  'Array.vm'
)}
${vmTranslator(
  `
function Keyboard.init 0
push constant 0
return
function Keyboard.keyPressed 0
push constant 24576
call Memory.peek 1
return
function Keyboard.readChar 2
push constant 0
call Output.printChar 1
pop temp 0
label WHILE_EXP0
push local 1
push constant 0
eq
push local 0
push constant 0
gt
or
not
if-goto WHILE_END0
call Keyboard.keyPressed 0
pop local 0
push local 0
push constant 0
gt
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push local 0
pop local 1
label IF_FALSE0
goto WHILE_EXP0
label WHILE_END0
call String.backSpace 0
call Output.printChar 1
pop temp 0
push local 1
call Output.printChar 1
pop temp 0
push local 1
return
function Keyboard.readLine 5
push constant 80
call String.new 1
pop local 3
push argument 0
call Output.printString 1
pop temp 0
call String.newLine 0
pop local 1
call String.backSpace 0
pop local 2
label WHILE_EXP0
push local 4
not
not
if-goto WHILE_END0
call Keyboard.readChar 0
pop local 0
push local 0
push local 1
eq
pop local 4
push local 4
not
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push local 0
push local 2
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push local 3
call String.eraseLastChar 1
pop temp 0
goto IF_END1
label IF_FALSE1
push local 3
push local 0
call String.appendChar 2
pop local 3
label IF_END1
label IF_FALSE0
goto WHILE_EXP0
label WHILE_END0
push local 3
return
function Keyboard.readInt 2
push argument 0
call Keyboard.readLine 1
pop local 0
push local 0
call String.intValue 1
pop local 1
push local 0
call String.dispose 1
pop temp 0
push local 1
return
  `,
  'Keyboard.vm'
)}
${vmTranslator(
  `
function Memory.init 0
push constant 0
pop static 0
push constant 2048
push static 0
add
push constant 14334
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 2049
push static 0
add
push constant 2050
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
return
function Memory.peek 0
push argument 0
push static 0
add
pop pointer 1
push that 0
return
function Memory.poke 0
push argument 0
push static 0
add
push argument 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
return
function Memory.alloc 1
push argument 0
push constant 1
lt
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 5
call Sys.error 1
pop temp 0
label IF_FALSE0
push constant 2048
pop local 0
label WHILE_EXP0
push constant 0
push local 0
add
pop pointer 1
push that 0
push argument 0
lt
not
if-goto WHILE_END0
push constant 1
push local 0
add
pop pointer 1
push that 0
pop local 0
goto WHILE_EXP0
label WHILE_END0
push local 0
push argument 0
add
push constant 16379
gt
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push constant 6
call Sys.error 1
pop temp 0
label IF_FALSE1
push constant 0
push local 0
add
pop pointer 1
push that 0
push argument 0
push constant 2
add
gt
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push argument 0
push constant 2
add
push local 0
add
push constant 0
push local 0
add
pop pointer 1
push that 0
push argument 0
sub
push constant 2
sub
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 1
push local 0
add
pop pointer 1
push that 0
push local 0
push constant 2
add
eq
if-goto IF_TRUE3
goto IF_FALSE3
label IF_TRUE3
push argument 0
push constant 3
add
push local 0
add
push local 0
push argument 0
add
push constant 4
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
goto IF_END3
label IF_FALSE3
push argument 0
push constant 3
add
push local 0
add
push constant 1
push local 0
add
pop pointer 1
push that 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
label IF_END3
push constant 1
push local 0
add
push local 0
push argument 0
add
push constant 2
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
label IF_FALSE2
push constant 0
push local 0
add
push constant 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 0
push constant 2
add
return
function Memory.deAlloc 2
push argument 0
push constant 2
sub
pop local 0
push constant 1
push local 0
add
pop pointer 1
push that 0
pop local 1
push constant 0
push local 1
add
pop pointer 1
push that 0
push constant 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 0
push local 0
add
push constant 1
push local 0
add
pop pointer 1
push that 0
push local 0
sub
push constant 2
sub
pop temp 0
pop pointer 1
push temp 0
pop that 0
goto IF_END0
label IF_FALSE0
push constant 0
push local 0
add
push constant 1
push local 0
add
pop pointer 1
push that 0
push local 0
sub
push constant 0
push local 1
add
pop pointer 1
push that 0
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 1
push local 1
add
pop pointer 1
push that 0
push local 1
push constant 2
add
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push constant 1
push local 0
add
push local 0
push constant 2
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
goto IF_END1
label IF_FALSE1
push constant 1
push local 0
add
push constant 1
push local 1
add
pop pointer 1
push that 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
label IF_END1
label IF_END0
push constant 0
return
  `,
  'Memory.vm'
)}
${vmTranslator(
  `
function Output.init 0
push constant 16384
pop static 4
push constant 0
not
pop static 2
push constant 32
pop static 1
push constant 0
pop static 0
push constant 6
call String.new 1
pop static 3
call Output.initMap 0
pop temp 0
call Output.createShiftedMap 0
pop temp 0
push constant 0
return
function Output.initMap 0
push constant 127
call Array.new 1
pop static 5
push constant 0
push constant 63
push constant 63
push constant 63
push constant 63
push constant 63
push constant 63
push constant 63
push constant 63
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 32
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 33
push constant 12
push constant 30
push constant 30
push constant 30
push constant 12
push constant 12
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 34
push constant 54
push constant 54
push constant 20
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 35
push constant 0
push constant 18
push constant 18
push constant 63
push constant 18
push constant 18
push constant 63
push constant 18
push constant 18
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 36
push constant 12
push constant 30
push constant 51
push constant 3
push constant 30
push constant 48
push constant 51
push constant 30
push constant 12
push constant 12
push constant 0
call Output.create 12
pop temp 0
push constant 37
push constant 0
push constant 0
push constant 35
push constant 51
push constant 24
push constant 12
push constant 6
push constant 51
push constant 49
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 38
push constant 12
push constant 30
push constant 30
push constant 12
push constant 54
push constant 27
push constant 27
push constant 27
push constant 54
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 39
push constant 12
push constant 12
push constant 6
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 40
push constant 24
push constant 12
push constant 6
push constant 6
push constant 6
push constant 6
push constant 6
push constant 12
push constant 24
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 41
push constant 6
push constant 12
push constant 24
push constant 24
push constant 24
push constant 24
push constant 24
push constant 12
push constant 6
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 42
push constant 0
push constant 0
push constant 0
push constant 51
push constant 30
push constant 63
push constant 30
push constant 51
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 43
push constant 0
push constant 0
push constant 0
push constant 12
push constant 12
push constant 63
push constant 12
push constant 12
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 44
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 12
push constant 12
push constant 6
push constant 0
call Output.create 12
pop temp 0
push constant 45
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 63
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 46
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 47
push constant 0
push constant 0
push constant 32
push constant 48
push constant 24
push constant 12
push constant 6
push constant 3
push constant 1
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 48
push constant 12
push constant 30
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 49
push constant 12
push constant 14
push constant 15
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 50
push constant 30
push constant 51
push constant 48
push constant 24
push constant 12
push constant 6
push constant 3
push constant 51
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 51
push constant 30
push constant 51
push constant 48
push constant 48
push constant 28
push constant 48
push constant 48
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 52
push constant 16
push constant 24
push constant 28
push constant 26
push constant 25
push constant 63
push constant 24
push constant 24
push constant 60
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 53
push constant 63
push constant 3
push constant 3
push constant 31
push constant 48
push constant 48
push constant 48
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 54
push constant 28
push constant 6
push constant 3
push constant 3
push constant 31
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 55
push constant 63
push constant 49
push constant 48
push constant 48
push constant 24
push constant 12
push constant 12
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 56
push constant 30
push constant 51
push constant 51
push constant 51
push constant 30
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 57
push constant 30
push constant 51
push constant 51
push constant 51
push constant 62
push constant 48
push constant 48
push constant 24
push constant 14
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 58
push constant 0
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 59
push constant 0
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
push constant 12
push constant 12
push constant 6
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 60
push constant 0
push constant 0
push constant 24
push constant 12
push constant 6
push constant 3
push constant 6
push constant 12
push constant 24
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 61
push constant 0
push constant 0
push constant 0
push constant 63
push constant 0
push constant 0
push constant 63
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 62
push constant 0
push constant 0
push constant 3
push constant 6
push constant 12
push constant 24
push constant 12
push constant 6
push constant 3
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 64
push constant 30
push constant 51
push constant 51
push constant 59
push constant 59
push constant 59
push constant 27
push constant 3
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 63
push constant 30
push constant 51
push constant 51
push constant 24
push constant 12
push constant 12
push constant 0
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 65
push constant 12
push constant 30
push constant 51
push constant 51
push constant 63
push constant 51
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 66
push constant 31
push constant 51
push constant 51
push constant 51
push constant 31
push constant 51
push constant 51
push constant 51
push constant 31
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 67
push constant 28
push constant 54
push constant 35
push constant 3
push constant 3
push constant 3
push constant 35
push constant 54
push constant 28
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 68
push constant 15
push constant 27
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 27
push constant 15
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 69
push constant 63
push constant 51
push constant 35
push constant 11
push constant 15
push constant 11
push constant 35
push constant 51
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 70
push constant 63
push constant 51
push constant 35
push constant 11
push constant 15
push constant 11
push constant 3
push constant 3
push constant 3
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 71
push constant 28
push constant 54
push constant 35
push constant 3
push constant 59
push constant 51
push constant 51
push constant 54
push constant 44
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 72
push constant 51
push constant 51
push constant 51
push constant 51
push constant 63
push constant 51
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 73
push constant 30
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 74
push constant 60
push constant 24
push constant 24
push constant 24
push constant 24
push constant 24
push constant 27
push constant 27
push constant 14
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 75
push constant 51
push constant 51
push constant 51
push constant 27
push constant 15
push constant 27
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 76
push constant 3
push constant 3
push constant 3
push constant 3
push constant 3
push constant 3
push constant 35
push constant 51
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 77
push constant 33
push constant 51
push constant 63
push constant 63
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 78
push constant 51
push constant 51
push constant 55
push constant 55
push constant 63
push constant 59
push constant 59
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 79
push constant 30
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 80
push constant 31
push constant 51
push constant 51
push constant 51
push constant 31
push constant 3
push constant 3
push constant 3
push constant 3
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 81
push constant 30
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 63
push constant 59
push constant 30
push constant 48
push constant 0
call Output.create 12
pop temp 0
push constant 82
push constant 31
push constant 51
push constant 51
push constant 51
push constant 31
push constant 27
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 83
push constant 30
push constant 51
push constant 51
push constant 6
push constant 28
push constant 48
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 84
push constant 63
push constant 63
push constant 45
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 85
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 86
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 30
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 87
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 63
push constant 63
push constant 63
push constant 18
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 88
push constant 51
push constant 51
push constant 30
push constant 30
push constant 12
push constant 30
push constant 30
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 89
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 12
push constant 12
push constant 12
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 90
push constant 63
push constant 51
push constant 49
push constant 24
push constant 12
push constant 6
push constant 35
push constant 51
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 91
push constant 30
push constant 6
push constant 6
push constant 6
push constant 6
push constant 6
push constant 6
push constant 6
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 92
push constant 0
push constant 0
push constant 1
push constant 3
push constant 6
push constant 12
push constant 24
push constant 48
push constant 32
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 93
push constant 30
push constant 24
push constant 24
push constant 24
push constant 24
push constant 24
push constant 24
push constant 24
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 94
push constant 8
push constant 28
push constant 54
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 95
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 63
push constant 0
call Output.create 12
pop temp 0
push constant 96
push constant 6
push constant 12
push constant 24
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 97
push constant 0
push constant 0
push constant 0
push constant 14
push constant 24
push constant 30
push constant 27
push constant 27
push constant 54
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 98
push constant 3
push constant 3
push constant 3
push constant 15
push constant 27
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 99
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 3
push constant 3
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 100
push constant 48
push constant 48
push constant 48
push constant 60
push constant 54
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 101
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 63
push constant 3
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 102
push constant 28
push constant 54
push constant 38
push constant 6
push constant 15
push constant 6
push constant 6
push constant 6
push constant 15
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 103
push constant 0
push constant 0
push constant 30
push constant 51
push constant 51
push constant 51
push constant 62
push constant 48
push constant 51
push constant 30
push constant 0
call Output.create 12
pop temp 0
push constant 104
push constant 3
push constant 3
push constant 3
push constant 27
push constant 55
push constant 51
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 105
push constant 12
push constant 12
push constant 0
push constant 14
push constant 12
push constant 12
push constant 12
push constant 12
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 106
push constant 48
push constant 48
push constant 0
push constant 56
push constant 48
push constant 48
push constant 48
push constant 48
push constant 51
push constant 30
push constant 0
call Output.create 12
pop temp 0
push constant 107
push constant 3
push constant 3
push constant 3
push constant 51
push constant 27
push constant 15
push constant 15
push constant 27
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 108
push constant 14
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 109
push constant 0
push constant 0
push constant 0
push constant 29
push constant 63
push constant 43
push constant 43
push constant 43
push constant 43
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 110
push constant 0
push constant 0
push constant 0
push constant 29
push constant 51
push constant 51
push constant 51
push constant 51
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 111
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 112
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 51
push constant 51
push constant 31
push constant 3
push constant 3
push constant 0
call Output.create 12
pop temp 0
push constant 113
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 51
push constant 51
push constant 62
push constant 48
push constant 48
push constant 0
call Output.create 12
pop temp 0
push constant 114
push constant 0
push constant 0
push constant 0
push constant 29
push constant 55
push constant 51
push constant 3
push constant 3
push constant 7
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 115
push constant 0
push constant 0
push constant 0
push constant 30
push constant 51
push constant 6
push constant 24
push constant 51
push constant 30
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 116
push constant 4
push constant 6
push constant 6
push constant 15
push constant 6
push constant 6
push constant 6
push constant 54
push constant 28
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 117
push constant 0
push constant 0
push constant 0
push constant 27
push constant 27
push constant 27
push constant 27
push constant 27
push constant 54
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 118
push constant 0
push constant 0
push constant 0
push constant 51
push constant 51
push constant 51
push constant 51
push constant 30
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 119
push constant 0
push constant 0
push constant 0
push constant 51
push constant 51
push constant 51
push constant 63
push constant 63
push constant 18
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 120
push constant 0
push constant 0
push constant 0
push constant 51
push constant 30
push constant 12
push constant 12
push constant 30
push constant 51
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 121
push constant 0
push constant 0
push constant 0
push constant 51
push constant 51
push constant 51
push constant 62
push constant 48
push constant 24
push constant 15
push constant 0
call Output.create 12
pop temp 0
push constant 122
push constant 0
push constant 0
push constant 0
push constant 63
push constant 27
push constant 12
push constant 6
push constant 51
push constant 63
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 123
push constant 56
push constant 12
push constant 12
push constant 12
push constant 7
push constant 12
push constant 12
push constant 12
push constant 56
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 124
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 12
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 125
push constant 7
push constant 12
push constant 12
push constant 12
push constant 56
push constant 12
push constant 12
push constant 12
push constant 7
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 126
push constant 38
push constant 45
push constant 25
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
push constant 0
call Output.create 12
pop temp 0
push constant 0
return
function Output.create 1
push constant 11
call Array.new 1
pop local 0
push argument 0
push static 5
add
push local 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
push local 0
add
push argument 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 1
push local 0
add
push argument 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 2
push local 0
add
push argument 3
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 3
push local 0
add
push argument 4
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 4
push local 0
add
push argument 5
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 5
push local 0
add
push argument 6
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 6
push local 0
add
push argument 7
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 7
push local 0
add
push argument 8
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 8
push local 0
add
push argument 9
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 9
push local 0
add
push argument 10
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 10
push local 0
add
push argument 11
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
return
function Output.createShiftedMap 4
push constant 127
call Array.new 1
pop static 6
push constant 0
pop local 2
label WHILE_EXP0
push local 2
push constant 127
lt
not
if-goto WHILE_END0
push local 2
push static 5
add
pop pointer 1
push that 0
pop local 0
push constant 11
call Array.new 1
pop local 1
push local 2
push static 6
add
push local 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
pop local 3
label WHILE_EXP1
push local 3
push constant 11
lt
not
if-goto WHILE_END1
push local 3
push local 1
add
push local 3
push local 0
add
pop pointer 1
push that 0
push constant 256
call Math.multiply 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 3
push constant 1
add
pop local 3
goto WHILE_EXP1
label WHILE_END1
push local 2
push constant 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 32
pop local 2
goto IF_END0
label IF_FALSE0
push local 2
push constant 1
add
pop local 2
label IF_END0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Output.getMap 1
push argument 0
push constant 32
lt
push argument 0
push constant 126
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 0
pop argument 0
label IF_FALSE0
push static 2
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push argument 0
push static 5
add
pop pointer 1
push that 0
pop local 0
goto IF_END1
label IF_FALSE1
push argument 0
push static 6
add
pop pointer 1
push that 0
pop local 0
label IF_END1
push local 0
return
function Output.drawChar 4
push argument 0
call Output.getMap 1
pop local 2
push static 1
pop local 0
label WHILE_EXP0
push local 1
push constant 11
lt
not
if-goto WHILE_END0
push static 2
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push local 0
push static 4
add
pop pointer 1
push that 0
push constant 256
neg
and
pop local 3
goto IF_END0
label IF_FALSE0
push local 0
push static 4
add
pop pointer 1
push that 0
push constant 255
and
pop local 3
label IF_END0
push local 0
push static 4
add
push local 1
push local 2
add
pop pointer 1
push that 0
push local 3
or
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 0
push constant 32
add
pop local 0
push local 1
push constant 1
add
pop local 1
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Output.moveCursor 0
push argument 0
push constant 0
lt
push argument 0
push constant 22
gt
or
push argument 1
push constant 0
lt
or
push argument 1
push constant 63
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 20
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 1
push constant 2
call Math.divide 2
pop static 0
push constant 32
push argument 0
push constant 352
call Math.multiply 2
add
push static 0
add
pop static 1
push argument 1
push static 0
push constant 2
call Math.multiply 2
eq
pop static 2
push constant 32
call Output.drawChar 1
pop temp 0
push constant 0
return
function Output.printChar 0
push argument 0
call String.newLine 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
call Output.println 0
pop temp 0
goto IF_END0
label IF_FALSE0
push argument 0
call String.backSpace 0
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
call Output.backSpace 0
pop temp 0
goto IF_END1
label IF_FALSE1
push argument 0
call Output.drawChar 1
pop temp 0
push static 2
not
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push static 0
push constant 1
add
pop static 0
push static 1
push constant 1
add
pop static 1
label IF_FALSE2
push static 0
push constant 32
eq
if-goto IF_TRUE3
goto IF_FALSE3
label IF_TRUE3
call Output.println 0
pop temp 0
goto IF_END3
label IF_FALSE3
push static 2
not
pop static 2
label IF_END3
label IF_END1
label IF_END0
push constant 0
return
function Output.printString 2
push argument 0
call String.length 1
pop local 1
label WHILE_EXP0
push local 0
push local 1
lt
not
if-goto WHILE_END0
push argument 0
push local 0
call String.charAt 2
call Output.printChar 1
pop temp 0
push local 0
push constant 1
add
pop local 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Output.printInt 0
push static 3
push argument 0
call String.setInt 2
pop temp 0
push static 3
call Output.printString 1
pop temp 0
push constant 0
return
function Output.println 0
push static 1
push constant 352
add
push static 0
sub
pop static 1
push constant 0
pop static 0
push constant 0
not
pop static 2
push static 1
push constant 8128
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 32
pop static 1
label IF_FALSE0
push constant 0
return
function Output.backSpace 0
push static 2
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push static 0
push constant 0
gt
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push static 0
push constant 1
sub
pop static 0
push static 1
push constant 1
sub
pop static 1
goto IF_END1
label IF_FALSE1
push constant 31
pop static 0
push static 1
push constant 32
eq
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push constant 8128
pop static 1
label IF_FALSE2
push static 1
push constant 321
sub
pop static 1
label IF_END1
push constant 0
pop static 2
goto IF_END0
label IF_FALSE0
push constant 0
not
pop static 2
label IF_END0
push constant 32
call Output.drawChar 1
pop temp 0
push constant 0
return
  `,
  'Output.vm'
)}
${vmTranslator(
  `
function Screen.init 1
push constant 16384
pop static 1
push constant 0
not
pop static 2
push constant 17
call Array.new 1
pop static 0
push constant 0
push static 0
add
push constant 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
label WHILE_EXP0
push local 0
push constant 16
lt
not
if-goto WHILE_END0
push local 0
push constant 1
add
pop local 0
push local 0
push static 0
add
push local 0
push constant 1
sub
push static 0
add
pop pointer 1
push that 0
push local 0
push constant 1
sub
push static 0
add
pop pointer 1
push that 0
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Screen.clearScreen 1
label WHILE_EXP0
push local 0
push constant 8192
lt
not
if-goto WHILE_END0
push local 0
push static 1
add
push constant 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 0
push constant 1
add
pop local 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Screen.updateLocation 0
push static 2
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push argument 0
push static 1
add
push argument 0
push static 1
add
pop pointer 1
push that 0
push argument 1
or
pop temp 0
pop pointer 1
push temp 0
pop that 0
goto IF_END0
label IF_FALSE0
push argument 0
push static 1
add
push argument 0
push static 1
add
pop pointer 1
push that 0
push argument 1
not
and
pop temp 0
pop pointer 1
push temp 0
pop that 0
label IF_END0
push constant 0
return
function Screen.setColor 0
push argument 0
pop static 2
push constant 0
return
function Screen.drawPixel 3
push argument 0
push constant 0
lt
push argument 0
push constant 511
gt
or
push argument 1
push constant 0
lt
or
push argument 1
push constant 255
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 7
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 0
push constant 16
call Math.divide 2
pop local 0
push argument 0
push local 0
push constant 16
call Math.multiply 2
sub
pop local 1
push argument 1
push constant 32
call Math.multiply 2
push local 0
add
pop local 2
push local 2
push local 1
push static 0
add
pop pointer 1
push that 0
call Screen.updateLocation 2
pop temp 0
push constant 0
return
function Screen.drawConditional 0
push argument 2
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push argument 1
push argument 0
call Screen.drawPixel 2
pop temp 0
goto IF_END0
label IF_FALSE0
push argument 0
push argument 1
call Screen.drawPixel 2
pop temp 0
label IF_END0
push constant 0
return
function Screen.drawLine 11
push argument 0
push constant 0
lt
push argument 2
push constant 511
gt
or
push argument 1
push constant 0
lt
or
push argument 3
push constant 255
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 8
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 2
push argument 0
sub
call Math.abs 1
pop local 3
push argument 3
push argument 1
sub
call Math.abs 1
pop local 2
push local 3
push local 2
lt
pop local 6
push local 6
push argument 3
push argument 1
lt
and
push local 6
not
push argument 2
push argument 0
lt
and
or
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push argument 0
pop local 4
push argument 2
pop argument 0
push local 4
pop argument 2
push argument 1
pop local 4
push argument 3
pop argument 1
push local 4
pop argument 3
label IF_FALSE1
push local 6
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push local 3
pop local 4
push local 2
pop local 3
push local 4
pop local 2
push argument 1
pop local 1
push argument 0
pop local 0
push argument 3
pop local 8
push argument 0
push argument 2
gt
pop local 7
goto IF_END2
label IF_FALSE2
push argument 0
pop local 1
push argument 1
pop local 0
push argument 2
pop local 8
push argument 1
push argument 3
gt
pop local 7
label IF_END2
push constant 2
push local 2
call Math.multiply 2
push local 3
sub
pop local 5
push constant 2
push local 2
call Math.multiply 2
pop local 9
push constant 2
push local 2
push local 3
sub
call Math.multiply 2
pop local 10
push local 1
push local 0
push local 6
call Screen.drawConditional 3
pop temp 0
label WHILE_EXP0
push local 1
push local 8
lt
not
if-goto WHILE_END0
push local 5
push constant 0
lt
if-goto IF_TRUE3
goto IF_FALSE3
label IF_TRUE3
push local 5
push local 9
add
pop local 5
goto IF_END3
label IF_FALSE3
push local 5
push local 10
add
pop local 5
push local 7
if-goto IF_TRUE4
goto IF_FALSE4
label IF_TRUE4
push local 0
push constant 1
sub
pop local 0
goto IF_END4
label IF_FALSE4
push local 0
push constant 1
add
pop local 0
label IF_END4
label IF_END3
push local 1
push constant 1
add
pop local 1
push local 1
push local 0
push local 6
call Screen.drawConditional 3
pop temp 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Screen.drawRectangle 9
push argument 0
push argument 2
gt
push argument 1
push argument 3
gt
or
push argument 0
push constant 0
lt
or
push argument 2
push constant 511
gt
or
push argument 1
push constant 0
lt
or
push argument 3
push constant 255
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 9
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 0
push constant 16
call Math.divide 2
pop local 3
push argument 0
push local 3
push constant 16
call Math.multiply 2
sub
pop local 7
push argument 2
push constant 16
call Math.divide 2
pop local 4
push argument 2
push local 4
push constant 16
call Math.multiply 2
sub
pop local 8
push local 7
push static 0
add
pop pointer 1
push that 0
push constant 1
sub
not
pop local 6
push local 8
push constant 1
add
push static 0
add
pop pointer 1
push that 0
push constant 1
sub
pop local 5
push argument 1
push constant 32
call Math.multiply 2
push local 3
add
pop local 0
push local 4
push local 3
sub
pop local 2
label WHILE_EXP0
push argument 1
push argument 3
gt
not
not
if-goto WHILE_END0
push local 0
push local 2
add
pop local 1
push local 2
push constant 0
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push local 0
push local 5
push local 6
and
call Screen.updateLocation 2
pop temp 0
goto IF_END1
label IF_FALSE1
push local 0
push local 6
call Screen.updateLocation 2
pop temp 0
push local 0
push constant 1
add
pop local 0
label WHILE_EXP1
push local 0
push local 1
lt
not
if-goto WHILE_END1
push local 0
push constant 1
neg
call Screen.updateLocation 2
pop temp 0
push local 0
push constant 1
add
pop local 0
goto WHILE_EXP1
label WHILE_END1
push local 1
push local 5
call Screen.updateLocation 2
pop temp 0
label IF_END1
push argument 1
push constant 1
add
pop argument 1
push local 1
push constant 32
add
push local 2
sub
pop local 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
function Screen.drawHorizontal 11
push argument 1
push argument 2
call Math.min 2
pop local 7
push argument 1
push argument 2
call Math.max 2
pop local 8
push argument 0
push constant 1
neg
gt
push argument 0
push constant 256
lt
and
push local 7
push constant 512
lt
and
push local 8
push constant 1
neg
gt
and
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push local 7
push constant 0
call Math.max 2
pop local 7
push local 8
push constant 511
call Math.min 2
pop local 8
push local 7
push constant 16
call Math.divide 2
pop local 1
push local 7
push local 1
push constant 16
call Math.multiply 2
sub
pop local 9
push local 8
push constant 16
call Math.divide 2
pop local 2
push local 8
push local 2
push constant 16
call Math.multiply 2
sub
pop local 10
push local 9
push static 0
add
pop pointer 1
push that 0
push constant 1
sub
not
pop local 5
push local 10
push constant 1
add
push static 0
add
pop pointer 1
push that 0
push constant 1
sub
pop local 4
push argument 0
push constant 32
call Math.multiply 2
push local 1
add
pop local 0
push local 2
push local 1
sub
pop local 6
push local 0
push local 6
add
pop local 3
push local 6
push constant 0
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push local 0
push local 4
push local 5
and
call Screen.updateLocation 2
pop temp 0
goto IF_END1
label IF_FALSE1
push local 0
push local 5
call Screen.updateLocation 2
pop temp 0
push local 0
push constant 1
add
pop local 0
label WHILE_EXP0
push local 0
push local 3
lt
not
if-goto WHILE_END0
push local 0
push constant 1
neg
call Screen.updateLocation 2
pop temp 0
push local 0
push constant 1
add
pop local 0
goto WHILE_EXP0
label WHILE_END0
push local 3
push local 4
call Screen.updateLocation 2
pop temp 0
label IF_END1
label IF_FALSE0
push constant 0
return
function Screen.drawSymetric 0
push argument 1
push argument 3
sub
push argument 0
push argument 2
add
push argument 0
push argument 2
sub
call Screen.drawHorizontal 3
pop temp 0
push argument 1
push argument 3
add
push argument 0
push argument 2
add
push argument 0
push argument 2
sub
call Screen.drawHorizontal 3
pop temp 0
push argument 1
push argument 2
sub
push argument 0
push argument 3
sub
push argument 0
push argument 3
add
call Screen.drawHorizontal 3
pop temp 0
push argument 1
push argument 2
add
push argument 0
push argument 3
sub
push argument 0
push argument 3
add
call Screen.drawHorizontal 3
pop temp 0
push constant 0
return
function Screen.drawCircle 3
push argument 0
push constant 0
lt
push argument 0
push constant 511
gt
or
push argument 1
push constant 0
lt
or
push argument 1
push constant 255
gt
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 12
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 0
push argument 2
sub
push constant 0
lt
push argument 0
push argument 2
add
push constant 511
gt
or
push argument 1
push argument 2
sub
push constant 0
lt
or
push argument 1
push argument 2
add
push constant 255
gt
or
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push constant 13
call Sys.error 1
pop temp 0
label IF_FALSE1
push argument 2
pop local 1
push constant 1
push argument 2
sub
pop local 2
push argument 0
push argument 1
push local 0
push local 1
call Screen.drawSymetric 4
pop temp 0
label WHILE_EXP0
push local 1
push local 0
gt
not
if-goto WHILE_END0
push local 2
push constant 0
lt
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push local 2
push constant 2
push local 0
call Math.multiply 2
add
push constant 3
add
pop local 2
goto IF_END2
label IF_FALSE2
push local 2
push constant 2
push local 0
push local 1
sub
call Math.multiply 2
add
push constant 5
add
pop local 2
push local 1
push constant 1
sub
pop local 1
label IF_END2
push local 0
push constant 1
add
pop local 0
push argument 0
push argument 1
push local 0
push local 1
call Screen.drawSymetric 4
pop temp 0
goto WHILE_EXP0
label WHILE_END0
push constant 0
return
  `,
  'Screen.vm'
)}
${vmTranslator(
  `
function String.new 0
push constant 3
call Memory.alloc 1
pop pointer 0
push argument 0
push constant 0
lt
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 14
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 0
push constant 0
gt
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push argument 0
call Array.new 1
pop this 1
label IF_FALSE1
push argument 0
pop this 0
push constant 0
pop this 2
push pointer 0
return

function String.dispose 0
push argument 0
pop pointer 0
push this 0
push constant 0
gt
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push this 1
call Array.dispose 1
pop temp 0
label IF_FALSE0
push pointer 0
call Memory.deAlloc 1
pop temp 0
push constant 0
return

function String.length 0
push argument 0
pop pointer 0
push this 2
return

function String.charAt 0
push argument 0
pop pointer 0
push argument 1
push constant 0
lt
push argument 1
push this 2
gt
or
push argument 1
push this 2
eq
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 15
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 1
push this 1
add
pop pointer 1
push that 0
return

function String.setCharAt 0
push argument 0
pop pointer 0
push argument 1
push constant 0
lt
push argument 1
push this 2
gt
or
push argument 1
push this 2
eq
or
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 16
call Sys.error 1
pop temp 0
label IF_FALSE0
push argument 1
push this 1
add
push argument 2
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 0
return

function String.appendChar 0
push argument 0
pop pointer 0
push this 2
push this 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 17
call Sys.error 1
pop temp 0
label IF_FALSE0
push this 2
push this 1
add
push argument 1
pop temp 0
pop pointer 1
push temp 0
pop that 0
push this 2
push constant 1
add
pop this 2
push pointer 0
return

function String.eraseLastChar 0
push argument 0
pop pointer 0
push this 2
push constant 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 18
call Sys.error 1
pop temp 0
label IF_FALSE0
push this 2
push constant 1
sub
pop this 2
push constant 0
return

function String.intValue 5
push argument 0
pop pointer 0
push this 2
push constant 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 0
return

label IF_FALSE0
push constant 0
not
pop local 3
push constant 0
push this 1
add
pop pointer 1
push that 0
push constant 45
eq
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push constant 0
not
pop local 4
push constant 1
pop local 0
label IF_FALSE1
label WHILE_EXP0
push local 0
push this 2
lt
push local 3
and
not
if-goto WHILE_END0
push local 0
push this 1
add
pop pointer 1
push that 0
push constant 48
sub
pop local 2
push local 2
push constant 0
lt
push local 2
push constant 9
gt
or
not
pop local 3
push local 3
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push local 1
push constant 10
call Math.multiply 2
push local 2
add
pop local 1
push local 0
push constant 1
add
pop local 0
label IF_FALSE2
goto WHILE_EXP0
label WHILE_END0
push local 4
if-goto IF_TRUE3
goto IF_FALSE3
label IF_TRUE3
push local 1
neg
pop local 1
label IF_FALSE3
push local 1
return

function String.setInt 4
push argument 0
pop pointer 0
push this 0
push constant 0
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 19
call Sys.error 1
pop temp 0
label IF_FALSE0
push constant 6
call Array.new 1
pop local 2
push argument 1
push constant 0
lt
if-goto IF_TRUE1
goto IF_FALSE1
label IF_TRUE1
push constant 0
not
pop local 3
push argument 1
neg
pop argument 1
label IF_FALSE1
push argument 1
pop local 1
label WHILE_EXP0
push local 1
push constant 0
gt
not
if-goto WHILE_END0
push argument 1
push constant 10
call Math.divide 2
pop local 1
push local 0
push local 2
add
push constant 48
push argument 1
push local 1
push constant 10
call Math.multiply 2
sub
add
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 0
push constant 1
add
pop local 0
push local 1
pop argument 1
goto WHILE_EXP0
label WHILE_END0
push local 3
if-goto IF_TRUE2
goto IF_FALSE2
label IF_TRUE2
push local 0
push local 2
add
push constant 45
pop temp 0
pop pointer 1
push temp 0
pop that 0
push local 0
push constant 1
add
pop local 0
label IF_FALSE2
push this 0
push local 0
lt
if-goto IF_TRUE3
goto IF_FALSE3
label IF_TRUE3
push constant 19
call Sys.error 1
pop temp 0
label IF_FALSE3
push local 0
push constant 0
eq
if-goto IF_TRUE4
goto IF_FALSE4
label IF_TRUE4
push constant 0
push this 1
add
push constant 48
pop temp 0
pop pointer 1
push temp 0
pop that 0
push constant 1
pop this 2
goto IF_END4
label IF_FALSE4
push constant 0
pop this 2
label WHILE_EXP1
push this 2
push local 0
lt
not
if-goto WHILE_END1
push this 2
push this 1
add
push local 0
push this 2
push constant 1
add
sub
push local 2
add
pop pointer 1
push that 0
pop temp 0
pop pointer 1
push temp 0
pop that 0
push this 2
push constant 1
add
pop this 2
goto WHILE_EXP1
label WHILE_END1
label IF_END4
push local 2
call Array.dispose 1
pop temp 0
push constant 0
return

function String.newLine 0
push constant 128
return

function String.backSpace 0
push constant 129
return

function String.doubleQuote 0
push constant 34
return
  `,
  'String.vm'
)}
${vmTranslator(
  `
function Sys.init 0
call Memory.init 0
pop temp 0
call Math.init 0
pop temp 0
call Screen.init 0
pop temp 0
call Output.init 0
pop temp 0
call Keyboard.init 0
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
push constant 12
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
push constant 119
call String.appendChar 2
push constant 111
call String.appendChar 2
push constant 114
call String.appendChar 2
push constant 108
call String.appendChar 2
push constant 100
call String.appendChar 2
push constant 33
call String.appendChar 2
call Output.printString 1
pop temp 0
call Output.println 0
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
      )
    );
    console.log(state.RAM);
  });
});

function c(args) {
  console.log(args);
  return args;
}
