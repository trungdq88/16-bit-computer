const { assembler } = require('./assembler.js');

describe('assembler', () => {
  it('should hoist labels', () => {
    expect(
      assembler(`
        @HELLO
        (HELLO)
        @3
    `)
    ).toBe('1 3');
  });

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

  it('break', () => {
    expect(
      assembler(`
        @2
        D=A
        BREAK
        @2
        @0
        BREAK
        M=D
    `)
    ).toBe('2 ec10 8000 2 0 8000 e308');
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

    expect(
      assembler(`
        // Draw a straight vertical line in the first line of the first panel
        @32767
        D=A
        @32767
        D=D+A
        D=D+1
        @SCREEN
        M=D
        (END)
        @END
        0;JMP  // Infinite loop
    `)
    ).toBe('7fff ec10 7fff e090 e7d0 4000 e308 7 ea87');

    expect(
      assembler(`
        // Animate binary counting in the first line of the second panel
        (LOOP)
        @i
        DM=M+1
        @SCREEN
        A=A+1
        M=D
        @LOOP
        0;JMP
    `)
    ).toBe('10 fdd8 4000 ede0 e308 0 ea87');

    expect(
      assembler(`
        // ANIMATE BINARY COUNTING IN THE FIRST LINE OF THE THIRD PANEL OF THE SECOND PANEL ROW
        @SCREEN
        D=A
        @130
        D=D+A
        @X
        M=D

        (LOOP)
        @i
        DM=M+1
        @X
        A=M
        M=D
        @LOOP
        0;JMP
    `)
    ).toBe('4000 ec10 82 e090 10 e308 11 fdd8 10 fc20 e308 6 ea87');

    console.log(
      assembler(`
    
   @0
   D=M
   @INFINITE_LOOP
   D;JLE 
   @counter
   M=D
   @SCREEN
   D=A
   @address
   M=D
(LOOP)
   @address
   A=M
   M=-1
   @address
   D=M
   @32
   D=D+A
   @address
   M=D
   @counter
   MD=M-1
   @LOOP
   D;JGT
(INFINITE_LOOP)
   @INFINITE_LOOP
   0;JMP
    `)
    );
  });
});
