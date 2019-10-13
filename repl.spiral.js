const { assembler } = require('./assembler.js');
const { vmTranslator, sharedCode } = require('./vm-translator.js');

console.log(
  assembler(`
// Spiral.asm -- Draw a square spiral on the screen.

// MACRO	@maskTable	// Allocate 'maskTable' at 100
// 	@100
// ENDM

	@100	// Initialize maskTable
	D=A
	@pixel
	M=D
	@mask
	M=1
(MASK_LOOP)
	@mask
	D=M
	@pixel
	A=M
	M=D
	@pixel
	M=M+1
	@mask
	D=M
	MD=D+M
	@MASK_LOOP
	D;JNE

	@2			// 'grow' = side growth factor
	D=A
	@grow
	M=D	
	@size		// 'size' = current side length
	M=D

	@SCREEN		// 'ptr' = middle screen word
	D=A
	@260		// 128 rows + 16 words 
	D=D+A
	@ptr
	M=D	

	@pixel		// 'pixel = pixel mask index.
	M=0
	@mask		// 'mask' = pixel mask.		INVARIENT: mask == maskTable[pixel]
	M=1
	
(GO_RIGHT)
	@size		// Draw 'size' pixels moving right
	D=M
	@count
	M=D
	
(RIGHT_LOOP)
	@mask		// Set pixel.
	D=M
	@ptr
	A=M
	M=D|M
	
	@pixel		// Move one pixel right.
	M=M+1
	@mask
	MD=D+M
	@RIGHT_CONTINUE
	D;JNE
	
	@ptr		// Move to next word right.
	M=M+1
	@pixel
	M=0
	@mask
	M=1
	
(RIGHT_CONTINUE)
	@count
	MD=M-1
	@RIGHT_LOOP
	D;JNE
	
	@grow		// Increase side length.
	D=M
	@size
	M=D+M
	
(GO_UP)
	@size		// Draw 'size' pixels moving up.
	D=M
	@count
	M=D
	
(UP_LOOP)
	@mask		// Set pixel.
	D=M
	@ptr
	A=M
	M=D|M
	
	@8
	D=A
	@ptr		// Move one row up.
	MD=M-D
	
	@SCREEN		// Still on the screen?
	D=D-A
	@HALT
	D;JLT

	@count
	MD=M-1
	@UP_LOOP
	D;JNE
	
	@grow		// Increase side length.
	D=M
	@size
	M=D+M

(GO_LEFT)
	@size		// Draw 'size' pixels moving left.
	D=M
	@count
	M=D
	
(LEFT_LOOP)
	@mask		// Set pixel.
	D=M
	@ptr
	A=M
	M=D|M
	
	@pixel		// Move one pixel left.
	MD=M-1
	@LEFT_CONTINUE
	D;JGE
	
	@ptr		// Move to next word left.
	M=M-1
	@15
	D=A
	@pixel
	M=D
	
(LEFT_CONTINUE)
	@pixel		// mask = maskTable[pixel]
	D=M
	@100
	A=D+A
	D=M
	@mask
	M=D

	@count
	MD=M-1
	@LEFT_LOOP
	D;JNE
	
	@grow		// Increase side length.
	D=M
	@size
	M=D+M

(GO_DOWN)
	@size		// Draw 'size' pixels moving down.
	D=M
	@count
	M=D
	
(DOWN_LOOP)
	@mask		// Set pixel.
	D=M
	@ptr
	A=M
	M=D|M
	
	@8
	D=A
	@ptr		// Move one row down.
	MD=D+M
	
	@KBD		// Still on the screen?
	D=D-A
	@HALT
	D;JGE

	@count
	MD=M-1
	@DOWN_LOOP
	D;JNE
	
	@grow		// Increase side length.
	D=M
	@size
	M=D+M
	
	@GO_RIGHT
	0;JMP
	
	@HALT
(HALT)
	0;JMP

`)
);

function c(args) {
  console.log(args);
  return args;
}
