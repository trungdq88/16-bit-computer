const { vmTranslator } = require('./vm-translator.js');

describe('vmTranslator', () => {
  it('push local', () => {
    // Put value at local[2] to the stack
    expect(vmTranslator('push local 2')).toBe(
      [
        '@LCL',
        'D=M',
        '@2',
        'D=D+A',
        'A=D',

        'D=M',

        '@SP',
        'A=M',

        'M=D',

        '@SP',
        'M=M+1',
      ].join('\n')
    );
  });

  it('pop local', () => {
    // Pop a top value of the stack value to local[2]
    expect(vmTranslator('pop local 3')).toBe(
      [
        // load address of segment[index] to D
        '@LCL',
        'D=M',
        '@3',
        'D=D+A',

        // store address of segment[index] to R15
        '@R15',
        'M=D',

        // decrease stack pointer
        '@SP',
        'M=M-1',

        // read top stack value
        'A=M',
        'D=M',

        // move to segment[index]
        '@R15',
        'A=M',

        // set value to segment[index]
        'M=D',
      ].join('\n')
    );
  });

  it('push constant', () => {
    expect(vmTranslator('push constant 123')).toBe(
      ['@123', 'D=A', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1'].join('\n')
    );
  });

  it('add', () => {
    expect(vmTranslator('add')).toBe(
      [
        '@SP',
        'M=M-1',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        'A=M',
        'M=D+M',
        '@SP',
        'M=M+1',
      ].join('\n')
    );
  });

  it('sub', () => {
    expect(vmTranslator('sub')).toBe(
      [
        '@SP',
        'M=M-1',
        'A=M',
        'D=M', // D = y
        '@SP',
        'M=M-1',
        'A=M', // M = x
        'M=D-M', // y - x
        'M=-M', // y - x
        '@SP',
        'M=M+1',
      ].join('\n')
    );
  });

  it('and', () => {
    expect(vmTranslator('and')).toBe(
      [
        '@SP',
        'M=M-1',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        'A=M',
        'M=D&M',
        '@SP',
        'M=M+1',
      ].join('\n')
    );
  });

  it('or', () => {
    expect(vmTranslator('or')).toBe(
      [
        '@SP',
        'M=M-1',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        'A=M',
        'M=D|M',
        '@SP',
        'M=M+1',
      ].join('\n')
    );
  });
});
