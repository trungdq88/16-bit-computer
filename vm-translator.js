const MEMORY_SEGMENT = {
  local: '@LCL',
  argument: '@ARG',
  this: '@THIS',
  that: '@THAT',
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

const TEMP_ADDRESS = 5;

exports.vmTranslator = function(source, programName) {
  if (programName === undefined) {
    programName = 'Unamed_' + Math.random();
  }

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
      if (command === 'push' || command === 'pop') {
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
        } else if (segment === 'temp') {
          const indexNumber = Number(index);
          if (indexNumber < 0 || indexNumber > 7) {
            throw new Error('Temp index must be from 0 to 7');
          }
          const register = '@R' + (indexNumber + TEMP_ADDRESS);
          if (command === 'push') {
            return [
              register,
              'D=M', // copy temp[index] value to D
              '@SP',
              'A=M',
              'M=D',
              '@SP',
              'M=M+1',
            ].join('\n');
          } else {
            return [
              '@SP',
              'M=M-1',
              'A=M',
              'D=M', // copy stack.pop() to D
              register,
              'M=D',
            ].join('\n');
          }
        } else if (segment === 'static') {
          const register = `@${programName}.${index}`;
          if (command === 'push') {
            return [
              register,
              'D=M', // copy static[index] to D
              '@SP',
              'A=M',
              'M=D',
              '@SP',
              'M=M+1',
            ].join('\n');
          } else {
            return [
              '@SP',
              'M=M-1',
              'A=M',
              'D=M', // D = stack.pop()
              register,
              'M=D',
            ].join('\n');
          }
        } else if (segment === 'pointer') {
          const register = {
            0: '@THIS',
            1: '@THAT',
          }[index];

          if (command === 'push') {
            return [
              register,
              'D=M',
              '@SP',
              'A=M',
              'M=D',
              '@SP',
              'M=M+1', ///////
            ].join('\n');
          } else {
            return [
              '@SP',
              'M=M-1',
              'A=M',
              'D=M',
              register,
              'M=D', ///////
            ].join('\n');
          }
        } else {
          throw new Error('Segment invalid: ' + segment);
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
        const [labelSymbolTrue, labelTrue] = allocateLabel('COMPARE_TRUE');
        const [labelSymbolFalse, labelFalse] = allocateLabel('COMPARE_FALSE');
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
