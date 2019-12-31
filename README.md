Tetris 16 bit
=============

After building the [8-bit computer](https://github.com/trungdq88/8-bit-computer), I decided to give another try to build
a 16-bit computer, following the [NAND to Tetris](https://www.nand2tetris.org/) course.

Although the course cover both Hardware and Software, I only find it interested to implement
the hardware part (Part 1) of the course, includes:

- Logic gates
- ALU
- Computer architecture (16-bit von Neumann machine)
- Micro OP codes and Machine language
- Assembler to compile assembly code to machine language
- Virtual manchine and a virtual machine code
- VM translator to translate virtual machine code to assembly

The circuit board is implemented in [Logism](https://sourceforge.net/projects/circuit/) (a logic gate simulator software), the assembler, VM translator and emulator (for testing) are written in JavaScript.

## Specifications

Other than my crappy circuit wires / logic gates arrangements, I did not invent anything. The implementations are mine but the specifications of CPU instructions, Machine Language, Assembly Language and VM translator are from the course can be found here: https://www.nand2tetris.org/course

## Some screenshots for fun:
### Testing my custom LCD screen
![](images/my%20lcd%20screen%20is%20working.gif)
![](images/it's%20drawing%20something.gif)

### Drawing a rectangle
![](images/success.gif)

### Drawing a spiral
![](images/try%20spiral%20with%20my%20screen%202.gif)

### CPU
![](cpu.png)

### ALU
![](alu.png)

### Display Control
![](display-control.png)
