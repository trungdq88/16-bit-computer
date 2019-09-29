const COMP_MAP = {
  '0': 0b0101010,
  '1': 0b0111111,
  '-1': 0b0111010,
  D: 0b0001100,
  A: 0b0110000,
  '!D': 0b0001101,
  '!A': 0b0110001,
  '-D': 0b0001111,
  '-A': 0b0110011,
  'D+1': 0b0011111,
  'A+1': 0b0110111,
  'D-1': 0b0001110,
  'A-1': 0b0110010,
  'D+A': 0b0000010,
  'D-A': 0b0010011,
  'A-D': 0b0000111,
  'D&A': 0b0000000,
  'D|A': 0b0010101,
};

const JMP_MAP = {
  JGT: 0b001,
  JEQ: 0b010,
  JGE: 0b011,
  JLT: 0b100,
  JNE: 0b101,
  JLE: 0b110,
  JMP: 0b111,
};

const PREDEFINED_SYMBOLS = {
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  SCREEN: 16384,
  KBD: 24576,
};

const VARIABLE_MEMORY_OFFSET = 16;

const keys = Object.keys(COMP_MAP);
keys.forEach(key => {
  if (key.indexOf('A') === -1) return;
  const mKey = key.replace(/A/g, 'M');
  const mValue = COMP_MAP[key] | 0b1000000;
  COMP_MAP[mKey] = mValue;
});

function isNormalInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

exports.assembler = function(source) {
  const assigned = {};
  let allocated = VARIABLE_MEMORY_OFFSET;
  const labels = {};

  const code = source
    .trim()
    .split('\n')
    .map(_ => _.replace(/\/\/.*?$/, ''))
    .map(_ => _.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (line[0] === '@') {
        const symbol = line.slice(1, line.length);
        if (isNormalInteger(symbol)) {
          return parseInt(symbol, 10);
        } else if (PREDEFINED_SYMBOLS[symbol] !== undefined) {
          return PREDEFINED_SYMBOLS[symbol];
        } else if (assigned[symbol] !== undefined) {
          return assigned[symbol];
        } else if (labels[symbol] !== undefined) {
          return labels[symbol];
        } else {
          assigned[symbol] = allocated;
          allocated += 1;
          return assigned[symbol];
        }
      } else if (line[0] === '(') {
        const label = line.replace(/[\(\)]/g, '');
        if (labels[label] !== undefined) {
          throw new Error('duplicated label ' + label);
        }
        labels[label] = index - Object.keys(labels).length;
        return null;
      } else {
        const parts = {
          dest: '',
          comp: '',
          jump: '',
        };

        let now = 'dest';

        for (let i = 0; i < line.length; i++) {
          if (line[i] === '=') {
            now = 'comp';
            continue;
          }
          if (line[i] === ';') {
            now = 'jump';
            continue;
          }
          parts[now] += line[i];
        }

        if (parts.comp === '') {
          const t = parts.dest;
          parts.dest = '';
          parts.comp = t;
        }

        let destBits = 0b000;
        if (parts.dest.indexOf('A') > -1) destBits |= 0b100;
        if (parts.dest.indexOf('D') > -1) destBits |= 0b010;
        if (parts.dest.indexOf('M') > -1) destBits |= 0b001;

        const jmpBits = JMP_MAP[parts.jump] || 0b000;

        return (
          (0b111 << 13) |
          (COMP_MAP[parts.comp] << 6) |
          (destBits << 3) |
          jmpBits
        );
      }
    })
    .filter(_ => _ !== null)
    .map(_ => _.toString(16))
    .join(' ');
  return code;
};
