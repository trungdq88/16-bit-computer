const { assembler } = require('./assembler.js');

describe('assembler', () => {
  it('works', () => {
    expect(
      assembler(`
@2
D=A
@2
D=D+A
@0
M=D
    `)
    ).toBe('2 ec10 2 e090 0 e308');
  });

  it('works 2', () => {
    expect(
      assembler(`
// Adds 1+...+100.
@i     // i refers to some mem. location.
M=1    // i=1
@sum   // sum refers to some mem. location.
M=0    // sum=0
(LOOP)
@i
D=M    // D=i
@100
D=D-A  // D=i-100
@END
D;JGT  // If (i-100)>0 goto END
@i
D=M    // D=i
@sum
M=D+M  // sum=sum+i
@i
M=M+1  // i=i+1
@LOOP
0;JMP  // Goto LOOP
(END)
@END
0;JMP  // Infinite loop
    `)
    ).toBe(
      '10 efc8 11 ea88 10 fc10 64 e4d0 12 e301 10 fc10 11 f088 10 fdc8 4 ea87 12 ea87'
    );
  });
});
