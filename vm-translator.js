const MEMORY_SEGMENT = {
  local: '@LCL',
  arg: '@ARG',
  this: '@THIS',
  that: '@that',
};

const CONSTANT_SEGMENT = {
  constant: true,
};

const ARITHMETIC_BINARY = {
  add: 'M=D+M',
  sub: 'M=D-M\nM=-M',
  and: 'M=D&M',
  or: 'M=D|M',
};

const ARITHMETIC_UNARY = {
  neg: 'M=-M',
  not: 'M=!M',
};

const ARITHMETIC_COMPARE = {
  eq: 'D;JEQ',

  // the jump commands below are swapped because the actual substract
  // is performed in reversed (y-x instead of x-y) (better performance)
  gt: 'D;JGT',
  lt: 'D;JLT',
};

exports.vmTranslator = function(source) {
  let labelAllocated = 0;

  function allocateLabel(name) {
    const label = `${labelAllocated++}/${name}`;
    return ['@' + label, `(${label})`];
  }

  return source
    .trim()
    .split('\n')
    .map(_ => _.replace(/\/\/.*?$/, ''))
    .map(_ => _.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(' ');
      const [command, segment, index] = parts;
      if (MEMORY_SEGMENT[segment]) {
        if (command === 'push') {
          return pushMemorySegment(MEMORY_SEGMENT[segment], index);
        } else if (command === 'pop') {
          return popMemorySegment(MEMORY_SEGMENT[segment], index);
        }
      } else if (CONSTANT_SEGMENT[segment]) {
        const [_a, _b, value] = parts;
        if (command === 'push') {
          return pushConstantSegment(value);
        } else {
          throw new Error('There is no pop for constant segment');
        }
      } else if (ARITHMETIC_BINARY[command]) {
        return [
          '@SP',
          'M=M-1',
          'A=M',
          'D=M',
          '@SP',
          'M=M-1',
          'A=M',
          ARITHMETIC_BINARY[command],
          '@SP',
          'M=M+1',
        ].join('\n');
      } else if (ARITHMETIC_UNARY[command]) {
        return [
          '@SP',
          'M=M-1',
          'A=M',
          ARITHMETIC_UNARY[command],
          '@SP',
          'M=M+1',
        ].join('\n');
      } else if (ARITHMETIC_COMPARE[command]) {
        const [labelSymbolTrue, labelTrue] = allocateLabel('JUMP_EQ');
        const [labelSymbolFalse, labelFalse] = allocateLabel('JUMP_NE');
        return [
          '@SP',
          'M=M-1',
          'A=M',
          'D=M',
          '@SP',
          'M=M-1',
          'A=M',
          'D=M-D',
          labelSymbolTrue,
          ARITHMETIC_COMPARE[command],
          '@SP',
          'A=M',
          'M=0',
          labelSymbolFalse,
          '0;JMP',
          labelTrue,
          '@SP',
          'A=M',
          'M=-1',
          labelFalse,
          '@SP',
          'M=M+1',
        ].join('\n');
      } else if (command === 'break') {
        return 'BREAK';
      } else {
        throw new Error(command + ' is invalid');
      }
    })
    .join('\n');
};

function pushMemorySegment(segmentSymbol, index) {
  return [
    // move to segment[index]
    segmentSymbol,
    'D=M',
    '@' + index,
    'D=D+A',
    'A=D',

    // read value at segment[index] to D
    'D=M',

    // move to top of stack
    '@SP',
    'A=M',

    // set stack's top value to D
    'M=D',

    // move stack pointer to next position
    '@SP',
    'M=M+1',
  ].join('\n');
}

function popMemorySegment(segmentSymbol, index) {
  return [
    // load address of segment[index] to D
    segmentSymbol,
    'D=M',
    '@' + index,
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
  ].join('\n');
}

function pushConstantSegment(value) {
  return ['@' + value, 'D=A', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1'].join('\n');
}
