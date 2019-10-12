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
  let currentFunction = null;

  function allocateLabel(name) {
    const label = `${programName}.${labelAllocated++}/${name}`;
    return ['@' + label, `(${label})`];
  }

  let returnLabelCount = 1;

  const lines = source
    .trim()
    .split('\n')
    .map(_ => _.replace(/\/\/.*?$/, ''))
    .map(_ => _.trim())
    .filter(Boolean);

  return (
    lines
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
          const [labelSymbol, label] = allocateLabel('COMPARE_RETURN');
          return [
            '// Set compare return address to R15',
            labelSymbol,
            'D=A',
            '@R15',
            'M=D',

            '// jump to shared compare code',
            `@__COMPARE_${command.toUpperCase()}`,
            '0;JMP',
            '// label to jump back',
            label,
          ].join('\n');
        } else if (command === 'break') {
          return 'BREAK';
        } else if (command === 'goto') {
          const [_, label] = parts;
          return [
            `@${currentFunction}.${label}`,
            '0;JMP', //
          ].join('\n');
        } else if (command === 'label') {
          const [_, label] = parts;
          // if (currentFunction === null) {
          //   throw new Error(
          //     'label not in a function: ' + line + ':' + programName
          //   );
          // }
          return `(${currentFunction}.${label})`;
        } else if (command === 'if-goto') {
          const [_, label] = parts;
          return [
            '@SP',
            'M=M-1',
            'A=M',
            'D=M',
            `@${currentFunction}.${label}`,
            'D;JNE', //
          ].join('\n');
          return `(${programName}.${label})`;
        } else if (command === 'call') {
          const [_, funcName, nArgs = 0] = parts;
          if (funcName === undefined) {
            throw new Error('funcName must be defined: ' + line);
          }
          const labelName = `${programName}.$ret.${returnLabelCount}`;
          returnLabelCount += 1;

          const functionAddress = '@R15';
          const nArgsAddress = '@R14';
          const labelAddress = '@R13';

          return [
            '// Set function address',
            `@${funcName} // call ${funcName}`,
            'D=A',
            functionAddress,
            'M=D',

            '// Set nArgs',
            `@${nArgs}`,
            'D=A',
            nArgsAddress,
            'M=D',

            '// Set label address',
            `@${labelName}`,
            'D=A',
            labelAddress,
            'M=D',

            '// Call shared code',
            '@__CALL',
            '0;JMP',
            `(${labelName})`,
          ].join('\n');
        } else if (command === 'function') {
          const [_, funcName, nArgs] = parts;
          currentFunction = funcName;
          return [
            `(${funcName})`,
            new Array(Number(nArgs)).fill(pushConstantSegment('0')).join('\n'),
            //
          ].join('\n');
        } else if (command === 'return') {
          const endFrame = '@R15';
          const returnAddress = '@R14';
          // currentFunction = null;
          return [
            '@__RETURN',
            '0;JMP', //
          ].join('\n');
        } else if (command === 'set') {
          const [_, address, valueStr] = parts;
          const value = Number(valueStr.replace(/[,;]/, ''));

          let index;

          if (
            ['sp', 'local', 'argument', 'this', 'that'].indexOf(address) === -1
          ) {
            index = address.replace(/RAM\[(\d+)\]/, '$1');
          } else {
            index = {
              sp: 'SP',
              local: 'LCL',
              argument: 'ARG',
              this: 'THIS',
              that: 'THAT',
            }[address];
          }
          return [
            value >= 0 ? `@${value}\nD=A` : `@0\nD=A\n@${-value}\nD=D-A`,
            '@' + index,
            'M=D',
            //
          ].join('\n');
        } else {
          throw new Error(command + ' is invalid');
        }
      })
      .join('\n') + '\n'
  );
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

function pushConstantSegment(value, { dereference } = {}) {
  return [
    value === undefined ? '' : '@' + value,
    dereference ? 'D=M' : 'D=A',
    '@SP',
    'A=M',
    'M=D',
    '@SP',
    'M=M+1', //
  ].join('\n');
}

function sharedCode() {
  return (
    [sharedCodeReturn(), sharedCodeCall(), sharedCodeCompare()].join('\n') +
    '\n'
  );
}

function sharedCodeReturn() {
  const endFrame = '@R15';
  const returnAddress = '@R14';

  return [
    // endFrame = LCL
    '(__RETURN)',
    '@LCL',
    'D=M',
    endFrame,
    'M=D',

    // return address = endFrame - 5
    // (resue D=*(LCL) state)
    '@5',
    'D=D-A',
    'A=D',
    'D=M',
    returnAddress,
    'M=D',

    // *ARG = pop()
    '@SP',
    'M=M-1',
    'A=M',
    'D=M',
    '@ARG',
    'A=M',
    'M=D',

    // SP = ARG + 1
    // (reuse A = *(ARG) state)
    'D=A+1',
    '@SP',
    'M=D',

    // THAT=*(endFrame - 1)
    endFrame,
    'D=M-1',
    'A=D',
    'D=M',
    '@THAT',
    'M=D',

    // THIS=*(endFrame - 2)
    endFrame,
    'D=M',
    '@2',
    'D=D-A',
    'A=D',
    'D=M',
    '@THIS',
    'M=D',

    // ARG=*(endFrame - 3)
    endFrame,
    'D=M',
    '@3',
    'D=D-A',
    'A=D',
    'D=M',
    '@ARG',
    'M=D',

    // LCL=*(endFrame - 4)
    endFrame,
    'D=M',
    '@4',
    'D=D-A',
    'A=D',
    'D=M',
    '@LCL',
    'M=D',

    // goto returnAddress
    returnAddress,
    'A=M',
    '0;JMP',
  ].join('\n');
}

function sharedCodeCall() {
  const functionAddress = '@R15';
  const nArgsAddress = '@R14';

  return [
    '(__CALL)',
    pushConstantSegment('R13', { dereference: true }),
    pushConstantSegment('LCL', { dereference: true }),
    pushConstantSegment('ARG', { dereference: true }),
    pushConstantSegment('THIS', { dereference: true }),
    pushConstantSegment('THAT', { dereference: true }),

    // ARG=SP-5-nArgs
    '@SP',
    'D=M',
    '@5',
    'D=D-A',
    nArgsAddress,
    'D=D-M',
    '@ARG',
    'M=D',

    // LCL=SP
    '@SP',
    'D=M',
    '@LCL',
    'M=D',

    // go to function name
    functionAddress,
    'A=M',
    '0;JMP',
  ].join('\n');
}

function sharedCodeCompare() {
  return Object.keys(ARITHMETIC_COMPARE)
    .map(command => {
      return [
        `(__COMPARE_${command.toUpperCase()})`,
        '@SP',
        'M=M-1',
        'A=M',
        'D=M',
        '@SP',
        'M=M-1',
        'A=M',
        'D=M-D',
        `@__COMPARE_TRUE_${command.toUpperCase()}`,
        ARITHMETIC_COMPARE[command],
        '@SP',
        'A=M',
        'M=0',
        `@__COMPARE_FALSE_${command.toUpperCase()}`,
        '0;JMP',
        `(__COMPARE_TRUE_${command.toUpperCase()})`,
        '@SP',
        'A=M',
        'M=-1',
        `(__COMPARE_FALSE_${command.toUpperCase()})`,
        '@SP',
        'M=M+1',
        '// jump back',
        '@R15',
        'A=M',
        '0;JMP',
      ].join('\n');
    })
    .join('\n');
}

exports.sharedCode = sharedCode;
