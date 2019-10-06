const { assembler } = require('./assembler.js');
const { vmTranslator, sharedCode } = require('./vm-translator.js');

console.log(
  assembler(`
${c(
  vmTranslator(`
set sp 261,
  `)
)}

${c(
  vmTranslator(
    `
function Sys.init 0
push constant 5
call Main.fibonacci 1   // computes the 4'th fibonacci element
label WHILE
    break
  `,
    'Sys.vm'
  )
)}
${c(
  vmTranslator(
    `
function Main.fibonacci 0
push argument 0
push constant 2
lt                     // checks if n<2
if-goto IF_TRUE
goto IF_FALSE
label IF_TRUE          // if n<2, return n
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
  )
)}

${sharedCode()}

`)
);

function c(args) {
  console.log(args);
  return args;
}
