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
label WHILE
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
label IF_FALSE         // if n>=2, returns fib(n-2)+fib(n-1)
push argument 0
push constant 2
sub
call Main.fibonacci 1  // computes fib(n-2)
push argument 0
push constant 1
sub
call Main.fibonacci 1  // computes fib(n-1)
add                    // returns fib(n-1) + fib(n-2)
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
});

function c(args) {
  console.log(args);
  return args;
}
