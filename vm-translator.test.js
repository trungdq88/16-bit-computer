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
    expect(vmTranslator('pop local 2')).toBe(
      [
        '@LCL',
        'D=M',
        '@2',
        'D=D+A',
        '@i',
        'M=D',

        '@SP',
        'A=M',
        'D=M',
        '@i',
        'M=D',

        '@SP',
        'M=M-1',
      ].join('\n')
    );
  });
});
