const SEGMENT_MAP = {
  local: '@LCL',
  arg: '@ARG',
  this: '@THIS',
  that: '@that',
};

exports.vmTranslator = function(source) {
  return source
    .trim()
    .split('\n')
    .map(_ => _.replace(/\/\/.*?$/, ''))
    .map(_ => _.trim())
    .filter(Boolean)
    .map(line => {
      const [command, segment, index] = line.split(' ');
      if (command === 'push' && SEGMENT_MAP[segment] !== undefined) {
        return [
          // move to segment[index]
          SEGMENT_MAP[segment],
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
    })
    .join('\n');
};
