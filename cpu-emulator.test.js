const { cpuEmulator } = require('./cpu-emulator.js');
const { assembler } = require('./assembler.js');

describe('cpuEmulator', () => {
  it('works', () => {
    expect(cpuEmulator(['@2', 'D=A', '@2', 'D=D+A', '@0', 'M=D'])).toEqual({
      A: 0,
      D: 4,
      M: expect.anything(),
      RAM: [4],
    });

    expect(
      cpuEmulator(
        assembler(
          `
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
        BREAK
    `,
          { renderUnlabeled: true }
        )
      )
    ).toEqual({
      A: 18,
      D: 1,
      M: expect.anything(),
      RAM: [...new Array(16), 101, 5050],
    });
  });
});
