const { parseParts } = require('./parse-parts.js');

function getSigned(binStr) {
  binStr =
    binStr.length >= 8 && binStr[0] === '1'
      ? binStr.padStart(32, '1')
      : binStr.padStart(32, '0');
  return parseInt(binStr, 2) >> 0;
}

const MAX = 100000;
let c = 0;

exports.cpuEmulator = function(program) {
  const state = {
    D: 0,
    A: 0,
    RAM: [],
    M(value) {
      if (value === undefined) {
        return this.RAM[this.A];
      } else {
        this.RAM[this.A] = value;
      }
    },
  };

  let counter = 0;

  while (true) {
    if (c++ > MAX) {
      throw new Error('max iteration exceeded');
    }

    const line = program[counter];

    if (!line) break;

    // console.log(line);

    if (line === 'BREAK') {
      // console.log('BREAK');
      break;
    } else if (line[0] === '@') {
      const symbol = line.slice(1, line.length);
      state.A = Number(symbol);
    } else {
      const { comp, dest, jump } = parseParts(line);

      const compHandler = {
        '0': () => 0,
        '1': () => 1,
        '-1': () => -1,
        D: () => state.D,
        A: () => state.A,
        M: () => state.M(),
        '!D': () => ~state.D,
        '!A': () => ~state.A,
        '!M': () => ~state.M(),
        '-D': () => -state.D,
        '-A': () => -state.A,
        '-M': () => -state.M(),
        'D+1': () => state.D + 1,
        'A+1': () => state.A + 1,
        'M+1': () => state.M() + 1,
        'D-1': () => state.D - 1,
        'A-1': () => state.A - 1,
        'M-1': () => state.M() - 1,
        'D+A': () => state.D + state.A,
        'D+M': () => state.D + state.M(),
        'D-A': () => state.D - state.A,
        'D-M': () => state.D - state.M(),
        'A-D': () => state.A - state.D,
        'M-D': () => state.M() - state.D,
        'D&A': () => state.D & state.A,
        'D&M': () => state.D & state.M(),
        'D|M': () => state.D | state.M(),
      };

      const handler = compHandler[comp];
      if (!handler) {
        throw new Error('Invalid comp: ' + comp + ', line: ' + line);
      }
      const result = handler();
      if (dest.indexOf('A') > -1) state.A = result;
      if (dest.indexOf('D') > -1) state.D = result;
      if (dest.indexOf('M') > -1) state.M(result);
      // console.log({ counter, comp, dest, jump, result, state });

      switch (jump) {
        case 'JGT':
          if (result > 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JEQ':
          if (result === 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JGE':
          if (result >= 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JLT':
          if (result < 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JNE':
          if (result !== 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JLE':
          if (result <= 0) {
            counter = state.A;
            continue;
          }
          break;
        case 'JMP':
          counter = state.A;
          continue;
          break;
      }
    }

    counter += 1;
  }

  return state;
};
